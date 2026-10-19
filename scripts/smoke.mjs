import assert from 'node:assert/strict';

const base = `http://127.0.0.1:${process.env.PORT ?? 3001}`;
const health = await fetch(`${base}/api/health`);
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), {
  status: 'ok',
  mode: 'demo',
  persistence: 'memory',
  integrations: 'disconnected',
});
const html = await fetch(base);
assert.equal(html.status, 200);
assert.match(await html.text(), /SpiderBox Liberty/);
const response = await fetch(`${base}/api/session`);
assert.equal(response.status, 200);
const session = await response.json();
assert.equal(session.mode, 'demo');
const cookie = response.headers.get('set-cookie')?.split(';')[0];
assert.ok(cookie);
const overviewResponse = await fetch(`${base}/api/overview`, { headers: { Cookie: cookie } });
assert.equal(overviewResponse.status, 200);
const overview = await overviewResponse.json();
assert.equal(overview.stations.length, 2);
assert.equal(overview.circuits.length, 2);
assert.equal(overview.availability.freeSlots, null);
assert.ok(overview.stations.every((station) => station.organizationId === session.organizationId));
console.log(
  'Smoke OK : page, API, session fictive, stations/circuits autorisés et disponibilité inconnue.',
);
