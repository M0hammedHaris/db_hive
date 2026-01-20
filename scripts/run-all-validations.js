#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}`);
  try {
    const out = execSync(cmd, { stdio: 'inherit', ...opts });
    return { ok: true, out };
  } catch (err) {
    console.error(`Command failed: ${cmd}`);
    return { ok: false, err };
  }
}

const root = path.resolve(__dirname, '..');

const steps = [
  `node ${path.join(root, 'scripts', 'validate-skeletons.js')}`,
  `node ${path.join(root, 'scripts', 'validate-ci-workflows.js')}`,
  `node ${path.join(root, 'scripts', 'validate-deploy-docs.js')}`,
  `node ${path.join(root, 'db-hive-backend', 'tests', 'unit', 'health.test.js')}`,
  `node ${path.join(root, 'db-hive-backend', 'tests', 'unit', 'telemetry.test.js')}`,
  `node ${path.join(root, 'scripts', 'emit-build-telemetry.js')}`,
  `node ${path.join(root, 'tests', 'unit', 'promotion.test.js')}`,
  `node ${path.join(root, 'tests', 'e2e', 'canary', 'health.e2e.js')}`,
];

for (const s of steps) {
  const res = run(s, { cwd: root });
  if (!res.ok) {
    console.error('\nValidation failed');
    process.exit(2);
  }
}

console.log('\nAll validations passed');
process.exit(0);
