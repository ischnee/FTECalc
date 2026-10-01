// The numbers worked out by hand in fake-time-schedule.js: summary, programs, instructors and TAs.
const { launch, READ, sleep } = require('./harness.js');
const CATS = { 'Prof, Alpha': 'tt', 'Prof, Beta': 'tt', 'Prof, Delta': 'tt', 'Prof, Kappa': 'tt', 'Prof, Gamma': 'teach', 'Lect, Lambda': 'teach', 'Grad, Mu': 'grad' };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
module.exports = async (check, port) => {
  const tab = await launch('numbers', port);
  try {
    const app = await tab.openApp();
    let r = await app.evaluate(READ);
    check('opens on the page’s academic year, 2026–27', (await app.evaluate('document.getElementById("ay").selectedOptions[0].textContent')) === '2026–27 (Aut, Win, Spr)');
    check('before any prefix: asks for one', /Add one or more course prefixes/.test(await app.evaluate('document.getElementById("programs").textContent')));

    await app.type('#prefix-input', 'phil, clas');
    await app.key('Enter', 'Enter', 13);
    await app.waitFor('document.querySelectorAll("#chips .chip").length === 2 && !/Loading/.test(document.getElementById("load-status").textContent)');
    await sleep(300);
    r = await app.evaluate(READ);
    check('2026–27 so far: SCH 1,665', r.summary[0].big === '1,665', r.summary[0]);
    check('2026–27 marked partial', r.summary[0].parts === 'Aut 1,665 · Win – · Spr –Winter 2027 and Spring 2027 not published yet: a partial year', r.summary[0].parts);
    check('no load problems reported', r.status === '', r.status);

    await app.choose('#ay', '2025');
    await app.waitFor('!/Loading/.test(document.getElementById("load-status").textContent) && /7,395/.test(document.getElementById("summary").textContent)');
    await sleep(200);
    r = await app.evaluate(READ);
    check('2025–26 SCH 7,395 with quarters', r.summary[0].big === '7,395' && r.summary[0].parts === 'Aut 2,915 · Win 2,016 · Spr 2,464' + '1 variable-credit section not counted', r.summary[0]);
    check('before categories: 24 courses at the default 4, plus STAFF and TAs = 8.25', r.summary[1].big === '8.25', r.summary[1]);
    check('nudge: 7 instructors without a category', /7 instructors without a category/.test(r.summary[1].parts), r.summary[1].parts);

    for (const [name, cat] of Object.entries(CATS)) await app.choose(`select.cat[data-person="${name}"]`, cat);
    await sleep(200);
    r = await app.evaluate(READ);
    check('instructional FTE 7.29 by category', r.summary[1].big === '7.29' && r.summary[1].parts === 'Tenure track 2.88 · Teaching track 1.92 · Grad instructor 0.25 · Unassigned 0.25 · TAs 2.00', r.summary[1]);
    check('SCH per FTE 1,397; 1,014 with TAs', r.summary[2].big === '1,397per instructor FTE' && r.summary[2].parts === '1,014 counting TAs too', r.summary[2]);
    check('cost per SCH waits for a budget', r.summary[3].big === '–' && /Add the instructional \(GOF\) budget/.test(r.summary[3].parts), r.summary[3]);
    const progs = r.programs.map(c => [c[0], c[1], c[2], c[3], c[4], c[6], c[7], c[8]].join(' | '));
    check('programs compared', same(progs, ['PHIL | 5,015 | 3.54 | 2.00 | 1,416 | 78% | 51 | –', 'CLAS | 2,380 | 1.92 | 0.00 | 1,242 | 59% | – | –', 'All programs | 7,395 | 5.29 | 2.00 | 1,397 | 57% | 51 | –']), progs);
    const fac = r.faculty.map(c => [c[0], c[6], c[7], c[8], c[9]].join(' | '));
    check('instructor loads', same(fac, ['Prof, Alpha | 3 of 4 | 0.75 | 1,100 | 73', 'Prof, Beta | 3.5 of 4 | 0.88 | 775 | 43', 'Prof, Delta | 2 of 4 | 0.50 | 90 | 9', 'Prof, Kappa | 3 of 4 | 0.75 | 905 | 60',
      'Lect, Lambda | 6 of 6 | 1.00 | 1,415 | 55', 'Prof, Gamma | 5.5 of 6 | 0.92 | 2,735 | 94', 'Grad, Mu | 1 | 0.25 | 200 | 40', 'Unassigned (STAFF, TBA) | 1 | 0.25 | 175 | 35']), fac);
    const alpha = r.faculty[0];
    check('combined 450/550 is one course, with the CAS warning', alpha[3] === 'PHIL 100' && alpha[4] === 'PHIL 450/PHIL 550 ⚠' && alpha[5] === 'PHIL 360', alpha.slice(3, 6));
    check('joint PHIL 320/CLAS 320 is one course; 345 co-taught counts ½', r.faculty[5][3] === 'PHIL 102PHIL 320/CLAS 320' && r.faculty[5][4] === 'PHIL 120PHIL 345½' && r.faculty[1][4] === 'PHIL 345½', [r.faculty[5][3], r.faculty[5][4], r.faculty[1][4]]);
    check('three courses below the CAS minimum', (await app.evaluate('[...document.querySelectorAll("#faculty .cc")].filter(c => /⚠/.test(c.textContent)).map(c => c.textContent).join()')) === 'PHIL 450/PHIL 550 ⚠,PHIL 115 ⚠,CLAS 210 ⚠');
    check('balance: Alpha 83% even', alpha[10] === '83% even', alpha[10]);
    const tip = await app.evaluate('document.querySelector("#faculty tbody tr .cc").title');
    check('a course chip’s hover gives section, credits and enrollment', tip === 'PHIL 100 A · INTRODUCTION TO PHILOSOPHY · 5 cr · 120/150 students', tip);
    const tas = r.tas.map(c => c.join(' | '));
    check('TA allocation', same(tas, ['PHIL 100 | Aut | 120 | 6 | 3 | 40', 'PHIL 102 | Aut | 150 | 6 | 2 | 75', 'PHIL 120 | Win | 140 | 7 | 3 | 47', 'PHIL 100 | Spr | 100 | 5 | 2 | 50', 'PHIL 243 | Spr | 100 | 4 | 2 | 50']), tas);
    check('75 students per TA flagged against the median of 50', (await app.evaluate('[...document.querySelectorAll("#tas .flag-hi, #tas .flag-lo")].map(e => e.className + " " + e.textContent).join()')) === 'flag-hi 75');
    const how = await app.evaluate('document.querySelectorAll("#tas tbody tr")[2].children[4].title');
    check('TA count explained on hover', how === '3 TAs named (usually 2 sections each); 1 section with students but no TA, 1 to named TAs → +0; 1 empty section not counted', how);

    await app.choose('#program', 'PHIL');
    r = await app.evaluate(READ);
    check('Program PHIL: SCH 5,015, FTE 5.54', r.summary[0].big === '5,015' && r.summary[1].big === '5.54', [r.summary[0].big, r.summary[1].big]);
    check('Program PHIL: no CLAS courses', r.faculty.every(c => !/CLAS/.test(c.join())) && r.faculty.length === 6, r.faculty.map(c => c[0]));
    await app.choose('#program', 'CLAS');
    r = await app.evaluate(READ);
    check('Program CLAS: Gamma’s joint course counts here too', r.summary[1].big === '1.92' && r.faculty.some(c => c[0] === 'Prof, Gamma' && c[6] === '1 of 6'), r.faculty.map(c => c[0] + ' ' + c[6]));
    await app.choose('#program', 'all');
    await app.click('#faculty th[data-sort="sch"]');
    check('sorting by SCH', (await app.evaluate('[...document.querySelectorAll("#faculty tbody td.name")].map(t => t.textContent).slice(0, 3).join(" / ")')) === 'Prof, Gamma / Lect, Lambda / Prof, Alpha');
    check('no script errors', app.errors.length === 0, app.errors);
  } finally { tab.kill(); }
};
