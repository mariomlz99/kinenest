# Wave 3: asynchronous Trigger service clients

Chrome and Firefox each passed **43/43 C++ cases**, covering 11 of the 25 coding
exercises. Session 3.5 now joins the five camera exercises from Wave 2; this is
not complete six-session C++ parity.

The course gate used frozen asset version dc3a1f873605 from the working tree based
on c8a3333. Public-support build 07312ea8a77b is undergoing its separate UI gate;
its pending result must not be inferred from the direct-runtime tests below.

## Service acceptance

| Case | Chrome | Firefox |
| --- | --- | --- |
| 3.5 reference: asynchronous request and response callback | PASS | PASS |
| 3.5 alternate callback structure | PASS | PASS |
| 3.5 client-only negative, without sending a request | Rejected | Rejected |
| Service handler failure preserves its diagnostic | PASS | PASS |
| Stop while a real response is held pending | PASS | PASS |
| Reset while a real response is held pending | PASS | PASS |
| Compiler error followed by corrected service execution | PASS | PASS |

Both valid solutions reset the actual shared robot from x = 2 to x = 0 and
consume the successful response. The negative creates a client endpoint but never
sends a request: the robot remains at x = 2 and the service checker fails.
No source-pattern checking or separate C++ service checker is used.

The error test temporarily makes the existing reset handler throw a controlled
error. The worker reports "Service request failed: Controlled reset service
failure", stops, does not invoke the successful response callback and receives
no false success evidence.

The lifecycle tests hold the real response at the test worker's transport boundary
after the actual service handler runs. They then Stop or Reset, start a fresh
compiled program, and release or simulate a late event from the disposed worker.
The replacement run receives neither stale output nor response evidence.
This is deterministic test-only fault injection; production routing is unchanged.

Each case checks endpoint cleanup and Reset state. The prior String, scan, camera,
retained-image, mailbox, compiler and infinite-loop checks also passed again.

## Compatibility boundary

The API is an educational rclcpp-shaped client for std_srvs::srv::Trigger.
It uses asynchronous callbacks. The callback receives a ready SharedFuture whose
get() returns the response; this does not provide native blocking std::future
or executor semantics. The request returns an identifier, not a blocking wait.

A failed response produces an actionable worker error and stops execution.
Services use the same RuntimeAdapter and physical reset handler as Python.
Native ROS middleware, arbitrary service packages and service-server authoring
remain outside this subset.

## Validation record

~~~bash
npm run test:cpp-course -- chrome --built --wave=3 --output=/tmp/kn-cpp-wave3
npm run test:cpp-course -- firefox --built --wave=3 --output=/tmp/kn-cpp-wave3
~~~

Machine-readable artifacts:

- /tmp/kn-cpp-wave3/chrome-wave-3.json
- /tmp/kn-cpp-wave3/firefox-wave-3.json

Chrome: 10:32:17.822–10:36:00.638 UTC on 4 October 2026.
Firefox: 10:32:17.824–10:36:32.307 UTC.

The relevant Python Session 3 suite passed in both browsers, with logs at
/tmp/kn-wave3-python-session3-chrome.log and the corresponding firefox.log.
The foundation unit run passed 56/56 tests and its production build succeeded.
Ordinary-URL C++ UI validation on public-support asset 07312ea8a77b passed
in Chrome and Firefox: all six Session 3 references, four-scene checks, seven
languages, independent drafts, phone Compare layout, service response and Reset.
Logs: /tmp/kn-wave3-image-ui-{chrome,firefox}.log.

No production deployment, complete parity or Safari validation is claimed.
