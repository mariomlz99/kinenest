# TF learning unit: baseline audit

Baseline inspected before implementation: KineNest main
`2ae347acc02c98b3cfaa96715ce79c27f1bb78e3` (13 October 2026).
Production `/build-info.json` reports the same commit, built
`2026-10-12T20:24:04.628Z`, asset version `fdd7cb638f68`, clean.
Worker configuration identifies `kinenest`, serving `dist`. No deployment is
part of this candidate. Immutable `legacy-assets/` must remain untouched.

The original `ros2learn` checkout is at
`3b7f0006f241612c5930fad44b9f8fdcbfa9a92f`, with uncommitted Python build work.
This task uses a separate `kinenest-tf` worktree and
`feature/tf-learning-unit`, based on fetched `origin/main`. The original
checkout and standalone ROS 2 Basics Lab are not edited.

## Existing hierarchy (from code, before changes)

```
odom
└── base_link                 dynamic: robot x/y/yaw
    ├── left_wheel_link       dynamic: rolling about y
    ├── right_wheel_link      dynamic: rolling about y
    ├── laser_link            static: (0.12, 0, 0.15) m
    └── camera_link           static: (0.10, 0, 0.50) m
        └── camera_optical_frame  static: q=(-0.5, 0.5, -0.5, 0.5)
```

Wheel origins are `(0, ±0.1225, 0.09)` m. `src/playground/sensors.js`
defines sensor and wheel geometry shared by the existing robot renderers,
ray casting and `src/playground/frames.js` message generation. No frame is
added by this lesson. Optical axes are x right, y down, z forward, unlike
the planar body frame; wheel and optical rotations must not be mislabeled
as planar yaw.

`Playground` integrates the robot at 20 Hz and initially publishes odometry,
dynamic TF, scan and camera at 10 Hz; static TF is transient-local at start.
`resetPose()` initially updates the robot/canvases immediately but leaves
published transforms until the next tick. This temporal mismatch needs a
small correction for a synchronous teaching inspector.

The canonical interface registry already includes
`tf2_msgs/msg/TFMessage`, `geometry_msgs/msg/TransformStamped` and
`PointStamped`. Native Jazzy inspection fixtures cover message formatting
and both TF topics. Existing tests: `playground-frames.test.js`,
`playground.test.js`, `playground-native.test.js`; native capture:
`scripts/capture-playground-native.py`. The latter uses native tf2 to check
composition, but that API does not exist in the browser runtime baseline.

There is no browser TF composition engine, tf2 Buffer/TransformListener in
Python or C++, live tree inspector, or TF lookup command. The old playground
lesson renders a static explanatory tree. The new unit will use live
publications and will not change that existing exercise.

## Implementation boundary

One publication-derived transform store, owned by `Runtime`, composes and
inverts the existing transforms. The lesson visualizer and both worker
languages use it. Latest transforms only: no historical cache, interpolation
or navigation. The spatial view is an orthographic top view with projected
axes, including an explicit explanation for optical/wheel axes.

The new unit is separate from the seven released Basics units, the existing
playground and Free Lab. It keeps an isolated workspace/session scope and
does not change their progress semantics. Coding checks require evidence
from the current installed student executable, not text matching or output.

## Terminal investigation

The baseline already handles `\x01`, `\x05`, Home and End in
`TerminalView.input()`. Its xterm custom handler only intercepts copy/interrupt
and suspend. Diagnosis must exercise real browser key events and xterm
rendered cursor state, especially exact wrap boundaries, before patching.
See the terminal regression evidence for the reproduced cause and results.
