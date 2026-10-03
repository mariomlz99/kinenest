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
