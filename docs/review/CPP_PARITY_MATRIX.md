# C++ course parity matrix

Independent reviewer: cpp_curriculum. Frozen candidate8679ae1. Review based on coordinator-provided compatibility/worker/lesson snapshots after child filesystem tools stalled. No independent execution by this reviewer; coordinator baseline and production tests pass both public exercises in Chrome and Firefox. Estimates are design judgments, not delivery promises; shared foundations must not be counted once per row.

Current executable support is Twist publication, LaserScan callbacks, timers/logger and node lifecycle. Shared RuntimeAdapter already supplies services/parameters/actions/TF primitives, but C++ typed classes, worker dispatch and async lifetimes do not. READY means feasible with current API, not publicly validated unless explicitly marked.

| Exercise | Shared concept / Python objective | Natural C++ API | Status | Runtime/adapter gap | Compiler/sysroot | Checker reuse | Approx lines | Incremental effort | Priority |
|---|---|---|---|---|---|---|---|---|---|
| 2.1 | Scan callback | create_subscription<LaserScan>; ranges | READY / public | None | Existing | Yes | 20–35 | maintenance | Preserve |
| 2.2 | Callback state + String timer | create_subscription<LaserScan/String>; create_publisher<String>; create_wall_timer | SMALL GAP | String class, publisher serializer, typed inbound dispatch | std::string only | Yes; state propagation needs stronger evidence | 45–75 | 1–3 days | Next |
| 2.3 | Angular sectors | LaserScan angles; educational report_sectors | SMALL GAP | Current-sample report bridge | cmath | Yes, numeric tolerances | 35–60 | 1–2 days | Next |
| 2.4 | Reactive avoidance | LaserScan + Publisher<Twist> | READY / public | None | Existing | Yes | 35–65 | maintenance | Preserve |
| 3.1 | Image dimensions | Subscription<Image> | MEDIUM GAP | Image/header/byte storage, worker ingress, dimension access | vector<uint8_t> | Yes after equivalent instrumentation | 25–40 | 3–5 days shared foundation | Later |
| 3.2 | Image data / NumPy | RGB stride-aware accumulation | DEFER exact NumPy parity | Image + statistics report; language-specific objective | No OpenCV needed | Statistics yes; NumPy objective no | 40–65 | 1–2 days after Image | Design first |
| 3.3 | Red detection | RGB threshold loop + report_detection | MEDIUM GAP | Image + frame-associated report | Integer arithmetic | Yes varied scenes | 45–75 | 1–3 days after Image | Later |
| 3.4 | Centroid | sum_x/count + report_detection | MEDIUM GAP | Image + centroid report | Standard arithmetic | Yes ±8 pixel tolerance | 50–85 | 1–2 days after 3.3 | Later |
| 3.5 | Service request/response | Client<Trigger>; async_send_request | MEDIUM GAP | Request/response types, IDs, async callback/future facade | No blocking thread assumptions | Yes | 30–55 | 3–6 days foundation | Later |
| 3.6 | Visual centering | Image callback + Twist | MEDIUM GAP | Image/perception foundation | No new library | Yes | 55–90 | 1–3 days after perception | Later |
| 4.1 | Parameters | declare_parameter<double>; get_parameter().as_double | MEDIUM GAP | Typed value class, declare/read bridge, host synchronization | Standard scalar container | Yes, improve command provenance | 30–50 | 3–5 days foundation | Later |
| 4.2 | Live tuning | Read synchronized value each timer | MEDIUM GAP | Host→worker parameter update, type rejection, stale invalidation | Existing event loop | Yes | 35–60 | 1–3 days after 4.1 | Later |
| 4.3 | Custom message | Publisher<TargetInfo> | MEDIUM GAP | Struct/header + generic serializer traits + validation | Generated-like local header; no fake generator | Yes with topic evidence | 30–50 | 2–4 days | Later |
| 4.4 | Action goal/result | rclcpp_action::create_client<DriveDistance>; async_send_goal | LARGE GAP | Goal/result/handle types, accept/reject/result dispatch | Callback-based; futures need lifecycle validation | Yes actual robot result | 50–85 | 5–8 days foundation | Later |
| 4.5 | Action feedback | SendGoalOptions.feedback_callback | LARGE GAP | Per-goal feedback dispatch + consumption evidence | No extra dependency expected | Yes | 60–100 | 2–3 days after 4.4 | Later |
| 4.6 | Optional cancellation | async_cancel_goal(handle) | LARGE GAP | Cancel request/response + terminal-state races | Event-driven only | Yes stop and final result | 65–110 | 2–4 days after actions | Optional |
| 5.1 | Odometry pose | Subscription<Odometry>; report_pose | MEDIUM GAP | Nested pose/twist/quaternion types, ingress, sample report | Standard structs, no Eigen | Yes | 35–55 | 3–5 days foundation | Later |
| 5.2 | Quaternion yaw | tf2::getYaw or planar formula | MEDIUM GAP (small after 5.1) | Odometry + helper header | cmath | Yes wrapped yaw | 35–60 | 1–2 days after 5.1 | Later |
| 5.3 | Sensor frame | Buffer.lookupTransform(odom,laser_link,TimePointZero) | LARGE GAP | TransformStamped, listener/snapshot, lookup evidence, exceptions | Planar math; no Eigen | Yes same runtime geometry | 40–70 | 4–7 days foundation | Later |
| 5.4 | Relative target | lookupTransform(base_link,target,...) | LARGE GAP (medium after TF) | TF foundation + report_relative | Existing math | Yes | 40–70 | 1–2 days after TF | Later |
| 5.5 | Goal control | Timer + TF + bounded Twist | LARGE GAP (medium after TF) | TF callback-safe availability | Existing math | Yes | 55–90 | 2–3 days after TF | Later |
| 5.6 | Goal + scan safety | TF timer + latest scan state | LARGE GAP (medium after TF) | TF + sensor freshness policy | Existing math | Yes | 75–120 | 2–4 days after 5.5 | Later |
| 6.1 | Wrong topic debugging | Existing scan + Twist controller | READY / NOT enabled | Starter/reference/negative/dual-browser acceptance | Existing | Yes | 35–65 | 1–2 days content/testing | After Session 2 |
| 6.2 | Wrong TF reference | TF controller with wrong target frame | LARGE GAP (medium after TF) | TF foundation + fault starter | Existing math | Yes; allow equivalent manual conversion | 55–90 | 1–2 days after TF | Later |
| 6.3 | Beacon docking | Image/scan state + Twist timer | LARGE GAP | Image foundation + freshness coordination + detection evidence | Byte processing; no native OpenCV | Yes after checker hardening | 90–150 | 3–5 days after prerequisites | Last |

