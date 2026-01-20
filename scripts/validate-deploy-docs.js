#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const repos = ['db-hive-frontend', 'db-hive-backend', 'db-hive-infra'];

let failed = false;
repos.forEach((r) => {
  const p = path.join(root, r, 'docs', 'DEPLOY.md');
  if (!fs.existsSync(p)) {
    console.error(`Missing DEPLOY.md for ${r}`);
    failed = true;
    return;
  }
  const content = fs.readFileSync(p, 'utf8');
  if (!content.includes('Canary') && !content.includes('canary')) {
    console.error(`DEPLOY.md for ${r} does not mention canary steps`);
    failed = true;
  }
});

if (failed) {
  console.error('\nDEPLOY docs validation failed');
  process.exit(2);
}
console.log('DEPLOY docs validated successfully');
process.exit(0);
