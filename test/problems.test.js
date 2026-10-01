// What a person sees when something's off: the wrong page, a pop-up blocker, an unknown prefix, a signed-out session, a year with no pages.
const { launch, READ, BASE, sleep, toggleSignedOut } = require('./harness.js');
module.exports = async (check, port) => {
  const tab = await launch('problems', port);
  try {
    await tab.go(BASE + '/elsewhere');
    await tab.runBookmarklet();
    const notice = () => tab.evaluate('(() => { const n = document.getElementById("ftecalc-notice"); if (!n) return null; const a = n.querySelector("a.go"); return { head: n.querySelector("#ftecalc-notice-head").textContent, msg: n.querySelector(".msg").textContent, link: a.style.display === "none" ? null : a.textContent + " " + a.href }; })()');
    let n = await notice();
    check('off the Time Schedule: says it’s installed, and the steps', n && n.head === 'FTECalc successfully installed' && n.msg === 'Open the UW Time Schedule: sign in with your UW NetID, pick any quarter (for example Autumn 2026), then click FTECalc again.', n);
    check('…with a button to the Time Schedule', n && n.link === 'Open the Time Schedule https://www.washington.edu/students/timeschd/', n);
    await tab.key('Escape', 'Escape', 27);
    check('Escape closes the notice', await tab.evaluate('!document.getElementById("ftecalc-notice")'));
    await tab.go(BASE + '/students/timeschd/');
    await tab.runBookmarklet();
    n = await notice();
    check('on the Time Schedule’s front page: pick a quarter', n && n.msg === 'Pick a quarter on this page (any quarter in the academic year you want), then click FTECalc again.' && !n.link, n);
    await tab.key('Enter', 'Enter', 13);
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
