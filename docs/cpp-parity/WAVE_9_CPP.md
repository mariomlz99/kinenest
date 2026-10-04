# Wave 9 — full C++ course acceptance

Tested production asset: `6ad7e489683f`, built at `2026-10-04T11:47:37.003Z` from dirty candidate based on `e282d52f555a4b3521c390a3903cef4bbfb54879`. This identifies the tested application files; it is not a claim that the final release commit or a deployed preview was tested.

## Results

**Chrome: 112/112 passed. Firefox: 112/112 passed.** Both execute all 25 coding exercise references with real browser Clang/WASM, the shared RuntimeAdapter and the existing language-neutral behavioral checkers.

| Coverage per browser | Cases |
| --- | ---: |
| References | 25 |
| Negative controls | 25 |
| Alternate solutions | 19 |
| API, diagnostics and integration scenarios | 42 |
| Infinite-loop and Stop-during-load scenario | 1 |
| Total | 112 |

Session coverage is 4/4 in Session 2, 6/6 in Session 3, 6/6 in Session 4, 6/6 in Session 5 and 3/3 in Session 6. Session 1 remains language-neutral. Each scenario checks Stop/Reset cleanup of workers, graph endpoints, sensor mailboxes, timers, parameter/action listeners, pending goals and evidence.

The additional scenarios include real compiler-error recovery, non-finite publication rejection, Unicode String/custom-message transport, binary Image mailbox bounds, retained-image provenance, service response races, live parameters and numeric bounds, quaternion edge cases, 288 actual C++/Python/inspector TF comparisons per language, action acceptance/feedback/result/cancellation races, and actual Python/C++ beacon-docking outcomes.

The separate ten-case copied-buffer/sample-provenance regression also passes both browsers on this asset. See `SENSOR_PROVENANCE.md`. The full-course JSON reports `fullParity: true` only for a nonfocused Wave 9 run with all 25 reference cases and every other scenario passing. This is the browser course acceptance gate; independent review, UI/release gates and maintainer approval remain separate.

Commands:

```sh
npm run test:cpp-course -- chrome --built
npm run test:cpp-course -- firefox --built
```

The command defaults to the full Wave 9 gate. Earlier waves remain available for focused development. `--wave=9 --focus` is rejected to avoid a misleading final-gate result.

## Recorded performance

The two full suites ran concurrently, alongside coordinator release checks. These are observed workstation timings, not isolated benchmarks or promises for student devices. Each Run creates a fresh execution/compiler worker; the browser profile and toolchain Cache Storage persist across scenarios. Warm loading therefore includes worker/toolchain preparation and does not mean a compiled student answer is reused.

| Measurement | Chrome | Firefox |
| --- | ---: | ---: |
| First cold toolchain load | 1,836.2 ms | 3,562 ms |
| First cold asset payload | 60,347,928 B | 60,347,928 B |
| First warm toolchain load | 120.6 ms | 485 ms |
| Warm downloaded payload | 0 B | 0 B |
| Warm cached payload read | 60,347,928 B | 60,347,928 B |
| Compile median, 25 reference programs | 2,493 ms | 2,180 ms |
| Compile mean, 25 reference programs | 2,661.7 ms | 2,373.5 ms |
| Compile median, 103 recorded final metrics | 2,508 ms | 2,207 ms |
| Link median, 25 reference programs | 31 ms | 13 ms |
| Largest recorded generated module | 406,541 B | 406,541 B |
| Maximum sampled compiler linear memory | 96,862,208 B | 96,862,208 B |
| Maximum sampled program linear memory | 1,638,400 B | 1,638,400 B |
| Full suite wall time | 639.742 s | 711.067 s |
| Sum of scenario durations | 626.641 s | 698.014 s |

The largest module is the 5.6 TF-plus-scan reference. Recovery scenarios may compile more than once but retain only their final metrics, and some failure/runaway cases have no completed metric record. The 103-record median is therefore not a count or distribution of every compiler invocation. Download/cache byte metrics count consumed asset payload, not compressed network-wire bytes. Linear-memory measurements exclude the browser process, JS heaps, graphics, other workers and cache storage; they must not be described as total memory usage.

## Camera observations

RGB frames contain 230,400 bytes. At the nominal 8 Hz simulator rate this is 1,843,200 bytes/s before copies. The beacon reference processed 58 frames (13,363,200 bytes) per browser. Its elapsed first-to-last-frame interval was 6,835 ms in Chrome and 8,435 ms in Firefox. Using `(frames - 1) * 230400 / elapsed`, observed delivered-frame cadence corresponds to approximately 1,921,405 B/s and 1,556,941 B/s respectively; concurrent workload and simulator stepping affect wall-clock cadence. This is an in-browser payload observation, not network bandwidth.

Beacon callback mean/max durations were 2.19/4.9 ms in Chrome and 6.81/14 ms in Firefox. The sampled beacon program linear memory was 1,376,256 bytes in both. The deterministic Image mailbox test independently checks one active plus one pending frame, drops superseded samples and drains correctly. No unbounded sensor queue was observed.

## Artifacts

- Chrome JSON: `/tmp/kn-cpp-wave9-full/chrome-wave-9.json`; completed `2026-10-04T11:59:50.545Z`.
- Firefox JSON: `/tmp/kn-cpp-wave9-full/firefox-wave-9.json`; completed `2026-10-04T12:01:01.875Z`.
- Logs: `/tmp/kn-cpp-wave9-full-{chrome,firefox}.log`.
- Extracted measurements: `/tmp/kn-cpp-wave9-full/performance-summary.json`.

These machine-readable reports include the exact build identity, every scenario result, behavioral evidence, diagnostics, runtime metrics and cleanup outcome. Safari/iOS remains unverified. This gate did not deploy, merge or change the production domain.
