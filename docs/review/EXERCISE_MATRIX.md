# Exercise inventory

Frozen source: `8679ae1`. 26 exercises: one CLI lab in Session 1 and 25 Python exercises. Public executable C++ covers 2.1 and 2.4. All reference paths passed built-site Chrome and Firefox in the baseline rerun. This table records baseline coverage, not a claim that every adversarial variant has been executed.

Checks are runtime evidence predicates, not source matching. `Empty` means Check on a fresh/reset exercise, not a comprehensive negative-program suite. Session 3 lacks uniform empty-program checks in its current harness. Mobile risk refers to editing/observation demands; no real phone has been tested.

| Session | Exercise ID | Title / concept | Python | C++ | Checker | Sensors | Services / actions / TF | Alternate present | Negative control | Reference | Browser tested | Mobile risk / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `topics-01` | Discover and use /cmd_vel | CLI only | no | topic_discovered, twist_published, robot_moved | — | — | — | CLI failures | `tests/browser.html` | Chrome + Firefox | medium: CLI entry |
| 2 | `session-02-01-subscriber` | Your first subscriber | yes | public | subscriber | LiDAR | — | — | Empty | `tests/python/course/session-02-01-subscriber.py` | Chrome + Firefox | medium: code + sensor context |
| 2 | `session-02-02-callbacks` | Callbacks are reactions | yes | no | subscriber, chatter, timer | LiDAR | — | — | Empty | `tests/python/course/session-02-02-callbacks.py` | Chrome + Firefox | medium: code + sensor context |
| 2 | `session-02-03-sectors` | Process LiDAR sectors | yes | no | sectors | LiDAR | — | NumPy sectors | Empty | `tests/python/course/session-02-03-sectors.py` | Chrome + Firefox | medium: code + sensor context |
| 2 | `session-02-04-avoidance` | React to an obstacle | yes | public | avoidance | LiDAR | — | — | Empty | `tests/python/course/session-02-04-avoidance.py` | Chrome + Firefox | medium: code + sensor context |
| 3 | `session-03-01-camera-subscriber` | Camera subscriber | yes | no | camera_subscriber, dimensions | camera | — | — | not per-exercise | `tests/python/solution-1.py` | Chrome + Firefox | medium: code + sensor context |
| 3 | `session-03-02-image-data` | Images are data | yes | no | camera_subscriber, image_array, image_stats | camera | — | — | not per-exercise | `tests/python/solution-2.py` | Chrome + Firefox | medium: code + sensor context |
| 3 | `session-03-03-color-detection` | Detect red pixels | yes | no | camera_subscriber, image_array, detection | camera | — | — | hard-coded detector | `tests/python/solution-3.py` | Chrome + Firefox | medium: code + sensor context |
| 3 | `session-03-04-object-position` | Left, center, or right? | yes | no | camera_subscriber, image_array, position | camera | — | class + cv2 | not per-exercise | `tests/python/solution-4.py` | Chrome + Firefox | medium: code + sensor context |
| 3 | `session-03-05-services` | Call a service | yes | no | service | — | service | — | not per-exercise | `tests/python/solution-5.py` | Chrome + Firefox | medium: code + sensor context |
| 3 | `session-03-06-target-challenge` | Find the target | yes | no | camera_subscriber, image_array, control, centered | camera | — | — | runaway Stop/reset | `tests/python/solution-6.py` | Chrome + Firefox | high: edit + live observation |
| 4 | `session-04-01-configure` | Configure your node | yes | no | configured | — | parameters | — | Empty | `tests/python/course/session-04-01-configure.py` | Chrome + Firefox | medium: code + sensor context |
| 4 | `session-04-02-tuning` | Tune without restarting | yes | no | parameter, timer | — | parameters | — | Empty | `tests/python/course/session-04-02-tuning.py` | Chrome + Firefox | medium: code + sensor context |
| 4 | `session-04-03-custom` | Publish a custom message | yes | no | custom | — | TargetInfo | — | Empty | `tests/python/course/session-04-03-custom.py` | Chrome + Firefox | medium: code + sensor context |
| 4 | `session-04-04-goal` | Send an action goal | yes | no | action_result | — | DriveDistance | — | Empty | `tests/python/course/session-04-04-goal.py` | Chrome + Firefox | medium: code + sensor context |
| 4 | `session-04-05-feedback` | Follow action feedback | yes | no | action | — | DriveDistance | — | Empty | `tests/python/course/session-04-05-feedback.py` | Chrome + Firefox | medium: code + sensor context |
| 4 | `session-04-06-cancel` | Optional: cancel a goal | yes | no | cancel | — | DriveDistance | — | Empty | `tests/python/course/session-04-06-cancel.py` | Chrome + Firefox | medium: code + sensor context |
| 5 | `session-05-01-odometry` | Read the robot pose | yes | no | pose | odom | — | — | Empty | `tests/python/course/session-05-01-odometry.py` | Chrome + Firefox | medium: code + sensor context |
| 5 | `session-05-02-heading` | Position plus orientation | yes | no | pose | odom | — | — | Empty | `tests/python/course/session-05-02-heading.py` | Chrome + Firefox | medium: code + sensor context |
| 5 | `session-05-03-frames` | Which coordinate frame? | yes | no | transform | — | TF | — | Empty | `tests/python/course/session-05-03-frames.py` | Chrome + Firefox | medium: code + sensor context |
| 5 | `session-05-04-relative` | Where is the target relative to me? | yes | no | relative | — | TF | — | Empty | `tests/python/course/session-05-04-relative.py` | Chrome + Firefox | medium: code + sensor context |
| 5 | `session-05-05-goal` | Close the loop with TF | yes | no | goal | — | TF | — | Empty | `tests/python/course/session-05-05-goal.py` | Chrome + Firefox | high: edit + live observation |
| 5 | `session-05-06-safety` | Goal direction plus obstacle safety | yes | no | integrated | LiDAR | TF | — | Empty | `tests/python/course/session-05-06-safety.py` | Chrome + Firefox | high: edit + live observation |
| 6 | `session-06-01-topic-debug` | The robot hears nothing | yes | no | avoidance | LiDAR | — | — | Empty | `tests/python/course/session-06-01-topic-debug.py` | Chrome + Firefox | high: edit + live observation |
| 6 | `session-06-02-frame-debug` | Correct numbers, wrong frame | yes | no | goal | — | TF | — | Empty | `tests/python/course/session-06-02-frame-debug.py` | Chrome + Firefox | high: edit + live observation |
| 6 | `session-06-03-beacon` | Final mission: find the red beacon | yes | no | dock | LiDAR, camera | — | — | Empty | `tests/python/course/session-06-03-beacon.py` | Chrome + Firefox | high: edit + live observation |
