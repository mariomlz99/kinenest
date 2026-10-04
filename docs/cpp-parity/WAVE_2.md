# Wave 2: camera data, perception and visual control

The real C++ course runner passed **36/36 cases in Chrome and Firefox** on
4 October 2026. This covers 10 of the 25 coding exercises, not complete C++ parity.

The tested production assets were version 4e3c9a0ec047, built from the Wave 2
working tree based on 953dbc3. The working tree contained uncommitted image
implementation changes; the base commit alone does not contain Wave 2.
The build timestamp was not retained. A later build, b9a2c4f2485f, enabled the five
new public language variants. Its ordinary-URL UI tests subsequently passed in
both browsers, including natural image-field logging and language controls.

## Exercise acceptance

| Exercise | Reference Chrome / Firefox | Negative control | Alternate Chrome / Firefox |
| --- | --- | --- | --- |
| 3.1 Camera subscriber | PASS / PASS | Printing without reading dimensions rejected | Not needed |
| 3.2 Image buffers and pixel indexing | PASS / PASS | Zero channel means rejected | PASS / PASS |
| 3.3 Red detection | PASS / PASS | Constant visible report rejected | PASS / PASS |
| 3.4 Target centroid | PASS / PASS | Constant center-coordinate report rejected | PASS / PASS |
| 3.6 Visual centering | PASS / PASS | Publishing on the wrong control topic rejected | PASS / PASS |

All five Wave 1 references, their negative controls and three alternates also
passed. Session 3.5 service clients remain outside this wave.

Detection and centroid tests use four actual rendered camera scenes: a red target
left, near center and right, followed by a blue target with no red detection.
Each scene runs for 1.5 simulated seconds with robot motion suppressed, matching
the application's perception-check procedure. Reports are checked against actual
pixels by the shared checker. Python-specific NumPy syntax is not imposed on C++.

## Transport and lifecycle evidence

Images cross the shared adapter as transferable binary bytes. Each 320 × 240
RGB frame contains exactly 230,400 bytes. The worker copies those bytes into owned
C++ image storage; no JSON integer array is used.

Six bursts of 20 images each processed the active image and the newest waiting
image: 12 processed frames and 108 replaced frames overall. The mailbox never
exceeded one active and one pending frame. The newest frame arrived after every
batch.

A retained-image test kept an old Image shared pointer and read only that old
buffer during newer callbacks. The old buffer remained usable, but its reads did
not count as current-frame processing or satisfy perception evidence.
A real compiler-error recovery test rejected an incorrect Image field, then
compiled and ran corrected source without a page reload.

Every scenario checked Stop endpoint cleanup and Reset evidence, mailbox, sample
and pending-state cleanup. Wave 1 String edge cases, non-finite Twist diagnostics,
compiler recovery and infinite-loop termination were rerun.

The burst test proves bounded latest-sample behavior under deliberate overload.
Its callback durations were short; it does **not** establish a sustained callback
exceeding the normal 125 ms camera period. See [performance](PERFORMANCE.md).

## Harness failure and correction

The initial runs stopped with "Unknown course check: camera_subscriber".
Legacy Session 3 lesson JSON does not contain a session property. The new runner
incorrectly used that property to select the course checker instead of the
perception checker.

The runner now derives the session from the explicit exercise ID when needed,
and skips course observation for Session 3, matching the application. No production
checker was weakened or changed for this failure. Both complete runs were repeated
successfully against the same frozen assets.

## Reproduction and artifacts

~~~bash
npm run test:cpp-course -- chrome --built --wave=2 --output=/tmp/kn-cpp-wave2
npm run test:cpp-course -- firefox --built --wave=2 --output=/tmp/kn-cpp-wave2
~~~

Machine-readable results from this run:

- /tmp/kn-cpp-wave2-harness-fixed/chrome-wave-2.json
- /tmp/kn-cpp-wave2-harness-fixed/firefox-wave-2.json

Chrome ran from 10:21:06.056 to 10:24:19.768 UTC.
Firefox ran from 10:21:06.056 to 10:24:50.648 UTC.
Each artifact records compilation, execution, expected and observed evidence,
checker outcome, duration, available compiler metrics and Stop/Reset results.

Public UI logs are /tmp/kn-wave2-image-ui-chrome.log and the corresponding
firefox.log. Separate Python gates are recorded by the release coordinator.
This report does not claim production deployment, Safari validation or complete
course parity.
