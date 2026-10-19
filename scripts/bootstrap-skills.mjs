import { readFileSync, existsSync, mkdirSync, realpathSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { inspectSkillSource } from './skill-source.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(readFileSync(resolve(root, 'skills-lock.json'), 'utf8'));
const env = {
  ...process.env,
  PATH: `${root}/node_modules/.bin:${process.env.PATH ?? ''}`,
  GSTACK_STATE_ROOT: `${root}/.cache/gstack-state`,
  BUN_INSTALL_CACHE_DIR: `${root}/.cache/bun`,
  SUPERPOWERS_DISABLE_TELEMETRY: '1',
  GSTACK_CSO_IMAGE_PULL_TIMEOUT_SECONDS: '5',
};
function run(command, args, cwd = root, capture = false) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    timeout: 300000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(`${command} ${args.join(' ')} : échec (${result.status}).`);
  return result.stdout?.trim() ?? '';
}
for (const [name, entry] of Object.entries(lock)) {
  const destination = resolve(root, entry.path);
  if (!destination.startsWith(`${root}/`)) throw new Error('Destination de skill hors dépôt.');
  mkdirSync(dirname(destination), { recursive: true });
  if (!existsSync(destination))
    run('git', ['clone', '--single-branch', '--depth', '1', entry.repository, destination]);
  if (!realpathSync(destination).startsWith(`${realpathSync(root)}/`))
    throw new Error('Lien de skill hors dépôt.');
  const head = inspectSkillSource(root, entry);
  if (head !== entry.commit) {
    if (run('git', ['status', '--porcelain'], destination, true))
      throw new Error(
        `${name} contient des modifications locales : aucune réinitialisation automatique.`,
      );
    run('git', ['fetch', '--depth', '1', 'origin', entry.commit], destination);
    run('git', ['checkout', '--detach', entry.commit], destination);
  }
  if (inspectSkillSource(root, entry) !== entry.commit)
    throw new Error(`Commit ${name} non vérifié.`);
  console.log(`${name} ${entry.version} · commit vérifié ${entry.commit}`);
}
const gstack = resolve(root, lock.gstack.path);
mkdirSync(env.GSTACK_STATE_ROOT, { recursive: true, mode: 0o700 });
for (const [key, value] of [
  ['telemetry', 'off'],
  ['update_check', 'false'],
  ['question_tuning', 'false'],
]) {
  run(resolve(gstack, 'bin/gstack-config'), ['set', key, value]);
}
// Official Codex project install. Browser QA reuses the host Chromium; no CDN download.
run('bash', [resolve(gstack, 'setup'), '--host', 'codex', '--prefix', '--no-browser']);
run('bash', [resolve(gstack, 'setup'), '--status']);
