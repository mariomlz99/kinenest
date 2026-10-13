# TF feature: adversarial review

Reviewed 14 October 2026. Scope: KineNest only. No merge or deployment.

- Authoritative main / merge base: `2ae347acc02c98b3cfaa96715ce79c27f1bb78e3`.
- Starting feature: `7ee23518b138cec2a931ef3823ac309924d7b770`.
- Branch: `feature/tf-learning-unit`.
- Validated product asset version: `55a05f586af1`.
- The original checkout's local `main` remains at `3b7f0006f241612c5930fad44b9f8fdcbfa9a92f`; comparison uses fetched `origin/main`, preserving unrelated uncommitted work.
- Current production remains main above, asset version `fdd7cb638f68`.

## Architecture and semantics

```
Playground robot integration + canonical sensor/wheel geometry
  -> dynamicTransforms / staticTransforms
  -> Runtime.publish('/tf' / '/tf_static')
  -> Runtime.tf: one publication-derived TransformStore
       -> lookup / inverse / composition / transformPoint
       -> versioned worker snapshots -> Python / C++ Buffer operations
       -> tfViewModel -> live tree, spatial positions, inspector, target
       -> verified worker evidence + current installed program -> checker
```

Workers mirror transform publications, not robot state. The visualizer stores
selection and zoom preferences, not an independent pose. Updates are asynchronous;
a worker may observe an earlier published revision until its next callback. The
checker verifies the revision actually observed.

Actual hierarchy, discovered in message generation and confirmed at runtime:

```
odom
└── base_link                  dynamic: robot pose
    ├── laser_link             static: (0.12, 0, 0.15) m
    ├── camera_link            static: (0.10, 0, 0.50) m
    │   └── camera_optical_frame  static optical orientation
    ├── left_wheel_link        dynamic: rolling orientation
    └── right_wheel_link       dynamic: rolling orientation
```

Wheel origins stay at `(0, ±0.1225, 0.09)` relative to the body. Their rotations
change as the wheels roll, so labeling these transforms dynamic is intentional.
The camera optical rotation is `(-0.5, 0.5, -0.5, 0.5)` in quaternion x/y/z/w.
No decorative frames were added.

`lookup_transform(target, source, Time())` and C++ `lookupTransform(target,
source, tf2::TimePointZero)` express the source frame in target coordinates.
Inspector controls explicitly say **Reference · target** and **Frame · source**,
then “Pose of source in target.” Both directions, same-frame identity, inverse,
multihop, full optical orientation and the fixed odom target agree numerically.
Yaw is used only for planar rotations; optical/wheel projections are explained.

The tree includes disconnected components. Their unavailable spatial/inspector
relationships fail clearly; invalid selections fall back after frame removal.
Invalid numeric values, empty/self-parent names and cycles are rejected atomically.
Repeated child entries produce one current edge, not duplicate displayed nodes.
Frame strings are rendered as text, including HTML-like adversarial names.

## Reproduced defects and fixes

| Severity | Reproduction and root cause | Smallest fix and regression |
| --- | --- | --- |
| BLOCKER | A Python program created a listener but performed no lookup, then submitted a copied static transform through `emit_json`. Exact-value validation alone accepted forged checker evidence. | Per-run proof held privately by the transform client; reject missing/wrong proof and old revisions. Real installed Python attack now fails; alternative Python/C++ implementations pass. Unit coverage also tests proof replay after a new run. |
| BLOCKER | A clean candidate lacked the latest production immutable asset directory. `/assets/fdd7cb638f68/src/cpp/worker.js` would be unavailable to already-open production tabs after deployment. | Archive all 115 current production files without altering older archives. Downloaded production files were byte-identical to the archive. SHA-256 manifest and built-artifact regression pin every file. |
| MAJOR | Destroying a temporary C++ listener disabled a still-live listener sharing the same buffer. Buffer tracked a boolean. | Reference-count listener lifetimes; disallow listener copying. Browser and native probes create/destroy a temporary listener before using the surviving listener. |
| MAJOR | All four resize-while-editing cases failed in both engines. Xterm does not reflow its active cursor line; resizing alone left an incorrect editable region. Very tall commands also attempted cursor-up into scrollback. | Flush pending writes; erase with the old width; fit and redraw; queue input during the fit. Bound the editing viewport for commands taller than the terminal while preserving the complete submitted command. 28 width/resize cases per engine now pass. |
| MAJOR | A finite `(1000, -1000)` pose generated 21,425 grid lines and approximately 66 ms of synchronous drawing; larger values could stall the UI. | Adaptive, disclosed square size bounds grid work. Same pose produces 13 lines, approximately 1.4 ms in the final run. Unrenderable `1e308` coordinates show a clear range message. |
| MINOR | “From · reference / To · frame” could be read in the opposite direction from the API. Numerical semantics were already correct. | Use explicit target/source labels; verify identity, forward and reverse selections. |
| MINOR | New lesson/visualizer prose stayed English in the other six supported languages. | Register the TF dictionary through existing i18n, including accessible labels. Keep frame/API identifiers unchanged; load the dictionary with the lab, not the homepage. Seven-language, five-width checks pass. |

