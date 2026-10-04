# Independent C++ expert review

Reviewed commit: `5c7d93254d18182f9ee9f095ae895f27c1773962`. Review is read-only for application code. No P0 or P1 finding established. Two P2 findings follow; neither is an observed failure of a shipped reference solution.

## Findings

### CPP-01 — P2: endpoint destruction leaves stale graph membership

- **Observation:** Publisher has no unregistering destructor; service-client destruction removes C++ pending callbacks only; action-client disposal clears its C++ registries only. The host graph removes their membership on node destruction/Stop, not handle destruction. Subscription destruction does have an explicit unregister message, making the difference especially surprising.
- **Evidence:** `src/cpp/compat.hpp:278`, `src/cpp/compat.hpp:291–308`, `src/cpp/compat.hpp:604–608`; `src/runtime/adapter.js:11–18`, `src/runtime/adapter.js:40`, `src/runtime/adapter.js:52`, `src/runtime/adapter.js:64`.
- **Reproduction to run:** Keep a node alive; create a String publisher in a nested scope, leave that scope, then inspect its topic. Similarly reset a Trigger/action client shared pointer while retaining the node. Source predicts publisher/client graph entries remain until node teardown. This reproduction was not executed in this review.
- **Impact:** Students investigating RAII and graph endpoints see a publisher/client that no longer exists in their C++ program. Stop/Reset cleanup still removes these entries.
- **Proposed fix:** Assign endpoint IDs and unregister on destruction, retaining node membership until the last endpoint of that kind/topic is gone. Alternatively state this ownership limitation explicitly in the compatibility contract.
- **Fix risk:** Medium: naive node-based deletion would remove another live endpoint on the same topic.
- **Confidence:** High in the source-level mismatch; browser manifestation not independently reproduced. Nonblocking for the demonstrated exercise solutions.

### CPP-02 — P2: service/action-only callbacks have no execution timeout

- **Observation:** The initial executing watchdog is cleared by ready. Sensor and timer dispatch arm a watchdog, but service responses and action events do not. An action/service callback that loops forever in a program without sensors/timers can remain running indefinitely.
- **Evidence:** `src/cpp/worker.js:73–82`; `src/runtime/adapter.js:34–35`, `src/runtime/adapter.js:43`, `src/runtime/adapter.js:53–70`, `src/runtime/adapter.js:81`.
- **Reproduction to run:** Create a Trigger client, request `/reset_robot`, and enter `while (true) {}` in its response callback; retain the node and spin, with no sensor subscription/timer. Wait longer than the five-second callback budget. Repeat in an action feedback/result callback. Source predicts no automatic timeout. These reproductions were not executed.
- **Impact:** The error remains recoverable by manual Stop, which terminates the worker. The automatic runaway protection differs by callback type, including the action-only starter pattern used in Session 4.
- **Proposed fix:** Track service/action callback dispatch/completion with the same bounded execution watchdog used for sensor/timer callbacks.
- **Fix risk:** Medium: account for queued events and asynchronous action duration so the watchdog measures callback execution, not the whole goal.
- **Confidence:** High in missing timeout coverage; runtime symptom not independently reproduced. Nonblocking given responsive manual Stop.

## Expert assessment and tradeoffs

The implementation executes real C++17 with ordinary classes, lambdas, shared ownership, STL algorithms and chrono durations. No student-source rewriting was found. Message payloads are decoded through typed field imports, strings use length-delimited UTF-8, finite publication/report values are checked, and image bytes become message-owned vector storage. Dispatch copies/moves callable registry entries before student code, protecting registry removal during callbacks. Action state uses weak ownership and handles rejected/terminal goals explicitly.

I accept a pinned older compiler and fresh worker per Run for this experimental browser course: isolation and straightforward Stop are useful benefits. I would not call this native ROS API parity. The documentation appropriately discloses missing threads, exceptions, package builds, native futures/UUIDs and full TF history. Native porting needs explicit changes to those APIs.

I disagree with treating tracked buffers as completely ordinary vectors: they support the documented access/copy/reference operations, but generic template deduction and unimplemented mutators remain different. This is disclosed, so it is a teaching tradeoff rather than a release blocker. Similarly, throwing out of `spin` is an understandable browser executor mechanism, but teaching post-spin cleanup or repeated spin requires a separate native example because those statements never resume here. A passing formative checker is not a security claim; exposed tracking hooks are correctly documented as inspectable.

All 25 public C++ starter strings were read. They use supported header paths and look syntactically coherent; their TODOs leave scaffolding rather than deliberate undefined identifiers. No starter compile error was established. I did not compile them, so this is not a 25-starter compile acceptance claim. The reference/alternate file inventory and release evidence were inspected, not independently rerun.

Stop/Reset architecture is sound at the reviewed boundary: a fresh worker is created per Run, old-worker messages are ignored, termination interrupts synchronous WASM, and adapter cleanup clears endpoints/mailboxes/goals and commands zero velocity. The two findings above concern in-run lifetime/timeout fidelity, not a demonstrated Stop escape.

## Evidence limits and readiness

Read: `docs/CPP.md`, `docs/CPP_PARITY_RELEASE.md`, all four requested C++ implementation files, `src/cpp/protocol.js`, shared `src/runtime/adapter.js`, and all 25 lesson starter strings. Exact HEAD was independently checked. No build, unit suite, browser run, native compiler probe, application edit, push or merge was performed. Reported 112/112 Chrome/Firefox acceptance and full Python passes are supplied project evidence on predecessor asset `6ad7e489683f`, not new measurements by this reviewer; frozen final asset `71f28e8ff533` was supplied by the coordinating reviewer and not independently hashed.

**Readiness:** no C++-expert blocker established for the explicitly experimental, documented course subset. Conditional support for candidate review/preview, with CPP-01/02 tracked and exact final-build/browser/maintainer gates completed by the release owner. This review does not approve production deployment or assert arbitrary natural C++/native ROS compatibility.
