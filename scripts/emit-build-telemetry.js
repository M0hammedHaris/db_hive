#!/usr/bin/env node
/* Emit a minimal CI telemetry event for canary builds. This is a placeholder
   that prints structured telemetry to stdout and can be replaced with a real
   telemetry sink integration. */
const payload = {
  event: 'ci.canary.build',
  ref: process.env.GITHUB_REF || null,
  runId: process.env.GITHUB_RUN_ID || null,
  job: process.env.GITHUB_JOB || null,
  status: process.env.CI_STATUS || 'success',
  timestamp: new Date().toISOString(),
};

if (process.env.LOGGING_DSN) {
  console.log('TELEMETRY_SEND', JSON.stringify(payload));
} else {
  console.log('TELEMETRY', JSON.stringify(payload));
}

process.exit(0);
