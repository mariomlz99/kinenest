# Session 4 — parameters, interfaces and actions

Six short exercises: configure a node, change its parameter live, publish TargetInfo, send a distance goal, process feedback, and optionally cancel. Suggested pacing: 15 minutes context, 10 + 10 + 15 + 15 + 10 minutes core exercises, 10 minutes cancellation or recap, 5 minutes discussion.

Parameters are declared scalar values owned by nodes. CLI list/get/set updates Python through the worker bridge. Python must read the value inside its callback to react. This subset does not implement descriptors, parameter services/events, array parameters or atomic transactions.

TargetInfo has bool visible, string position and float32 confidence. The course validates confidence in [0,1]. Python supplies a generated-like class directly. The real-machine sidebar explains ament_cmake and rosidl_generate_interfaces without running either in the browser.

/drive_distance_server provides /drive_distance with ros2learn_interfaces/action/DriveDistance: float32 distance goal, bool success and float32 final_distance result, float32 distance_travelled feedback. Its speed parameter defaults to 0.5 m/s. Goals are limited to 0–3 m (exclusive of zero); speed must be 0–1 m/s (exclusive of zero). One goal runs at a time. Progress comes from actual accumulated robot motion, not elapsed time alone. A collision aborts, and cancellation or reset stops motion. Status codes follow ROS conventions: 4 succeeded, 5 cancelled, 6 aborted.

ActionClient supports send_goal_async, goal acceptance, feedback_callback, get_result_async and cancel_goal_async. This is an educational single-server action implementation, not DDS action transport. Student-defined action servers and advanced goal policies are outside this course. The CLI shares this server and supports list/type/info/send_goal with --feedback; Ctrl+C cancels a CLI-owned goal.
