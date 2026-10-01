// Runs the FTECalc tests against a fake Time Schedule: node --experimental-websocket test/run.js
// Each test runs the bookmarklet on a made-up Time Schedule page in headless Chrome, as a person would, and checks the numbers
// worked out by hand in fake-time-schedule.js.
const fs = require('fs');
const { TMP, startServer } = require('./harness.js');
const TESTS = ['numbers', 'settings', 'privacy', 'problems'];

(async () => {
  fs.mkdirSync(TMP, { recursive: true });
  const server = await startServer();
  let failed = 0, port = 9360;
  for (const name of TESTS) {
    const results = [];
    const check = (label, ok, detail) => results.push({ label, ok: !!ok, detail });
    try { await require(`./${name}.test.js`)(check, port++); }
    catch (e) { check('ran without error', false, e.message); }
    console.log(`\n${name}`);
    results.forEach(r => { if (!r.ok) failed++; console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.label}${r.ok || r.detail === undefined ? '' : '  → ' + JSON.stringify(r.detail)}`); });
  }
  server.close();
  console.log(failed ? `\n${failed} failed` : '\nall passed');
  process.exit(failed ? 1 : 0);
})();
