# Browser review

Frozen revision: 8679ae1. Installed versions: Google Chrome 141.0.7390.107 and Firefox 151.0.4 on Ubuntu. These are the actual tested binaries; this report does not claim the latest Chrome stable was tested.

| Check | Chrome | Firefox | Evidence |
|---|---|---|---|
| Full built-site Python course / shared UI | PASS | PASS | baseline logs |
| Real C++ probe, runtime, errors, infinite-loop Stop/Reset | PASS | PASS | baseline logs |
| Public C++ 2.1 and 2.4, Compare/drafts | PASS | PASS | baseline logs |
| Actual Pages commit 8679ae1, C++2.1/2.4 and Python | PASS | PASS | production logs |
| 390×844 C++ run/check/Stop/Reset, Python recovery | PASS | PASS | mobile-actions JSON |
| 13 widths + landscape + seven-language geometry sweep | 200 cases | not full sweep | responsive-baseline.json |
| Real Safari / iPhone / Android touch keyboard | UNVERIFIED | UNVERIFIED | no physical-device claim |
| Edge | UNVERIFIED | — | no separate binary tested |

Narrow-width automation uses desktop rendering at CSS viewport sizes, not a real mobile browser. It does not simulate virtual keyboards, thermal throttling, storage eviction or OS process termination.

## Production

Both browsers tested https://mariomlz99.github.io/ros2learn/ against build-info commit 8679ae1008806352ce89efeb2d9cc651de557261. Normal URLs exposed both supported C++ exercises. Tests compiled and ran C++, then real Python, checked footer links on nine public pages, active-theme About logos and one-second navigation. No deployment was performed during this review.

## CI finding BR-01

- Area: release gating; Session: all; Exercise: all; Language: Python/C++.
- Severity: medium; Category: browser.
- Observation: Pages gates Chrome only despite documented Firefox support.
- Evidence: .github/workflows/pages.yml runs test:chrome and test:cpp -- chrome; no Firefox job.
- Reproduction: inspect the successful workflow 37144563700 and its test-build steps.
- Why it matters: local Firefox success can drift between releases.
- Suggested change: add a Firefox release/PR job using a pinned runner/browser setup, then consider every push after measuring duration. A scheduled-only job would detect regressions after publication.
- Risk of change: medium; browser installation/profile support on CI must be proven before making it a release gate.
- Confidence: high. Requires implementation: yes, as a separately validated CI change; no unsupported workflow edit during this audit.

## Evidence limits

Baseline exercises each have reference execution coverage; that is not exhaustive student-program coverage. Additional negative/alternate testing and reviewer-specific stress cases are listed in their reports. Back/Forward, reduced-motion and transition cleanup have existing browser harness coverage. Actual tab suspension and physical-device input remain unverified.
