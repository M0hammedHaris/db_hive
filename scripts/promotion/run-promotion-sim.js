"use strict";
const { createPromotionPR } = require('./create-pr');

async function runSim() {
  // Fake octokit implementation for local simulation
  const fakeOctokit = {
    pulls: {
      create: async (args) => ({ data: { number: 999, args } }),
    },
  };

  const head = process.env.GITHUB_REF ? process.env.GITHUB_REF.replace('refs/heads/', '') : 'canary';
  const resp = await createPromotionPR(fakeOctokit, {
    owner: 'example',
    repo: 'db_hive',
    head,
    runId: process.env.GITHUB_RUN_ID || 'local',
    sha: process.env.GITHUB_SHA || 'local-sha',
  });

  console.log('Simulated PR created:', resp.data.number);
}

if (require.main === module) {
  runSim().catch((err) => {
    console.error(err && err.stack ? err.stack : err);
    process.exit(1);
  });
}
