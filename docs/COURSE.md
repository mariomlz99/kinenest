# Six sessions × 90 minutes

Sessions 1–2 are introductory. Core supports Python and C++ in the browser: 16 Foundations exercises (one CLI exercise and 15 coding exercises), followed by Build & launch and the native transition. Ten Further exercises are optional. Finish and evaluate Core before broadening the platform.

| Session | Focus | Material |
| --- | --- | --- |
| 1 | Graph, CLI, topics, messages, cmd_vel | Original CLI lab plus multi-terminal experiments |
| 2 | Subscribers and callbacks | 2 Core + 2 Further exercises; see SESSION2.md |
| 3 | Messages and services | 2 Core + 4 Further exercises; see SESSION3.md |
| 4 | Parameters, custom interfaces, actions | 5 Core exercises plus optional cancellation; see SESSION4.md |
| 5 | Odometry, heading and TF | 4 Core + 2 Further exercises; see SESSION5.md |
| 6 | Debugging and explanation | 2 Core repairs and an optional camera/LiDAR beacon challenge; see SESSION6.md |

All materials above are implemented. Teaching pace still requires classroom validation; exercise counts are not a claim that every cohort can finish all extensions in 90 minutes. Reserve explanation and discussion time. For Session 1, demonstrate discovery, inspect message fields, then have pairs publish/echo/hz, deliberately break topic/type names, reset and explain the graph. Do not spend its full 90 minutes on typing a single solution.

Keep Session 3 focused: no parameter/action/TF exercises are added there. Pixel processing is Further practice; Python uses NumPy, with optional cv2 helpers, while C++ uses the image byte buffer. Its callback-state and real-machine sidebars are explanatory, not new assessed tasks.

The UI and lesson text support EN/NL/FR/ES/DE/PT/IT; Python/C++ code, ROS identifiers, commands and terminal output remain English. Translation does not change lesson IDs, starter programs, world state or check behaviour. Light/dark and split/stacked preferences are local to the browser.

The Build & launch finale models ament_python and ament_cmake packages, package.xml, setup.py/setup.cfg or CMakeLists.txt, colcon, sourcing, ros2 run and ros2 launch. Python execution and C++ compilation are real; the browser parses a bounded build/launch model and does not execute native CMake or colcon. The native transition exports the same two-node package for ROS 2 Jazzy.

Use checks for practice, not secure grading. Accept different algorithms; ask students to explain a fresh debugging or control task for assessment. No accounts, grade database, LMS, backend, native ROS, Gazebo or RViz are introduced.
