# ROS semantics and transfer review

Frozen8679ae1. Source-evidence review by ros_semantics; coordinator checked official upstream documentation. No native ROS execution was used to claim equivalence.

Scan angle convention, RGB image handling, valid planar odometry quaternion, source-in-target TF lookup, action result/status progression and shared pub/sub graph are coherent. world→odom identity is valid here but does not make the frames interchangeable on a real system. Latest-only TF, immediate educational cancellation, limited QoS and scalar parameters are simplifications, not full middleware behavior.

| ID | Area/session/exercise/language | Severity/category/priority | Observation/evidence | Reproduction | Why | Suggested change | Risk/confidence/implementation |
|---|---|---|---|---|---|---|---|
| RS-01 | Real transition/all/reference/Python | low/ROS semantics/P2 | Python package tree omits resource/camera_detector marker | Compare real-ros.html with official package tutorial | Package discovery needs marker installation | Add marker to conceptual tree | low/high/yes |
| RS-02 | Parameters/4/4.1–2/Python | low/ROS semantics/P2 | JS numeric scalar does not distinguish integer/double ROS types | Inspect setParameter type check | Avoid teaching full native parameter type fidelity | Document simplification | low/high/yes docs |

Official references: [Python package structure and resource marker](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.rst); [tf2 listener source/target/time semantics](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Tutorials/Intermediate/Tf2/Writing-A-Tf2-Listener-Py.rst); [action client/result/feedback pattern](https://raw.githubusercontent.com/ros2/ros2_documentation/jazzy/source/Tutorials/Intermediate/Writing-an-Action-Server-Client/Py.rst); [LaserScan definition](https://raw.githubusercontent.com/ros2/common_interfaces/jazzy/sensor_msgs/msg/LaserScan.msg).

The transfer page already distinguishes Python ament_python from interface/C++ ament_cmake, console entry points, colcon and sourcing. Keep native builds outside the browser course. Private educational spin scheduling is not a native executor; this is disclosed compatibility, not a reason to impose native threading complexity.

A proposed service checker exploit was withdrawn: current create_client restricts Trigger and /reset_robot. Reverse-transform lookup followed by correct inversion is a valid solution. Timer-driven control using callback state is also valid. Do not grade the preferred syntax.
