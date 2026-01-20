const assert = require('assert');
const { getHealth, lambdaHandler } = require('../../src/health');

function assertHealth(h) {
  assert.strictEqual(h.status, 'ok', 'status must be ok');
  assert.ok(h.services && h.services.db === 'ok', 'db service must be ok');
  assert.ok(typeof h.uptime === 'number' && h.uptime >= 0, 'uptime must be number');
  const d = new Date(h.timestamp);
  assert.ok(!isNaN(d.getTime()), 'timestamp should be a valid ISO date');
}

async function run() {
  const h = getHealth();
  assertHealth(h);

  const lambdaResp = await lambdaHandler({});
  assert.strictEqual(lambdaResp.statusCode, 200);
  const body = JSON.parse(lambdaResp.body);
  assertHealth(body);

  console.log('health tests passed');
}

run().catch((err) => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
