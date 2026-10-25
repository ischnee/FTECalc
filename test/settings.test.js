// Settings and FTEs: co-teaching, the TA divisor, budgets, each person's FTE (fractions, carried forward to later years),
// and that all of it survives reopening FTECalc.
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
    check('no loads in Settings any more', await app.evaluate('!document.getElementById("ttLoad") && !document.getElementById("gradShare") && !!document.getElementById("taPerQuarter")'));
    await app.choose('#coteach', 'full');
    let r = await app.evaluate(READ);
    check('co-taught in full: Beta 4 courses, Gamma 6, FTE unchanged at 9.00', r.summary[1].big === '9.00' && r.faculty.some(c => c[0] === 'Prof, Beta' && c[6] === '4') && r.faculty.some(c => c[0] === 'Prof, Gamma' && c[6] === '6'), [r.summary[1].big, r.faculty.map(c => c[6])]);
    check('co-taught in full: SCH still split', r.faculty.some(c => c[0] === 'Prof, Beta' && c[7] === '775'));
    check('co-taught in full: CLAS has 1 of Gamma’s 6 courses, 2.17 FTE', r.programs[1][2] === '2.17', r.programs[1]);
    await app.choose('#coteach', 'split');
    await app.evaluate(setInput('taPerQuarter', 3));
    check('a TA quarter as ⅓: TAs 4.00', / TAs 4\.00$/.test((await fte()).parts), (await fte()).parts);
    await app.click('#reset');
    check('reset restores the defaults', (await fte()).big === '9.00', await fte());
    await app.evaluate('(() => { for (const [p, v] of [["PHIL", 1000000], ["CLAS", 500000]]) { const i = document.querySelector(`[data-budget="${p}"]`); i.value = v; i.dispatchEvent(new Event("change", { bubbles: true })); } })()');
    r = await app.evaluate(READ);
    check('cost per SCH: $1.5M ÷ 7,395 = $203', r.summary[3].big === '$203' && /\$1,500,000/.test(r.summary[3].parts), r.summary[3]);
    check('cost per SCH by program: $199, $210, $203', r.programs.map(c => c[8]).join() === '$199,$210,$203', r.programs.map(c => c[8]));
    await app.key('Escape', 'Escape', 27);
    check('Escape closes Settings', await app.evaluate('document.getElementById("settings").hidden'));

    /* A person's FTE: typed as a decimal or a fraction, kept to two decimals, and carried forward to later years. */
    const setFte = (name, v) => app.evaluate(`(() => { const i = document.querySelector('input.fte[data-fte="${name}"]'); i.value = "${v}"; i.dispatchEvent(new Event("change", { bubbles: true })); })()`);
    const fteOf = name => app.evaluate(`(() => { const i = document.querySelector('input.fte[data-fte="${name}"]'); return i ? i.value + (i.classList.contains("set") ? " set" : "") + " | " + i.title : null; })()`);
    await setFte('Prof, Alpha', '1/2');
    check('“1/2” is 0.50, marked as changed, and its hover says since when', (await fteOf('Prof, Alpha')) === '0.50 set | 0.50 since 2025–26. A change applies from 2025–26 on.', await fteOf('Prof, Alpha'));
    check('…and the FTE total drops by half: 8.50', (await fte()).big === '8.50' && /^Tenure track 3\.50 ·/.test((await fte()).parts), await fte());
    check('…and PHIL’s FTE: 4.50', (await app.evaluate(READ)).programs[0][2] === '4.50');
    await setFte('Lect, Lambda', '¾');
    check('“¾” is 0.75', (await fteOf('Lect, Lambda')).startsWith('0.75 set'), await fteOf('Lect, Lambda'));
    await setFte('Lect, Lambda', '2/3');
    check('“2/3” is 0.67', (await fteOf('Lect, Lambda')).startsWith('0.67 set'), await fteOf('Lect, Lambda'));
    await setFte('Lect, Lambda', 'half');
    check('something that isn’t a number is ignored', (await fteOf('Lect, Lambda')).startsWith('0.67 set'), await fteOf('Lect, Lambda'));
    await setFte('Lect, Lambda', '1.5');
    check('…as is more than 1', (await fteOf('Lect, Lambda')).startsWith('0.67 set'), await fteOf('Lect, Lambda'));
    await setFte('Lect, Lambda', '1');
    check('back to 1: no longer marked', (await fteOf('Lect, Lambda')) === '1.00 | 1 FTE, as everyone is unless changed. A change applies from 2025–26 on.', await fteOf('Lect, Lambda'));
    await setFte('Unassigned (STAFF, TBA)', '0.33');
    check('courses with no instructor can be given FTE too: 8.83', (await fte()).big === '8.83', await fte());
    await setFte('Unassigned (STAFF, TBA)', '0');

    await app.choose('#ay', '2026');
    await app.waitFor('/1,665/.test(document.getElementById("summary").textContent)');
    check('carried forward: Alpha is 0.50 in 2026–27 too', (await fteOf('Prof, Alpha')) === '0.50 set | 0.50 since 2025–26. A change applies from 2026–27 on.', await fteOf('Prof, Alpha'));
    await setFte('Prof, Alpha', '1');
    check('back to 1 from 2026–27', (await fteOf('Prof, Alpha')).startsWith('1.00 set | 1.00 since 2026–27.'), await fteOf('Prof, Alpha'));
    await app.choose('#ay', '2025');
    await app.waitFor('/7,395/.test(document.getElementById("summary").textContent)');
    check('…and still 0.50 in 2025–26', (await fteOf('Prof, Alpha')).startsWith('0.50 set'), await fteOf('Prof, Alpha'));
    const stored = await app.evaluate('JSON.parse(localStorage.getItem("ftecalc-people"))["Prof, Alpha"]');
    check('only the changes are kept', JSON.stringify(stored) === '{"cat":"tt","fte":{"2025":0.5,"2026":1}}', stored);

    await app.choose('select.cat[data-person="Prof, Kappa"]', 'other');
    check('Other: still 1 FTE', (await app.evaluate(READ)).summary[1].parts.includes('Other 1.00'), (await fte()).parts);
    await app.choose('select.cat[data-person="Prof, Kappa"]', 'tt');

    await app.close();
    app = await tab.openApp('SPR2026');
    await app.waitFor('/7,395/.test(document.getElementById("summary").textContent)');
    await sleep(300);
    r = await app.evaluate(READ);
    check('reopened: prefixes, categories, FTEs and budgets kept', r.summary[1].big === '8.50' && r.summary[3].big === '$203' && (await app.evaluate('document.querySelectorAll("#chips .chip").length')) === 2, [r.summary[1].big, r.summary[3].big]);
    check('reopened: Alpha’s FTE kept', (await app.evaluate('document.querySelector(\'input.fte[data-fte="Prof, Alpha"]\').value')) === '0.50');
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
