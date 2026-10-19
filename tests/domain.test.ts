import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessLocalEvidence, fieldChecklist, type FieldEvidence } from '../src/domain';
import { circuits, stations } from '../server/fixtures';

const evidence: FieldEvidence = {
  circuitId: circuits[0].id,
  circuitVersion: 1,
  stationId: stations[0].id,
  site: stations[0].site,
  configurationVersion: 'demo-v1',
  testerId: 'user-a',
  testedAt: '2026-10-19T10:00:00Z',
  completeRoundTrip: true,
  traceHasGaps: false,
  traceReference: 'fixture://round-trip',
  photoReferences: ['fixture://photo'],
  conditions: 'Conditions de test fictives',
  checklist: Object.fromEntries(fieldChecklist.map((item) => [item, true])),
};
test('evidence contract accepts a complete dossier for the exact local scope', () => {
  assert.deepEqual(assessLocalEvidence(circuits[0], stations[0], evidence), []);
});
test('partial round trip, gaps and missing checklist items prevent validation', () => {
  for (const invalid of [
    { completeRoundTrip: false },
    { traceHasGaps: true },
    { traceReference: '' },
    { checklist: {} },
    { photoReferences: [] },
    { testerId: '' },
    { conditions: '' },
  ]) {
    assert.ok(
      assessLocalEvidence(circuits[0], stations[0], { ...evidence, ...invalid }).length > 0,
    );
  }
});
test('circuit version, site, configuration and station never transfer implicitly', () => {
  for (const invalid of [
    { circuitVersion: 2 },
    { site: 'autre site' },
    { configurationVersion: 'v2' },
    { stationId: 'station-b' },
  ]) {
    assert.ok(
      assessLocalEvidence(circuits[0], stations[0], { ...evidence, ...invalid }).length > 0,
    );
  }
});

test('whitespace-only tester, trace and photo references are not evidence', () => {
  for (const invalid of [
    { testerId: ' ' },
    { traceReference: '\t' },
    { photoReferences: [''] },
    { photoReferences: ['fixture://photo', '  '] },
  ]) {
    assert.ok(
      assessLocalEvidence(circuits[0], stations[0], { ...evidence, ...invalid }).length > 0,
    );
  }
});
