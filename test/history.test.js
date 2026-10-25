// A person's history: every year the Time Schedule has, other spellings of the name, FTE by year, periods, the first-to-last
// comparison, adding and dropping names, and printing.
//
// Worked out by hand from fake-time-schedule.js, PHIL only. Alpha ("Prof, Alpha B" until 2022–23) teaches PHIL 100, 450 and
// 360 every year but 2021–22; 2025–26 has the combined 450/550. Alpha B is set to 0.5 FTE in 2020–21, which carries to 2022–23.
//   Year     SCH    Students  Alpha FTE   Everyone: SCH ÷ instructor FTE
//   2019–20    900  180       1           3,450 ÷ 4   (Alpha B, Gamma, Beta, Alphonse)
//   2020–21    950  190       0.5         3,350 ÷ 2.5
//   2021–22      –    –       –           2,400 ÷ 2
//   2022–23  1,050  210       0.5         3,450 ÷ 2.5
//   2023–24  1,100  220       1           3,500 ÷ 3
//   2024–25  1,150  230       1           3,550 ÷ 3
//   2025–26  1,100  220       1           5,015 ÷ 5
//   2026–27 has only Autumn, so it's left out. Nothing before 2019–20, so reading stops at 2018–19 and 2017–18.
const { launch, BASE, sleep } = require('./harness.js');
const HREAD = `(() => { const h = document.getElementById("history"); if (!h) return null; return {
  title: h.querySelector("h2").textContent, sub: h.querySelector("#hist-sub").textContent, note: h.querySelector("#hist-note").textContent,
  names: [...h.querySelectorAll("#hist-chips .chip")].map(c => c.firstChild.textContent + (c.querySelector("button") ? " ×" : "")),
  tilesHead: (h.querySelector(".tiles-head") || {}).textContent || "",
  tiles: [...h.querySelectorAll(".tile")].map(t => t.querySelector(".tl").textContent + ": " + t.querySelector(".tv").textContent + " " + t.querySelector(".td").textContent),
  rows: [...h.querySelectorAll(".hist-table tbody tr")].map(tr => [...tr.children].map(td => td.textContent.trim()).join(" | ")),
  bars: [...h.querySelectorAll(".hist-chart rect title")].map(t => t.textContent),
}; })()`;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const requests = async () => +(await (await fetch(BASE + '/__requests')).text());
module.exports = async (check, port) => {
  const tab = await launch('history', port);
  try {
    const app = await tab.openApp();
    await app.type('#prefix-input', 'phil');
    await app.key('Enter', 'Enter', 13);
    await app.waitFor('document.querySelectorAll("#chips .chip").length === 1 && !/Loading/.test(document.getElementById("load-status").textContent)');
    await app.choose('#ay', '2025');
    await app.waitFor('/5,015/.test(document.getElementById("summary").textContent) && !/Loading/.test(document.getElementById("load-status").textContent)');
    await app.choose('select.cat[data-person="Prof, Alpha"]', 'tt');
    await app.choose('#ay', '2020');
    await app.waitFor('!!document.querySelector(\'select.cat[data-person="Prof, Alpha B"]\') && !/Loading/.test(document.getElementById("load-status").textContent)');
    check('another spelling of a name uses its category', (await app.evaluate('document.querySelector(\'select.cat[data-person="Prof, Alpha B"]\').value')) === 'tt');
    await app.evaluate(`(() => { const i = document.querySelector('input.fte[data-fte="Prof, Alpha B"]'); i.value = "0.5"; i.dispatchEvent(new Event("change", { bubbles: true })); })()`);
    await app.choose('#ay', '2025');
    await app.waitFor('/5,015/.test(document.getElementById("summary").textContent)');
    check('2025–26 is untouched: Alpha 1.00', (await app.evaluate('document.querySelector(\'input.fte[data-fte="Prof, Alpha"]\').value')) === '1.00');

    const before = await requests();
    await app.click('#faculty button.who[data-history="Prof, Alpha"]');
    const done = () => app.waitFor('!!document.getElementById("history") && !/Reading/.test(document.getElementById("hist-note").textContent)', 100);
    await done();
    check('reads back to the first year with no pages, then stops: 7 years × 3 quarters', (await requests()) - before === 21, (await requests()) - before);
    check('it covers the dashboard', await app.evaluate('!!document.elementFromPoint(700, 30).closest("#history") && !!document.elementFromPoint(700, 600).closest("#history")'));
    let h = await app.evaluate(HREAD);
    check('the name and what it covers', h.title === 'Prof, AlphaTeaching history' && h.sub === 'PHIL · 2019–20 to 2025–26 · Autumn, Winter and Spring', [h.title, h.sub]);
    check('a year without Winter and Spring yet is left out, and says so', h.note === '2026–27 isn’t included until all of Autumn, Winter and Spring are published.', h.note);
    check('found under both spellings', same(h.names, ['Prof, Alpha', 'Prof, Alpha B ×']), h.names);
    check('three-year periods ending with the latest, and a total', same(h.rows, [
      '2019–20 | 1 of 1 | 3 | 180 | 60 | 900 | 1.00 | 900 | 863 | 100 · 360 · 450',
      '2020–23 | 2 of 3 | 6 | 400 | 67 | 2,000 | 0.50 | 2,000 | 1,314 | 100 ×2 · 360 ×2 · 450 ×2',
      '2023–26 | 3 of 3 | 9 | 670 | 74 | 3,350 | 1.00 | 1,117 | 1,097 | 100 ×3 · 360 ×3 · 450 ×2 · 450/550',
      'All, 2019–26 | 6 of 7 | 18 | 1,250 | 69 | 6,250 | 0.83 | 1,250 | 1,123 | 100 ×6 · 360 ×6 · 450 ×5 · 450/550']), h.rows);
    check('the year off is named on hover', (await app.evaluate('document.querySelectorAll(".hist-table tbody tr")[1].children[1].firstChild.title')) === 'No courses in 2021–22');
    check('first period against the last, per year taught', h.tilesHead === '2019–20 → 2023–26, per year taught' && same(h.tiles, ['Courses a year: 3 → 3 no change', 'Students a year: 180 → 223 ▲ 24%', 'Average class: 60 → 74 ▲ 24%', 'SCH a year: 900 → 1,117 ▲ 24%', 'SCH per FTE: 900 → 1,117 ▲ 24%']), [h.tilesHead, h.tiles]);
    check('a column for each year, with its numbers on hover', h.bars.length === 7 && h.bars[0] === '2019–20: 900 SCH · 3 courses · 180 students' && h.bars[2] === '2021–22: no courses', h.bars);
    check('the first and last values are labelled on the chart', (await app.evaluate('[...document.querySelectorAll(".hist-chart text")].filter(t => t.getAttribute("font-weight")).map(t => t.textContent).join()')) === '900,1,100');

    await app.click('#history [data-group="1"]');
    h = await app.evaluate(HREAD);
    check('one-year periods: a row a year', h.rows.length === 8 && h.rows[1] === '2020–21 | 3 | 190 | 63 | 950 | 0.50 | 1,900 | 1,340 | 100 · 360 · 450' && h.rows[2] === '2021–22 | – | – | – | – | – | – | 1,200 | No courses', h.rows);
    check('…compared first year to last', same(h.tiles, ['Courses a year: 3 → 3 no change', 'Students a year: 180 → 220 ▲ 22%', 'Average class: 60 → 73 ▲ 22%', 'SCH a year: 900 → 1,100 ▲ 22%', 'SCH per FTE: 900 → 1,100 ▲ 22%']), h.tiles);
    check('the period length is remembered', (await app.evaluate('localStorage.getItem("ftecalc-history-group")')) === '1');

    await app.type('#hist-add', 'Nobody, Zed');
    await app.key('Enter', 'Enter', 13);
    check('a name not in these years is refused', await app.evaluate('document.getElementById("hist-add").classList.contains("bad")'));
    await app.evaluate('(() => { const i = document.getElementById("hist-add"); i.value = "prof, alphonse"; i.dispatchEvent(new Event("change", { bubbles: true })); })()');
    h = await app.evaluate(HREAD);
    check('adding a name counts their courses too', same(h.names, ['Prof, Alpha', 'Prof, Alpha B ×', 'Prof, Alphonse ×']) && h.rows[0] === '2019–20 | 4 | 210 | 53 | 1,050 | 1.00 | 1,050 | 863 | 100 · 115 · 360 · 450', [h.names, h.rows[0]]);
    await app.click('#hist-chips button[data-drop="Prof, Alphonse"]');
    await app.click('#hist-chips button[data-drop="Prof, Alpha B"]');
    h = await app.evaluate(HREAD);
    check('dropping a spelling leaves out its years', same(h.names, ['Prof, Alpha']) && h.sub === 'PHIL · 2023–24 to 2025–26 · Autumn, Winter and Spring' && h.rows.length === 4, [h.names, h.sub, h.rows.length]);
    const stored = await app.evaluate('JSON.parse(localStorage.getItem("ftecalc-people"))["Prof, Alpha"]');
    check('the names chosen are kept', same(stored, { cat: 'tt', notAka: ['Prof, Alpha B'] }), stored);
    await app.evaluate('(() => { const i = document.getElementById("hist-add"); i.value = "Prof, Alpha B"; i.dispatchEvent(new Event("change", { bubbles: true })); })()');
    check('…and a dropped one can be added back', same((await app.evaluate(HREAD)).names, ['Prof, Alpha', 'Prof, Alpha B ×']));

    await app.send('Emulation.setEmulatedMedia', { media: 'print' });
    const printed = await app.evaluate('[getComputedStyle(document.querySelector(".summary")).display, getComputedStyle(document.querySelector(".hist-bar")).display, getComputedStyle(document.getElementById("history")).position, getComputedStyle(document.getElementById("hist-add")).display].join()');
    check('printing shows only the history, without its controls', printed === 'none,none,static,none', printed);
    await app.send('Emulation.setEmulatedMedia', { media: '' });

    await app.key('Escape', 'Escape', 27);
    check('Escape closes it', await app.evaluate('!document.getElementById("history") && !document.body.classList.contains("hist-open")'));
    const again = await requests();
    await app.click('#faculty button.who[data-history="Prof, Gamma"]');
    await done();
    h = await app.evaluate(HREAD);
    check('another person, without reading the pages again', (await requests()) === again && h.title === 'Prof, GammaTeaching history' && h.rows.length === 8, [(await requests()) - again, h.title, h.rows.length]);
    await app.click('#history .hist-back');
    check('Back closes it', await app.evaluate('!document.getElementById("history")'));
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
