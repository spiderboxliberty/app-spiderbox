import { readFileSync, lstatSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectSkillSource } from './skill-source.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const lock = JSON.parse(readFileSync(resolve(root, 'skills-lock.json'), 'utf8'));
let ok = true;
for (const [name, entry] of Object.entries(lock)) {
  try {
    if (inspectSkillSource(root, entry) !== entry.commit)
      throw new Error('Commit différent du verrouillage.');
    console.log(`${name}: origine, source propre et commit vérifiés · ${entry.version}`);
  } catch (error) {
    ok = false;
    console.error(`${name}: ${error.message}`);
  }
}
const checkFile = (path) => {
  try {
    return lstatSync(path).isFile();
  } catch {
    return false;
  }
};
for (const [name, entries] of [
  [
    'gstack',
    lock.gstack.codex_skills.map((name) => resolve(root, '.agents/skills', name, 'SKILL.md')),
  ],
  [
    'superpowers',
    lock.superpowers.skills.map((name) =>
      resolve(root, lock.superpowers.path, 'skills', name, 'SKILL.md'),
    ),
  ],
]) {
  const missing = entries.filter((path) => !checkFile(path));
  console.log(
    `${name}: ${entries.length - missing.length}/${entries.length} instructions présentes (fichiers réels)`,
  );
  if (missing.length) {
    ok = false;
    for (const path of missing) console.error(`Absent ou lien au lieu d’un fichier : ${path}`);
  }
}
if (!ok) process.exitCode = 1;
