# Performance observations

Frozen source 8679ae1, Ubuntu desktop, headless browser runs. These are individual observations, not statistically controlled benchmarks or mobile estimates. Other review processes may have run concurrently. Milliseconds are rounded.

| Metric | Chrome 141 | Firefox 151 |
|---|---:|---:|
| C++ cold toolchain transfer | 60,347,928 bytes | 60,347,928 bytes |
| C++ cold load, robotics program | 2,186 ms | 1,813 ms |
| C++ cold compile / link | 1,693 / 34 ms | 1,283 / 12 ms |
| C++ warm toolchain network | 0 bytes | 0 bytes |
| C++ warm load, next program | 113 ms | 502 ms |
| C++ warm compile / link | 1,748 / 31 ms | 1,405 / 13 ms |
| Subscriber module | 321,911 bytes | 321,911 bytes |
| Controller module | 328,991 bytes | 328,991 bytes |
| Peak reported compiler linear memory, controller | 52,101,120 bytes | 52,101,120 bytes |
| Program linear memory | 1,114,112 bytes | 1,114,112 bytes |
| Reported filesystem memory | 9,830,400 bytes | 9,830,400 bytes |

The memory fields measure the toolchain's tracked WebAssembly allocations, **not** total browser/process memory. Do not add them and present the sum as peak RSS.

## Lazy loading

The actual Pages smoke test observed 26,052 bytes of document/resource transfer on Session 2 after navigating from the root page, with shared resources already cached. This is a warm navigation measurement, not first-visit site size. Neither browser fetched the C++ runtime/toolchain before C++ was run. The independent 390px test also checked this.

A separate fresh-profile measurement loaded Session 3 from local dist: Chrome reported 273,875 bytes and Firefox 310,090 bytes for page resources before Python. These are uncompressed local-server Resource Timing totals including protocol overhead, not CDN transfer estimates.

| Python readiness | Chrome | Firefox |
|---|---:|---:|
| Cold profile, Run to callbacks-ready | 2,100 ms | 2,291 ms |
| Warm HTTP cache, new disposable worker | 2,163 ms | 1,875 ms |
| Cold Python stage before NumPy | ~1,383 ms | ~1,546 ms |
| Cold NumPy stage through API preparation | ~685 ms | ~704 ms |

Stage timings come from visible state transitions and include overhead; they do not isolate NumPy download from import/initialization. A new worker reinitializes CPython, so warm cache does not guarantee a dramatically faster Run. Worker-internal Pyodide/NumPy transfer totals were not collected; main-page Resource Timing cannot provide them accurately.

Chrome Performance metrics over three-second idle-simulation windows:

| Page | Width | Main-thread task time | Script time | Layout time |
|---|---:|---:|---:|---:|
| LiDAR | 390 | 236 ms | 142 ms | 5.6 ms |
| LiDAR | 1440 | 283 ms | 178 ms | 6.3 ms |
| Camera | 390 | 266 ms | 161 ms | 5.8 ms |
| Camera | 1440 | 250 ms | 146 ms | 6.6 ms |
| TF | 390 | 291 ms | 169 ms | 6.2 ms |
| TF | 1440 | 309 ms | 179 ms | 6.8 ms |

This measures the whole page's main thread, not isolated sensor/render CPU, worker CPU or total device utilization. Reported JS heap was 2.5–3.8 MB; this excludes worker/WASM memory. No Firefox CPU or mobile battery measurement is claimed.

Both browsers executed a 1,000-line Python output burst. The output stayed at 24,000 characters in one text node, with Stop still usable. The worker rate limiter intentionally drops excess lines; the output is not a complete log archive.

## Data-cost finding PERF-01

- Area: code workspace; Session: 2; Exercise: 2.1/2.4; Language: C++.
- Severity: medium; Category: performance / UX.
- Observation: the first C++ run downloads about 60 MB, but the visible mode note only says browser compilation.
- Evidence: cold-download counters above; CodeWorkspace.render() in the frozen source.
- Reproduction: use a fresh browser profile, open ordinary Session 2, select C++, then Run.
- Why it matters: students on cellular connections cannot judge the first-run cost before starting it.
- Suggested change: a concise static note near C++ Run stating approximate first-run download and caching; no modal and no prefetch.
- Risk of change: low; text only, translate consistently.
- Confidence: high. Requires implementation: yes, selected P2 candidate.

## Boundaries

Logs are bounded in UI and worker output is rate-limited. Latest-sample mailboxes prevent sensor backlog. Baseline tests exercise these mechanisms, but a successful desktop test does not establish low-memory iOS behavior. Compiler cache persistence is a browser policy, not a guarantee.

Final implementation keeps compiler loading lazy and adds a seven-language inline first-run notice (~60 MB, cache when available). Final C++ acceptance repeats cold/warm measurements in evidence/final-chrome.log and final-firefox.log. Concurrent browser validation timings are observations, not a controlled speed comparison. No toolchain or sensor-rate change was made.
