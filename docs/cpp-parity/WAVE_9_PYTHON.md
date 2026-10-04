# Wave 9: full Python acceptance

Frozen asset: 6ad7e489683f. Build source: HEAD e282d52 plus final Wave 9 changes. The shared adapter now requires actual ranges access before accepting range/sector reports. No application edits or rebuilds are made during this run.

## Command and execution

Chrome, then Firefox, each through:

```bash
node scripts/check-course.mjs <browser> --built
```

The runner executes 18 suites per browser: checker-hardening, diagnostics, responsive, footer, brand-theme, theme-browser, transitions, compare, tf-browser, localization, lesson-loading, browser (Session 1/CLI), session2, session3, session4, session5, session6 and string-type.

## Results

Chrome and Firefox each exit 0: **18/18 suites PASS per browser**, with no observed failure or corrective rerun.

| Coverage | Chrome | Firefox |
|---|---|---|
| Session 1 CLI, multiple terminals, odometry/Twist and cleanup | PASS | PASS |
| All 25 Python references in Sessions 2–6 | PASS | PASS |
| NumPy sector alternate and cv2 perception alternate | PASS | PASS |
| Empty-program and hard-coded perception negative controls | PASS | PASS |
| Checker hardening: 15 reference/alternate/bypass/print-only/empty cases, Stop/Reset | PASS | PASS |
| Seven Python fault/recovery scenarios, including NaN/infinity | PASS | PASS |
| 361 responsive cases across ten pages and seven-language headers | PASS | PASS |
| Footer, light/dark branding and grid themes | PASS | PASS |
| One-second transitions, reduced motion, Back/Forward recovery | PASS | PASS |
| Compare drafts, language preferences and mobile layout | PASS | PASS |
| Moving TF frames, inspector agreement with real Python | PASS | PASS |
| Seven UI languages preserve running Python, world and code | PASS | PASS |
| Delayed lesson loading, latest-selection and draft preservation | PASS | PASS |
| String payload `Infinity` remains a string | PASS | PASS |

The newly required LaserScan ranges-access evidence accepts existing Python sector and obstacle-control references, including the NumPy sector alternate. Goal control, LiDAR safety, action cancellation, frame debugging and beacon integration all pass on this final shared-adapter build.

No source edits, rebuilds, unit runs or changes to the frozen production assets occurred during these browser suites.

## Coverage boundaries

The course runner includes real Pyodide reference programs, empty-program negatives, selected alternate implementations, hardened checker bypasses, diagnostics/recovery, seven-language preservation, responsive geometry, themes and shared UI. It does not enumerate every possible valid student implementation. Chrome/Firefox automated results are not Safari/iOS validation. C++ acceptance is coordinated independently and is not implied by these Python results.

Logs: /tmp/kn-wave9-python-chrome.log, /tmp/kn-wave9-python-firefox.log and /tmp/kn-wave9-python-runner.log.
