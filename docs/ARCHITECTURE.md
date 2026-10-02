# Architecture

## Static delivery

Native JavaScript modules, CSS, SVG and JSON. No framework or external runtime dependencies. Build copies an allowlist to dist; relative URLs support project paths. The personal website is separate.

## Runtime

Runtime owns Robot, node/topic endpoint sets and assessment evidence. Runtime.publish validates before mutation; future Python uses this same API. /simulator subscribes to /cmd_vel; /odom and /scan are announced but have no samples. A temporary CLI publisher has exited on completion. Future Python nodes should be registered for their actual lifetime; /student_controller is not falsely listed before creation.

## Simulator

State: x/y/yaw, velocities, remaining hold time and cumulative path distance, in SI units. Exact constant-twist integration uses fixed 1/60 s steps. Each command replaces the previous velocity and lasts two simulated seconds. Hidden-tab time is paused; frame time is capped against large jumps. Speed limits and timeout are teaching-world policies. No collisions or sensors. Camera follows robot; trail history is bounded. Distance is cumulative path length including reverse travel. Rotation alone cannot pass.

## CLI

Explicit grammar, not a shell. Common Humble/Jazzy syntax; publication requires --once. Parser quotes bare flow-mapping keys then uses JSON.parse, never eval. Runtime rejects invalid fields/types, nonzero unsupported axes and out-of-range values. Omitted components default to zero. No full YAML or repeated publishing. Output uses textContent.

## Lessons and checks

JSON requires id/title/description, steps, hints and checks. Loader validates check types and positive distance thresholds. topic_discovered records listing, inspection or valid targeted publication: interaction evidence, not proof of understanding. twist_published requires a valid publication. robot_moved checks cumulative travel. No source matching. Only Lab 01 is implemented.

## UI and reset

Semantic controls, keyboard history, progressive hints and live feedback. Reset restores runtime, hints, terminal/history, trail and feedback. No persistence or Python editor yet. Loading errors disable the lab and show a useful message.

## Future Python bridge

Not implemented. Milestone 2 should use real Pyodide in a cancellable worker, minimal rclpy/Twist shims and Runtime.publish. Reset must reject stale worker messages. CLI and Python share one graph/checker.