Total: **2 BLOCKER, 3 MAJOR, 2 MINOR**, fixed. No remaining reproduced product
issue from this review.

Three test-harness corrections are separate from product defects: editor
acceptance now honors `LAB_URL`; the autosave race test resolves versioned module
paths; completion derives its expected interface count from the canonical
registry (149), instead of accepting only 147/148. Both initially failing checks
passed after these corrections against the same unchanged product assets.

## TF numerical and language evidence

- **512 seeded, genuinely distinct poses**: positive/negative positions, arbitrary
  yaw, ±π boundaries and independently varied wheel rotations. Independent
  planar equations check body/sensor/wheel origins, inverse reconstruction,
  four world points per pose and unchanged static transforms.
- **11 poses × 2 actual browser languages**: static, dynamic, multihop, inverse,
  same-frame and optical lookups plus the world target. Programs print observed
  values; assertions compare them with an independent analytical oracle.
- **11 poses × 2 native Jazzy languages**: the same probe sources compile/run
  unchanged with real `Buffer`/`TransformListener`. Browser/native values agree,
  including the optical frame and point conversion. Quaternion `q` and `-q`
  are treated as the same orientation.
- Internal geometry uses absolute tolerance **1e-10**; printed browser/native
  probes use **1e-9**, allowing decimal formatting and floating-point rounding.
  This is a claim about the tested latest-transform subset, not all of tf2.
- Original lesson sources also passed native validation. Browser coverage includes
  starter failures, unknown frames, missing startup transforms, movement,
  resets, Stop, error recovery, rerun and alternative implementations.
- Actual Python/C++ checker attacks reject print-only programs, copied coordinates,
  listener-without-lookup and the wrong pair. Python additionally reproduces the
  forged bridge-result attack. Unit tests reject terminal-owned evidence,
  missing listeners, wrong target points, stale runs and post-Reset evidence.
- Both beginner walkthroughs use visible starters, instructions and hints, editing
  through the code editor. They never reveal or import reference solutions.

