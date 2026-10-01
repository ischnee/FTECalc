// Settings: loads, co-teaching, the TA divisor, budgets, course releases and overloads, and that all of it survives reopening FTECalc.
const { launch, READ, sleep } = require('./harness.js');
const CATS = { 'Prof, Alpha': 'tt', 'Prof, Beta': 'tt', 'Prof, Delta': 'tt', 'Prof, Kappa': 'tt', 'Prof, Gamma': 'teach', 'Lect, Lambda': 'teach', 'Grad, Mu': 'grad' };
const setInput = (id, value) => `(() => { const i = document.getElementById(${JSON.stringify(id)}); i.value = ${JSON.stringify(String(value))}; i.dispatchEvent(new Event("change", { bubbles: true })); })()`;
module.exports = async (check, port) => {
  const tab = await launch('settings', port);
  try {
    let app = await tab.openApp('SPR2026');
    check('opened from Spring 2026: 2025–26', (await app.evaluate('document.getElementById("ay").value')) === '2025');
    await app.type('#prefix-input', 'PHIL,CLAS');
    await app.key('Enter', 'Enter', 13);
    await app.waitFor('/7,395/.test(document.getElementById("summary").textContent) && !/Loading/.test(document.getElementById("load-status").textContent)');
    for (const [name, cat] of Object.entries(CATS)) await app.choose(`select.cat[data-person="${name}"]`, cat);
    const fte = async () => (await app.evaluate(READ)).summary[1];

    await app.click('#settings-btn');
    check('gear opens Settings', await app.evaluate('!document.getElementById("settings").hidden'));
    await app.choose('#coteach', 'full');
    let r = await app.evaluate(READ);
    check('co-taught in full: FTE 7.50, Beta 4 of 4, Gamma 6 of 6', r.summary[1].big === '7.50' && r.faculty.some(c => c[0] === 'Prof, Beta' && c[6] === '4 of 4') && r.faculty.some(c => c[0] === 'Prof, Gamma' && c[6] === '6 of 6'), [r.summary[1].big, r.faculty.map(c => c[6])]);
    check('co-taught in full: SCH still split', r.faculty.some(c => c[0] === 'Prof, Beta' && c[8] === '775'));
    await app.choose('#coteach', 'split');
    await app.evaluate(setInput('ttLoad', 5));
    check('tenure-track load 5: 11.5 courses ÷ 5 = 2.30', /^Tenure track 2\.30 ·/.test((await fte()).parts), (await fte()).parts);
    await app.evaluate(setInput('taPerQuarter', 3));
    check('a TA quarter as ⅓: TAs 4.00', / TAs 4\.00$/.test((await fte()).parts), (await fte()).parts);
    await app.click('#reset');
    check('reset restores the defaults', (await fte()).big === '7.29', await fte());
    await app.evaluate('(() => { for (const [p, v] of [["PHIL", 1000000], ["CLAS", 500000]]) { const i = document.querySelector(`[data-budget="${p}"]`); i.value = v; i.dispatchEvent(new Event("change", { bubbles: true })); } })()');
    r = await app.evaluate(READ);
    check('cost per SCH: $1.5M ÷ 7,395 = $203', r.summary[3].big === '$203' && /\$1,500,000/.test(r.summary[3].parts), r.summary[3]);
    check('cost per SCH by program: $199, $210, $203', r.programs.map(c => c[8]).join() === '$199,$210,$203', r.programs.map(c => c[8]));
    await app.key('Escape', 'Escape', 27);
    check('Escape closes Settings', await app.evaluate('document.getElementById("settings").hidden'));

    /* Course releases and overloads: a person's load for one year. FTE still divides by the category's load. */
    const setLoad = (name, v) => app.evaluate(`(() => { const i = document.querySelector('input.load[data-load="${name}"]'); i.value = "${v}"; i.dispatchEvent(new Event("change", { bubbles: true })); })()`);
    const row = async name => (await app.evaluate(READ)).faculty.find(c => c[0] === name);
    const loadOf = name => app.evaluate(`(() => { const i = document.querySelector('input.load[data-load="${name}"]'); return i ? i.value + (i.classList.contains("adj") ? " adj" : "") + " | " + i.title : null; })()`);
    await setLoad('Prof, Alpha', 3);
    let alpha = await row('Prof, Alpha');
    check('a course release: Alpha 3 of 3, FTE still 0.75', alpha[6] === '3 of 3' && alpha[7] === '0.75', alpha);
    check('the changed load is marked, and its hover says why', (await loadOf('Prof, Alpha')) === '3 adj | Tenure track load is 4; 3 in 2025–26 (1 course release). FTE still divides by 4.', await loadOf('Prof, Alpha'));
    await setLoad('Lect, Lambda', 7);
    const lambda = await row('Lect, Lambda');
    check('an overload: Lambda 6 of 7, FTE 1.00', lambda[6] === '6 of 7' && lambda[7] === '1.00', lambda);
    check('summary FTE unchanged by releases and overloads', (await fte()).big === '7.29', await fte());
    await setLoad('Lect, Lambda', 6);
    check('back to the category’s load: no longer marked', (await loadOf('Lect, Lambda')).startsWith('6 | Teaching track load.'), await loadOf('Lect, Lambda'));
    await app.choose('#ay', '2026');
    await app.waitFor('/1,665/.test(document.getElementById("summary").textContent)');
    check('a release is for one year: Alpha’s load is 4 in 2026–27', (await loadOf('Prof, Alpha')).startsWith('4 | '), await loadOf('Prof, Alpha'));
    await app.choose('#ay', '2025');
    await app.waitFor('/7,395/.test(document.getElementById("summary").textContent)');
    check('…and still 3 in 2025–26', (await loadOf('Prof, Alpha')).startsWith('3 adj'), await loadOf('Prof, Alpha'));
    await app.click('#settings-btn');
    await app.evaluate(setInput('ttLoad', 5));
    check('a release follows the category’s load: tenure track 5 → Alpha 4', (await loadOf('Prof, Alpha')).startsWith('4 adj'), await loadOf('Prof, Alpha'));
    await app.click('#reset');
    await app.key('Escape', 'Escape', 27);

    await app.choose('select.cat[data-person="Prof, Kappa"]', 'other');
    const kappa = await row('Prof, Kappa');
    check('Other: the default load, 3 of 4, FTE 0.75', kappa && kappa[6] === '3 of 4' && kappa[7] === '0.75', kappa);
    await app.choose('select.cat[data-person="Prof, Kappa"]', 'tt');

    await app.close();
    app = await tab.openApp('SPR2026');
    await app.waitFor('/7,395/.test(document.getElementById("summary").textContent)');
    await sleep(300);
    r = await app.evaluate(READ);
    check('reopened: prefixes, categories and budgets kept', r.summary[1].big === '7.29' && r.summary[3].big === '$203' && (await app.evaluate('document.querySelectorAll("#chips .chip").length')) === 2, [r.summary[1].big, r.summary[3].big]);
    check('reopened: Alpha’s release kept', (await app.evaluate('document.querySelector(\'input.load[data-load="Prof, Alpha"]\').value')) === '3');
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
