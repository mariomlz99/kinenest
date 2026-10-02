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
