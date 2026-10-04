# Candidate visual evidence

Captured from clean local production build `5c7d93254d18182f9ee9f095ae895f27c1773962`, asset `71f28e8ff533`, on 4 October 2026. These files are excluded from production dist. Browser viewport emulation is not physical-device/Safari validation.

- [Welcome, dark](index-en-dark-1440.png) / [light](index-en-light-1440.png) / [Italian, 390px](index-it-light-390.png).
- [Session 1](session-01-en-dark-1440.png).
- Session 2: [Python](session-02-dark-1440-python.png), [C++](session-02-dark-1440-cpp.png), [Compare](session-02-dark-1440-compare.png).
- [Camera](session-03-en-dark-1440.png), [TF detail](session-05-tf-details.png), [debugging](session-06-en-dark-1440.png).
- About logo: [dark](about-dark-1440-logo.png) / [light](about-light-1440-logo.png); [footer/contact](footer.png).

## Cross-page handoff

| Navigation | Outgoing at ~350 ms | Covered destination | Ready destination |
| --- | --- | --- |
| Session 1 → 2 | [frame](chrome-session-01.html-outgoing.png) | [frame](chrome-session-01.html-incoming.png) | [frame](chrome-session-01.html-complete.png) |
| Session 2 → 3 | [frame](chrome-session-02.html-outgoing.png) | [frame](chrome-session-02.html-incoming.png) | [frame](chrome-session-02.html-complete.png) |
| Session 5 → 6 | [frame](chrome-session-05.html-outgoing.png) | [frame](chrome-session-05.html-incoming.png) | [frame](chrome-session-05.html-complete.png) |

The local boot harness deliberately delays initialization to make the protected destination observable. That test delay is not an application delay. Both Chrome and Firefox passed first-paint theme/language/layout coverage, real readiness, short reveal, direct entry/reload, Back/Forward, reduced motion and failure recovery. Full raw frames/measurements remain under `/tmp/kn-parity-final-boot` and `/tmp/kn-parity-final-transitions`.

Recognizable animation variants: [LiDAR](chrome-lidar-sweep-dark.png), [TF](chrome-tf-rotate-light.png), [robot yaw](chrome-robot-yaw-dark.png). Outgoing dwell remains approximately 1,000 ms with 850 ms animation; incoming reveal is 160 ms and adds no artificial loading dwell.

Reproduce: `node scripts/capture-workstation.mjs /tmp/kinenest-captures`; `node scripts/check-boot.mjs chrome --output=/tmp/boot`; `node scripts/check-transitions.mjs chrome --output=/tmp/transitions` (repeat browser tests with Firefox).
