#!/usr/bin/env node
/*
  validate-skeletons.js

  Simple workspace validation tool used by the Dev Agent to confirm the requested
  repository skeletons were created. Exits with code 0 on success and non-zero
  on failure.
*/
const fs = require('fs');
const path = require('path');

// scripts/validate-skeletons.js is located in the `scripts` folder; the repo
// root is one level up. Use the repo root as the base for repo path checks.
const root = path.resolve(__dirname, '..');
const repos = ['db-hive-frontend', 'db-hive-backend', 'db-hive-infra'];
const expectedFiles = ['README.md', 'CONTRIBUTING.md'];
const expectedDirs = ['infra', 'frontend', 'backend', 'tests', 'docs'];

let failed = false;

repos.forEach((repo) => {
  const repoPath = path.join(root, repo);
  if (!fs.existsSync(repoPath) || !fs.lstatSync(repoPath).isDirectory()) {
    console.error(`Missing repo directory: ${repo}`);
    failed = true;
    return;
  }

  expectedFiles.forEach((f) => {
    const p = path.join(repoPath, f);
    if (!fs.existsSync(p)) {
      console.error(`Missing ${f} in ${repo}`);
      failed = true;
    }
  });

  expectedDirs.forEach((d) => {
    const dpath = path.join(repoPath, d);
    if (!fs.existsSync(dpath) || !fs.lstatSync(dpath).isDirectory()) {
      console.error(`Missing directory ${repo}/${d}`);
      failed = true;
      return;
    }
    const entries = fs.readdirSync(dpath);
    if (entries.length === 0) {
      console.error(`Directory ${repo}/${d} is empty (expected at least a .gitkeep)`);
      failed = true;
    }
  });
});

if (failed) {
  console.error('\nRepository skeleton validation failed');
  process.exit(2);
}

console.log('All repository skeletons validated successfully');
process.exit(0);
