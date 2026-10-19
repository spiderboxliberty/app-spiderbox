import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { request, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { randomUUID } from 'node:crypto';
import { createDemoServer } from '../server/app';
import { demoSession } from '../server/fixtures';
import type { Overview, Session } from '../src/domain';

const running: Server[] = [];
after(async () =>
  Promise.all(
    running.map(
      (server) =>
        new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        ),
    ),
  ),
);

async function client(session?: Session) {
  const server = createDemoServer({ mode: 'demo', session });
  running.push(server);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const response = await fetch(`${base}/api/session`);
  const cookie = response.headers.get('set-cookie')!.split(';')[0];
  return {
    base,
    request: (path: string, method = 'GET', body?: unknown) =>
      fetch(`${base}/api${path}`, {
        method,
        headers: { Cookie: cookie, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      }),
  };
}

test('real mode is rejected instead of silently exposing fixture sessions', () => {
  assert.throws(() => createDemoServer({ mode: 'production' }), /Authentification réelle/);
});
test('private API requires a server-issued session', async () => {
  const app = await client();
  assert.equal((await fetch(`${app.base}/api/overview`)).status, 401);
});
test('overview isolates organizations and leaves unavailable data unknown', async () => {
  const app = await client();
  const overview: Overview = await (await app.request('/overview')).json();
  assert.equal(overview.stations.length, 2);
  assert.equal(overview.circuits.length, 2);
  assert.equal(overview.partners.length, 2);
  assert.equal(overview.availability.freeSlots, null);
  assert.ok(
    overview.stations.every(
      (s) => s.organizationId === 'org-a' && s.technicalAvailability === 'unknown',
    ),
  );
  assert.ok(!JSON.stringify(overview).includes('Privé B'));
});
test('organization B sees its own resources and cannot modify A by direct ID', async () => {
  const app = await client({
    ...demoSession,
    userId: 'user-b',
    organizationId: 'org-b',
    stationIds: ['station-b'],
  });
  const overview: Overview = await (await app.request('/overview')).json();
  assert.deepEqual(
    overview.stations.map((s) => s.id),
    ['station-b'],
  );
  assert.equal(
    (await app.request('/circuits/circuit-rives/prepare', 'POST', { version: 1 })).status,
    404,
  );
  assert.equal(
    (
      await app.request('/partners/partner-a', 'PATCH', {
        version: 1,
        status: 'En échange',
        note: 'attaque',
        reminder: null,
      })
    ).status,
    404,
  );
});
test('direct IDs do not grant access to another organization or station', async () => {
  const app = await client();
  assert.equal(
    (await app.request('/circuits/circuit-b/prepare', 'POST', { version: 1 })).status,
    404,
  );
  assert.equal(
    (
      await app.request('/partners/partner-b', 'PATCH', {
        version: 1,
        status: 'En échange',
        note: 'attaque',
        reminder: null,
      })
    ).status,
    404,
  );
  assert.equal(
    (
      await app.request('/submissions', 'POST', {
        circuitId: 'circuit-b',
        version: 1,
        requestId: randomUUID(),
      })
    ).status,
    404,
  );
  const restricted = await client({ ...demoSession, stationIds: ['station-mobile'] });
  assert.equal(
    (await restricted.request('/circuits/circuit-rives/prepare', 'POST', { version: 1 })).status,
    404,
  );
  const overview: Overview = await (await restricted.request('/overview')).json();
  assert.equal(overview.circuits.length, 0);
});
test('removed permissions block operations server-side', async () => {
  const app = await client({ ...demoSession, permissions: [] });
  assert.equal((await app.request('/overview')).status, 403);
  assert.equal(
    (await app.request('/circuits/circuit-rives/prepare', 'POST', { version: 1 })).status,
    403,
  );
  assert.equal(
    (
      await app.request('/partners/partner-a', 'PATCH', {
        version: 1,
        status: 'En échange',
        note: '',
        reminder: null,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await app.request('/submissions', 'POST', {
        circuitId: 'circuit-rives',
        version: 1,
        requestId: randomUUID(),
      })
    ).status,
    403,
  );
});
test('preparing a circuit does not validate or launch it; stale writes conflict', async () => {
  const app = await client();
  const response = await app.request('/circuits/circuit-rives/prepare', 'POST', { version: 1 });
  assert.equal(response.status, 200);
  const updated = await response.json();
  assert.equal(updated.status, 'prepared');
  assert.equal(updated.version, 2);
  assert.equal(
    (await app.request('/circuits/circuit-rives/prepare', 'POST', { version: 1 })).status,
    409,
  );
  assert.equal((await app.request('/circuits/circuit-rives/validate', 'POST', {})).status, 404);
  assert.equal((await app.request('/admin/launch', 'POST', {})).status, 404);
});
test('partner edits validate DTO, version and actual calendar dates', async () => {
  const app = await client();
  const values = {
    version: 1,
    status: 'À rappeler',
    note: 'Note confidentielle A',
    reminder: '2026-11-10',
  };
  assert.equal(
    (await app.request('/partners/partner-a', 'PATCH', { ...values, reminder: '2026-02-31' }))
      .status,
    400,
  );
  assert.equal(
    (await app.request('/partners/partner-a', 'PATCH', { ...values, organizationId: 'org-b' }))
      .status,
    400,
  );
  assert.equal((await app.request('/partners/partner-a', 'PATCH', values)).status, 200);
  assert.equal((await app.request('/partners/partner-a', 'PATCH', values)).status, 409);
  const overview: Overview = await (await app.request('/overview')).json();
  assert.equal(overview.partners[0].note, values.note);
});
test('submission allowlist excludes private notes and replay is idempotent', async () => {
  const app = await client();
  await app.request('/partners/partner-a', 'PATCH', {
    version: 1,
    status: 'En échange',
    note: 'NE PAS TRANSMETTRE',
    reminder: null,
  });
  const payload = { circuitId: 'circuit-rives', version: 1, requestId: randomUUID() };
  assert.equal(
    (await app.request('/submissions', 'POST', { ...payload, note: 'Privée' })).status,
    400,
  );
  const first = await app.request('/submissions', 'POST', payload);
  assert.equal(first.status, 201);
  const submission = await first.json();
  const replay = await app.request('/submissions', 'POST', payload);
  assert.equal(replay.status, 200);
  assert.deepEqual(await replay.json(), submission);
  assert.equal(
    (await app.request('/submissions', 'POST', { ...payload, circuitId: 'circuit-vignes' })).status,
    409,
  );
  const overview: Overview = await (await app.request('/overview')).json();
  assert.equal(overview.submissions.length, 1);
  assert.ok(!JSON.stringify(overview.submissions).includes('NE PAS TRANSMETTRE'));
  assert.deepEqual(Object.keys(submission).sort(), [
    'circuitId',
    'circuitVersion',
    'id',
    'sentAt',
    'status',
    'title',
  ]);
});
test('foreign browser origins and unexpected Host headers are rejected', async () => {
  const app = await client();
  assert.equal(
    (await fetch(`${app.base}/api/session`, { headers: { Origin: 'https://attacker.example' } }))
      .status,
    403,
  );
  const status = await new Promise<number | undefined>((resolve, reject) => {
    const req = request(
      `${app.base}/api/session`,
      { headers: { Host: 'attacker.example' } },
      (res) => {
        res.resume();
        resolve(res.statusCode);
      },
    );
    req.on('error', reject);
    req.end();
  });
  assert.equal(status, 403);
});
