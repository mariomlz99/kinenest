# Wave 8 — beacon docking integration

Candidate based on `51c564f183211a264e673cf85761a7d4605f7b74`. Tested dirty asset `69b6028946c7`, built at `2026-10-04T11:31:56.715Z`. The public flag build is validated separately.

## Scope

Exercise 6.3 combines real binary Image callbacks, pixel thresholding/centroid state, LaserScan sector state, a timer and bounded Twist publications. It uses the same physical beacon-docking checker as Python, with no hidden target-coordinate API. The intentionally unsafe negative controller receives scans but never inspects ranges; it must not receive scan-use credit.

## Browser results

Chrome **6/6** and Firefox **6/6** focused cases passed: reference, negative, alternate controller, actual Python/C++ physical comparison, pending-sensor Stop/Reset/exercise-switch recovery and runaway termination. The manifest now contains all 25 coding exercises, but this focused gate executes one reference and does not claim final full-course parity.

The negative runs for ten simulated seconds rather than stopping at startup. Both legitimate styles pass the shared physical checker. Each run checks endpoint, timer, sensor mailbox, action/parameter listener and evidence cleanup.

The direct language comparison runs the real Python reference and real C++ controller from a reset world. Both satisfy the same checks with zero collisions and actual image, scan and command evidence. Their floating-point trajectories need not be identical.

| Browser | Language | Distance travelled (m) | Scan samples read | Image callbacks | Sampled max active/pending mailbox entries |
| --- | --- | ---: | ---: | ---: | --- |
| Chrome | C++ | 2.160 | 36 | 58 | 3 / 0 |
| Chrome | Python | 2.250 | 37 | 59 | 2 / 0 |
| Firefox | C++ | 2.160 | 36 | 57 | 2 / 0 |
| Firefox | Python | 2.230 | 37 | 60 | 2 / 0 |

The active-entry bound includes the controller timer as well as the two sensor callbacks. Sampling every 200 ms is a runtime observation, not a proof that no intermediate pending frame existed. The separate deterministic mailbox stress test establishes the bounded replacement policy. C++ processed 13,363,200 image bytes in Chrome and 13,132,800 in Firefox; sampled program linear memory was 1,376,256 bytes in both. This is WASM linear memory, not total browser process memory.

The switch scenario deliberately creates pending camera samples, stops and resets, then runs a different real C++ exercise. Injected late messages from the previous worker cannot restore image evidence or write stale output.

Chrome completed at `2026-10-04T11:33:21.521Z`, with 61.632 seconds summed scenario duration. Firefox completed at `2026-10-04T11:33:38.185Z`, with 77.466 seconds. Machine results include sampled trajectories: `/tmp/kn-cpp-wave8/{chrome,firefox}-wave-8-focus.json`. Logs: `/tmp/kn-cpp-wave8-{chrome,firefox}.log`.

## Other gates and remaining work

Unit tests: 63/63. Python Session 6 passes Chrome and Firefox. Public UI build `c002e43a2ba4` passes Chrome and Firefox: real compilation and physical check on the ordinary URL, seven UI languages, independent drafts, Stop/Reset, 390 px Compare and switching exercise during an active run. Logs: `/tmp/kn-cpp-wave8-ui-{chrome,firefox}.log`. Python logs: `/tmp/kn-wave8-python-session6-{chrome,firefox}.log`. Full 25-exercise Chrome/Firefox acceptance, final checker review and final release validation remain required. No deployment or full parity completion is claimed by this wave.
