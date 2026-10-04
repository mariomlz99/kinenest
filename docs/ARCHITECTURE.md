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

Scalar parameters are stored per node and sent to its worker when CLI updates occur. The node reads its current value in callbacks. /drive_distance_server implements a bounded single-active-goal DriveDistance server. Physical distance drives feedback/results; actual Twist commands appear on /cmd_vel. Collision aborts, cancellation stops, reset cancels. The worker receives asynchronous goal, feedback and result events. Python and C++ consume the same action events. Notification closures are pinned to their originating worker; terminal request IDs are removed before delivery. Completed records release notification/disposer closures, and only the newest 100 terminal goals remain for inspection. This is not a general executor/action-server framework.

## TF

The published tree is world → odom → base_link, base_link → laser_link/camera_link, world → target. The Python Buffer and educational C++ tf2_ros::Buffer compose/invert received transforms. Only latest planar transforms are supported, all sent periodically on /tf. There is no TF history, interpolation or /tf_static durability simulation. The visual tree is drawn from the same published state.

## Lessons and checking

Session catalogs and JSON lessons specify text/translations, starter code, checks, initial pose, optional rectangular world, camera targets and goal. Session 1 retains its original loader/checker. Perception checks use actual pixels and varied scenes. Course checks use callback/data access, computed reports, parameter reads/command changes, accepted goals/results, TF queries, motion, stop duration and collision counts. Reports communicate computed values without forcing a particular algorithm. These are formative, client-side checks, not secure proof of understanding.

## CLI and lifecycle

An explicit parser supports the documented ROS subset; it is not a shell or full YAML parser. TerminalSession owns one foreground publisher, echo, measurement or action goal. Stop/Close/Reset dispose its resources. Measurements use simulated time; bw reports estimated payload bytes rather than DDS traffic. All text output is escaped through textContent and bounded.

## Spatial transforms and disclosure

The TF inspector, spatial axes and SVG hierarchy use src/ui/tf-model.js and the published edges from runtime/course.js. The shared lookup composes those edges, as both language buffers do; there is no separate visual pose model. Spatial labels retain actual origins, including distinct camera/laser mounts and coincident world/odom frames. Sensor offsets rotate with base_link. Numeric data attributes support browser assertions without exporting application runtime globals.

Session 5 defaults to world/base_link/target; exercise 5.3 selects base_link/laser_link. Source and target selectors follow lookup_transform(target_frame, source_frame) semantics. The dashed vector always connects base_link to the target. Panel disclosure follows session focus; it does not remove graph endpoints or CLI capabilities.

## Sensor mounting and capture time

src/simulator/sensors.js is the shared mounting configuration: laser_link at (+0.20, 0) m, camera_link at (+0.10, 0) m, both forward-facing. The 0.18 m circular footprint encloses the camera; the laser projects slightly forward on the nose. Projection, ray origins, TF, world markers and inspectors use these mounts. Camera and scan samples are generated after pose integration with the current simulation timestamp. TF is emitted at each sensor capture before its sample. The displayed LiDAR rays use the scan’s captured origin, not a later robot pose. Reset clears samples and queued callbacks.

## Execution adapters and drafts

RuntimeAdapter owns graph endpoints, sensor mailboxes, parameters/actions, evidence and cleanup. PythonBridge supplies a Pyodide worker; the experimental C++ adapter supplies a compiled WebAssembly worker. Both use the same typed event protocol and runtime. Checkers count code publications and processed samples, independently of the execution language.

Lessons now use programming.python/cpp with supported, starterCode and an optional experimental flag. World, task, ID and checks stay shared. DraftStore keeps separate code per exercise and language. Compare renders the actual editable drafts; switching views or UI language does not restart execution. Public availability is enabled per exercise only after its Chrome and Firefox acceptance passes; CPP.md records the current branch matrix. Future supported variants can remain gated by ?experimentalCpp=1; unsupported variants never expose execution. Unsupported exercises fall back to Python without deleting the C++ draft.

## Experimental C++ and navigation

The C++ adapter compiles a single translation unit through a pinned WebAssembly Clang/LLD worker, then supplies explicit kinenest imports for endpoint events, publishing and callback dispatch. LaserScan arrays cross the shared latest-sample mailbox and are copied into module memory for each callback. Image payloads use a transferred Uint8Array and one copy into a message-owned WASM vector; they are never serialized as JSON integer arrays. Small messages use deterministic typed fields with strict own-property traversal. Trigger requests use request IDs and asynchronous response dispatch; callbacks see an already-completed response object, not a blocking future. Parameter updates are pinned to the active worker and node; typed reads reject invalid narrowing. Odometry and TF decode the same nested published messages used by Python. TF carries latest planar edge snapshots, with no time history. The real compiler and C++ algorithms run locally. Toolchain assets are lazy and cached separately; see CPP.md for limits, measurements and provenance.

Shared transitions use the compact supplied logo, native CSS and sessionStorage no-repeat selection. Eligible internal links prevent default navigation and show one 850 ms animation within a deliberate 1,000 ms outgoing dwell. Reduced motion navigates immediately. Duplicate clicks retain the first destination; pagehide/pageshow, navigation exceptions and a five-second safety deadline clear overlays. Destination pages do not add another dwell. A separate inline indicator follows actual runtime loading/compilation stages. Reduced motion disables rotational effects.

## Lazy language host and build diagnostics

ExecutionHost loads adapter constructors from a registry and owns cancellation during asynchronous loading. It calls the existing run/stop methods; worker diagnostics and prepare/compile stages remain adapter-specific. RuntimeAdapter still owns endpoints, mailboxes and checking evidence. Adding a third adapter requires registering its factory and supported lesson variants, not duplicating the robot or checker. No Rust adapter or UI exists.

Every production build writes build-info.json with Git commit, build time, asset version and dirty-worktree status. About shows the deployed identity and currently loaded asset version. Source previews can report unavailable metadata. The production smoke command requires an expected commit and rejects an older deployment before exercising it.

Parameter fidelity: the educational runtime validates scalar JavaScript types. It does not distinguish native ROS integer and double parameter types; numeric values share one number type. Native ROS parameter descriptors, ranges and type rules are outside this subset.

## Static page readiness and navigation

Every public HTML file contains the same generated first-paint shell from
`src/ui/page-shell.js`. Run `npm run sync:shell` after changing that shell or
the shared brand/navigation markup. The build applies the same idempotent
generator, and unit tests detect stale source shells.

A tiny synchronous head script reads the existing `ros2learn-theme` and
`ros2learn-language` preferences before styles paint. The opaque, fixed boot
cover exists in HTML; it does not depend on application modules arriving.
Content remains hidden while its real dimensions can still be measured.

Page entry calls `pageReady()` only after branding, saved layout, initial
translation, lesson shell, controls and the first visual render are installed.
The shared ready handler waits for the compact icons to decode and two
animation frames, then reveals the page with a 160 ms fade. It never waits for
Pyodide, NumPy or the C++ compiler. Those stay lazy.

Internal navigation retains the five outgoing animations and approximately
1000 ms dwell. The destination adds no artificial dwell. Reduced motion skips
the outgoing delay and incoming animation while retaining first-paint coverage.
History restoration clears stale covers. A failed initialization produces an
actionable reload view; a 10-second watchdog handles modules that never arrive.
Without JavaScript, the cover stays hidden and a noscript explanation remains.

The welcome page lives at `/` and `index.html`; Session 1 lives at
`session-01.html`. Session detection uses explicit session paths. Brand links
return to the welcome page, and course navigation includes all six sessions.
