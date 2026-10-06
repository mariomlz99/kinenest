# Bridge performance — local built site

Measured on 2026-10-06 with Chrome 141.0.7390.107 and Firefox 151.0.4. Each browser acceptance started a fresh browser profile against the local built site (`assetVersion f7407008b24b`), with network access for Pyodide and the C++ toolchain. Values are elapsed wall time in milliseconds from browser `performance.now()`, rounded to the nearest millisecond. One run per browser/language path; these are observations, not benchmarks or service guarantees.

| Browser / path | Workspace ready | First successful build | Successful rebuild after failure | `ros2 run` command returned | Launch to delivered message | Stop | Reset |
|---|---:|---:|---:|---:|---:|---:|---:|
| Chrome / Python | 339 | 2,004 | 1,753 | 252 | 3,005 | 2 | 4 |
| Firefox / Python | 438 | 2,298 | 2,005 | 251 | 3,255 | 0 | 2 |
| Chrome / C++ | 343 | 8,264 | 4,759 | 252 | 3,756 | 3 | 2 |
| Firefox / C++ | 447 | 6,304 | 5,038 | 251 | 3,784 | 1 | 2 |

The first Python build is from a fresh test profile. The first successful C++ build follows an intentionally cancelled compile, so some compiler assets may already be cached; it is not a cold C++ timing. The successful rebuild follows a deliberately failed build. `ros2 run` timing ends when the simulated command reports a started process; launch timing ends only after a real message crosses the remapped browser graph. Stop and Reset timings measure synchronous model/worker cleanup, not garbage collection or native process shutdown. Sample size is one, so repeat before using these values to set performance budgets.

The C++ compiler is loaded by the C++ build/run path. Workspace browsing and Python-only flows use lazy language adapters and do not request it in application code. A network-level assertion that no compiler asset was fetched on Python-only navigation remains a release verification item.
