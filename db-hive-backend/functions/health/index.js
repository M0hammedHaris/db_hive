"use strict";

const { getHealth } = require('../../src/health');

// AWS Lambda compatible handler
exports.handler = async function handler(/* event, context */) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(getHealth()),
  };
};
