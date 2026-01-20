"use strict";

function emitEvent(name, payload = {}) {
  const event = {
    name,
    service: process.env.SERVICE_NAME || 'db-hive-backend',
    version: process.env.SERVICE_VERSION || 'v0.1',
    payload,
    runId: process.env.GITHUB_RUN_ID || null,
    ref: process.env.GITHUB_REF || null,
    timestamp: new Date().toISOString(),
  };

  try {
    if (process.env.LOGGING_DSN) {
      // Placeholder for a real telemetry sink (Sentry/Datadog/Kinesis)
      console.log('TELEMETRY_SEND', JSON.stringify(event));
    } else {
      // Emit structured telemetry to stdout for CI / local collection
      console.log('TELEMETRY', JSON.stringify(event));
    }
  } catch (err) {
    // Never fail the main path for telemetry errors
    console.error('telemetry emit failed', err && err.stack ? err.stack : err);
  }
}

module.exports = { emitEvent };