Official sources used for API/ordering review:
[Jazzy Python listener tutorial](https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Intermediate/Tf2/Writing-A-Tf2-Listener-Py.rst),
[Jazzy Python Buffer interface](https://github.com/ros2/geometry2/blob/jazzy/tf2_ros_py/tf2_ros/buffer_interface.py),
and installed Jazzy C++ headers. The documentation site rejected automated
access; its official repository sources were used instead.

## Terminal evidence

Controlled reproduction serves the original main `TerminalView` to the same
keyboard test without modifying production or the repository baseline. It fails
12 of 28 Chrome cases and 13 of 28 Firefox cases. The incoming control characters
and logical cursor already worked: xterm delayed its exact-width wrap, while
redraw assumed the cursor had advanced to the next row. This could erase earlier
output. The original feature fix explicitly realizes that wrap; this review
additionally corrects resize and viewport-overflow handling.

Final real-keyboard coverage in **Chrome 141.0.7390.107** and **Firefox 155.0**:

- Ctrl+A/E and Home/End, insert at start/middle/end, Left/Right, Backspace, Delete.
- Ctrl+U/K/W preserve the correct remaining text.
- Four container widths; one/two terminal rows at exact boundaries and ±1
  characters; four shrink/grow transitions; commands taller than the viewport.
- Logical line/cursor, rendered xterm content/cursor, preserved previous output,
  full submitted command and history agree.
- Ctrl+C copies selected terminal text and otherwise cancels/interrupts;
  Ctrl+Shift+C, Ctrl+Z, history and completion also pass.
- Terminal Ctrl+A does not select the page; outside-terminal Ctrl+A retains its
  normal behavior. Optional translated Keyboard help passes.

**28/28 torture cases per engine**, plus the complete shortcut regression.
Headed Chrome also passed all 28. The headed Firefox window was manually closed
by the user after 25 passing cases; this is recorded as an interrupted run,
not a failure or complete pass. Both engines subsequently completed in background
mode. Original nano/editor and paginated-completion acceptance also pass.

## Lifecycle, UI and performance

- **55 TF cycles**: enter, start, move, run installed Python lookup, select frame,
  reset pose, stop, navigate away. After each exit: zero live workers, processes,
  runtime nodes/endpoints, TF listeners, jobs, evidence, frames and overlays.
- Cached session infrastructure stayed stable at five intervals/seven observers;
  DOM/listener counts stayed stable after garbage collection (307 event
  listeners). Final heap was about 101 MB, without monotonic growth.
- **55 mixed-runtime cycles** independently cover Python/C++ workers, callbacks
  and teardown. Free Lab passes 20 robot start/stop cycles per language.
- Course ↔ TF ↔ playground drafts and workspaces stay isolated. Python/C++ draft
  preservation follows existing shared-workspace rules; reload, new tab,
  Back/Forward and TF-only reset pass. Navigation does not revive processes.
- Widths **1920, 1440, 1366, 820 and 320 px**, all **seven languages**, no horizontal
  page overflow. Tree keyboard selection, selectors, live inspector, focus,
  light/dark screenshots and text-safe frame names checked.
- Final visualizer update median about **0.9 ms**, p95 **2.7 ms** over 2,898 updates.
  Local measurements are diagnostic, not a device-independent performance SLA.
- Three fresh-profile main/candidate comparisons: homepage request count remains
  eight; transferred resource bodies increase by **2,660 bytes**. Lab resource
  bodies increase about 123 KB (approximately 0.43%). No eager C++ compiler/worker
  or Python WASM on initial entry; a Python-only runtime suite also proves no C++
  toolchain loading. TF first view measured 156–200 ms locally.

## Final regression run

**170 unit tests**, installation-source consistency, build, immutable-asset
verification and **32 browser/integration runs** pass. Product assets tested:
`55a05f586af1`; later report/test-harness commits do not change them.

Coverage includes real Python/C++ build/runtime, seven released Basics units,
custom messages, parameters, services, launch, Actions, all modeled interface
bindings, playground exercises, Free Lab, camera/LiDAR/odometry feedback,
installed C++ programs, binary message transport, endpoint cleanup, compiler
failure recovery, editors, completions, layout, autosave races, Python-only
loading, language transitions, TF and terminal suites.

Evidence is retained locally under `artifacts/review/`:

- `final-results.json`: consolidated 32-run result; original harness failures
  and their successful reruns are retained, not erased.
- `unit-final-full.log`, `build-final.log`, `native-review.json`, `runtime-numerics.json`.
- `checker-attacks-before.json`, `checker-attacks.json`.
- `terminal-wrap-old.json`, `terminal-wrap-before.json`, `terminal-wrap.json`.
- `ui-stress.json`, `session.json`, `loading.json`, `legacy.log`.
- Screenshots: `artifacts/tf/visualizer-mount.png`,
  `artifacts/tf/visualizer-target.png`, `artifacts/review/responsive-*.png`.

CI now runs the independent TF review and terminal torture regressions, plus the
production-asset manifest check. Native Jazzy validation remains a separate local
check requiring an installed ROS environment.

## Intentional boundaries and verdicts

Latest transforms only; no historical cache, interpolation, blocking waits,
listener threads, navigation or 3D renderer. C++ lookup errors stop the process
clearly, and the following run is clean. Checker evidence validates supported
learner execution, not arbitrary modification of the browser runtime.

- TF FEATURE SEMANTICALLY CORRECT: **YES**
- TF VISUALIZER CONSISTENT WITH RUNTIME: **YES**
- PYTHON TF PATH READY: **YES**
- C++ TF PATH READY: **YES**
- TERMINAL SHORTCUT FIX ROBUST: **YES**
- EXISTING KINENEST REGRESSION CLEAN: **YES**
- FEATURE READY TO MERGE: **YES**

Review-ready only. Maintainer approval is still required before merge or
production publication. The standalone ROS 2 Basics Lab was not changed.
