# FTECalc

A browser bookmarklet, planned for the UW Philosophy department, that estimates **teaching FTE** from the [UW Time Schedule](https://www.washington.edu/students/timeschd/). It covers everyone teaching: faculty, lecturers, graduate instructors and TAs.

**Status: in design.** Nothing here is usable yet.

## What it will do

Run it on the Time Schedule, pick one or more course prefixes and an academic year, and it adds up each person's teaching over **Autumn, Winter and Spring**. It divides by that person's annual load to give a figure where 1.0 is one person's full teaching year.

**Summer is separate.** Summer quarter is never part of an FTE figure.

## How FTE is counted

The unit is the academic year.

| Who | Their FTE | Example |
|---|---|---|
| Faculty and lecturers | courses taught in the year ÷ their annual course load | load 4, teaching 1 + 2 + 1 → **1.0**; load 6, teaching 2 + 2 + 1 → **0.83** |
| Graduate instructors of record | appointment % × quarters taught ÷ 3 | one Winter course at 50% → **0.17** |
| TAs | TA positions each quarter × appointment % ÷ 3 | 20 + 16 + 14 TAs at 50% → **8.3** |
| Unassigned courses (STAFF, TBA) | courses ÷ the default load | 2 courses at load 4 → **0.5** |

- **Loads and categories.** The Time Schedule doesn't say who is faculty, a lecturer or a graduate student, or what anyone's load is. So FTECalc will have a default annual load, plus a load and category for each instructor that you can change. These settings stay in your browser.
- **The current year.** Until Winter and Spring are published, the current year is partial and marked that way. The most recent complete year is one click away.

## Which courses count

- **Counted:**
  - lecture sections from 100 to 500 level, including Honors sections and graduate seminars
  - quiz sections, for estimating TAs
- **Left out:**
  - independent study (course numbers ending in 99)
  - 600, 700 and 800 level (independent study, thesis, dissertation)
- **Counted once:** combined and joint-listed sections, such as a 4xx/5xx pair or two prefixes meeting together. Sections with the same instructor, time and room merge.
- **Known limit:** the Time Schedule lists one instructor per section, so co-teachers are missed.

## Privacy

- **No student data.** FTECalc reads only the Time Schedule's public section listings, which UW shows after sign-in.
- **TA names are never stored or shown.** TAs are counted from the quiz sections they lead and appear only as TA1, TA2 and so on.
- **Instructor loads are personnel information.** Instructors of record are listed on the Time Schedule, but loads you enter stay in your browser.

## Open questions

1. What is the number for: hiring and budget cases, TA allocation, or workload balance? This decides whether TAs are part of the same total.
2. What are Philosophy's standard annual loads for research faculty and teaching faculty? What appointment % do graduate instructors and TAs have (50%?)
3. Does every course count as 1, or are they weighted by credits or enrollment?
4. Should saved results include instructor loads, or only the totals?

## Background

FTECalc grew out of the snapshot and TA-estimate work on Ben Marwick's Time Schedule Viz ([uw-anthro-web-helpers](https://github.com/benmarwick/uw-anthro-web-helpers)). It is a separate tool.
