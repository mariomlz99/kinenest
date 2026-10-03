# Course scope: six sessions of 90 minutes

The course teaches the ROS 2 mental model through browser experiments. Sessions 1 and 2 are introductory. Avoid turning the syllabus into a survey of every robotics tool. RViz, Gazebo, middleware internals, deep learning and deployment infrastructure are not required.

| Session | Focus | Teaching outcome | Implementation status |
| --- | --- | --- | --- |
| 1 | Graph, CLI, cmd_vel | Discover nodes/topics, publish a Twist, observe the robot and echo messages in another terminal | Implemented |
| 2 | Callbacks, LiDAR, pub/sub | Explain a callback and react to a simple range measurement | Planned; introductory |
| 3 | Camera, data processing, services | Process image pixels, compute a detection and use request/response | Six exercises implemented |
| 4 | Parameters, interfaces, actions | Configure behaviour, inspect data contracts and distinguish long-running goals from services | Future work |
| 5 | Odometry, TF, integrated control | Relate reported motion and reference frames to a simple controller | Future work; odometry exists as infrastructure |
| 6 | Proposed: integrated challenge and debugging | Combine previous ideas and explain/debug the system | Proposal for lecturer approval; no new major concept |

## General 90-minute rhythm

Use roughly 15 minutes for explanation and demonstration, 55 minutes for guided practice, 15 minutes for an integrated task, and 5 minutes for discussion. Adjust to the group; progressive hints and extension tasks should absorb differences in pace. Available commands are a reference, not a requirement to teach every flag.

## Session 3 pacing

- 10 minutes: camera topics, message dimensions and callback demonstration.
- 10 minutes: exercise 3.1, receive images.
- 10 minutes: exercise 3.2, array shape and RGB channel means.
- 15 minutes: exercise 3.3, colour detection.
- 10 minutes: exercise 3.4, centroid and left/center/right.
- 15 minutes: exercise 3.5, service request and response.
- 15 minutes: exercise 3.6, target-centering challenge; extension if the class needs more time on fundamentals.
- 5 minutes: discussion and connection to the next session.

The core path uses NumPy. cv2 helpers are optional alternatives, not a second computer-vision syllabus. Student-created service servers, complex executor/future behaviour and ROS action servers are deferred. A brief service example can introduce call_async and its completion callback without a deep concurrency lecture.

## Teaching and assessment boundaries

Keep explanations honest about the simulator. Practice checks accept different algorithms and source structures, but are not a secure grading mechanism. Students can inspect the static client and public source repository. Assess understanding through a fresh task, explanation or debugging discussion when needed. Do not add tracking/accounts solely for this short course.

The next implementation priority is a focused Session 2 after lecturer review of the current material, followed by Sessions 4 and 5. The presence of supporting odometry or range data does not mean the corresponding future lesson is already authored.

## Scope beyond this course

The project may grow beyond these six sessions later. Finish the core course and gather classroom feedback before adding a broader curriculum or infrastructure. Keep reusable lesson data and runtime modules without implementing speculative features.
