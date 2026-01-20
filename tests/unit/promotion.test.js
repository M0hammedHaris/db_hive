const assert = require('assert');
const { createPromotionPR } = require('../../scripts/promotion/create-pr');

async function run() {
  const calls = [];
  const fakeOctokit = {
    pulls: {
      create: async (args) => {
        calls.push(args);
        return { data: { number: 123, ...args } };
      },
    },
  };

  // Test default base branch
  const resp = await createPromotionPR(fakeOctokit, {
    owner: 'me',
    repo: 'repo',
    head: 'canary',
    runId: 'run-1',
    sha: 'abc123',
  });

  assert.strictEqual(resp.data.number, 123);
  assert.strictEqual(calls.length, 1);
  assert.strictEqual(calls[0].head, 'canary');
  assert.ok(calls[0].base === 'release/prd-v0.2');
  assert.ok(calls[0].title.includes('Promote canary'));

  // Test override via PROMOTE_BRANCH env
  process.env.PROMOTE_BRANCH = 'main';
  const resp2 = await createPromotionPR(fakeOctokit, {
    owner: 'me',
    repo: 'repo',
    head: 'canary-2',
    runId: 'run-2',
    sha: 'def456',
  });
  assert.strictEqual(resp2.data.number, 123);
  assert.strictEqual(calls.length, 2);
  assert.strictEqual(calls[1].base, 'main');

  console.log('promotion tests passed');
}

run().catch((err) => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
