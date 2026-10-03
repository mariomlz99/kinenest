# Architecture

## Static delivery

Native JavaScript modules, CSS, SVG and JSON. No frontend framework. Session 3 loads Pyodide and NumPy only when Python runs. Build publishes an allowlist under a content-versioned asset directory; relative URLs support project paths. The personal website is separate.

## Runtime

Runtime owns Robot, node/topic endpoint sets and assessment evidence. Runtime.publish validates before mutation; CLI and Python use this same API. /simulator subscribes to /cmd_vel; /odom publishes ideal odometry at 5 Hz; /scan produces 36 synthetic range readings at 5 Hz. A temporary CLI publisher exits on completion. Python nodes are registered for their actual lifetime; /student_controller is not falsely listed before creation.

## Simulator

State: x/y/yaw, velocities, remaining hold time and cumulative path distance, in SI units. Exact constant-twist integration uses fixed 1/60 s steps. Each command replaces the previous velocity and lasts two simulated seconds. Hidden-tab time is paused; frame time is capped against large jumps. Speed limits and timeout are teaching-world policies. No collision physics. Synthetic range readings approximate visible targets. Camera follows robot; trail history is bounded. Distance is cumulative path length including reverse travel. Rotation alone cannot pass.

## CLI

Explicit grammar, not a shell. Common Humble/Jazzy syntax; publication supports --once and continuous rates. Parser quotes bare flow-mapping keys then uses JSON.parse, never eval. Runtime rejects invalid fields/types, nonzero unsupported axes and out-of-range values. Omitted components default to zero. No full YAML or DDS emulation. Output uses textContent.

## Lessons and checks

JSON requires id/title/description, steps, hints and checks. Loader validates check types and positive distance thresholds. topic_discovered records listing, inspection or valid targeted publication: interaction evidence, not proof of understanding. twist_published requires a valid publication. robot_moved checks cumulative travel. No source matching. Session 3 adds data-driven camera, perception, service and control checks; see SESSION3.md.

## UI and reset

Semantic controls, keyboard history, progressive hints and live feedback. Reset restores runtime, hints, terminal/history, trail and feedback. Session 3 includes a Python editor; drafts are kept in memory for the current page session. Loading errors disable the lab and show a useful message.

## Python bridge

Implemented for Session 3: real Pyodide in a cancellable worker, NumPy, educational rclpy/Image/Twist/Trigger/CvBridge APIs and Runtime.publish. Generation checks reject stale worker messages. CLI and Python share one graph. See SESSION3.md for protocol and assessment details.

## Shared topic subscriptions and terminal processes

Runtime.subscribe registers a callback and a named subscriber node, returning an idempotent unsubscribe function. Runtime.emit delivers separate message copies, without replay. Runtime.step advances robot physics and emits odometry at deterministic 0.2-second simulation boundaries, including while stationary. The app now advances Runtime.step instead of Robot.step. Odometry contains ROS-shaped header, child_frame_id, PoseWithCovariance and TwistWithCovariance. Timestamps use simulation time, orientation is a quaternion and covariance is zero for the ideal model.

TerminalSession owns command history and at most one foreground command. It delegates one-shot commands to execute, validates command flags and field paths, and manages subscriptions or publication jobs until interrupted or --once completes. Stopping unregisters the subscriber node. The UI creates independent panels without duplicating simulation state. Reset stops sessions before resetting Runtime; captured subscription maps make stale cleanup harmless after reset. No background polling timer is needed per terminal.

Terminals are shared infrastructure for Lab 01 and Session 3. No DDS, QoS negotiation or cross-tab networking is provided.

## CLI compatibility coverage

The installed Jazzy CLI help was used to check basic command families. Nodes, topics, interfaces and services use one shared dispatcher in all labs. Continuous publishers use simulation-clock jobs and register actual publisher nodes. Echo and measurements own subscriptions until stopped; dynamic String/Twist topics disappear when their final endpoint is removed. Measurements use simulated time; bandwidth explicitly reports estimated payload bytes, not a fabricated DDS measurement. Scan is a simple 36-ray model: empty space in Lab 01 and circular approximations of camera targets in Session 3.
