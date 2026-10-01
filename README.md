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
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/ischnee/FTECalc@main/bookmarklet-ftecalc.js?t=' + Date.now();
  s.onload = function() { console.log('[Bookmarklet] Script loaded'); };
  s.onerror = function() { console.error('[Bookmarklet] Failed to load script'); };
  document.body.appendChild(s);
})();
```

This short script loads the latest FTECalc from this repository each time you click it, so you never need to reinstall it to get updates.

**Prefer a fixed copy that doesn't update itself?**
1. Download `FTECalc.html` from this repository.
2. Import it in Chrome: Bookmark Manager → **⋮** → **Import bookmarks**.
3. To update later, delete that bookmark and import a newer copy.

## How to use

1. Sign in and open the Time Schedule for any quarter, for example `…/students/timeschd/AUT2026/`.
2. Click **FTECalc**. It opens in a new tab on that quarter's academic year. From a Winter, Spring or Summer page, the year menu also offers the next academic year, since its Autumn may already be published.
   - Clicked anywhere else, FTECalc says it's installed and gives the steps, with a button to the Time Schedule. On the Time Schedule's front page, it asks you to pick a quarter. If Chrome blocks the new tab, it says to allow pop-ups.
3. Type one or more course prefixes, such as `PHIL, CLAS`, and press Enter. Each prefix is a program.
4. In **Faculty and instructor loads**, set each instructor's category once. FTECalc remembers it.
5. For a course release or an overload, change that person's **Load** for the year.
6. To keep the results, click **Save**.

## What it shows

It serves three purposes:
- **Fair faculty loads:** each instructor's courses against their load.
- **TA allocation:** students per TA, by course and quarter.
- **Comparing programs:** how each program uses its teaching resources, e.g. SCH per FTE, who teaches the SCH, and cost per SCH.

The page has:
- **A summary:** SCH (with each quarter), instructional FTE by category, SCH per FTE (with and without TAs), and cost per SCH.
- **Programs compared:** one row per prefix plus a total. Columns: SCH, instructor FTE, TA FTE, SCH per instructor FTE, a bar of who teaches the SCH, the share taught by the top quarter of instructors, students per TA, and cost per SCH.
- **Faculty and instructor loads:** for each person:
  - category and load
  - their courses in each quarter, as chips whose hover gives the section, credits and enrollment
  - courses against load (e.g. "3.5 of 4")
  - FTE, SCH and average class size
  - how evenly their SCH is spread across their courses
- **TA allocation:** each course with quiz sections, per quarter. It shows students, quiz sections, estimated TAs and students per TA. Values well above or below the median are highlighted.

The **Program** menu in the header narrows the whole page to one prefix. The **⚙** menu holds the loads, the co-teaching rule, the CAS minimums and the budgets. Click a panel's title to collapse or expand it; FTECalc remembers which are closed.

**Summer is separate.** Summer quarter is never part of an FTE figure.

## How FTE is counted

The unit is the academic year: Autumn, Winter and Spring.

| Who | Their FTE | Example |
|---|---|---|
| Tenure-track faculty | courses taught in the year ÷ 4 | teaching 1 + 2 + 1 → **1.0** |
| Teaching-track faculty and teaching professors | courses taught in the year ÷ 6 | teaching 2 + 2 + 1 → **0.83** |
| Graduate instructors of record | ¼ per course, like a tenure-track course | one course → **0.25** |
| Other | courses ÷ the default load (4) | 2 courses → **0.5** |
| Not set yet | courses ÷ the default load | 2 courses → **0.5** |
| Unassigned courses (STAFF, TBA) | courses ÷ the default load | 2 courses → **0.5** |
| TAs | ⅙ per TA per quarter (a 50% appointment for a third of the year) | 20 + 16 + 14 TAs → **8.3** |

Every course counts as 1, whatever its credits or size. All the loads can be changed in ⚙.

- **Categories.** The Time Schedule doesn't say who is faculty, a lecturer or a graduate student. You set each instructor's category in the Faculty table, and FTECalc keeps it in your browser. Until then they count at the default load, and the summary says how many still need one.
- **Course releases and overloads.** Each person's Load can be changed for one academic year: lower for a course release, higher for an overload. The changed number is highlighted, and its hover says what it was changed from. It's kept as a change from the category's load, so it follows if that load changes in ⚙, and it applies only to that year.
  - The change sets what the person's courses are measured against: a tenure-track member with a release who teaches 3 courses shows "3 of 3".
  - **FTE doesn't change.** FTE is teaching delivered, so it still divides by the category's load: those 3 courses are 0.75 FTE. A release therefore shows up as less teaching FTE, which is what program comparisons need.
- **Co-taught courses** (instructors listed as `A/B`) count ½ to each of two instructors, ⅓ to each of three, and so on. Their SCH is split the same way. ⚙ can count the course in full for each instructor instead; the SCH is still split.
- **The current year.** Until Winter and Spring are published, the year is partial and marked that way. The academic year menu goes back seven years.

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

## Privacy

- **No student data.** FTECalc reads only the Time Schedule's section listings, which UW shows after sign-in.
- **TA names are never stored or shown.** As each page loads, names are replaced with labels, and only counts appear.
- **Instructor loads are personnel information.** Instructors of record are listed on the Time Schedule. The categories, loads and budgets you enter are kept only in your browser.

## Compared with Ben Marwick's Instructor Workload Dashboard

Ben's [Time Schedule tools](https://github.com/benmarwick/uw-anthro-web-helpers) include an Instructor Workload Dashboard that totals SCH by instructor for an academic year. FTECalc is a separate app with its own code, but it borrows several of Ben's ideas:
- **His list of course prefixes** and their Time Schedule pages.
- **His way of reading section lines.**
- **Splitting co-taught sections** evenly among their instructors.
- **The CAS minimum-enrollment warning.**
- **How evenly an instructor's SCH is spread** across their courses ("% even"), and which course contributes most.
- **How concentrated SCH is** among instructors (here, the share taught by the top quarter).

Where FTECalc differs:
- **FTE, not just SCH:** categories and annual loads turn courses into FTE.
- **TAs:** estimated from quiz sections and counted in FTE. Ben's dashboard skips quiz sections.
- **Programs side by side,** with cost per SCH from the instructional budget.
- **Combined and joint-listed sections count once** for load. Ben's dashboard counts each listing.
- **Honors sections count;** Ben's dashboard leaves them out.
- **Sections with no one enrolled** count as a course taught; Ben's dashboard skips them.
- **STAFF and TBA** form one "Unassigned" row instead of appearing as instructors.
- **No SCH target slider or histogram:** each person is measured against their own load instead.

## Saving results

**Save** in the header writes the year's results to one HTML file. It opens in any browser without the Time Schedule or a sign-in.
- **The dialog:**
  - **A note**, with quick picks: 10th day, End of quarter, End of year, Budget request. Tab in an empty note takes the suggestion shown.
  - **Reload first** (on by default), so the "data as of" time is exact.
  - **The file name**, made from the year, the prefixes, the time and the note.
- **Where it goes:** Chrome's Save As dialog remembers the folder used last time. Other browsers save to Downloads.
- **What's in it:** each instructor's courses, category and load, plus the settings and budgets for those programs. TAs appear only as counts.
  - Share the file only with people who should see instructors' loads.
- **Opening the file:**
  - A **SAVED** banner shows the note, the year, the prefixes and when the data was read.
  - The numbers don't update. Categories and loads can still be changed there to try things out, but those changes aren't kept.

## Decisions

All settled (Sept 29, 2026):
- **Purposes:** the three above.
- **Loads:** 4 courses a year for tenure track and 6 for teaching track. A graduate instructor counts ¼ per course. A TA counts ⅙ per quarter.
- **Courses:** every course counts as 1.
- **Summer:** never part of FTE.
- **Enrollment:** live.
- **Budget:** the instructional budget (GOF).
- **Saved results:** include both the totals and the instructor loads.
- **Course releases** (Oct 1, 2026): a person's load can be changed for a year. FTE stays courses ÷ the category's load.

## For maintainers

- `bookmarklet-ftecalc.js` is the whole app. On a Time Schedule page it opens a new tab and writes the dashboard into it. The dashboard fetches each prefix's Autumn, Winter and Spring pages from the Time Schedule.
- `node make-import.js` rebuilds `FTECalc.html` after a change.
- `node --experimental-websocket test/run.js` runs the tests in headless Chrome. They use made-up PHIL and CLAS pages in the Time Schedule's format (`test/fake-time-schedule.js`), whose numbers were worked out by hand. They also run the file through a loader like the one above. Needs Node 20+ and Google Chrome.
- **Every push reaches every user.** Everyone using the loader runs whatever is on `main` the next time they click. Keep write access to people who need it, and protect those GitHub accounts with two-factor authentication.
- **Send updates out right away.** jsDelivr keeps a copy of the file on its servers for up to 12 hours. About a minute after pushing, open `https://purge.jsdelivr.net/gh/ischnee/FTECalc@main/bookmarklet-ftecalc.js` once, and everyone gets the new version on their next click.
  - Wait the minute: purging in the first seconds after a push can put the old version straight back, before GitHub reports the new one.
  - The loader's timestamp (`?t=…`) stops browsers from reusing an old copy.

## Credit

FTECalc grew out of the snapshot and TA-estimate work in TimeScheduleMod, which builds on Ben Marwick's Time Schedule Viz. The course-prefix list and the way section lines are read come from Ben's tools, under the MIT license (see [LICENSE](LICENSE)).
