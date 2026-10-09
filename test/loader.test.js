// The README's loader: the file runs when loaded as a script, and still opens FTECalc's tab after the script arrives.
// LIVE=1 also runs the loader as written, against the real GitHub and jsDelivr.
const { launch, READ, BASE, sleep } = require('./harness.js');
module.exports = async (check, port) => {
  const tab = await launch('loader', port);
  try {
    await tab.go(BASE + '/elsewhere');
    await tab.runLoader();
    await tab.waitFor('!!document.getElementById("ftecalc-notice")');
    check('loaded by the loader on the wrong page: the installed notice', /FTECalc successfully installed/.test(await tab.evaluate('(document.getElementById("ftecalc-notice") || {}).textContent || ""')));
    check('…loaded at the commit GitHub names', /\/cdn\/0123456789abcdef0123456789abcdef01234567\/bookmarklet-ftecalc\.js$/.test(await tab.scriptSrc()), await tab.scriptSrc());
    await tab.go(BASE + '/elsewhere');
    await tab.runLoader('/nosha');
    await tab.waitFor('!!document.getElementById("ftecalc-notice")');
    check('…and from main when GitHub doesn’t answer', /\/cdn\/main\/bookmarklet-ftecalc\.js\?t=\d+$/.test(await tab.scriptSrc()), await tab.scriptSrc());
    const app = await tab.openApp('AUT2026', () => tab.runLoader());
    await app.type('#prefix-input', 'PHIL');
    await app.key('Enter', 'Enter', 13);
    await app.waitFor('!/Loading/.test(document.getElementById("load-status").textContent) && /2026–27/.test(document.title)');
    await sleep(200);
    check('loaded by the loader on a quarter page: FTECalc opens and reads PHIL', (await app.evaluate(READ)).summary[0].big === '1,175', (await app.evaluate(READ)).summary[0]);
    if (process.env.LIVE) {
      const live = await tab.openApp('AUT2026', () => tab.runLoader('live'));
      await live.waitFor('!/Loading/.test(document.getElementById("load-status").textContent)');
      await sleep(300);
      check('the jsDelivr copy opens FTECalc, with Save', await live.evaluate('!!document.getElementById("save-btn") && document.querySelectorAll("#chips .chip").length === 1'));
    }
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
