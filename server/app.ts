import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { z } from 'zod';
import { ApiError, checkVersion, requirePermission, scopedResource } from './access';
import {
  circuits as seedCircuits,
  demoSession,
  partners as seedPartners,
  stations as seedStations,
} from './fixtures';
import type { Session, Submission } from '../src/domain';

const versionInput = z.object({ version: z.number().int().positive() }).strict();
const partnerInput = z
  .object({
    version: z.number().int().positive(),
    status: z.enum(['À contacter', 'En échange', 'À rappeler']),
    note: z.string().max(2000),
    reminder: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => {
        const date = new Date(`${value}T00:00:00.000Z`);
        return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
      })
      .nullable(),
  })
  .strict();
const submissionInput = z
  .object({ circuitId: z.string(), version: z.number().int().positive(), requestId: z.uuid() })
  .strict();

async function readJson(req: IncomingMessage): Promise<unknown> {
  if (!req.headers['content-type']?.startsWith('application/json'))
    throw new ApiError(415, 'JSON requis.');
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 65536) throw new ApiError(413, 'Requête trop volumineuse.');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    throw new ApiError(400, 'JSON invalide.');
  }
}

export function createDemoServer(options: { mode: string; session?: Session; distDir?: string }) {
  if (options.mode !== 'demo')
    throw new Error(
      'Seul APP_MODE=demo est disponible. Authentification réelle et contrôles d’accès Lovable Cloud requis avant tout usage réel.',
    );
  const sessionTemplate = structuredClone(options.session ?? demoSession);
  const stations = structuredClone(seedStations);
  const circuits = structuredClone(seedCircuits);
  const partners = structuredClone(seedPartners);
  const sessions = new Map<string, { session: Session; expires: number }>();
  const submissions: (Submission & { organizationId: string; userId: string })[] = [];
  const idempotency = new Map<
    string,
    { circuitId: string; version: number; submission: Submission }
  >();
  // Ephemeral demo audit, deliberately excludes notes, credentials and customer data.
  const audit: { action: string; userId: string; resourceId: string; at: string }[] = [];
  const record = (action: string, userId: string, resourceId: string) =>
    audit.push({ action, userId, resourceId, at: new Date().toISOString() });

  return createServer(async (req, res) => {
    const json = (status: number, body: unknown) => {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      res.end(JSON.stringify(body));
    };
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    try {
      const remote = req.socket.remoteAddress;
      if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(remote ?? ''))
        throw new ApiError(403, 'Démonstration locale uniquement.');
      const base = new URL(`http://${req.headers.host ?? 'invalid'}`);
      if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname))
        throw new ApiError(403, 'Hôte non autorisé.');
      const url = new URL(req.url ?? '/', base);
      const path = url.pathname;
      if (
        req.headers.origin &&
        ![base.origin, 'http://127.0.0.1:5173', 'http://localhost:5173'].includes(
          req.headers.origin,
        )
      )
        throw new ApiError(403, 'Origine non autorisée.');
      if (req.method === 'GET' && path === '/api/health')
        return json(200, {
          status: 'ok',
          mode: 'demo',
          persistence: 'memory',
          integrations: 'disconnected',
        });
      const token = req.headers.cookie
        ?.split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('sb_demo='))
        ?.slice(8);
      const entry = token ? sessions.get(token) : undefined;
      if (entry && entry.expires <= Date.now()) sessions.delete(token!);
      const session = entry && entry.expires > Date.now() ? entry.session : undefined;
      if (req.method === 'GET' && path === '/api/session') {
        if (session) return json(200, session);
        // This is a labelled fixture session, not user authentication. No real mode exists.
        const id = randomUUID();
        for (const [key, value] of sessions) if (value.expires <= Date.now()) sessions.delete(key);
        if (sessions.size >= 100)
          throw new ApiError(429, 'Trop de sessions de démonstration. Redémarrez le serveur.');
        sessions.set(id, {
          session: structuredClone(sessionTemplate),
          expires: Date.now() + 8 * 3600000,
        });
        res.setHeader(
          'Set-Cookie',
          `sb_demo=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`,
        );
        return json(200, sessionTemplate);
      }
      if (req.method === 'GET' && path === '/api/overview') {
        const user = requirePermission(session, 'station:read');
        return json(200, {
          stations: stations.filter(
            (s) => s.organizationId === user.organizationId && user.stationIds.includes(s.id),
          ),
          circuits: circuits.filter(
            (c) =>
              c.organizationId === user.organizationId && user.stationIds.includes(c.stationId),
          ),
          partners: partners.filter((p) => p.organizationId === user.organizationId),
          submissions: submissions
            .filter(
              (s) =>
                s.organizationId === user.organizationId &&
                circuits.some((c) => c.id === s.circuitId && user.stationIds.includes(c.stationId)),
            )
            .map(({ organizationId: _org, userId: _user, ...publicFields }) => publicFields),
          availability: {
            freeSlots: null,
            reason: 'Contrats réservation et Agent 1 non raccordés.',
          },
        });
      }
      const prepare = path.match(/^\/api\/circuits\/([^/]+)\/prepare$/);
      if (req.method === 'POST' && prepare) {
        const user = requirePermission(session, 'circuit:prepare');
        const circuit = scopedResource(
          user,
          circuits.find((c) => c.id === prepare[1]),
        );
        const input = versionInput.parse(await readJson(req));
        checkVersion(circuit.version, input.version);
        if (circuit.status !== 'documentary') throw new ApiError(409, 'Essai déjà préparé.');
        circuit.status = 'prepared';
        circuit.version++;
        record('circuit.prepared', user.userId, circuit.id);
        return json(200, circuit);
      }
      const partner = path.match(/^\/api\/partners\/([^/]+)$/);
      if (req.method === 'PATCH' && partner) {
        const user = requirePermission(session, 'partner:write');
        const item = scopedResource(
          user,
          partners.find((p) => p.id === partner[1]),
        );
        const input = partnerInput.parse(await readJson(req));
        checkVersion(item.version, input.version);
        Object.assign(item, input, { version: item.version + 1 });
        record('partner.updated', user.userId, item.id);
        return json(200, item);
      }
      if (req.method === 'POST' && path === '/api/submissions') {
        const user = requirePermission(session, 'submission:create');
        const input = submissionInput.parse(await readJson(req));
        const circuit = scopedResource(
          user,
          circuits.find((c) => c.id === input.circuitId),
        );
        const key = `${user.organizationId}:${user.userId}:${input.requestId}`;
        const prior = idempotency.get(key);
        if (prior) {
          if (prior.circuitId !== input.circuitId || prior.version !== input.version)
            throw new ApiError(409, 'Clé de requête déjà utilisée pour un autre contenu.');
          return json(200, prior.submission);
        }
        checkVersion(circuit.version, input.version);
        const submission: Submission = {
          id: randomUUID(),
          circuitId: circuit.id,
          circuitVersion: circuit.version,
          title: circuit.name,
          status: 'received',
          sentAt: new Date().toISOString(),
        };
        submissions.push({
          ...submission,
          organizationId: user.organizationId,
          userId: user.userId,
        });
        idempotency.set(key, { circuitId: input.circuitId, version: input.version, submission });
        record('submission.received', user.userId, submission.id);
        return json(201, submission);
      }
      if (path.startsWith('/api/')) throw new ApiError(404, 'Opération indisponible.');
      if (req.method === 'GET' && options.distDir)
        return await serveStatic(path, options.distDir, res);
      throw new ApiError(404, 'Ressource introuvable.');
    } catch (error) {
      if (error instanceof ApiError) return json(error.status, { error: error.message });
      if (error instanceof z.ZodError)
        return json(400, { error: 'Données invalides. Vérifiez les champs.' });
      console.error('Erreur serveur interne', error instanceof Error ? error.name : 'unknown');
      return json(500, { error: 'Erreur interne.' });
    }
  });
}

async function serveStatic(path: string, distDir: string, res: ServerResponse) {
  const root = resolve(distDir);
  const decoded = decodeURIComponent(path);
  const file = resolve(root, `.${decoded}`);
  if (!file.startsWith(`${root}/`) && file !== root)
    throw new ApiError(404, 'Ressource introuvable.');
  const types: Record<string, string> = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.html': 'text/html; charset=utf-8',
    '.svg': 'image/svg+xml',
  };
  let content: Buffer;
  let extension = extname(file);
  try {
    content = await readFile(extension ? file : resolve(root, 'index.html'));
  } catch {
    throw new ApiError(404, 'Ressource introuvable. Build requis.');
  }
  if (!extension) extension = '.html';
  res.writeHead(200, {
    'Content-Type': types[extension] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'Content-Security-Policy':
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  });
  res.end(content);
}
