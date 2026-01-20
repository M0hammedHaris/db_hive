#!/usr/bin/env node
/*
  validate-ci-workflows.js

  Simple validation script that ensures each skeleton repo contains a
  `.github/workflows/canary.yml` file and that the file includes a minimal
  set of required jobs and secret references.
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const repos = [
  {
    name: 'db-hive-frontend',
    required: ['install-and-test', 'canary-health-check', 'VERCEL_TOKEN', 'CI_HEALTH_CHECK_URL', 'emit-build-telemetry', 'pulls.create'],
  },
  {
    name: 'db-hive-backend',
    required: ['install-and-test', 'canary-health-check', 'CI_DEPLOY_KEY', 'CI_HEALTH_CHECK_URL', 'emit-build-telemetry', 'pulls.create'],
  },
  {
    name: 'db-hive-infra',
    required: ['validate', 'canary-health-check', 'CI_HEALTH_CHECK_URL', 'emit-build-telemetry', 'pulls.create'],
  },
];

let failed = false;

repos.forEach((repo) => {
  const wfPath = path.join(root, repo.name, '.github', 'workflows', 'canary.yml');
  if (!fs.existsSync(wfPath)) {
    console.error(`Missing workflow for ${repo.name}: ${wfPath}`);
    failed = true;
    return;
  }

  const content = fs.readFileSync(wfPath, 'utf8');
  repo.required.forEach((token) => {
    if (!content.includes(token)) {
      console.error(`Workflow ${wfPath} does not include required token: ${token}`);
      failed = true;
    }
  });
});

if (failed) {
  console.error('\nCI workflow validation failed');
  process.exit(2);
}

console.log('All CI workflow templates validated successfully');
process.exit(0);
