import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// Real local Git checkouts, no network and no installer execution.
function fixture() {
  const root = mkdtempSync(resolve(tmpdir(), 'spiderbox-tools-'));
  const git = (dir: string, ...args: string[]) => {
    const result = spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const lock = JSON.parse(readFileSync(new URL('../skills-lock.json', import.meta.url), 'utf8'));
  for (const [name, entry] of Object.entries(lock) as [
    string,
    { path: string; commit: string; repository: string; skills?: string[] },
  ][]) {
    const dir = resolve(root, entry.path);
    mkdirSync(dir, { recursive: true });
    git(dir, 'init', '-q');
    git(dir, 'remote', 'add', 'origin', entry.repository);
    writeFileSync(resolve(dir, 'trusted-source'), 'original\n');
    if (name === 'superpowers') {
      for (const skill of entry.skills ?? ['using-superpowers']) {
        mkdirSync(resolve(dir, 'skills', skill), { recursive: true });
        writeFileSync(resolve(dir, 'skills', skill, 'SKILL.md'), 'fixture');
      }
    }
    git(dir, 'add', '.');
    git(
      dir,
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      '-c',
      'commit.gpgsign=false',
      'commit',
      '-qm',
      'fixture',
    );
    entry.commit = git(dir, 'rev-parse', 'HEAD');
  }
  const skills = lock.gstack.codex_skills ?? ['gstack', 'gstack-qa'];
  for (const name of skills) {
    mkdirSync(resolve(root, '.agents/skills', name), { recursive: true });
    writeFileSync(resolve(root, '.agents/skills', name, 'SKILL.md'), 'fixture');
  }
  mkdirSync(resolve(root, 'scripts'), { recursive: true });
  for (const name of ['skills-status.mjs', 'skill-source.mjs']) {
    try {
      cpSync(new URL(`../scripts/${name}`, import.meta.url), resolve(root, 'scripts', name));
    } catch (error) {
      if (name !== 'skill-source.mjs') throw error;
    }
  }
  writeFileSync(resolve(root, 'skills-lock.json'), JSON.stringify(lock));
  return {
    root,
    lock,
    run: () =>
      spawnSync(process.execPath, [resolve(root, 'scripts/skills-status.mjs')], {
        encoding: 'utf8',
      }),
    clean: () => rmSync(root, { recursive: true, force: true }),
  };
}
test('tooling status accepts a complete installation at the expected sources', () => {
  const f = fixture();
  try {
    assert.equal(f.run().status, 0);
  } finally {
    f.clean();
  }
});
test('tooling status rejects changed source at the pinned commit', () => {
  const f = fixture();
  try {
    writeFileSync(resolve(f.root, f.lock.gstack.path, 'trusted-source'), 'modified\n');
    assert.notEqual(f.run().status, 0);
  } finally {
    f.clean();
  }
});
test('tooling status rejects an incomplete catalog or missing router', () => {
  const f = fixture();
  try {
    rmSync(resolve(f.root, '.agents/skills/gstack/SKILL.md'));
    assert.notEqual(f.run().status, 0);
  } finally {
    f.clean();
  }
});
