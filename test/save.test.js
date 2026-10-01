// Save: the dialog, the saved file (which reopens the dashboard without the Time Schedule), and what it keeps.
const fs = require('fs'), path = require('path');
const { launch, READ, TMP, sleep } = require('./harness.js');
const CATS = { 'Prof, Alpha': 'tt', 'Prof, Beta': 'tt', 'Prof, Delta': 'tt', 'Prof, Kappa': 'tt', 'Prof, Gamma': 'teach', 'Lect, Lambda': 'teach', 'Grad, Mu': 'grad' };
const TAS = ['Assistant', 'Aster', 'Birch', 'Cedar', 'Dahlia', 'Elm', 'Fern', 'Ginkgo', 'Hazel', 'Iris', 'Juniper'];
/* Chrome's Save As dialog can't be driven headless, so the test stands in for it and keeps what would be written. */
const FAKE_PICKER = `window.showSaveFilePicker = async opts => { window.__pickerOpts = opts; return { name: opts.suggestedName, createWritable: async () => ({ write: async b => { window.__saved = await b.text(); }, close: async () => {} }) }; }`;
module.exports = async (check, port) => {
  const tab = await launch('save', port);
  try {
    const app = await tab.openApp('SPR2026');
    check('Save waits for a prefix', await app.evaluate('document.getElementById("save-btn").disabled'));
    await app.type('#prefix-input', 'PHIL, CLAS');
    await app.key('Enter', 'Enter', 13);
    await app.waitFor('/7,395/.test(document.getElementById("summary").textContent) && !document.getElementById("save-btn").disabled');
    for (const [name, cat] of Object.entries(CATS)) await app.choose(`select.cat[data-person="${name}"]`, cat);
    await app.evaluate(`(() => { const i = document.querySelector('input.load[data-load="Prof, Alpha"]'); i.value = "3"; i.dispatchEvent(new Event("change", { bubbles: true })); })()`);
    await app.click('#settings-btn');
    await app.evaluate('(() => { const i = document.querySelector(`[data-budget="PHIL"]`); i.value = 1000000; i.dispatchEvent(new Event("change", { bubbles: true })); })()');
    await app.key('Escape', 'Escape', 27);
    await app.click('.panel-toggle[data-panel="tas"]');
    check('a panel collapses', await app.evaluate('document.getElementById("panel-tas").classList.contains("collapsed") && getComputedStyle(document.getElementById("tas")).display === "none"'));
    const live = await app.evaluate(READ);

    await app.evaluate(FAKE_PICKER);
    await app.click('#save-btn');
    check('Save opens the dialog with the note ready', await app.evaluate('document.activeElement && document.activeElement.id === "save-note"'));
    await app.key('Tab', 'Tab', 9);
    check('Tab takes the suggested note', (await app.evaluate('document.getElementById("save-note").value')) === '10th day of Spring');
    check('the file name has the year, prefixes and note', /^FTECalc 2025–26 PHIL CLAS \d{4}-\d\d-\d\d \d{4} 10th day of Spring\.html$/.test(await app.evaluate('document.getElementById("save-file").textContent')), await app.evaluate('document.getElementById("save-file").textContent'));
    await app.click('.dlg-save');
    await app.waitFor('!document.getElementById("save-dialog") && !!window.__saved');
    check('a toast names the file', /^Saved as “FTECalc 2025–26 PHIL CLAS .* 10th day of Spring\.html”$/.test(await app.evaluate('(document.querySelector(".toast") || {}).textContent')));
    check('Save As opens in the folder used last time for FTECalc results', (await app.evaluate('window.__pickerOpts.id')) === 'ftecalc-results');
    const html = await app.evaluate('window.__saved');
    const file = path.join(TMP, 'saved-results.html');
    fs.writeFileSync(file, html);
    check('no TA name in the saved file', TAS.every(n => !html.includes(n)), TAS.filter(n => html.includes(n)));
    check('the saved file keeps only the people in it', !/Prof, Nobody/.test(html));

    const s = await tab.openFile(file);
    const r = await s.evaluate(READ);
    check('the saved file shows the same numbers', JSON.stringify([r.summary, r.programs, r.faculty, r.tas]) === JSON.stringify([live.summary, live.programs, live.faculty, live.tas]), { saved: r.summary, live: live.summary });
    const banner = await s.evaluate('document.querySelector(".saved-banner").textContent');
    check('a SAVED banner with the note and the year', /^SAVED10th day of Spring2025–26 · PHIL, CLAS · data as of .*Saved .* · numbers don’t update$/.test(banner), banner);
    check('one academic year, no prefix box, no Save', await s.evaluate('document.getElementById("ay").disabled && document.getElementById("ay").options.length === 1 && getComputedStyle(document.getElementById("prefix-input")).display === "none" && getComputedStyle(document.getElementById("save-btn")).display === "none"'));
    check('the tab title says it’s saved', (await s.evaluate('document.title')) === 'FTECalc 2025–26 · saved · 10th day of Spring');
    await s.evaluate(`(() => { const i = document.querySelector('select.cat[data-person="Prof, Beta"]'); i.value = "teach"; i.dispatchEvent(new Event("change", { bubbles: true })); })()`);
    check('changes in a saved file work but aren’t stored', (await s.evaluate('localStorage.length')) === 0 && (await s.evaluate('document.querySelector(\'select.cat[data-person="Prof, Beta"]\').value')) === 'teach');
    check('no script errors in the saved file', s.errors.length === 0, s.errors);

    await app.evaluate('delete window.showSaveFilePicker; window.showSaveFilePicker = undefined');
    await app.click('#save-btn');
    await app.evaluate('document.getElementById("save-reload").click()');
    await app.click('.dlg-save');
    const dl = await tab.downloaded();
    check('without Save As, the file downloads', dl && /FTECalc 2025–26 PHIL CLAS/.test(path.basename(dl)), dl);
    check('…and a toast says where', /^Saved to your Downloads folder: FTECalc/.test(await app.evaluate('(document.querySelector(".toast:last-of-type") || {}).textContent')));
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
