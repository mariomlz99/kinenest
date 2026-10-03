# Initial validation

Validated on 2026-10-02 with bundled Node v24.21.0 and installed Google Chrome in headless mode.

- Seven Node unit tests passed: lesson loading/validation, graph introspection, message parsing, publication and motion, deterministic arcs, rejection without state mutation, and reset/replay.
- Static build passed. Assets loaded under /ros2learn/.
- Chrome browser smoke test passed: loading, CLI, motion, three passing checks, progressive hint, full reset and invalid-command feedback.
- Repeated the browser flow with real requestAnimationFrame timing (no animation-clock override); it passed.
- Inspected a 1440 px Chrome screenshot of the interface.

The interactive Chrome connector was unavailable. Firefox/Edge/Safari have not been tested. GitHub Pages deployment must still be verified after push and enabling GitHub Actions as the repository's Pages source. No Python execution is included in this milestone.

## Multiple terminals — 2026-10-03

Eleven Node tests pass, including fan-out, no replay, odometry timing/pose, echo once, invalid fields, subscriber lifecycle and reset. Extended headless Chrome test passes the original lab plus adding a third terminal, simultaneous odometry and Twist echoes, Ctrl+C, Stop, Close and active-session reset. Static build and project-subpath loading pass.

## Session 3 and CLI revision — 2026-10-03

- 22 Node tests pass: original runtime, lessons, terminal lifecycle; camera projection and movement; services; camera rate/summary; varied-scene checking; production asset allowlist; discovery; repeated publication; String pub/sub and metrics.
- Chrome and Firefox passed all six exercises using actual Pyodide/NumPy against the content-versioned static build under /ros2learn/. A second functional cv2-style centroid solution also passed; direct NumPy buffer conversion is accepted without requiring CvBridge. A constant-positive detector failed; Stop recovered from an executing infinite loop.
- Firefox is Snap-installed on this Ubuntu machine; the automated test profile must be in the workspace rather than the host /tmp namespace. The test runner handles that location and deletes its temporary profile.
- Lab 01 Chrome regression passed after the shared CLI changes. A clean Chrome also loaded the currently deployed Lab 01 successfully when the lecturer reported Loading lesson. The exact original failure was not reproduced; startup diagnostics and versioned asset paths address silent module failures and stale mixed deployments.
- Chrome screenshot inspected for the new Session 3 layout. Edge and Safari are not independently verified.
- Pages CI now tests real Python in Chrome before deployment. The test and initial student Python load need access to the pinned Pyodide CDN.

No RViz/Gazebo, native OpenCV, backend, accounts, Session 2, Python service servers or ROS action protocol are included. Production does not contain reference-solution files; the public source repository does contain acceptance-test programs. The checker is formative, not tamper-proof.

## Full course workstation — 2026-10-03

32 Node tests pass. Added deterministic 120-ray rectangular LiDAR and collision tests, parameter mutations/types, custom message validation, physical action feedback/completion/cancellation, CLI ownership cleanup, TF composition/inversion, reset cancellation, translated catalog/reference-program coverage and production allowlist checks.

All 25 Python reference exercises have passed in Chrome and Firefox with real Pyodide/NumPy. Session 3 retains its alternate cv2/direct-buffer solution, constant-detector negative test and running-infinite-loop Stop test. New course suites reject empty programs; Session 2 additionally accepts a NumPy-vectorized sector implementation. Language and theme/layout tests preserve student code. The original Lab 01 multi-terminal regression passes in both browsers.

Testing exposed and corrected a missing report-helper call in one reference program and a goal/obstacle oscillation in the initial safety controller. The final safety example uses short-lived avoidance state before resuming target steering. A transient NumPy CDN failure led to bounded retry and an explicit download error. These are recorded as fixes, not assumed browser incompatibilities.

Inspected the Dutch light-theme 1440-pixel workstation screenshot. A full run of npm run test:chrome -- --built and npm run test:firefox -- --built exercises each session on the production project path. CI runs the complete Chrome course suite before Pages deployment. Edge is not installed in this environment; Edge and Safari remain independently unverified. No classroom timing study or native-language editorial review has yet been performed.