## Implementation structure

Use a Node subclass owning its subscriptions, publishers, timers and clients; retain handles. For 2.2 the timer publishes the latest forward range as String on /chatter, and a String subscriber observes it. It does not need a Twist publisher. For 4.1/4.2 preserve the actual lesson parameter name speed and default0.2. For 6.2 the shipped defect requests odom rather than base_link; it is not simply swapped arguments. These clarify inaccuracies in the initial reviewer sketches.

Image processing: validate rgb8, use row step, accumulate channel sums or red-pixel count/sum_x, and associate reports with the current frame. Service clients should use asynchronous request callbacks. Action clients should separately handle goal acceptance, feedback, result and cancellation. TF should expose latest planar transforms and explicit lookup exceptions, using the shared edges. Educational report helpers belong in a KineNest namespace, never rclcpp.

## Browser and mobile implications

All C++ starts retain the existing ~60.35MB first toolchain cost; keep it lazy and explain it before Run. Services/actions add lifecycle complexity rather than large data. A320×240 RGB image is230,400bytes, ~1.84MB/s at8Hz for one payload copy; avoid JSON pixel arrays and unbounded queues. Use binary ingress/latest-sample delivery and measure actual memory before enabling Image publicly. Longer C++ nodes should stack in Compare on phones. No real-phone performance is established.

## Sequencing and disagreements

Preserve2.1/2.4; next String dispatch and sample-associated sector reports, then6.1. Implement typed message transport before adding superficial headers. Image statistics can share an outcome with Python, but a C++ loop is not a NumPy lesson: define language-specific objectives for3.2. Async services, parameters, TF and actions need separate lifecycle acceptance. Do not add all APIs merely for parity badges. Desktop simultaneous views help lecturers; mobile stacking is appropriate, but universal single-pane tabs would hide cause and effect. No unsupported C++ execution was enabled.
