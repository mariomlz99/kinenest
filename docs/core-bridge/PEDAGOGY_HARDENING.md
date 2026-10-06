# Core teaching and terminal hardening

This pass addresses the external teaching review and the terminal report across all six Foundations pages and the Core finale. It retains the shared runtime, process manager and launch subset.

## Terminal consistency

Every learning page uses the same workspace terminal implementation. Terminals on a page share files and graph state, with independent working directories, histories and sourced environments. Supported file operations include `pwd`, `cd`, `ls -a/-l`, `tree`, `mkdir -p`, `touch`, `cat`, `cp -r`, `mv`, `rm -r`, `rm -rf` and `clear`. The reported `ros2 pkg create --build-type ament_cmake --license Apache-2.0 my_robot_pkg` works after `cd src` on every course page. Removing source or installed output invalidates the affected build. Existing ROS graph commands, streaming output and Ctrl+C remain available.

This is a bounded browser workspace. It does not execute Bash, arbitrary binaries, pipelines or native ROS processes. The help and technical disclosure state this boundary.

## Review disposition

| Exercise / area | Applied change |
|---|---|
| 1.1 | Explain the simulated two-second watchdog and explicitly publish a zero Twist. |
| 2.1 | Mark ray 60 as specific to the fixed scan; point forward to angle metadata. |
| 2.2 | Scan callback stores state; timer publishes; learner observes with terminal echo. Remove self-subscription from starter/reference and replace its checker with typed publication evidence. |
| 2.3 | Highlight the three ±15° sectors with angle labels while rays are visible. |
| 2.4 | Let behavior and collision evidence determine completion; remove the fixed eight-second wait. |
| 3.1 | Frame the exercise as transferring the subscriber pattern to another sensor. |
| 3.2 | Remove an unused Python helper import; label checker helpers near the editor. |
| 3.3 | Describe threshold detection as a deliberately simple learning method. |
| 3.4 | Add a prediction prompt before a varied scene. |
| 3.5 | Use language-neutral Trigger-client instructions. |
| 3.6 | Derive image center from width in Python and C++ guidance. |
| 4.1 | Declare and inspect node-owned speed; publish a simple fixed command. No repeated live-tuning requirement. |
| 4.2 | Start from the fixed controller and replace its constant with a live, bounded parameter read. |
| 4.3 | Use language-neutral wording, display TargetInfo.msg, and explain generated interfaces in native package builds. |
| 4.4 | Distinguish action name /drive_distance from its server. |
| 4.5 | Prefill Python goal acceptance and final result; leave feedback as the new TODO. |
| 4.6 | Explain the browser numeric cancellation representation and name native symbolic equivalents. Keep optional. |
| 5.1 | Read x/y, raw quaternion and pose versus velocity. Add sample-bound report_position in both languages. |
| 5.2 | Make quaternion-to-yaw conversion the distinct next objective. |
| 5.3 | Preserve the mounted-sensor/frame exercise. |
| 5.4 | Preserve frame semantics and add a sign-prediction prompt. |
| 5.5 | Describe steering as an educational controller. |
| 5.6 | Present AVOID → CLEAR → SEEK and a callback counter as one possible memory strategy. Checker remains algorithm-neutral. |
| 6.1 / 6.2 | Preserve the debugging tasks. Introduce Session 6 as synthesis of prior concepts. |
| 6.3 | Python starter now separates sensor-state callbacks from a control timer, matching the C++ structure. Update its executable reference. |
| Core finale | Add Package & Build → Run & Inspect → Launch & Debug checkpoints using the final check's actual evidence. Explain the roles of CMake declarations. |
| Homepage | Present Foundations and the finale as KineNest Core, followed by optional future tracks. |

Teaching changes are reflected in the six translated variants as well as English. Identifiers and code stay shared. The report helper note explicitly distinguishes KineNest checker APIs from ROS 2 APIs.

## Acceptance and audit evidence

- Unit contracts test typed /chatter evidence, separation of raw position from yaw, sample provenance, file operations and build invalidation.
- `terminal-browser` exercises the shared file commands and the reported CMake package-creation command on all six Foundations pages, using two terminals per page.
- `bridge-browser` tests both languages from package creation through manual communication and launch diagnosis; checkpoints must start empty, complete with the system check and clear on Reset.
- `starter-path` starts with the supplied editors and fills only the changed TODOs for 4.1, 4.2, 4.5, 5.1 and 5.2, in Python and C++. It never fetches reference programs. This caught an omitted C++ protocol entry for the new position report before release.
- Existing full Python/C++ course suites cover the remaining exercises and alternatives. The 2.2 negative control now publishes on the wrong topic: absence of a self-subscription is intentionally valid.
- The browser workflow runs both new acceptance suites in Chrome and Firefox. Existing lifecycle, language, responsive, boot and deployment gates remain required.

The starter-path automation is a focused regression test, not a substitute for an independent first-time learner completing all exercises from visible instructions. The external human review is a separate release input. Do not describe reference-solution runs as a manual novice walkthrough.

Native package validation uses freshly exported files from the browser templates, isolated temporary workspaces and separate ROS domains. See NATIVE_JAZZY_VALIDATION.md and the current PR's validation results. Main branch protection is a maintainer configuration decision; this pass does not change repository protection settings.

## Reference

Package layout and create/build/source/run sequencing were checked against the official [Jazzy package tutorial source](https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.rst). Launch remains aligned with the official [Jazzy launch tutorial source](https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Intermediate/Launch/Creating-Launch-Files.rst). No QoS, DDS, additional launch formats or new Core sessions were added.
