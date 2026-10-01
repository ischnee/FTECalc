// Made-up PHIL and CLAS Time Schedule pages in the real page's format, for the tests. Every name and number is invented.
// pages[QUARTER][PREFIX] = courses: [number, title, gen ed, sections]; a section is [id, credits, meeting, instructor, enrolled, limit, quizzes, flag].
// A quiz is [leader, enrolled]: a TA's first name (shown as "Assistant,<name>"), 'STAFF', 'TBA' (no time, no name), '' (blank),
// or 'PROF' (the lecture's own instructor). flag puts "Restr" or ">" before the SLN, as the real pages do.
//
// Worked out by hand for 2025–26, with categories set (Alpha, Beta, Delta, Kappa tenure track; Gamma, Lambda teaching track; Mu grad):
//   Alpha  TT     PHIL 100 (600) · PHIL 450/550 combined, one course (80 + 20) · PHIL 360 (400)          3 courses   SCH 1,100  FTE .75
//   Beta   TT     PHIL 240 (450) · PHIL 345 with Gamma, ½ (150 ÷ 2) · PHIL 322 (200) · PHIL 401 (50)        3.5         SCH   775  FTE .875
//   Gamma  Teach  PHIL 102 (750) · PHIL 320 + CLAS 320 jointly, one course (150 + 60) · PHIL 345 ½ (75)
//                 · PHIL 120 (700) · PHIL 100 (500) · PHIL 243 (500)                                     5.5         SCH 2,735  FTE .9167
//   Delta  TT     PHIL 210 Honors (90) · PHIL 115 B with no one enrolled (0)                             2           SCH    90  FTE .5
//   Mu     Grad   PHIL 115 A (200)                                                                       1           SCH   200  FTE .25
//   STAFF         PHIL 241 (175)                                                                         1           SCH   175  FTE .25
//   Kappa  TT     CLAS 101 (500) · CLAS 205 (305) · CLAS 430 (100)                                       3           SCH   905  FTE .75
//   Lambda Teach  CLAS 210 A (300) · CLAS 210 B (15) · CLAS 101 (400) · CLAS 301 3 cr (186) · CLAS 102 (450)
//                 · CLAS 111 credits 2-5, counted as 2 (64)                                              6           SCH 1,415  FTE 1
//   Not counted: PHIL 105 (limit 0), PHIL 499 and PHIL 600 (independent study), PHIL 590 (VAR credits: "1 variable-credit section").
//   All:  SCH 7,395 (Aut 2,915 · Win 2,016 · Spr 2,464). Instructor FTE 5.2917 (TT 2.875, Teaching 1.9167, Grad .25, Unassigned .25).
//         TAs: Aut PHIL 100 3 (2 named + 2 sections ÷ 2), PHIL 102 2; Win PHIL 120 3 (Ginkgo, with 1 section, takes the STAFF one);
//         Spr PHIL 100 2 (1 named + 2 ÷ 2), PHIL 243 2 → 12 TA quarters = TA FTE 2.0. SCH per instructor FTE 1,397; with TAs 1,014.
//         Top 25% (2 of 7 instructors: Gamma, Lambda) teach 57% of the SCH.
//   PHIL: SCH 5,015, instructor FTE 3.5417, SCH per FTE 1,416, top 25% 78%. CLAS: SCH 2,380, FTE 1.9167 (with Gamma's ⅙), 1,242, 59%.
//   2026–27 has only Autumn: PHIL 100 Alpha 700, PHIL 240 Beta 475, CLAS 101 Kappa 490 → SCH 1,665.
const TA2 = (a, b) => [[a, 25], [a, 24], [b, 25], [b, 23]];
const pages = {
  AUT2025: {
    PHIL: [
      ['100', 'INTRODUCTION TO PHILOSOPHY', '(A&H/SSc)', [['A', '5', 'MWF    1030-1120  SAV  264', 'PROF,ALPHA', 120, 150, [...TA2('Aster', 'Birch'), ['STAFF', 12], ['', 11]], 'Restr']]],
      ['102', 'CONTEMPORARY MORAL PROBLEMS', '(A&H/SSc)', [['A', '5', 'TTh    1130-1320  KNE  120', 'PROF,GAMMA', 150, 160, [['Cedar', 25], ['Cedar', 25], ['Cedar', 25], ['Dahlia', 25], ['Dahlia', 25], ['Dahlia', 25]]]]],
      ['105', 'PHILOSOPHICAL PUZZLES', '(A&H)', [['A', '5', 'TTh    0830-0920  SAV  132', 'PROF,ALPHA', 0, 0]]],
      ['210', 'HONORS INTRODUCTION TO ETHICS', '(A&H)', [['A', '5', 'MW     0130-0320  SAV  130', 'PROF,DELTA', 18, 20]]],
      ['240', 'INTRODUCTION TO ETHICS', '(A&H/SSc)', [['A', '5', 'MWF    0930-1020  SMI  120', 'PROF,BETA', 90, 100]]],
      ['320', 'HISTORY OF ANCIENT PHILOSOPHY', '(A&H)', [['A', '5', 'MW     1130-1250  DEN  213', 'PROF,GAMMA', 30, 35]]],
      ['499', 'UNDERGRADUATE INDEPENDENT STUDY', '', [['A', 'VAR', 'to be arranged', 'PROF,ALPHA', 3, 10]]],
      ['600', 'INDEPENDENT STUDY OR RESEARCH', '', [['A', 'VAR', 'to be arranged', 'PROF,BETA', 4, 20]]],
    ],
    CLAS: [
      ['101', 'LATIN AND GREEK IN CURRENT USE', '(A&H)', [['A', '5', 'MWF    1030-1120  DEN  112', 'PROF,KAPPA', 100, 100]]],
      ['210', 'GREEK AND ROMAN MYTHOLOGY', '(A&H)', [['A', '5', 'MWF    0130-0220  DEN  211', 'LECT,LAMBDA', 60, 60], ['B', '5', 'TTh    0130-0320  DEN  211', 'LECT,LAMBDA', 3, 40]]],
      ['320', 'GREEK PHILOSOPHY', '(A&H)', [['A', '5', 'MW     1130-1250  DEN  213', 'PROF,GAMMA', 12, 15]]],
    ],
  },
  WIN2026: {
    PHIL: [
      ['120', 'INTRODUCTION TO LOGIC', '(NSc)', [['A', '5', 'MWF    1230-0120  KNE  210', 'PROF,GAMMA', 140, 150, [...TA2('Elm', 'Fern'), ['Ginkgo', 25], ['STAFF', 22], ['', 0]]]]],
      ['241', 'TOPICS IN ETHICS', '(A&H/SSc)', [['A', '5', 'TTh    0230-0420  SAV  136', 'STAFF', 35, 40]]],
      ['345', 'MORAL PSYCHOLOGY', '(A&H)', [['A', '5', 'MW     1030-1220  SAV  155', 'PROF,BETA/PROF,GAMMA', 30, 30, null, '>']]],
      ['450', 'EPISTEMOLOGY', '(A&H)', [['A', '5', 'TTh    1330-1450  SAV  155', 'PROF,ALPHA', 16, 25]]],
      ['550', 'SEMINAR IN EPISTEMOLOGY', '', [['A', '5', 'TTh    1330-1450  SAV  155', 'PROF,ALPHA', 4, 10]]],
      ['590', 'SPECIAL TOPICS', '', [['A', 'VAR', 'to be arranged', 'PROF,DELTA', 2, 10]]],
    ],
    CLAS: [
      ['101', 'LATIN AND GREEK IN CURRENT USE', '(A&H)', [['A', '5', 'MWF    1030-1120  DEN  112', 'LECT,LAMBDA', 80, 100]]],
      ['205', 'BIOCULTURAL ROOTS OF SCIENCE', '(A&H)', [['A', '5', 'TTh    1030-1220  DEN  110', 'PROF,KAPPA', 61, 70]]],
      ['301', 'GREEK AND ROMAN DRAMA', '(A&H)', [['A', '3', 'TTh    0230-0350  DEN  209', 'LECT,LAMBDA', 62, 70]]],
    ],
  },
  SPR2026: {
    PHIL: [
      ['100', 'INTRODUCTION TO PHILOSOPHY', '(A&H/SSc)', [['A', '5', 'MWF    1030-1120  SAV  264', 'PROF,GAMMA', 100, 120, [['Hazel', 25], ['Hazel', 24], ['PROF', 19], ['', 20], ['TBA', 0]]]]],
      ['115', 'PRACTICAL REASONING', '(SSc)', [['A', '5', 'TTh    1030-1220  SAV  260', 'GRAD,MU', 40, 40], ['B', '5', 'MW     0330-0520  SAV  260', 'PROF,DELTA', 0, 25]]],
      ['243', 'ENVIRONMENTAL ETHICS', '(A&H/SSc)', [['A', '5', 'MWF    1130-1220  SMI  205', 'PROF,GAMMA', 100, 100, TA2('Iris', 'Juniper')]]],
      ['322', 'MODERN PHILOSOPHY', '(A&H)', [['A', '5', 'TTh    0930-1120  SAV  132', 'PROF,BETA', 40, 40]]],
      ['360', 'INTRODUCTION TO SYMBOLIC LOGIC', '(NSc)', [['A', '5', 'MWF    0830-0920  SAV  264', 'PROF,ALPHA', 80, 80]]],
      ['401', 'PHILOSOPHICAL WRITING', '', [['A', '5', 'W      0330-0520  SAV  155', 'PROF,BETA', 10, 15]]],
    ],
    CLAS: [
      ['102', 'GREEK AND LATIN ELEMENTS', '(A&H)', [['A', '5', 'MWF    1130-1220  DEN  112', 'LECT,LAMBDA', 90, 100]]],
      ['111', 'WORDS AND IDEAS', '(A&H)', [['A', '2-5', 'TTh    0830-0920  DEN  309', 'LECT,LAMBDA', 32, 40]]],
      ['430', 'TOPICS IN CLASSICS', '(A&H)', [['A', '5', 'TTh    1030-1220  DEN  309', 'PROF,KAPPA', 20, 20]]],
    ],
  },
  AUT2026: {
    PHIL: [
      ['100', 'INTRODUCTION TO PHILOSOPHY', '(A&H/SSc)', [['A', '5', 'MWF    1030-1120  SAV  264', 'PROF,ALPHA', 140, 150]]],
      ['240', 'INTRODUCTION TO ETHICS', '(A&H/SSc)', [['A', '5', 'MWF    0930-1020  SMI  120', 'PROF,BETA', 95, 100]]],
    ],
    CLAS: [
      ['101', 'LATIN AND GREEK IN CURRENT USE', '(A&H)', [['A', '5', 'MWF    1030-1120  DEN  112', 'PROF,KAPPA', 98, 100]]],
    ],
  },
};
const FILES = { 'phil.html': 'PHIL', 'clas.html': 'CLAS' };

