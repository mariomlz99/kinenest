# Bridge performance — local built site

Measured on 2026-10-06 with Chrome 141.0.7390.107 and Firefox 151.0.4. Each browser acceptance started a fresh browser profile against the local built site (`assetVersion 767d8fa6c9c8`), with network access for Pyodide and the C++ toolchain. Values are elapsed wall time in milliseconds from browser `performance.now()`, rounded to the nearest millisecond. One run per browser/language path; these are observations, not benchmarks or service guarantees.

| Browser / path | Workspace ready | First successful build | Successful rebuild after failure | `ros2 run` command returned | Launch to delivered message | Stop | Reset |
|---|---:|---:|---:|---:|---:|---:|---:|
| Chrome / Python | 323 | 2,006 | 1,756 | 252 | 3,005 | 2 | 3 |
| Firefox / Python | 483 | 2,305 | 2,018 | 251 | 3,284 | 1 | 1 |
| Chrome / C++ | 338 | 10,011 | 4,757 | 252 | 3,756 | 2 | 2 |
| Firefox / C++ | 451 | 6,551 | 5,077 | 251 | 3,782 | 2 | 2 |

The first Python build is from a fresh test profile. The first successful C++ build follows an intentionally cancelled compile, so some compiler assets may already be cached; it is not a cold C++ timing. The successful rebuild follows a deliberately failed build. `ros2 run` timing ends when the simulated command reports a started process; launch timing ends only after a real message crosses the remapped browser graph. Stop and Reset timings measure synchronous model/worker cleanup, not garbage collection or native process shutdown. Sample size is one, so repeat before using these values to set performance budgets.

A separate fresh Chrome profile ran the screenshot flow without an intentionally cancelled compile. It completed a Python build before opening the C++ package; no C++ build/run path had been entered. The first C++ build took **6,760 ms** and the source-change rebuild took **5,004 ms**. In that same flow, the Python initial build took 2,256 ms and rebuild 1,753 ms. These are one-run clean-profile observations, not a network cache disabled benchmark; browser or OS asset caches may still affect transfer time.

The C++ compiler is loaded by the C++ build/run path. Workspace browsing and Python-only flows use lazy language adapters and do not request it in application code. The deployed browser smoke asserts that opening/running a Python course page did not request the C++ compiler before a C++ run. Bridge browser acceptance checks resource timing after a Python-only workspace build and fails if it fetched `/src/cpp/` or `wasm-clang` assets. This assertion passed in the Chrome and Firefox CI jobs for commit `fb83852`; it covers the tested Python workspace path, not every possible navigation sequence.
