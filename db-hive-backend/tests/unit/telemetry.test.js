const assert = require('assert');
const telemetry = require('../../src/telemetry');

function captureConsole(fn) {
  const logs = [];
  const orig = console.log;
  console.log = (...args) => logs.push(args.join(' '));
  try {
    fn();
  } finally {
    console.log = orig;
  }
  return logs;
}

function run() {
  const logs = captureConsole(() => {
    telemetry.emitEvent('test.event', { sample: true });
  });
  assert.ok(logs.length > 0, 'expected telemetry logs to be produced');
  assert.ok(logs.some((l) => l.includes('TELEMETRY')), 'expected TELEMETRY marker');
  console.log('telemetry tests passed');
}

run();
