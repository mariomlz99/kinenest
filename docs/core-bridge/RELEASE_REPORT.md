# Release hardening — blocked, 2026-10-06

**CORE READY TO FREEZE: NO.** The hardening implementation was committed as `684eb2fdf0d345f5c37c85994ef470d8d2702838`; this report is a subsequent documentation-only update. No merge, tag, production deployment or fresh preview deployment was performed.

## Intended changes

- Preserved the existing Compare correction: ordinary Session 6 URLs select the default Core lesson and canonicalize to a valid `?lesson=` URL. Direct frame-debug deep links, Compare, language preference, draft round trips and same-document Back/Forward remain covered by the browser regression.
- Preserved the lesson-history listener that restores the selected exercise and in-memory drafts.
- Completed the existing wrong-topic regression: publisher alone on `/cmdd_vel` is 1 publisher / 0 subscribers; active echo is 1 / 1; the robot stays stationary and `/cmd_vel` remains 0 publishers / 1 simulator subscriber; stopping echo restores 1 / 0; stopping the publisher removes the empty dynamic topic. The five terminal error cases remain covered.
- Retained `.nvmrc` selecting Node 22. No curriculum, starter, bridge, package or export code changed. Existing [native Jazzy validation](NATIVE_JAZZY_VALIDATION.md) remains applicable; it was not rerun.

## Verification and blockers

- Syntax checks for the changed JavaScript and `git diff --check` passed. The implementation commit left a clean working tree.
- Node 22.23.3 ran all 85 unit tests with test isolation disabled: 84 passed, 1 failed (build identity). This is not a passing release test run.
- Building from the clean implementation commit produced asset version `98b8341f51ee`, but `build-info.json` reported `commit: null` and `dirty: null`. Direct diagnosis returned `EPERM spawnSync git EPERM`. The generated artifact is invalid as a release candidate; its metadata was not manually altered.
- Full Chrome and Firefox course runners were both attempted with Node 22. Both stopped at their first browser suite with `listen EPERM: operation not permitted 127.0.0.1`. The remaining browser matrix and downstream gates have not executed successfully.
- GitHub CLI access failed; Git remote access failed with DNS resolution for github.com. No remote CI run for this candidate could be started or verified.
- Preview publication remains gated on a clean identified build and the complete green matrix. No new preview identity is claimed.

## Remaining release sequence

On a workstation permitting Git subprocesses, local browser servers and GitHub access, verify the final clean HEAD, build with Node 22 and require its exact SHA plus `dirty: false`. Run every existing workflow acceptance step in both browsers, including all downstream C++, starters, bridge, terminals, transitions, responsive and cleanup checks. Require all steps to execute and pass. Only then deploy a preview from that SHA and verify both commit and assetVersion against the tested build. Record the CI and preview evidence before changing the freeze verdict. Do not merge, tag or deploy production before that clean green candidate.

# Latest curriculum follow-up

The reviewed Core/Further split is documented in [CORE_PATH_IMPLEMENTATION.md](CORE_PATH_IMPLEMENTATION.md), including complete required coding-starter coverage and remaining human-review/CI gates. The earlier candidate evidence below is retained as historical evidence.

# Core bridge release report — review candidate, 2026-10-06

## Final hardening follow-up

The ecosystem terminal and external teaching-review follow-up is documented in [PEDAGOGY_HARDENING.md](PEDAGOGY_HARDENING.md). It supersedes the earlier unchanged-curriculum description below. The tables below record the earlier bridge candidate; current hardening validation belongs to the latest PR checks and review summary. Core freeze remains gated by current CI and maintainer review.

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
