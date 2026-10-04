# Independent ROS semantics review

- Candidate: frozen SHA `5c7d93254d18182f9ee9f095ae895f27c1773962`; final asset identity supplied by coordinator: `71f28e8ff533`.
- Scope: read-only inspection of compatibility header, runtime adapter/course/graph, worker bridge, representative reference/lifecycle/TF programs, release contract, session HTML and translation rows. No build, unit suite, browser execution, deployment or application edits performed by this reviewer.
- Existing coordinator evidence: C++ 112/112 scenarios in each browser on asset `6ad7e489683f`, Python 18 suites per browser. These are supplied results, not independently rerun results. Final identity was supplied, not independently rebuilt here.
- Working tree already contained changes to `scripts/check-live-course.mjs` and untracked media when inspected. They were not touched.

## Verdict

No concrete P0/P1 ROS-semantic blocker found. The supported teaching paths preserve the relevant callback, service, action, odometry and planar TF concepts. This is approval of the declared educational subset, not native ROS equivalence or an exhaustive ownership proof.

## ROS-01 — Timer clock boundary should be explicit at native transfer

- Severity / priority: low / P3, documentation follow-up; not a release blocker.
- Evidence: `src/cpp/compat.hpp:399` exposes `create_wall_timer`; `src/runtime/adapter.js:42` schedules through the simulator; `src/runtime/graph.js:22` limits periods to 0.05–60 seconds and `src/runtime/graph.js:79` advances jobs with simulation slices. `docs/CPP.md` describes chrono timers and an educational executor but does not spell out this timing boundary.
- Reproduction: static trace: creating a 100 ms timer registers a simulator job, and callback eligibility advances only when runtime simulation steps advance. A 10 ms period is rejected by the runtime. No fresh browser reproduction was performed.
- Impact: learners transferring the same method name may assume a wall/steady-clock cadence and unrestricted native timer periods. Existing course timing remains coherent because sensors, robot and jobs share simulation time.
- Suggested fix / risk: add one sentence to the compatibility/native-transfer explanation identifying simulation-clock scheduling and supported period limits. Low risk; do not replace the shared simulator clock as part of release review.
- Confidence: high in source behavior; inferred learner impact. This is a disclosed-subset refinement, not evidence of failing exercises.

## Verified by inspection

| Area | Evidence | Assessment and limits |
| --- | --- | --- |
| Callback lifetime | `src/cpp/compat.hpp:308`, `:314`, `:405`, `:412`, `:415`, `:417`, `:439`, `:642` | Subscription/timer teardown removes callback entries; dispatch owns a callable copy during self-removal; spin retains its node. Stop kills the worker and host cleanup removes node endpoints/jobs. Unspun multi-node/executor equivalence is not claimed or independently tested. |
| Trigger service | `src/cpp/compat.hpp:265`, `:278`, `:279`, `:437`; `src/runtime/adapter.js:64`; `tests/cpp/course/session-03-05-services.cpp:12` | Request sends asynchronously through the worker; callback receives a completed response wrapper; pending entries are removed before callback execution. Lack of blocking futures and service discovery waits is explicitly documented. |
| Parameters | `src/cpp/compat.hpp:318`–`:363`, `:378`–`:388`; `src/runtime/course.js:35`–`:43` | Scalar type checks, safe-integer declarations, narrowing overflow checks and live updates are present. Integer/double collapse, absent descriptors and no native parameter callbacks are accepted scope limits, not native fidelity. |
| Actions | `src/cpp/compat.hpp:545`–`:629`; `src/runtime/adapter.js:51`–`:59`; `src/runtime/course.js:45`–`:64`; `tests/cpp/action-lifecycle.cpp:15`–`:28` | Acceptance is asynchronous; rejection delivers null and removes the goal; feedback and result are separate callbacks; cancellation requests remain alive if terminal result arrives first; client disposal invalidates callbacks. Goal handles/request IDs, immediate cancellation physics and synchronous retained-terminal cancellation are intentional simplified behavior. Native client callback signatures and acceptance/null convention agree with the official source below. |
| Odometry | `src/runtime/graph.js:63`–`:67`; `src/cpp/compat.hpp:124`–`:132` | Pose has the odom parent and base child; linear body-x/angular body-z twist agrees with the child-frame convention. Covariance omission is explicit. |
| Quaternion / TF | `src/cpp/compat.hpp:140`–`:145`, `:453`–`:480`; `src/runtime/course.js:19`–`:32`; `tests/cpp/tf-numerical.cpp:9`–`:14` | Yaw formulas match upstream including the documented pitch-singularity convention. Traversal composes source-to-target coordinate transforms; output header=target, child=source. Inverse translation includes rotation. Latest planar snapshots, no history/interpolation, no durable static transport and fail-fast instead of native exceptions are accurately scoped. TF numerical test source covers all 36 directed frame pairs; its fresh execution was not performed here. |
| Native transfer | `session-02.html:12`, `session-03.html:17`, `session-04.html:18`, `session-05.html:12`, `session-06.html:12`; `src/ui/locales.js:8`–`:11` | Native package/dependency/build/run route and checker-helper distinction are present in English and six translation rows (NL/FR/ES/DE/PT/IT). Presence and technical identifiers checked; this is not a professional linguistic validation. |

## Disagreement / release tradeoffs

I would disagree with making native DDS, QoS discovery, full message allocator types, catchable tf2 exceptions, wall-clock executors or action UUID/future parity a release gate: the contract deliberately excludes them and the tested teaching tasks do not require them. Conversely, browser execution success alone does not prove native transfer; the timer naming caveat remains worth documenting. A C++ ownership reviewer may demand broader multi-node/destructor stress; this review does not convert the supplied single-worker course evidence into that guarantee. An educator may prefer more transfer scaffolding; the existing seven-language native-package notes are sufficient to avoid claiming these headers are native rclcpp. These positions are explicit tradeoffs, not an averaged consensus or a claim that another reviewer raised them.

## Primary-source checks

Official docs.ros.org pages were access-blocked. Official ROS GitHub source was used instead:

- [ROS 2 nav_msgs Odometry definition](https://raw.githubusercontent.com/ros2/common_interfaces/jazzy/nav_msgs/msg/Odometry.msg): establishes pose parent-frame and twist child-frame conventions.
- [ROS 2 rclcpp_action Jazzy client](https://raw.githubusercontent.com/ros2/rclcpp/jazzy/rclcpp_action/include/rclcpp_action/client.hpp): confirms distinct goal-response, feedback, result and cancel callback types, including null rejected handles.
- [ROS 2 geometry2 upstream yaw implementation](https://raw.githubusercontent.com/ros2/geometry2/rolling/tf2/include/tf2/impl/utils.hpp): confirms the normalized pitch-sine branch and yaw formulas used in this header. Rolling source was inspected; no claim of a complete Jazzy binary conformance test.
