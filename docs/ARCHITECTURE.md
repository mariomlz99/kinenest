# Architecture

## Static delivery and UI

Native JavaScript modules, CSS, Canvas/SVG and JSON. Seven static entry pages reuse the workstation UI for Sessions 2–6. GitHub Pages serves an allowlisted dist with content-versioned src/public directories. All module, lesson and worker URLs remain relative to those directories. Reference answers/tests are excluded.

The preferences module switches light/dark, split/stacked layout and EN/NL/FR/ES/DE/PT/IT. JSON carries translated lesson titles/descriptions/steps/hints. Shared UI translations are separate from code. Language changes do not reset the simulator or modify Python. Code drafts stay in memory per lesson; preferences alone use localStorage.

## Runtime and geometry

Runtime owns the graph, Robot, simulation time, event listeners and evidence. CLI and Python call the same validated publication/service/parameter/action APIs. Sensor endpoints exist only when enabled. Dynamic message topics are typed and removed when no endpoints remain. Node lifetimes follow Python/terminal lifetimes.

Fixed-step (maximum 1/60 s) exact constant-twist integration drives x/y/yaw. Valid axes are linear.x and angular.z. Commands have a two-second watchdog. Camera renders 320 × 240 RGB at 8 Hz. LaserScan uses 120 deterministic ray/AABB intersections at 5 Hz; laser_link is 0.2 m ahead of the robot. A 0.18 m circular footprint collision guard rejects intersecting translation and records a contact. There is no dynamics, friction or rigid-body engine. Odometry has valid quaternions and zero covariance in this ideal model.

## Python and bounded transport

A dedicated worker loads pinned Pyodide 0.28.3 and NumPy 2.2.5. NumPy downloads have bounded retries. Python modules are educational definitions executed by actual CPython. Typed subscriptions receive image bytes or nested ROS-shaped objects. Sensor queues allow one in-flight callback and one replaceable latest sample per subscription; acknowledgements deliver the newest waiting sample. Timers allow one in-flight callback. Watchdogs stop long-running initial code/callbacks. Stop terminates the worker, cleans graph endpoints/jobs/goals, and invalidates stale messages. Hidden-tab time pauses.

spin yields to worker events; statements after spin do not resume. Node subclasses and functional callbacks both work. Camera bridge returns genuine ndarray values. LaserScan access is tracked for formative evidence. No regex interpretation or source matching is used. The optional cv2 layer implements only inRange/countNonZero/moments.

## Course services, parameters and actions

/reset_robot (Trigger) cancels motion goals and resets pose while preserving subscriptions. Full lab Reset also clears graph/evidence and restores the lesson world; starter code is restored only by its explicit button.

Scalar parameters are stored per node and sent to its worker when CLI updates occur. The node reads its current value in callbacks. /drive_distance_server implements a bounded single-active-goal DriveDistance server. Physical distance drives feedback/results; actual Twist commands appear on /cmd_vel. Collision aborts, cancellation stops, reset cancels. The worker receives asynchronous goal, feedback and result events. This is not a general executor/action-server framework.

## TF

The published tree is world → odom → base_link, base_link → laser_link/camera_link, world → target. The Python Buffer composes/inverts received transforms. Only latest planar transforms are supported, all sent periodically on /tf. There is no TF history, interpolation or /tf_static durability simulation. The visual tree is drawn from the same published state.

## Lessons and checking

Session catalogs and JSON lessons specify text/translations, starter code, checks, initial pose, optional rectangular world, camera targets and goal. Session 1 retains its original loader/checker. Perception checks use actual pixels and varied scenes. Course checks use callback/data access, computed reports, parameter reads/command changes, accepted goals/results, TF queries, motion, stop duration and collision counts. Reports communicate computed values without forcing a particular algorithm. These are formative, client-side checks, not secure proof of understanding.

## CLI and lifecycle

An explicit parser supports the documented ROS subset; it is not a shell or full YAML parser. TerminalSession owns one foreground publisher, echo, measurement or action goal. Stop/Close/Reset dispose its resources. Measurements use simulated time; bw reports estimated payload bytes rather than DDS traffic. All text output is escaped through textContent and bounded.

## Spatial transforms and disclosure

The TF inspector, spatial axes and SVG hierarchy use src/ui/tf-model.js and the published edges from runtime/course.js. The shared lookup composes those edges, as Python Buffer does; there is no separate visual pose model. Spatial labels retain actual origins, including distinct camera/laser mounts and coincident world/odom frames. Sensor offsets rotate with base_link. Numeric data attributes support browser assertions without exporting application runtime globals.

Session 5 defaults to world/base_link/target; exercise 5.3 selects base_link/laser_link. Source and target selectors follow lookup_transform(target_frame, source_frame) semantics. The dashed vector always connects base_link to the target. Panel disclosure follows session focus; it does not remove graph endpoints or CLI capabilities.

## Sensor mounting and capture time

src/simulator/sensors.js is the shared mounting configuration: laser_link at (+0.20, 0) m, camera_link at (+0.10, 0) m, both forward-facing. The 0.18 m circular footprint encloses the camera; the laser projects slightly forward on the nose. Projection, ray origins, TF, world markers and inspectors use these mounts. Camera and scan samples are generated after pose integration with the current simulation timestamp. TF is emitted at each sensor capture before its sample. The displayed LiDAR rays use the scan’s captured origin, not a later robot pose. Reset clears samples and queued callbacks.