/* The page for a quarter ("AUT2025") and file ("phil.html"), or null when there's none. */
function page(quarter, file) {
  const prefix = FILES[file], courses = pages[quarter] && pages[quarter][prefix];
  if (!courses) return null;
  let sln = 10000 + Object.keys(pages).indexOf(quarter) * 1000 + (prefix === 'CLAS' ? 500 : 0);
  let out = `<html><head><title>${prefix} ${quarter}</title></head><body><h1>${prefix}</h1>`
    + `<table><tr><td><pre>Restr  SLN   ID   Cred       Meeting Times      Bldg/Rm        Instructor           Status  Enrl/Lim</pre></td></tr></table>`;
  courses.forEach(([num, name, gened, secs]) => {
    out += `<br><table><tr><td><A NAME=${prefix.toLowerCase()}${num}>${prefix}&nbsp;&nbsp; ${num} </A>&nbsp;<A HREF=/course>${name}</A> ${gened}</td></tr></table>`;
    secs.forEach(([sec, cred, meets, who, enrl, lim, quizzes, flag]) => {
      out += `<table><tr><td><pre>${flag ? flag + (flag === '>' ? '' : '  ') : ''}<A HREF=/sln>${sln++}</A> ${sec}  ${cred.padEnd(8)}${meets.padEnd(31)}${who.padEnd(24)}Open     ${String(enrl).padStart(3)}/ ${lim}      ${gened.replace(/[()]/g, '')}</pre></td></tr></table>`;
      (quizzes || []).forEach(([leader, qe], q) => {
        const id = sec + String.fromCharCode(65 + q);
        const qmeets = leader === 'TBA' ? 'to be arranged' : 'TTh    0930-1020  SAV  132';
        const person = leader === 'PROF' ? who : leader === 'STAFF' ? 'STAFF' : leader && leader !== 'TBA' ? 'Assistant,' + leader : '';
        out += `<table><tr><td><pre><A HREF=/sln>${sln++}</A> ${id} QZ      ${qmeets.padEnd(31)}${person.padEnd(24)}Open      ${String(qe).padStart(2)}/ 25</pre></td></tr></table>`;
      });
    });
  });
  return out + '</body></html>';
}
page.pages = pages;
module.exports = page;