The complete Firefox production run passed all sessions. A combined Chrome run encountered a transient fetch failure after individual suites had passed; the worker now fetches its local teaching API before loading Pyodide and retries failed fetches with a bounded timeout and an explicit path/error. The final Chrome run was repeated after this loader fix.

Final full Chrome production run passed all six sessions after the loader fix. A targeted real-Python regression also verifies that the String payload "Infinity" stays text while non-finite LaserScan ranges decode as floats. Shared translation lookup uses a precomputed map to keep frequent visual updates inexpensive.

## Pages CI lesson-loading race — 2026-10-03

[Run 37115132011](https://github.com/mariomlz99/ros2learn/actions/runs/37115132011) passed all 32 unit tests, the static build and browser Sessions 1–4, then timed out at the first Session 5 exercise with Python stopped and no output. Inspection found that the lesson selector became enabled before initial loading completed; reselecting the current lesson also left Run active while a pending response could reset the newly started worker. The acceptance harness incorrectly used the unchanged exercise title as its readiness signal.

Lesson controls now stay disabled until the selected lesson has finished loading and resetting. Tests wait for explicit ready state and selected lesson ID. A new browser regression delays lesson JSON responses by 350 ms and checks initial readiness, same-lesson reload, blocked Run, preserved drafts and overlapping selections. It failed against the previous build and passes against the fix in Chrome and Firefox. All 32 unit tests and the static build pass; all six Session 5 reference programs also pass in Firefox.

The Node.js 20 deprecation warning and Ubuntu migration notice were separate from the failed browser test. CI now uses checkout/setup-node v7 and pins ubuntu-24.04; the application test Node version remains 22. GitHub-hosted deployment verification still requires pushing the fix.

The complete corrected Chrome production run passed: delayed-loading regression, original CLI lab, all 25 Python reference exercises across Sessions 2–6, alternate solutions, negative controls, Stop/Reset, theme/language/layout and String payload regression. No browser suite was skipped or retried in this run.

## KineCourse workstation baseline — 2026-10-03

Starting revision fb86743: clean working tree; 32 unit tests and static build passed. Full Chrome and Firefox production suites passed all six sessions before changes. Branding/copy changes retain lesson IDs, Python programs and runtime behaviour. The original CLI browser regression and the new independent-brand/emoji checks pass after rebranding.

Six-language stage: 35 unit tests pass, including every lesson/catalog translation and required UI rows. Chrome and Firefox language regressions pass with running Python and continued robot motion; switching EN/NL/FR/ES/DE/PT preserves source, selected lesson, theme and layout. Existing Dutch/French Session 1 steps and Session 3 hints were made complete. Legal notices and low-level Python/CLI diagnostics intentionally retain English; reference-page teaching prose is translated. Native-speaker editorial review remains separate from engineering validation.

TF stage: 37 unit tests pass. Chrome and Firefox TF browser regressions verify translation/rotation of axes, the rotated 0.20 m laser offset, fixed target, selectable hierarchy, reference-frame changes and numeric equality between the inspector, runtime lookup and actual Python Buffer. Firefox exposed an initial empty iframe document in the new test; the readiness predicate now handles it explicitly.

Visual review: captured Sessions 1, 3, 5 and 6 at 1440 × 1100, plus Sessions 1/3/5 in Spanish, German and Portuguese and the Session 5.3 sensor-frame hierarchy. Reviewed dark and light themes, task text, labels, axis geometry and overflow. All 14 page/language/theme cases passed the horizontal-overflow and visible-brand audit. Screenshots exposed excess vertical spacing and low-contrast light-theme telemetry; both were corrected. Four current screenshots are saved in docs/media/. The capture script is a maintainer tool, excluded from production.

Translation review: checked the new languages for identifier preservation, concise tasks and layout. Spanish and Portuguese retain topic/callback/publisher/subscriber where they match the programming material; German uses Koordinatensystem for a frame where explanatory prose needs it. Portuguese follows European forms such as câmara and perceção. This is an engineering/editorial pass, not native-speaker certification; lecturer review remains requested.

Final local release checks: all 37 unit tests, static build (asset version 1d0fc154a99a), complete Firefox suite and complete Chrome suite passed. Both browsers exercised all six sessions, real Pyodide/NumPy programs, alternate solutions, negative controls, Stop/Reset, six-language preservation and numerical TF agreement. One initial Chrome run stopped in the Session 5 harness with a generic Failed to fetch after successful odometry feedback; a complete rerun passed without code changes or skipped checks. The failing request was not identified, so this is recorded as an intermittent fetch failure rather than an asserted application fix.

The managed shell runner is unavailable in this workstation (bwrap loopback permission error). Tests used the bundled Node v24.21.0 executable through the available Node tool to run the exact package-script entry points: node --test, scripts/build.mjs and scripts/check-course.mjs chrome/firefox --built. CI independently runs the documented npm commands on Node 22. Edge/Safari and classroom timing remain unverified.

Deployment status: local release commits are ready, but this session could not publish them. HTTPS git push failed because no Git credential is configured for noninteractive use. The connected GitHub app could read repository metadata but GitHub rejected create-tree with HTTP 403 Resource not accessible by integration. No remote branch was changed. Push main from an authenticated maintainer terminal, then verify the resulting Pages workflow and production views. At this check, production still corresponded to fb86743; its workflow 37116107865 had succeeded. The new KineCourse production deployment is not yet verified.

## KineNest baseline — 2026-10-03

Starting revision 951f662 is clean and matches origin/main; its Pages deployment succeeded. All 37 unit tests and the static build pass. Full Firefox acceptance passes. Chrome passed Sessions 1–4 but stalled at Session 5 without a test result; local fixture and lesson HTTP requests returned 200. An isolated Session 5 run passed with an explicitly persistent headless Chrome session. The harness now uses remote-debugging-port=0 instead of dump-dom (an extraction mode), and reference/progress fetches have bounded, path-specific errors. No student code was changed to address this harness failure. A full Chrome recheck follows.

The complete persistent-session Chrome baseline passed all suites, including all 25 Python exercises, TF, translations, alternate implementations, negative controls and Stop/Reset.

KineNest branding/localization: supplied-logo derivatives inspected, 26 Italian lesson translations added, all seven languages checked in Chrome and Firefox with continuous Python/robot motion and preserved code/theme/layout. About and attribution text are translated. A repeated language-label write initially caused a MutationObserver loop; updating only changed labels fixed it, and both browser tests pass.

Sensor stage: 41 unit tests pass, including distinct camera/LiDAR origins, rotated mounting transforms, capture-pose timestamps, same-stamp TF, bounded newest-sample delivery and Reset cleanup. Camera mount is now +0.10 m; LiDAR remains +0.20 m.

Language-neutral stage: 43 unit tests and the full Chrome/Firefox Python course suites pass after extracting RuntimeAdapter and migrating starter data. Both browsers pass Compare-mode tests for independent drafts, UI-language changes, exercise fallback, retained programming preference and experimental-only visibility.

## KineNest release candidate — 2026-10-03

All 44 Node tests and the static build pass. Complete Chrome and Firefox course acceptance passes all six sessions, all 25 Python reference programs, alternate algorithms, negative controls, Stop/Reset, seven-language state preservation, TF numeric agreement, Compare drafts, navigation, reduced motion and Back/Forward cleanup. Tests ran the exact npm-script entry points using bundled Node v24.21.0 because npm is unavailable in the managed shell; CI uses Node 22.

Both browsers also pass the separate experimental C++ suite: real hello-world compilation/execution, functional and class LaserScan callbacks, Twist publication, timers/logger, the shared obstacle-avoidance checker, cold/warm toolchain loading, source-location compiler diagnostics, infinite-loop Stop, Reset and actual Compare UI execution. Exercises 2.1 and 2.4 are feature-gated by experimentalCpp=1. Broader C++ course parity is not implemented. See CPP.md for sizes, timings, sampled linear memory and toolchain limitations.

Validation found and corrected virtual include paths and the old toolchain's unsupported atomic/static guards. Single-threaded libc++ configuration now matches the worker execution model. A UI Reset assertion also exposed graph text waiting for the next frame; Reset now redraws immediately. Translating execution statuses required the language test to check continued callbacks and enabled Stop instead of searching for an English status phrase.

Visual review covered 22 workstation combinations, including Sessions 1, 2, 3, 5 and 6; 1440 px desktop and 1100 px laptop; dark/light; Spanish, German, Portuguese and Italian; and Compare. All passed overflow, language and visible-brand audits. About, full logo and footer were inspected separately. Native keyboard selection of a language passed in Chrome. Reviewed screenshots are in docs/media. A duplicated light-theme flag and preview SVG MIME handling were fixed. TF axes/labels now retain readable screen size while their origins follow the actual transforms.

The seven-language engineering/editorial review preserves technical identifiers and concise tasks; native-speaker and classroom validation remain separate. Edge and Safari are still best-effort, not independently tested. Legal notices and raw compiler/Python/CLI diagnostics retain their original language.

Validated production asset version: 155e9188d07d. GitHub Pages publication is checked separately below.

Publication check: HTTPS push could not authenticate (no noninteractive GitHub username/credential). Existing SSH access was also unavailable: strict host-key verification found no saved GitHub host key; no trust settings were changed. The release therefore remains local. Production still returns KineCourse and asset version 1d0fc154a99a, while the validated local build is 155e9188d07d. Publish with git push origin main from the authenticated maintainer terminal, then inspect the Pages workflow and the deployed version. The personal root website and repository name were not modified.


## White world surfaces in light theme — 2026-10-03

At the start of this follow-up, origin/main matched 8017b1c and the public Pages site returned KineNest with asset version 155e9188d07d. The earlier release was therefore published after the authentication failure recorded above.

The SVG Session 1 grid and Canvas worlds in Sessions 2–6 now use shared CSS theme colors. Light mode has white world surfaces; grid lines, rays, robot heading, target vectors and TF annotations retain contrast. Theme changes redraw immediately without modifying camera pixel data or advancing/resetting the runtime. The TF vector arrowhead now uses the same color as its line.

All 44 unit tests and the static build pass (asset version 56c72703b2a8). The new theme browser regression passes Chrome and Firefox for all six sessions, including actual Canvas pixels, SVG styles, label/axis contrast, unchanged camera pixels, preserved drafts/selection, continued CLI-driven motion, dark restoration and saved theme. Existing CLI and real-Python TF regressions also pass in both browsers. The theme regression is part of the regular course acceptance command and Pages CI.

Captured 22 workstation views at desktop/laptop sizes; inspected light Session 1, light Session 2 LiDAR/Compare and light Session 5 TF. The updated Session 5 screenshot is in docs/media. Full course acceptance and publication results follow below.

Full Chrome and Firefox course acceptance passed with this build: all 25 Python reference exercises, alternate solutions, negative controls, Stop/Reset, translations, Compare, TF, transitions and the added world-theme regression. No suite was skipped or retried.

Publication of the theme follow-up remains pending: noninteractive HTTPS push again failed because no GitHub username/credential is available in this session. Production was last verified at 155e9188d07d; the validated theme build is 56c72703b2a8. The two local commits are ready for the maintainer’s authenticated git push origin main.


## Consolidated workstation baseline — 2026-10-03

Started clean on main at 13f0accc2e67e14c6ad42a6340657ad79d427877. All 44 unit tests, static build 56c72703b2a8, complete Chrome/Firefox course suites and both C++ suites pass. The first Firefox run exposed a test-only assumption: an immediate theme redraw may catch up to the latest robot pose between sensor frames. The regression now bounds continuous motion by one sensor period rather than requiring equality with an older visual sample; the complete Firefox baseline then passed.

GitHub CLI is absent; the public Actions API confirms [run 37130011718](https://github.com/mariomlz99/ros2learn/actions/runs/37130011718) completed tests, build, C++ tests and Pages deployment successfully for the same commit. Production returns KineNest and asset version 56c72703b2a8. Native Chrome/CDP and Firefox/BiDi probes verified ordinary Session 2 hides C++/Compare, the query flag reveals them, and the deployed C++ obstacle controller compiles, moves the robot and passes the shared checker in both browsers. Cold toolchain loads were 1.95 s / 2.62 s and compilation 2.00 s / 1.53 s (Chrome/Firefox). No production feature was missing; it was gated.

Public C++ gate: 45 unit tests and build pass. Complete C++ suites pass in Chrome and Firefox. The ordinary Session 2 URL now compiles/runs 2.1 and 2.4 and passes the shared checkers; language/theme/layout preserve both Compare drafts. Unsupported lessons remain Python-only and unfinished variants require the developer flag.

Navigation: both browsers pass timing assertions for the 1,000 ms outgoing dwell and reduced-motion bypass, actual session navigation, duplicate destination prevention, no repeated variant, external/modified/hash links, failed/cancelled navigation cleanup and Back/Forward. Five animations now run for 850 ms; robot yaw makes one full rotation.

Build identity and attribution: build-info.json records commit, UTC build time, product, asset version and dirty-worktree flag without paths or credentials. About compares deployed and loaded asset versions. Both browsers verified the exact English attribution and required links on all nine pages, including after UI-language changes. Build tests enforce the metadata schema, production allowlist and footer links.

Language host: 46 unit tests pass, including third-adapter injection, lazy selection and cancellation of a stale load. Both browsers pass delayed lesson loading and Compare after the extraction. The old readiness test assumed a Python-stopped label even when no Python adapter had been loaded; it now checks that no Worker is constructed and Stop remains disabled.

Integrated course checks: complete Firefox Python and C++ suites pass. The first integrated Chrome run timed out while moving from Session 5.1 to 5.2, leaving the previous output visible. An isolated Session 5 run and then the complete Chrome Python course passed without application changes. The harness now includes lesson ID, readiness state and status in timeout errors; the original timeout is not claimed fixed or explained. All goal-control, obstacle integration and debugging reference programs pass in both browsers, with empty-program negative checks and Stop between exercises.

The new commit-aware deployment smoke passed against the local static build in Chrome and Firefox: ordinary URLs, public C++ 2.1/2.4 compilation and shared checks, a real Python subscriber, one-second navigation, all nine footers and About identity. It refuses older or dirty releases by default. Pages now runs the Chrome smoke after deployment; actual publication of this iteration is recorded below.

Visual inspection: 1440 px desktop Compare shows independent starter drafts and compact language badges; the light Session 5 world is white with labelled, contrasting axes and a readable transform inspector. Sensor regression coverage still verifies the shared camera/LiDAR mounts, TF composition, capture time, reset invalidation and bounded latest-sample delivery; no sensor geometry was rewritten in this cycle.

The isolated rmw_wasm artifact probe passed String pub/sub, AddTwoInts service calls and worker termination in Chrome and Firefox. Pinned files total 69,793,449 bytes; four workers expose 256 MiB combined linear memory. These are local artifact observations, not internet download or total-memory measurements. The source stack was not rebuilt, and native Twist-to-simulator integration remains unverified. See experiments/rmw-wasm/README.md; production excludes the experiment and downloaded binaries.

Final integrated validation: all 46 unit tests and static build pass (asset version 0c05cf3b6167). Complete Chrome and Firefox course and C++ suites pass, including compiler diagnostics, runaway-program Stop, Reset, public exercise execution and shared checkers. No course suite was skipped. Edge and Safari remain independently unverified.

Publication remains blocked by workstation Git authentication: noninteractive git push origin main returned fatal: could not read Username for https://github.com (terminal prompts disabled). No new remote deployment is claimed. The last verified public revision is 13f0acc / asset version 56c72703b2a8. Push the prepared main branch from an authenticated maintainer terminal; the new verify-pages workflow then checks the exact deployed commit, and test:deployed can independently verify it in Firefox. The personal root site, repository name and domain are unchanged.
