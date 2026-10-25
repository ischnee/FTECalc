# FTECalc

A browser bookmarklet, built for the UW Philosophy department, that estimates **teaching FTE** and **student credit hours (SCH)** from the [UW Time Schedule](https://www.washington.edu/students/timeschd/). It covers everyone teaching: faculty, lecturers, graduate instructors and TAs.

**Status: built, and tested against made-up Time Schedule pages. Not yet tried on the real Time Schedule.**

## Install

A [bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet) is a bookmark stored in your web browser that contains JavaScript commands that make the browser do useful work. This one only works on the UW Time Schedule, which requires UW credentials.

1. In Chrome, open **Bookmarks → Bookmark Manager**.
2. Click the **⋮** menu at the very top right of that page (not the one beside your profile icon), then **Add new bookmark**.
3. For the name, use `FTECalc`.
4. Paste the script below into the URL field, then click **Save**.

#### Script for the bookmarklet:

```
javascript:(function(){
  function load(v) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/ischnee/FTECalc@' + v + '/bookmarklet-ftecalc.js' + (v === 'main' ? '?t=' + Date.now() : '');
    s.onerror = function() { alert("FTECalc couldn't load on this page. Open the UW Time Schedule, pick a quarter, then click it again."); };
    document.body.appendChild(s);
  }
  fetch('https://api.github.com/repos/ischnee/FTECalc/commits/main', { headers: { Accept: 'application/vnd.github.sha' } })
    .then(function(r) { return r.ok ? r.text() : ''; })
    .then(function(sha) { load(/^[0-9a-f]{40}$/.test(sha) ? sha : 'main'); }, function() { load('main'); });
})();
```

This short script loads the latest FTECalc from this repository each time you click it, so you never need to reinstall it to get updates. It asks GitHub which version is latest, so an update reaches you as soon as it's published. If GitHub doesn't answer, it falls back to jsDelivr's copy, which can lag behind by up to a day.

**Installed the loader before October 8, 2026?** Replace its address with the script above. The older loader relies on jsDelivr's copy alone, which can be hours behind.

**Prefer a fixed copy that doesn't update itself?**
1. Download `FTECalc.html` from this repository.
2. Import it in Chrome: Bookmark Manager → **⋮** → **Import bookmarks**.
3. To update later, delete that bookmark and import a newer copy.

## How to use

1. Sign in and open the Time Schedule for any quarter, for example `…/students/timeschd/AUT2026/`.
2. Click **FTECalc**. It opens in a new tab on that quarter's academic year. From a Winter, Spring or Summer page, the year menu also offers the next academic year, since its Autumn may already be published.
   - Clicked anywhere else, FTECalc says it's installed and gives the steps, with a button to the Time Schedule. On the Time Schedule's front page, it asks you to pick a quarter. If Chrome blocks the new tab, it says to allow pop-ups.
3. Type one or more course prefixes, such as `PHIL, CLAS`, and press Enter. Each prefix is a program.
4. In **Faculty and instructors**, set each instructor's category once. FTECalc remembers it.
5. Everyone counts 1 FTE. For someone part time, change their **FTE**, e.g. to `0.5` or `1/3`.
6. To keep the results, click **Save**.
7. For one person's teaching over the years, click their name.

## What it shows

It serves three purposes:
- **Faculty teaching:** each instructor's FTE, courses and SCH.
- **TA allocation:** students per TA, by course and quarter.
- **Comparing programs:** how each program uses its teaching resources, e.g. SCH per FTE, who teaches the SCH, and cost per SCH.

It can also show **one person's teaching history** across every year the Time Schedule has (see below).

The page has:
- **A summary:** SCH (with each quarter), instructional FTE by category, SCH per FTE (with and without TAs), and cost per SCH.
- **Programs compared:** one row per prefix plus a total. Columns: SCH, instructor FTE, TA FTE, SCH per instructor FTE, a bar of who teaches the SCH, the share taught by the top quarter of instructors, students per TA, and cost per SCH.
- **Faculty and instructors:** for each person:
  - category and FTE
  - their courses in each quarter, as chips whose hover gives the section, credits and enrollment
  - how many courses that makes
  - SCH and average class size
  - how evenly their SCH is spread across their courses
- **TA allocation:** each course with quiz sections, per quarter. It shows students, quiz sections, estimated TAs and students per TA. Values well above or below the median are highlighted.

The **Program** menu in the header narrows the whole page to one prefix. The **⚙** menu holds the TA divisor, the co-teaching rule, the CAS minimums and the budgets. Click a panel's title to collapse or expand it; FTECalc remembers which are closed.

**Summer is separate.** Summer quarter is never part of an FTE figure.

## How FTE is counted

The unit is the academic year: Autumn, Winter and Spring.

| Who | Their FTE |
|---|---|
| Everyone teaching that year: faculty, lecturers, graduate instructors | **1**, unless you change it |
| Unassigned courses (STAFF, TBA) | **0**, unless you change it |
| TAs | ⅙ per TA per quarter (a 50% appointment for a third of the year): 20 + 16 + 14 TAs → **8.3** |

- **Courses are noted, not counted.** The Faculty table shows how many courses each person teaches, but a person is 1 FTE whether they teach 3 courses or 6. Someone who teaches nothing in the year (on leave, say) isn't listed and counts nothing.
- **Changing a person's FTE.** Type a decimal or a fraction in their **FTE** box: `0.5`, `.75`, `1/3`, `¾`, `50%`. It's kept to two decimals, so ⅓ is 0.33. A changed FTE is highlighted.
  - **A change applies from that year on**, until a later change. Lowering someone to 0.5 in 2025–26 keeps them at 0.5 in 2026–27; earlier years stay at 1. The box's hover says since when.
  - A grad instructor counts 1 like everyone else. Give them less if their appointment is part of a year.
  - The Unassigned row can be given FTE too, e.g. for a lecturer still to be hired.
- **People in more than one program.** With several prefixes loaded, a person's FTE is shared by their courses. Someone with 1 of their 5.5 courses in CLAS counts 1 ÷ 5.5 of their FTE in CLAS's row; the Faculty table shows "0.18 here" when you pick CLAS in the Program menu. A joint course counts in each of its programs, as its SCH does. Courses in prefixes you haven't loaded aren't seen, so load all the prefixes a person teaches in.
- **Categories.** The Time Schedule doesn't say who is faculty, a lecturer or a graduate student. You set each instructor's category in the Faculty table, and FTECalc keeps it in your browser. Categories split the FTE and SCH by kind of instructor; until they're set, people count under "Not set", and the summary says how many still need one.
- **Name spellings.** Categories and FTEs are kept under the name as the Time Schedule spells it. When a middle initial comes or goes, the new spelling uses the old one's category and FTE until you change them.
- **Co-taught courses** (instructors listed as `A/B`) count ½ to each of two instructors, ⅓ to each of three, and so on. Their SCH is split the same way. ⚙ can count the course in full for each instructor instead; the SCH is still split.
- **The current year.** Until Winter and Spring are published, the year is partial and marked that way. The academic year menu goes back seven years; a person's history goes back as far as the Time Schedule does.

## Student credit hours

- **SCH** = credits × students enrolled, summed over lecture sections. Quiz sections carry no credits.
- **Enrollment is live:** whatever the Time Schedule shows when FTECalc runs. Past quarters show their final enrollment. UW's official SCH uses 10th-day counts, so FTECalc's figures are close but not identical.
- **Cost per SCH:** enter each program's instructional budget (GOF) in ⚙, and FTECalc divides it by that program's SCH. This is the "instructional cost per SCH" measure used in national comparisons, such as the Delaware Cost Study. Budgets stay in your browser.

## Which courses count

- **Counted:** lecture sections (one-letter section IDs) from 100 to 599, including Honors sections and graduate seminars.
- **Read for the TA estimate:** quiz sections.
- **Left out:**
  - independent study (course numbers ending in 99)
  - 600, 700 and 800 level (independent study, thesis, dissertation)
  - sections with a limit of 0 (placeholders)
  - sections with variable credits ("VAR"), which have no fixed credits for SCH. The summary says how many were left out.
- **Credit ranges** such as "2-5" count the lower number.
- **Sections with no one enrolled** still count as a course taught but add no SCH.
- **Counted once:** combined and joint-listed sections, such as a 4xx/5xx pair or two prefixes meeting together. Sections in the same quarter with the same instructors, days, time and room merge. A joint course counts in each of its programs' rows, and once in the total.
- **CAS minimum enrollment:** a course below the College's minimum is marked ⚠: fewer than 10 students at the 100–300 level, or fewer than 5 at the 400–500 level. Both numbers can be changed in ⚙.

## How TAs are estimated

This is the same estimate as in [TimeScheduleMod](https://github.com/ischnee/TimeScheduleMod):
- A TA is a name on a quiz section other than its own lecture's instructor.
- A TA's load is the number of quiz sections they lead that quarter, across the prefixes loaded. Each course uses its TAs' usual load.
- Sections with students but no TA go first to TAs below that load. The rest need one more TA per usual load.
- Empty sections with no TA aren't counted.

Hover over a course's TA count to see the arithmetic.

## A person's history

Click an instructor's name in the Faculty table. FTECalc reads every academic year the Time Schedule has for the prefixes loaded, newest first, and stops after two years in a row with no pages. Pages already read aren't read again. It follows a colleague's one-page teaching history, without its salary half: salary isn't on the Time Schedule and stays out.

- **The name.** The Time Schedule's spelling changes over the years, usually a middle initial. "Found as" lists every spelling with the same last and first name, e.g. "Smith, John" and "Smith, John A".
  - **×** leaves out a spelling that's someone else.
  - **Add another name** counts courses under a different name too, e.g. from before a name change. It suggests the names in the years read.
  - These choices are remembered in your browser.
- **Years.** Only whole academic years count: Autumn, Winter and Spring. Summer never counts, and the current year is left out until its Winter and Spring are published. The history runs from the first year the person taught to the last.
- **Periods** of 1, 2 or 3 years, ending with the latest. FTECalc remembers the choice.
- **The comparison:** the first period against the last, per year taught: courses, students, average class, SCH, and SCH per FTE, each with its % change. A year with no courses (a leave, say) doesn't pull the averages down.
- **The chart:** SCH each year, on the periods' bands. Hover over a year for its courses and students.
- **The table:** for each period:
  - years taught (hover to see which years had no courses)
  - courses, students, average class and SCH
  - the person's FTE, averaged over the years taught, and SCH per FTE
  - everyone's SCH per instructor FTE in the same years, for comparison
  - the courses taught, e.g. "100 ×3 · 450/550"
- **FTE by year.** The FTE is what the year view has for that person and year, so a change to 0.5 shows in every year it applies to. Change it in the year view.
- **Print** gives a one-page report without the controls; choose "Save as PDF" in the print dialog to keep it.
- A saved file has no histories: they need the Time Schedule.

## Privacy

- **No student data.** FTECalc reads only the Time Schedule's section listings, which UW shows after sign-in.
- **TA names are never stored or shown.** As each page loads, names are replaced with labels, and only counts appear.
- **Instructors' FTEs are personnel information.** Instructors of record are listed on the Time Schedule. The categories, FTEs and budgets you enter are kept only in your browser.
- **A person's history is about one colleague.** It uses only public teaching records, but share a printed history with care.

## Compared with Ben Marwick's Instructor Workload Dashboard

Ben's [Time Schedule tools](https://github.com/benmarwick/uw-anthro-web-helpers) include an Instructor Workload Dashboard that totals SCH by instructor for an academic year. FTECalc is a separate app with its own code, but it borrows several of Ben's ideas:
- **His list of course prefixes** and their Time Schedule pages.
- **His way of reading section lines.**
- **Splitting co-taught sections** evenly among their instructors.
- **The CAS minimum-enrollment warning.**
- **How evenly an instructor's SCH is spread** across their courses ("% even"), and which course contributes most.
- **How concentrated SCH is** among instructors (here, the share taught by the top quarter).

Where FTECalc differs:
- **FTE, not just SCH:** each person's FTE, so programs can compare SCH per FTE.
- **TAs:** estimated from quiz sections and counted in FTE. Ben's dashboard skips quiz sections.
- **Programs side by side,** with cost per SCH from the instructional budget.
- **Combined and joint-listed sections count once** as a course. Ben's dashboard counts each listing.
- **Honors sections count;** Ben's dashboard leaves them out.
- **Sections with no one enrolled** count as a course taught; Ben's dashboard skips them.
- **STAFF and TBA** form one "Unassigned" row instead of appearing as instructors.
- **No SCH target slider or histogram.**

## Saving results

**Save** in the header writes the year's results to one HTML file. It opens in any browser without the Time Schedule or a sign-in.
- **The dialog:**
  - **A note**, with quick picks: 10th day, End of quarter, End of year, Budget request. Tab in an empty note takes the suggestion shown.
  - **Reload first** (on by default), so the "data as of" time is exact.
  - **The file name**, made from the year, the prefixes, the time and the note.
- **Where it goes:** Chrome's Save As dialog remembers the folder used last time. Other browsers save to Downloads.
- **What's in it:** each instructor's courses, category and FTE, plus the settings and budgets for those programs. TAs appear only as counts.
  - Share the file only with people who should see instructors' teaching.
- **Opening the file:**
  - A **SAVED** banner shows the note, the year, the prefixes and when the data was read.
  - The numbers don't update. Categories and FTEs can still be changed there to try things out, but those changes aren't kept.

## Decisions

All settled (Sept 29, 2026):
- **Purposes:** the three above.
- **Loads:** 4 courses a year for tenure track and 6 for teaching track. A graduate instructor counts ¼ per course. A TA counts ⅙ per quarter. (Replaced Oct 25, 2026; see below.)
- **Courses:** every course counts as 1.
- **Summer:** never part of FTE.
- **Enrollment:** live.
- **Budget:** the instructional budget (GOF).
- **Saved results:** include both the totals and each instructor's teaching.
- **Course releases** (Oct 1, 2026): a person's load could be changed for a year.
- **One person, one FTE** (Oct 25, 2026): replaces the loads and course releases. Everyone counts 1 FTE unless changed; courses are noted but don't change FTE.
- **A person's history** (Oct 25, 2026): every year the Time Schedule has, in periods of 1 to 3 years, with no salary.

## For maintainers

- `bookmarklet-ftecalc.js` is the whole app. On a Time Schedule page it opens a new tab and writes the dashboard into it. The dashboard fetches each prefix's Autumn, Winter and Spring pages from the Time Schedule.
- `node make-import.js` rebuilds `FTECalc.html` after a change.
- `node --experimental-websocket test/run.js` runs the tests in headless Chrome. They use made-up PHIL and CLAS pages in the Time Schedule's format (`test/fake-time-schedule.js`), whose numbers were worked out by hand; PHIL goes back to 2019–20 for the history test. They also run the file through a loader like the one above. Needs Node 20+ and Google Chrome.
- **Every push reaches every user.** Everyone using the loader runs whatever is on `main` the next time they click. Keep write access to people who need it, and protect those GitHub accounts with two-factor authentication.
- **Send updates out right away.** jsDelivr keeps a copy of the file on its servers for up to 12 hours. About a minute after pushing, open `https://purge.jsdelivr.net/gh/ischnee/FTECalc@main/bookmarklet-ftecalc.js` once, and everyone gets the new version on their next click.
  - Wait the minute: purging in the first seconds after a push can put the old version straight back, before GitHub reports the new one.
  - The loader's timestamp (`?t=…`) stops browsers from reusing an old copy.

## Credit

FTECalc grew out of the snapshot and TA-estimate work in TimeScheduleMod, which builds on Ben Marwick's Time Schedule Viz. The course-prefix list and the way section lines are read come from Ben's tools, under the MIT license (see [LICENSE](LICENSE)).
