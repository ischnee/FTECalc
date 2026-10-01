// What a person sees when something's off: the wrong page, a pop-up blocker, an unknown prefix, a signed-out session, a year with no pages.
const { launch, READ, BASE, sleep, toggleSignedOut } = require('./harness.js');
module.exports = async (check, port) => {
  const tab = await launch('problems', port);
  try {
    await tab.go(BASE + '/elsewhere');
    await tab.runBookmarklet();
    check('off the Time Schedule: a notice saying where to run it', /Open the UW Time Schedule for any quarter/.test(await tab.evaluate('(document.getElementById("ftecalc-notice") || {}).textContent || ""')));
    await tab.key('Escape', 'Escape', 27);
    check('Escape closes the notice', await tab.evaluate('!document.getElementById("ftecalc-notice")'));
    await tab.go(BASE + '/students/timeschd/AUT2026/');
    await tab.evaluate(require('fs').readFileSync(require('path').join(__dirname, '..', 'bookmarklet-ftecalc.js'), 'utf8').slice('javascript:'.length), false);
    check('pop-up blocked: a notice saying to allow pop-ups', /Pop-up blocked/.test(await tab.evaluate('(document.getElementById("ftecalc-notice") || {}).textContent || ""')));

    const app = await tab.openApp();
    await app.type('#prefix-input', 'PHIL, XYZQ');
    await app.key('Enter', 'Enter', 13);
    check('unknown prefix: named, and nothing added', (await app.evaluate('document.getElementById("load-status").textContent')) === 'Unknown prefix: XYZQ' && (await app.evaluate('document.getElementById("prefix-input").className')) === 'bad' && (await app.evaluate('document.querySelectorAll("#chips .chip").length')) === 0);
    await app.evaluate('document.getElementById("prefix-input").value = ""');
    await app.type('#prefix-input', 'phil');
    await app.key('Enter', 'Enter', 13);
    await app.waitFor('document.querySelectorAll("#chips .chip").length === 1 && !/Loading/.test(document.getElementById("load-status").textContent)');

    await toggleSignedOut();
    await app.choose('#ay', '2024');
    await app.waitFor('/Couldn’t read/.test(document.getElementById("load-status").textContent)');
    let r = await app.evaluate(READ);
    check('signed out: says which pages couldn’t be read, and what to do', r.status === 'Couldn’t read PHIL Aut, PHIL Win, PHIL Spr. Still signed in to UW? Reload the Time Schedule, then FTECalc.', r.status);
    check('signed out: the summary says so too', /Autumn 2024, Winter 2025 and Spring 2025 couldn’t be read/.test(r.summary[0].parts), r.summary[0].parts);
    await toggleSignedOut();
    await app.choose('#ay', '2020');
    await app.waitFor('!/Loading/.test(document.getElementById("load-status").textContent) && /No Time Schedule/.test(document.getElementById("summary").textContent)');
    r = await app.evaluate(READ);
    check('a year with no pages says so', /No Time Schedule for 2020–21/.test(r.summary[0].parts), r.summary[0].parts);
    await app.click('#chips .chip button');
    await sleep(200);
    check('removing the last prefix empties the page', /Add one or more course prefixes/.test(await app.evaluate('document.getElementById("programs").textContent')) && (await app.evaluate('document.getElementById("program").options.length')) === 1);
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
