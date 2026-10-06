# Existing Foundations course audit

Reviewed every Session 1–6 exercise JSON before bridge design. The bridge reuses the current pub/sub, callbacks, graph tools, parameters and debugging, and teaches package/build/run/launch integration.

| Exercise | Concept | Python behavior | C++ behavior | Runtime feature | Integration reuse |
|---|---|---|---|---|---|
| session-02-01-subscriber | Your first subscriber | real CPython solution for your first subscriber | browser-compiled C++ solution for your first subscriber | subscriber | callback/sensor workflow |
| session-02-02-callbacks | Callbacks are reactions | real CPython solution for callbacks are reactions | browser-compiled C++ solution for callbacks are reactions | subscriber, chatter, timer | callback/sensor workflow |
| session-02-03-sectors | Process LiDAR sectors | real CPython solution for process lidar sectors | browser-compiled C++ solution for process lidar sectors | sectors | callback/sensor workflow |
| session-02-04-avoidance | React to an obstacle | real CPython solution for react to an obstacle | browser-compiled C++ solution for react to an obstacle | avoidance | callback/sensor workflow |
| session-03-01-camera-subscriber | Camera subscriber | real CPython solution for camera subscriber | browser-compiled C++ solution for camera subscriber | camera_subscriber, dimensions | graph discovery |
| session-03-02-image-data | Images are data | real CPython solution for images are data | browser-compiled C++ solution for images are data | camera_subscriber, image_array, image_stats | graph discovery |
| session-03-03-color-detection | Detect red pixels | real CPython solution for detect red pixels | browser-compiled C++ solution for detect red pixels | camera_subscriber, image_array, detection | graph discovery |
| session-03-04-object-position | Left, center, or right? | real CPython solution for left, center, or right? | browser-compiled C++ solution for left, center, or right? | camera_subscriber, image_array, position | graph discovery |
| session-03-05-services | Call a service | real CPython solution for call a service | browser-compiled C++ solution for call a service | service | graph discovery |
| session-03-06-target-challenge | Find the target | real CPython solution for find the target | browser-compiled C++ solution for find the target | camera_subscriber, image_array, control, centered | graph discovery |
| session-04-01-configure | Configure your node | real CPython solution for configure your node | browser-compiled C++ solution for configure your node | configured | current concept |
| session-04-02-tuning | Tune without restarting | real CPython solution for tune without restarting | browser-compiled C++ solution for tune without restarting | parameter, timer | parameter propagation |
| session-04-03-custom | Publish a custom message | real CPython solution for publish a custom message | browser-compiled C++ solution for publish a custom message | custom | current concept |
| session-04-04-goal | Send an action goal | real CPython solution for send an action goal | browser-compiled C++ solution for send an action goal | action_result | current concept |
| session-04-05-feedback | Follow action feedback | real CPython solution for follow action feedback | browser-compiled C++ solution for follow action feedback | action | current concept |
| session-04-06-cancel | Optional: cancel a goal | real CPython solution for optional: cancel a goal | browser-compiled C++ solution for optional: cancel a goal | cancel | current concept |
| session-05-01-odometry | Read the robot pose | real CPython solution for read the robot pose | browser-compiled C++ solution for read the robot pose | pose | callback/sensor workflow |
| session-05-02-heading | Position plus orientation | real CPython solution for position plus orientation | browser-compiled C++ solution for position plus orientation | pose | callback/sensor workflow |
| session-05-03-frames | Which coordinate frame? | real CPython solution for which coordinate frame? | browser-compiled C++ solution for which coordinate frame? | transform | callback/sensor workflow |
| session-05-04-relative | Where is the target relative to me? | real CPython solution for where is the target relative to me? | browser-compiled C++ solution for where is the target relative to me? | relative | callback/sensor workflow |
| session-05-05-goal | Close the loop with TF | real CPython solution for close the loop with tf | browser-compiled C++ solution for close the loop with tf | goal | callback/sensor workflow |
| session-05-06-safety | Goal direction plus obstacle safety | real CPython solution for goal direction plus obstacle safety | browser-compiled C++ solution for goal direction plus obstacle safety | integrated | callback/sensor workflow |
| session-06-01-topic-debug | The robot hears nothing | real CPython solution for the robot hears nothing | browser-compiled C++ solution for the robot hears nothing | avoidance | graph/debugging |
| session-06-02-frame-debug | Correct numbers, wrong frame | real CPython solution for correct numbers, wrong frame | browser-compiled C++ solution for correct numbers, wrong frame | goal | graph/debugging |
| session-06-03-beacon | Final mission: find the red beacon | real CPython solution for final mission: find the red beacon | browser-compiled C++ solution for final mission: find the red beacon | dock | graph/debugging |
| topics-01 | Discover and use /cmd_vel | terminal graph/robot commands | no student C++ in Session 1 | topic_discovered, twist_published, robot_moved | graph discovery |

## Coverage conclusion

The six sessions already include publisher/subscriber communication, the simulator plus a student node, `ros2 node list`, `ros2 topic list`, `ros2 topic echo`, services, parameters, actions, odometry, TF, callbacks, sensor processing and debugging. The missing experience is assembling a package, declaring build/install rules, building and sourcing a workspace, running two independently owned student executables, and launching their configuration. The bridge therefore teaches system integration rather than repeating topic theory.

Session 1 has no student source variant; Sessions 2–6 carry both Python and C++ variants. Python uses Pyodide CPython; C++ uses browser Clang/LLD. Their ROS APIs remain educational shims.
