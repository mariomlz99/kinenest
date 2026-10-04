# Sustained slow C++ camera callbacks

Chrome and Firefox PASS against frozen production assets fa5ed7191581 (original sustained measurement) and 6ad7e489683f (Wave 9 rerun with mid-callback Stop). The measurements below are separate runs, not pooled samples. Both use actual slow WASM callbacks; the earlier synthetic 120-frame burst test is a different test.

## Method

The browser really compiles tests/cpp/camera-stress.cpp and runs it through CppBridge. Each Image callback reads pixels, then performs a volatile unsigned-arithmetic loop. A live integer parameter adjusts loop iterations until the worker's measured callback time is 200–700 ms. There is no fake worker delay, source matching, or unsupported clock_time_get call.

After calibration, the real runtime advances by 125 ms every 125 ms of wall time for six seconds, generating camera messages through its ordinary sensor pipeline. The harness counts actual mailbox replacement and callback completions, then stops generation and waits for the newest frame to drain. The callback workload stays unchanged during measurement.

## Original sustained measurement — fa5ed7191581

These two tests ran sequentially to limit contention with other browser validation.

| Metric | Chrome | Firefox |
|---|---:|---:|
| Generation interval | 125 ms | 125 ms |
| Measured generation duration | 6,001 ms | 6,000 ms |
| Generated frames | 48 | 47 |
| Processed frames, including final drain | 20 | 19 |
| Replaced pending frames | 28 | 28 |
| Median callback duration | 319.6 ms | 320 ms |
| Maximum callback duration | 339.2 ms | 330 ms |
| Maximum in-flight / pending | 1 / 1 | 1 / 1 |
| WASM linear memory, every sample | 1,376,256 bytes | 1,376,256 bytes |
| Memory samples | 20 | 19 |
| Calibrated loop iterations | 75,183,554 | 73,669,065 |

Both browsers processed the newest generated frame after generation stopped. Generated minus processed exactly matched replaced pending frames. Stop removed the C++ node; Reset left the worker and queues empty.

## Wave 9 measurement and mid-callback Stop — 6ad7e489683f

Both extended browser runs completed with PASS. This table records the new six-second measurement and does not replace the earlier results above.

| Metric | Chrome | Firefox |
|---|---:|---:|
| Generation interval | 125 ms | 125 ms |
| Measured generation duration | 6,001 ms | 6,000 ms |
| Generated frames | 48 | 47 |
| Processed frames, including final drain | 20 | 20 |
| Replaced pending frames | 28 | 27 |
| Median callback duration | 318.1 ms | 319 ms |
| Maximum callback duration | 329.3 ms | 326 ms |
| Maximum in-flight / pending | 1 / 1 | 1 / 1 |
| WASM linear memory, every sample | 1,376,256 bytes | 1,376,256 bytes |
| Memory samples | 20 | 20 |
| Calibrated loop iterations | 74,526,929 | 73,142,857 |
| Newest drained frame ID | 52 | 51 |
| Interrupted in-flight frame ID | 53 | 52 |
| Discarded waiting frame ID | 54 | 53 |
| Observation after Stop | 1,260 ms | 1,276 ms |

After draining the sustained workload, the harness offered one more real camera frame with the same calibrated loop. Following a 100 ms wait, it asserted that the callback was still incomplete: the processed-frame metric and callback evidence were unchanged, and one frame remained in flight. It offered a second real frame, confirmed one pending latest sample, then called Stop while the first callback was still running. No delay was inserted into the worker.

During the observation interval after Stop, the runtime generated ten more real camera samples. Both browsers retained an empty worker/mailbox, no student node, no publishers/subscribers, no timers and no student parameter binding or update listener. Neither interrupted nor pending frame produced a processed record. Callback counts, historical reports, output and status did not change. The recorded result was `noLateEvidence: true` in both browsers. Stop preserves existing exercise evidence for inspection; this test requires that no new evidence arrives after disposal.

Reset then cleared the runtime's camera exercise evidence. A real rerun compiled the same source again, confirmed cleared per-run report/processed history, and processed one fresh image using the original short 500,000-iteration workload. Its callback count was exactly one and pixel-access evidence was present. A final Stop and Reset cleared the callback evidence and registrations again.

Captured logs: /tmp/kn-wave9-camera-chrome.log and /tmp/kn-wave9-camera-firefox.log. The harness emits separate METRICS and MID_CALLBACK_STOP records before its final PASS.

## Interpretation and limits

Callbacks genuinely took more than one 125 ms camera period. The application retained only one in-flight frame and one replaceable pending frame instead of accumulating stale sensor work. The final newest frame drained successfully. WASM linear memory remained exactly constant over the sustained interval.

This measures six seconds on this workstation, not a classroom-wide performance guarantee. WASM linear memory is not total browser/process memory. The test does not claim a one-period end-to-end latency when student computation itself lasts approximately 320 ms; it establishes bounded backlog and replacement of stale waiting samples. Background CPU load can change calibration and timings. No calibration failure or harness correction was needed in these runs.

## Reproduction

After building dist/:

```bash
node scripts/check-browser.mjs chrome --suite=cpp-camera-stress --built
node scripts/check-browser.mjs firefox --suite=cpp-camera-stress --built
```

Harness: tests/cpp-camera-stress.html. Source: tests/cpp/camera-stress.cpp. Captured log: /tmp/kn-wave6-camera-stress.log.
