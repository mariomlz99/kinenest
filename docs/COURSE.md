# Six sessions × 90 minutes

Sessions 1–2 are introductory. The core is Python-first and browser-only. Finish and evaluate this course before broadening the platform.

| Session | Focus | Material |
| --- | --- | --- |
| 1 | Graph, CLI, topics, messages, cmd_vel | Original CLI lab plus multi-terminal experiments |
| 2 | Subscribers, callbacks, LiDAR and reactive pub/sub | Four exercises; see SESSION2.md |
| 3 | Camera, NumPy, perception, services | Original six exercises; see SESSION3.md |
| 4 | Parameters, custom interfaces, actions | Five core exercises plus optional cancellation; see SESSION4.md |
| 5 | Odometry, heading, TF, relative control | Five core exercises plus obstacle integration; see SESSION5.md |
| 6 | Debugging, integration and explanation | Two repairs and a camera/LiDAR beacon challenge; see SESSION6.md |

All materials above are implemented. Teaching pace still requires classroom validation; exercise counts are not a claim that every cohort can finish all extensions in 90 minutes. Reserve explanation and discussion time. For Session 1, demonstrate discovery, inspect message fields, then have pairs publish/echo/hz, deliberately break topic/type names, reset and explain the graph. Do not spend its full 90 minutes on typing a single solution.

Keep Session 3 focused: no parameter/action/TF exercises are added there. NumPy is primary; cv2 helpers are optional. Its callback-state and real-machine sidebars are explanatory, not new assessed tasks.

The UI and lesson text support EN/NL/FR; Python, ROS identifiers, commands and terminal output remain English. Translation does not change lesson IDs, starter programs, world state or check behaviour. Light/dark and split/stacked preferences are local to the browser.

The real-ROS transition explains ament_python, package.xml, setup.py/setup.cfg, colcon and sourcing a workspace. CMake appears only as context for custom interfaces/ament_cmake or future C++; the browser never executes it.

Use checks for practice, not secure grading. Accept different algorithms; ask students to explain a fresh debugging or control task for assessment. No accounts, grade database, LMS, backend, native ROS, Gazebo or RViz are introduced.
