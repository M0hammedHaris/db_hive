"use strict";

const telemetry = require('./telemetry');

function getHealth() {
  const uptime = typeof process.uptime === 'function' ? Math.floor(process.uptime()) : 0;
  return {
    status: 'ok',
    version: process.env.SERVICE_VERSION || 'v0.1',
    uptime,
    services: {
      db: 'ok',
    },
    timestamp: new Date().toISOString(),
  };
}

function httpHandler(req, res) {
  const payload = getHealth();
  res.setHeader('Content-Type', 'application/json');
  try {
    telemetry.emitEvent('health.check', { status: payload.status, services: payload.services });
  } catch (err) {
    console.error('telemetry error', err && err.stack ? err.stack : err);
  }
  // For simple serverless adapters that accept Node-style res objects
  if (typeof res.status === 'function') {
    return res.status(200).json(payload);
  }
  res.statusCode = 200;
  res.end(JSON.stringify(payload));
}

async function lambdaHandler(/* event, context */) {
  const payload = getHealth();
  try {
    telemetry.emitEvent('health.check', { status: payload.status, services: payload.services });
  } catch (err) {
    console.error('telemetry error', err && err.stack ? err.stack : err);
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

module.exports = {
  getHealth,
  httpHandler,
  lambdaHandler,
};
