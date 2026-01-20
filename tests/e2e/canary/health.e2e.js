const assert = require('assert');

async function run() {
  const url = process.env.CI_HEALTH_CHECK_URL;
  if (!url) {
    console.log('CI_HEALTH_CHECK_URL not set — skipping e2e canary test');
    return;
  }

  console.log(`Running canary e2e health check against ${url}`);
  let res;
  if (typeof fetch === 'function') {
    res = await fetch(url, { method: 'GET' });
    assert.strictEqual(res.status, 200, 'expected HTTP 200');
    const j = await res.json();
    assert.strictEqual(j.status, 'ok', 'expected status ok');
    assert.strictEqual(j.services && j.services.db, 'ok', 'expected services.db ok');
  } else {
    // Node <18 fallback to curl
    const { execSync } = require('child_process');
    const out = execSync(`curl -sSf "${url}"`);
    const j = JSON.parse(out.toString());
    assert.strictEqual(j.status, 'ok', 'expected status ok');
    assert.strictEqual(j.services && j.services.db, 'ok', 'expected services.db ok');
  }

  console.log('canary e2e health test passed');
}

run().catch((err) => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
