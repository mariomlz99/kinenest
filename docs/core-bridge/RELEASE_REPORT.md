# Core bridge release report — review candidate, 2026-10-06

## Identity and disposition

- Branch: `core-real-ros-bridge`, based on main `b23b2ca1ae4a7742a41bc9426f33c8c888bf12dc`.
- Final implementation commit: `cb29576583facbe8bc9e4a81a2441bcb73fd9347` on draft [PR #9](https://github.com/mariomlz99/kinenest/pull/9). The [preview](https://core-real-ros-bridge-kinenest.malizia-mario99.workers.dev/) returned the tested evidence commit `fb83852afc015fbf2506de8562d9c5dbd096c2ff`, asset `767d8fa6c9c8`, `dirty: false` on 2026-10-06. Later documentation-only commits may change the branch and preview commit without changing the implementation or asset. No merge or production deployment was performed.
- First candidate `1cf3f97ed3cf762b6a2b4566331e49e2996f5ef8` passed [CI run 37424713599](https://github.com/mariomlz99/kinenest/actions/runs/37424713599). The tested evidence commit `fb83852` passed [CI run 37440644417](https://github.com/mariomlz99/kinenest/actions/runs/37440644417): `test-build`, Chrome acceptance and Firefox acceptance all succeeded. Production-only deploy and verify jobs were correctly skipped for the PR. The working tree was not clean at the start; see `BASELINE.md`.
- Production build-info at baseline: commit `b23b2ca1ae4a7742a41bc9426f33c8c888bf12dc`, asset `c102a34c5604`, dirty false. Production remains separate from this draft preview.
- Main branch protection API returned HTTP 404. Require `test-build` and both Chrome/Firefox `browser-acceptance` matrix results before merging. The matrix on this branch includes Python and C++ bridge acceptance. No repository protection setting was changed.

## Implemented learner flow

The existing six Foundations sessions retain their exercise files and teaching order. A final Core page adds a bounded browser workspace: Python or C++ package creation, editable source and metadata, meaningful build failures, modeled build/install/log output, per-terminal sourcing, two manual `ros2 run` processes, graph inspection, an intentionally faulty launch remapping, correction, and a successful two-node `ros2 launch`. Terminals start at `~/ros2_ws`, display their current directory, and explain why learners enter `src`; the editor explains each file and a command guide explains the sequence. The checked result depends on compiled/executed student code and live graph messages. A native ROS transition page connects the **same exported package**, `system_launch.py` and debugging workflow to a real Jazzy installation without reteaching topic concepts. Seven-language navigation and learning copy complete the path. Future specialist tracks remain roadmap entries only.

## Local verification

| Gate | Result |
|---|---|
| Unit/build | `npm test` 80/80 after final learner-flow changes; `npm run build` and `git diff --check` passed |
| Build packaging | Wrangler dry run passed (132 files); worker asset check passed (11 exact HTML routes and versioned assets) |
| Bridge Chrome | Python and C++ end-to-end acceptance passed again on the refined flow: create, edit, build, failure/recovery, source, manual two-node communication, CLI inspection, fault diagnosis, remap repair, launch, stop, terminal close, navigation and Reset cleanup; C++ compile cancellation passed |
| Bridge Firefox | Same refined Python and C++ acceptance passed |
| Existing Foundations | Python full course passed in Chrome and Firefox; C++ full course passed in Chrome and Firefox (25 exercises / 112 cases per browser) |
| Responsive/translation | Chrome and Firefox passed eleven public routes, seven languages, desktop and phone checks including 320 px on the refined build; translated footer passed on all eleven routes in the first candidate |
| Preview deployment smoke | Chrome and Firefox passed exact preview build identity `cb29576583facbe8bc9e4a81a2441bcb73fd9347`, route/footer/navigation on eleven pages, real Python, and C++ exercises 2.1 and 2.4. The same asset is now served by preview commit `fb83852`. This was the draft preview, not production. |
| Native Jazzy examples | Exported Python and C++ ZIP packages passed archive validation, native Jazzy `colcon build`, source, two manual `ros2 run` processes with messages, and `ros2 launch` with observed remapped `hello` messages and propagated `prefix` parameter. The launch remapping fault produced the expected disconnected native graph. See `NATIVE_JAZZY_VALIDATION.md`. Fixed example packages were validated; arbitrary edits were not. |

Screenshots: [`screenshots/bridge-python-workspace.png`](screenshots/bridge-python-workspace.png), [`bridge-python-launch.png`](screenshots/bridge-python-launch.png), [`bridge-cpp-launch.png`](screenshots/bridge-cpp-launch.png), and [`bridge-it-mobile.png`](screenshots/bridge-it-mobile.png). They show the final local built candidate, not a deployed preview. One-run timing measurements for all four browser/language paths are in `PERFORMANCE.md`. Browser C++ builds use the real browser Clang/LLD toolchain; Python uses Pyodide CPython. Native Jazzy validation used the workstation's `/opt/ros/jazzy` installation.

## Official ROS reference and limits

The [official Jazzy tutorials](https://docs.ros.org/en/jazzy/Tutorials.html) are the teaching target. Package, Python/C++ pub/sub, workspace and launch forms were checked against the official Jazzy documentation source; basic newer Lyrical examples retain the forms taught here, although Lyrical reorganizes tutorial locations. The newer parameter example uses a context-manager initialization idiom, documented without silently changing the Jazzy lesson. Service, parameter, action and TF beginner APIs were also compared with Lyrical sources. See `ROS_REFERENCE_POLICY.md`, `ROS_JAZZY_MAPPING.md` and `ROS_API_AUDIT.md` for exact links and decisions. KineNest's workspace, shell, colcon, ament/CMake subset, launch parser and graph are educational browser models; there is no native ROS 2, DDS/RMW, Linux process or full shell in the browser. See `DIFFERENCES_FROM_NATIVE_ROS2.md`.

## Open release gates

- Browser Safari/iOS was not tested.
- Maintainer review/approval, main branch protection for the required CI jobs, and a freeze decision are still required. No tag should be made before these gates pass.

**CORE READY TO FREEZE: NO.** The implementation, preview and remote CI gates passed. Maintainer review, branch protection and a freeze decision remain open.
