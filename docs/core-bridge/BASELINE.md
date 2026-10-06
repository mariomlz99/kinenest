# Core bridge baseline — 2026-10-05

- Repository: `mariomlz99/kinenest`; fetched `origin/main` before editing.
- Main SHA and branch start: `b23b2ca1ae4a7742a41bc9426f33c8c888bf12dc`; package version `0.3.0`.
- Existing branch: `core-real-ros-bridge`, tracking `origin/main`. It was already checked out when this work resumed.
- The tree was **not clean** before work resumed: untracked `docs/core-bridge/WORKSPACE_MODEL.md`, `src/bridge/workspace.js`, and empty `much`, `otherwise`, `provide` were present. They were preserved and inspected. Thus the requested clean-tree precondition could not truthfully be confirmed.
- Production `https://kinenest.com/build-info.json`: commit `b23b2ca1ae4a7742a41bc9426f33c8c888bf12dc`, `builtAt` `2026-10-05T18:10:23.231Z`, `assetVersion` `c102a34c5604`, `dirty: false`.
- Public routes in the allowlisted build before this branch: `/`, `/session-01.html` through `/session-06.html`, `/real-ros.html`, `/about.html`, `/licences.html`. `build-info.json` is generated separately.
- Test matrix: `npm test`, build, Wrangler dry run, Worker routing; then Chrome and Firefox Python course, C++ acceptance and full C++ course, stress, responsive, transitions, boot, local deployed smoke. Production deploy is gated after both browser matrix jobs in workflow, but the GitHub API reported `main` has no branch protection (HTTP 404). Required status checks are therefore not enforced at repository protection level.
- Footer translation fix: shared footer uses `footerAttribution(language)` and `preferences.js` replaces it on language change. This was present at baseline.
- Documented limitations: educational rclpy/rclcpp-shaped APIs and graph; no native ROS 2, DDS, QoS negotiation, TF history, full OpenCV, Gazebo, RViz, Nav2, SLAM or native package builds; planar latest-only TF; one world per tab; see `README.md` and `docs/ARCHITECTURE.md`.
- Production remains untouched. This branch has not been merged or deployed.

## CI recommendation

Protect `main`; require `test-build` and both `browser-acceptance` matrix results. This branch adds Python and C++ bridge steps to each browser matrix job. Do not enable auto-merge until all required jobs and review pass. No repository setting was changed in this branch.
