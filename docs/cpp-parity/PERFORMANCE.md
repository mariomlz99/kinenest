# C++ parity performance measurements

Measured on the Ubuntu maintainer workstation on 4 October 2026. Chrome and
Firefox ran concurrently in clean browser profiles. Wave 2 used production asset
version 4e3c9a0ec047 from the working tree based on 953dbc3.

These are local observations, not browser-wide guarantees.
Network, scheduling and hardware affect results.

## Compiler and course runner

| Measurement | Chrome | Firefox |
| --- | ---: | ---: |
| Cold toolchain download | 60,347,928 B | 60,347,928 B |
| Cold toolchain loading | 1.761 s | 2.294 s |
| First warm toolchain loading | 0.114 s | 0.529 s |
| First warm toolchain download | 0 B | 0 B |
| Compile median across 32 cases with metrics | 1.864 s | 1.468 s |
| Largest generated module in these cases | 346,953 B | 346,953 B |
| Largest sampled compiler/filesystem linear memory | 65,142,784 B | 65,142,784 B |
| Complete Wave 2 runner, 36 cases | 193.712 s | 224.592 s |

Cold means a fresh browser profile. Warm means a subsequent worker run in that
profile, with 60,347,928 bytes read from Cache Storage. Failed-value and runaway
cases can terminate before publishing metrics; the compile median includes only
the 32 cases that reported them. It is not a median over every compiler attempt.

The compiler-memory metric samples WebAssembly linear-memory allocations,
including the toolchain filesystem. It is **not total browser memory**, a process
peak or a measure of JS objects, compiled code and browser overhead.
Program memory below is separate from compiler memory.

## Camera processing

The simulator produces RGB images at 320 × 240 and a nominal 8 Hz in simulated
time: 230,400 payload bytes per frame, or 1,843,200 B/s before copies. Every accepted
camera case verified the exact binary byte count.

Source inspection establishes a host-side subscriber clone, transfer of its
ArrayBuffer to the worker, and a copy into WASM-owned image storage. Browser
internal copies were not instrumented; no zero-copy end-to-end claim is made.

| Reference | Frames Chrome / Firefox | Mean callback Chrome / Firefox | Maximum callback Chrome / Firefox |
| --- | ---: | ---: | ---: |
| 3.1 Dimensions | 3 / 3 | 1.13 / 0.67 ms | 2.4 / 1 ms |
| 3.2 RGB channel means | 3 / 3 | 7.50 / 17.67 ms | 9.5 / 20 ms |
| 3.3 Red detection | 48 / 48 | 2.75 / 9.60 ms | 6.4 / 18 ms |
| 3.4 Centroid | 48 / 48 | 2.64 / 7.27 ms | 7.2 / 19 ms |
| 3.6 Visual control | 26 / 26 | 3.44 / 6.73 ms | 6.1 / 15 ms |

The first two callback measurements are short samples. The 48-frame detection
runs transferred 11,059,200 payload bytes per browser. Their recorded worker
windows were 5.630 s in Chrome and 7.184 s in Firefox. These windows begin with
the first frame and differ from the number of simulated camera periods, so
dividing all payload bytes by that window is not a precise sustained 8 Hz
bandwidth measurement. The harness's fixed-step timer can run ahead of or behind
wall time under scheduling load.

All camera reference cases reported 1,376,256 bytes of program linear memory.
This is a sampled WASM capacity, not total worker memory or a JS heap measurement.
Host-to-callback scheduling latency was not independently instrumented.

## Bounded overload and retained images

Six same-turn bursts of 20 frames tested queue replacement independently of
machine speed.

| Measurement | Chrome | Firefox |
| --- | ---: | ---: |
| Frames generated | 120 | 120 |
| Frames processed | 12 | 12 |
| Waiting frames replaced | 108 | 108 |
| Maximum active / pending per subscription | 1 / 1 | 1 / 1 |
| Processed payload | 2,764,800 B | 2,764,800 B |
| Burst test wall duration | 386 ms | 405 ms |
| Observed payload / test wall duration | 7.17 MB/s | 6.83 MB/s |
| Largest callback | 4.3 ms | 5 ms |
| Program linear memory, all six samples | 1,376,256 B | 1,376,256 B |

MB/s uses decimal bytes. This is a short synthetic burst ratio, **not** normal
camera bandwidth, sustained capacity or a claim about long-running slow callbacks.
The test verified newest-frame delivery and no memory-capacity growth across
the six batches. Retaining one old Image shared pointer was also tested; reading
it did not create access evidence for a newer frame.

## Remaining measurements

The historical Wave 2 measurements above are superseded for full-course scope by
[WAVE_9_CPP.md](WAVE_9_CPP.md) and [the retained JSON results](results/performance-summary.json).
Actual slow-callback, bounded-queue and mid-callback Stop measurements are in
[CAMERA_STRESS.md](CAMERA_STRESS.md). Build identities and measurement limits
remain explicit; these are not physical-phone benchmarks.

Still unmeasured here: total process memory, long-duration retained-image growth,
physical phone memory pressure, Safari, and end-to-end sensor scheduling latency.
The no-C++-download Python path remains an independent startup acceptance gate.

Raw results: /tmp/kn-cpp-wave2-harness-fixed/{chrome,firefox}-wave-2.json.
