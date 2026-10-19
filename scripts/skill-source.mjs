import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

export function inspectSkillSource(root, entry) {
  const destination = resolve(root, entry.path);
  const physicalRoot = realpathSync(root);
  if (
    !destination.startsWith(`${root}/`) ||
    !realpathSync(destination).startsWith(`${physicalRoot}/`)
  )
    throw new Error('Source de skill hors dépôt.');
  const git = (...args) => {
    const result = spawnSync('git', ['-C', destination, ...args], {
      encoding: 'utf8',
      timeout: 15000,
    });
    if (result.status !== 0) throw new Error('Source Git du skill illisible.');
    return result.stdout.trim();
  };
  if (realpathSync(git('rev-parse', '--show-toplevel')) !== realpathSync(destination))
    throw new Error('La source du skill doit être son propre dépôt.');
  if (git('remote', 'get-url', 'origin') !== entry.repository)
    throw new Error('Origine du skill différente du verrouillage.');
  if (git('status', '--porcelain'))
    throw new Error(
      'Source du skill modifiée : conservée, aucune exécution ou réinitialisation automatique.',
    );
  return git('rev-parse', 'HEAD');
}
