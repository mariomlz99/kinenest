# Verified branch preview

Verified URL: https://cpp-parity-kinenest.malizia-mario99.workers.dev/

Deployed source commit: `5c7d93254d18182f9ee9f095ae895f27c1773962`. `build-info.json` returned HTTP 200, `dirty: false`, asset `71f28e8ff533`, built `2026-10-04T12:06:12.097Z`. This matches the clean local candidate asset.

## Actual remote browser results

| Test | Chrome | Firefox |
| --- | --- | --- |
| Session 1 CLI, motion, reset | PASS | PASS |
| All 25 C++ references, empty checks, Stop/Reset | PASS | PASS |
| All 25 Python references, empty checks, Stop/Reset | PASS | PASS |
| Visible outgoing transitions, variants and history | PASS | PASS |
| Destination first paint, saved preferences, ready reveal and reduced motion | PASS | PASS |

The live course runner reads local reference source and enters it into the real deployed UI. Compilation, Pyodide execution, sensors, robot and checking all run on the remote application in the browser; no test harness or reference answer is shipped in production.

Reproduce:
```sh
node scripts/check-live-course.mjs chrome --language=cpp --url=https://cpp-parity-kinenest.malizia-mario99.workers.dev/ --commit=5c7d93254d18182f9ee9f095ae895f27c1773962
node scripts/check-live-course.mjs firefox --language=cpp --url=https://cpp-parity-kinenest.malizia-mario99.workers.dev/ --commit=5c7d93254d18182f9ee9f095ae895f27c1773962
```

Use `--language=python` for the corresponding Python run. The runner rejects an unexpected deployed SHA or dirty build.

The first Firefox live attempt did not start its protocol endpoint because its temporary profile was under `/tmp`, unlike the existing working browser runners. No application test ran in that attempt. The live runner now uses the same workspace profile root as the boot/deployed runners; both subsequent Firefox language runs exited 0. Logs preserve both attempts.

## Routes and deployment isolation

HTTP 200: `/`, `/index.html`, `/session-01.html` through `/session-06.html`, `/about.html`, `/licences.html`, `/real-ros.html` and `/session-02.html?experimentalCpp=1`. Both root forms contain the welcome page and Start Session 1. `/not-real.html` returns a real 404.

The root-domain production and main workers.dev build-info still identify `63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff`, asset `784328576e05`; only the branch preview was published. No Worker settings, DNS, repository rename or production deployment was performed. PR #3 remains open.

## Logs and remaining gate

- `/tmp/kn-parity-live-chrome-{cpp,python}.log`
- `/tmp/kn-parity-live-firefox-{cpp,python}-profile.log`
- `/tmp/kn-parity-live-{transitions,boot}-{chrome,firefox}.log`
- `/tmp/kn-parity-live-routes.json`
- [CI run for the exact candidate](https://github.com/mariomlz99/ros2learn/actions/runs/37200950076) is tracked separately; this report does not predeclare its result.

Maintainer teaching/visual approval is still required before merge. Safari/iOS and physical-device behavior remain unverified.
