# Independent performance review

Reviewed frozen source candidate `5c7d93254d18182f9ee9f095ae895f27c1773962` (coordinator identifies dist `71f28e8ff533`) on 2026-10-04. Evidence/source review only: no browser rerun, application edits or new measurements. CI was still running when this review was requested; this report does not certify CI completion.

**No concrete P0/P1 performance defect found in the reviewed scope.** Existing measurements are accurately qualified. The following are P2 tradeoffs and evidence limitations, not blockers established by these observations.

## Evidence checks

- `WAVE_9_CPP.md` matches `/tmp/kn-cpp-wave9-full/performance-summary.json`: 112/112 per browser, 103 final metric records, 25-reference compile medians 2,493/2,180 ms, first warm loads 120.6/485 ms, 60,347,928 cache bytes and zero downloaded payload on that warm observation. These timing data belong to historical asset `6ad7e489683f`, not the frozen release asset. Concurrent workstation runs are not isolated or student-device benchmarks.
- Beacon arithmetic is correct: 58 × 230,400 = 13,363,200 bytes; 57 inter-frame periods over 6,835/8,435 ms give approximately 1,921,405/1,556,941 B/s. This describes delivered payload cadence, not network bandwidth. Callback timing includes preparation/copy and WASM execution (`src/cpp/worker.js:57`–`69`), so it is not a pure student-function benchmark. The timer ends after the last callback; “first-to-last-frame interval” is an approximate label for this measured worker window.
- Linear-memory sampling is narrowly described correctly. `src/cpp/toolchain.js:24` samples application plus filesystem linear-memory capacity at tool invocation completion; it is not continuous process-peak instrumentation. `src/cpp/worker.js:70` samples program capacity after image callbacks. No total browser/process-memory inference is warranted.
- `CAMERA_STRESS.md` distinguishes the six-second real slow-callback measurements from the synthetic burst test. Reported generated minus processed counts equal replaced pending counts, including final drain, and the post-Stop observation is explicitly bounded in time.

## P2 — repeated Run has a real cached-toolchain cost

`src/cpp/bridge.js:5` creates a fresh worker after stopping the previous one. `src/cpp/worker.js:21` loads the toolchain each run; `src/cpp/toolchain.js:7`–`26` rereads asset buffers, prepares the filesystem and invokes WebAssembly compilation in that worker. Cache Storage avoids the observed 60 MB download but does not eliminate this preparation or source compilation. Cache failures are tolerated, so warm zero-download behavior is conditional on usable storage.

I agree with worker isolation as the current course tradeoff: termination and fresh run state are valuable, and the observed warm preparation plus roughly 2–3 second compilation does not justify a release-time architectural rewrite. I disagree with any interpretation that a warm cache makes repeated C++ Run effectively free. Keep the existing load/compile stages and disclose the measured costs; reconsider reuse only if device evidence makes latency a material problem.

## P2 — bounded mailbox is not a bound on all retained image memory

`src/runtime/mailbox.js:3`–`7` permits one in-flight and one replaceable pending delivery **per subscription**. `src/runtime/adapter.js:74`–`84` uses that mailbox and transfers accepted buffers; Stop terminates the worker and clears it (lines 21–24). However, `src/runtime/graph.js:59` clones each subscriber message before mailbox replacement, so overload still causes transient clone allocation for subsequently discarded frames. `src/cpp/worker.js:59`–`62` copies accepted bytes into WASM storage. No end-to-end zero-copy claim is justified.

The queue bound scales with subscriptions; student-retained Image pointers and browser allocation/collection behavior are outside that queue bound. Constant sampled program capacity during six seconds supports the documented sustained test only, not indefinite retained-image stability. `PERFORMANCE.md` already records this limitation; its historical “Remaining measurements” section would benefit from links to Wave 9 and camera stress so it does not imply those later measurements are still missing.

## P2 — distinguish startup evidence from all worker traffic

`/tmp/kn-parity-final-legacy-{chrome,firefox}.log` show C++ probe/runtime/UI PASS and successful warm-cache reuse. Neither includes a Python-only network/resource assertion, so these logs cannot independently prove zero C++ asset requests for Python sessions. Source supports lazy isolation: `src/runtime/languages.js:2`–`5` dynamically imports the selected adapter, and the C++ worker imports the toolchain only when created. Actual startup assertions exist in `scripts/check-boot.mjs:76`–`77` and `scripts/check-deployed.mjs:28`. Additional evidence reviewed: `/tmp/kn-parity-final-boot-{chrome,firefox}.log` and `/tmp/kn-parity-live-boot-{chrome,firefox}.log` all PASS; the coordinator ties these to final asset `71f28e8ff533`. Together with the check-boot assertion, these support no compiler/runtime preloading in the observed main-document startup resource entries. Main-document Resource Timing is not an exhaustive worker-network trace, and this check does not run a Python program. Lazy adapter/toolchain source inspection strengthens the isolation conclusion. Distinguish initial Python startup from Python execution and from a session that already ran C++; do not generalize these logs into a universal zero-worker-traffic measurement.

Coordinator-reported final local and live-preview passes are relevant release evidence but were not rerun by this reviewer. Historical performance values must retain their own build identity even when final functional parity is green.
