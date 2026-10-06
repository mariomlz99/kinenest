# Native Jazzy validation of exported starter packages

Validated locally on 2026-10-06 using the workstation's `/opt/ros/jazzy` installation. These results concern the **generated starter packages** for Python and C++, not arbitrary student edits or hardware. The browser's `colcon`, launch and graph remain educational models.

## Procedure and observations

1. `node scripts/export-bridge-fixtures.mjs /tmp/kinenest-jazzy-check-2026-10-06-` wrote both package trees and ZIPs. `unzip -t` accepted both archives; each contains `launch/system_launch.py`.
2. In isolated Python and C++ native workspaces, sourced `/opt/ros/jazzy/setup.bash`, ran `colcon build --event-handlers console_direct+`, then sourced `install/local_setup.bash`. Python build completed in about 0.98 s; C++ build in about 5.87 s. Both installed `publisher`, `subscriber` and `system_launch.py`.
3. Started `ros2 run my_robot_pkg publisher` and `ros2 run my_robot_pkg subscriber` as separate native processes. `ros2 node list` showed `/talker` and `/listener`; topic inspection showed `/chatter`, `ros2 topic echo` observed `hello`, and the subscriber logged `heard: hello` for both language packages.
4. Ran `ros2 launch my_robot_pkg system_launch.py`. Both packages produced `/bridge_chatter` with one publisher and one subscriber; `ros2 topic echo` observed `hello`; `ros2 param get /listener prefix` returned `received`; the subscriber logged `received: hello`.
5. For each package, changed the installed launch file's subscriber remapping to `/other_chatter` in a temporary validation workspace. The native graph then showed a publisher but no subscriber on `/bridge_chatter`, and a subscriber but no publisher on `/other_chatter`. This reproduces the learner's deliberate launch fault.

The native manual and launch checks used separate `ROS_DOMAIN_ID` values and bounded process lifetimes. A first validation shell used background SIGINT cleanup and hung after success; it was stopped, then replaced with bounded TERM/kill cleanup. The final manual, launch and fault checks exited successfully. That shell issue was in the validation harness, not in the exported packages.

## Fidelity issues found and resolved

| Finding | Resolution |
|---|---|
| The first browser terminal defaulted to `ros2_ws/src`, while the lesson asked learners to navigate there. | Terminals now start at `~/ros2_ws`; the displayed current directory and guide explain `cd src`, package creation and returning to the workspace root. |
| The initial file `system.launch.py` worked, but the Jazzy launch tutorial recommends the `_launch.py` spelling. | Generated and installed file renamed to `system_launch.py`; the browser still accepts supported files ending in `launch.py`. |
| A Python `setup.py` could name the wrong launch file while the browser installed the real file anyway. | The build now checks the literal `data_files` launch entries against actual files; a missing or unlisted launch file fails the build. |

## Remaining native differences

- The browser does not run native ROS 2, DDS/RMW, colcon, ament, CMake, Bash or Linux processes. Native dependency installation and hardware setup belong to the learner's real system.
- The browser parses a bounded package/CMake/launch subset and runs actual learner Python or compiled C++ against its shared educational graph. More complex native packages, launch substitutions, QoS and arbitrary dependencies are outside this Core bridge.
- Exported starter packages passed the exact native checks above. Changed source, build definitions, ROS installations and hardware require their own native verification.

Reference: [Jazzy package tutorial](https://docs.ros.org/en/jazzy/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.html), [Jazzy launch tutorial](https://docs.ros.org/en/jazzy/Tutorials/Intermediate/Launch/Launch-system.html).
