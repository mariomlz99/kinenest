# Core bridge release report — local candidate, 2026-10-06

## Identity and disposition

- Branch: `core-real-ros-bridge`, based on main `b23b2ca1ae4a7742a41bc9426f33c8c888bf12dc`.
- Candidate commit SHA, preview URL and CI run: pending branch commit/push and GitHub authentication. The working tree was not clean at the start; see `BASELINE.md`. No merge or production deployment was performed.
- Production build-info at baseline: commit `b23b2ca1ae4a7742a41bc9426f33c8c888bf12dc`, asset `c102a34c5604`, dirty false. The local candidate build has asset `f7407008b24b`, base commit and dirty true; it is not a published release identity.
- Main branch protection API returned HTTP 404. Require `test-build` and both Chrome/Firefox `browser-acceptance` matrix results before merging. The matrix on this branch includes Python and C++ bridge acceptance. No repository protection setting was changed.

## Implemented learner flow

The existing six Foundations sessions retain their exercise files and teaching order. A final Core page adds a bounded browser workspace: Python or C++ package creation, editable source and metadata, meaningful build failures, modeled build/install/log output, per-terminal sourcing, two manual `ros2 run` processes, graph inspection, an intentionally faulty launch remapping, correction, and a successful two-node `ros2 launch`. The checked result depends on compiled/executed student code and live graph messages. A native ROS transition page and seven-language navigation/landing copy complete the learner path. Future specialist tracks remain roadmap entries only.

## Local verification

| Gate | Result |
|---|---|
| Unit/build | `npm test` 79/79; `npm run build` passed; `git diff --check` passed on tested source |
| Build packaging | Wrangler dry run passed (132 files); worker asset check passed (11 exact HTML routes and versioned assets) |
| Bridge Chrome | Python and C++ end-to-end acceptance passed: create, edit, build, failure/recovery, source, manual two-node communication, CLI inspection, fault diagnosis, remap repair, launch, stop, terminal close, navigation and Reset cleanup; C++ compile cancellation passed |
| Bridge Firefox | Same Python and C++ acceptance passed |
| Existing Foundations | Python full course passed in Chrome and Firefox; C++ full course passed in Chrome and Firefox (25 exercises / 112 cases per browser) |
| Responsive/translation | Chrome and Firefox passed eleven public routes, seven languages, desktop and phone checks including 320 px; translated footer passed on all eleven routes |
| Local deployment smoke | Chrome and Firefox passed expected local build identity, route/footer/navigation, real Python, and C++ exercises 2.1 and 2.4. This is a local smoke, not a production or preview deployment. |
| Native Jazzy examples | Exported Python and C++ ZIP packages passed archive validation and native Jazzy `colcon build`, source, `ros2 run` executable discovery/run, and `ros2 launch` with observed remapped `hello` messages. Fixed example packages were validated; arbitrary edits were not. |

Screenshots: `/tmp/kinenest-core-bridge-screenshots/bridge-python-workspace.png`, `bridge-python-launch.png`, `bridge-cpp-launch.png`, and `bridge-it-mobile.png`. They show the local built candidate, not a deployed preview. One-run timing measurements for all four browser/language paths are in `PERFORMANCE.md`. Browser C++ builds use the real browser Clang/LLD toolchain; Python uses Pyodide CPython. Native Jazzy validation used the workstation's `/opt/ros/jazzy` installation.

## Official ROS reference and limits

The [official Jazzy tutorials](https://docs.ros.org/en/jazzy/Tutorials.html) are the teaching target. Package, Python/C++ pub/sub, workspace and launch forms were checked against the official Jazzy documentation source; basic newer Lyrical examples retain the forms taught here, although Lyrical reorganizes tutorial locations. The newer parameter example uses a context-manager initialization idiom, documented without silently changing the Jazzy lesson. Service, parameter, action and TF beginner APIs were also compared with Lyrical sources. See `ROS_REFERENCE_POLICY.md`, `ROS_JAZZY_MAPPING.md` and `ROS_API_AUDIT.md` for exact links and decisions. KineNest's workspace, shell, colcon, ament/CMake subset, launch parser and graph are educational browser models; there is no native ROS 2, DDS/RMW, Linux process or full shell in the browser. See `DIFFERENCES_FROM_NATIVE_ROS2.md`.

## Open release gates

- Obtain a candidate commit, remote branch, CI run and preview URL once GitHub authentication is usable; verify candidate build-info against that exact SHA.
- Run the full remote CI matrix and review its required-check configuration. The current main protection does not enforce required jobs.
- Resolve any CI-specific failures. Browser Safari/iOS was not tested.
- Maintainer review/approval and a freeze decision are still required. No tag should be made before these gates pass.

**CORE READY TO FREEZE: NO.** The local candidate has passed substantial functional testing; remote and review gates remain open.
