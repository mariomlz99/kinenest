# Sustained slow C++ camera callbacks

Chrome and Firefox PASS against frozen production asset fa5ed7191581. Tests ran sequentially to limit contention with other browser validation. This is a distinct measurement from the earlier synthetic 120-frame burst test.

## Method

The browser really compiles tests/cpp/camera-stress.cpp and runs it through CppBridge. Each Image callback reads pixels, then performs a volatile unsigned-arithmetic loop. A live integer parameter adjusts loop iterations until the worker's measured callback time is 200–700 ms. There is no fake worker delay, source matching, or unsupported clock_time_get call.

After calibration, the real runtime advances by 125 ms every 125 ms of wall time for six seconds, generating camera messages through its ordinary sensor pipeline. The harness counts actual mailbox replacement and callback completions, then stops generation and waits for the newest frame to drain. The callback workload stays unchanged during measurement.

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
