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
