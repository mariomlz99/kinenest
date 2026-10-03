# Isolated rmw_wasm feasibility result

This experiment is excluded from the production build. It does not replace RuntimeAdapter, download anything for students, or add an execution mode to the course.

## What actually ran

Pinned upstream talker/listener and AddTwoInts server/client **precompiled artifacts** ran in separate browser workers, with an original, small host router implementing their publish/retrieve protocol. Their native C++ callbacks produced successive "Hello there!" messages and a request 5 + 8 → response 13. Chrome and Firefox both passed pub/sub, services and worker termination without reported errors. The binaries contain rmw_wasm_cpp and rmw_publish identity/symbol strings; communication uses their middleware callbacks, not KineNest's educational C++ header.

This is an artifact-level feasibility test. We did **not** rebuild the ROS C++ sources, and cannot establish the exact middleware source revision used to produce those upstream binaries. Do not describe this as a reproducible build of the current rmw_wasm source.

## Pins and licences

- Tested artifact repository: [ros2wasm-website at ee6f4aec4e5f71eeceeb236ee9d4e99543adf25b](https://github.com/ros2wasm/ros2wasm-website/tree/ee6f4aec4e5f71eeceeb236ee9d4e99543adf25b). Site licence: BSD-3-Clause. Exact byte lengths and SHA-256 digests are in assets.json.
- Inspected middleware source: [rmw_wasm at a8e824af1c9d8683bc5ba5b6cbd210ddd8947dc9](https://github.com/ros2wasm/rmw_wasm/tree/a8e824af1c9d8683bc5ba5b6cbd210ddd8947dc9), Apache-2.0. Its README targets Humble and lists pub/sub and services, with actions, parameters and QoS unsupported.
- Inspected build recipe: [ros2wasm-builder at 63753d466820712e652c58d0a19c91d31641d782](https://github.com/ros2wasm/ros2wasm-builder/tree/63753d466820712e652c58d0a19c91d31641d782), MIT.

Generated binaries embed other ROS/toolchain components with their own terms. A complete dependency/licence manifest must accompany any future redistribution. Downloaded vendor assets and full measurement logs are ignored by Git; no third-party binary is committed or shipped with KineNest.

## Reproduce the tested probe

From the repository root, with Node 22+ and the corresponding browser installed on the maintainer machine:

~~~bash
node experiments/rmw-wasm/fetch-assets.mjs
node experiments/rmw-wasm/run.mjs chrome
node experiments/rmw-wasm/run.mjs firefox
~~~

The fetcher verifies pinned hashes. The runner starts a temporary loopback static file server and launches a clean browser profile; it is a maintainer test, not a student backend. No cross-origin isolation, SharedArrayBuffer, ROS installation or application server is needed to execute these artifacts. Logs go to ignored results/. Reviewed measurements are in observations.json.

## Observations — 3 October 2026

| Measurement | Chrome | Firefox |
| --- | ---: | ---: |
| Four JS/Wasm artifact pairs, uncompressed | 69,793,449 bytes | 69,793,449 bytes |
| WebAssembly runtime initialized, range across workers | 139–171 ms | 289–368 ms |
| First received String message | 2.64 s | 1.82 s |
| Client received service result | 3.49 s | 2.65 s |
| Linear memory per worker | 64 MiB | 64 MiB |
| Four worker linear memories combined | 256 MiB | 256 MiB |

These are localhost artifact-loading measurements with fresh browser profiles; they do not measure an internet cold download. Runtime initialization precedes ROS node readiness. Linear memory excludes JS objects, compiled-code storage and browser overhead, so it is not total memory or peak RSS. Worker startup ran concurrently with other workstation validation, and the numbers are observations, not performance guarantees.

The artifact's retrieve loop polls at 100 ms. The probe host retains only the latest payload per topic, with delivery sequence per worker; it does not claim DDS queue/QoS semantics. Stop terminates all four workers. No native middleware actions, parameter behaviour, TF, Python bindings, multi-client service correctness or slow-subscriber stress test was performed. Parameter endpoints visible at startup do not establish parameter support.

## Source-build gate

The inspected recipe expects Emscripten 3.1.45, a Humble source workspace, dynamic_message_introspection, ROS patches and a micromamba host environment before invoking colcon with the Emscripten toolchain file. emcc and micromamba are absent here; native colcon and CMake alone cannot cross-compile this stack. The recipe also references floating dependency branches, so pinning the top-level middleware alone would not reproduce its dependency closure.

A future source-build experiment should check out the two source pins above, resolve and record every ROS/dynmsg dependency revision, supply the pinned Emscripten toolchain in an isolated maintainer directory, apply the reviewed patches, and build test_wasm through that toolchain. Do not run the upstream sudo/package-install recipe automatically or present its floating dependency imports as reproducible. Compilation, rebuild size and source-to-artifact provenance remain unverified in this cycle.

## Simulator bridge decision

A future bridge can validate incoming geometry_msgs/msg/Twist and pass it to the existing Runtime.publish('/cmd_vel', ...) path, registering native node endpoints in that same graph. No second simulation is needed. The same clock, reset ownership and checker evidence must be retained; native callback/data-access evidence needs a deliberate design.

The available probes publish String, not Twist. Therefore native /cmd_vel → KineNest robot motion has **not** been demonstrated here, and no artificial conversion from "Hello there!" to velocity was added. The next concrete step is a source-built native Twist publisher plus one disposable bridge. Python integration, parameters/actions, TF and lesson checking remain adoption gates. Keep the educational runtime as the course default.
