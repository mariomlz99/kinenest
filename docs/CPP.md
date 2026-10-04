# Experimental browser C++

Open session-02.html. On the cpp-parity candidate, tested exercises 2.1–2.4, 3.1–3.6 and 6.1 offer Python, C++ and Compare by default, with an Experimental label. Future implemented variants can remain developer-gated by ?experimentalCpp=1. The normal course remains Python-first. Compare contains editable student drafts; it does not insert answers. Only the selected program runs at a time.

## Implemented

A worker downloads a pinned Clang/LLD toolchain, compiles controller.cpp as C++17, links WebAssembly and executes it locally. Compiler diagnostics retain filename and line numbers. The educational header supports Node, Twist and String publishers/subscribers, LaserScan and binary rgb8 Image subscriptions, real C++ callbacks, chrono-based timers and logger macros. KineNest-only report_range/report_sectors helpers associate results with the actual active scan; they are not rclcpp APIs. Both adapters use RuntimeAdapter, the same graph, sensor mailbox, robot and behavioural checks. Stop terminates compilation or execution; Reset also discards stale messages and endpoints.

The shipped rclcpp-shaped header is not ROS rclcpp. It supports one translation unit and one worker executor. spin yields into browser events; statements following spin do not resume. No threads, blocking sleep, exception handling, native filesystem, package build or arbitrary ROS packages are supported. Asynchronous Trigger clients use create_client and async_send_request; the response callback receives an already-completed SharedFuture whose get() returns success/message. Blocking waits are unavailable. Failed requests stop cleanly with their cause; Stop/Reset remove clients and invalidate pending responses. Parameters, actions and TF remain Python-only. Image pixels arrive as a transferable byte buffer and are copied once into the message-owned WASM vector; width/height/data access and reports are tied to the current image. Old frames are replaced instead of queued. No compilation server is used.

## Toolchain decision

The proof of concept pins [binji/wasm-clang](https://github.com/binji/wasm-clang/tree/648c4a89997a351eef75cdaec3ef5b89d4937dec), an explicitly experimental Clang 8.0.1 demonstration. It supplies a compact, reproducible compiler, linker, in-memory WASI host and sysroot without cross-origin isolation headers. Its age and limited host APIs are reasons to keep the feature experimental. It is not a long-term toolchain endorsement.

[LiveCodes clang-wasm](https://github.com/live-codes/clang-wasm) is a newer candidate with a different host/sysroot integration. It was reviewed, not integrated or benchmarked. Replacing the compiler should preserve the bridge and require the same browser acceptance suite.

The vendored JavaScript host differs from upstream by an explicit additional-import hook, exported App constructor and streaming UTF-8 decoding of WASI output. Source and headers enter its filesystem as UTF-8 bytes. Licence files are retained beside it. Compilation selects the sysroot's ABI version 2 and musl configuration, disables thread support and thread-safe static guards. This avoids unsupported atomic instructions in shared_ptr/static initialization in a single-threaded worker. No student source rewriting is involved.

## Measurements, 3 October 2026

Measured on this Ubuntu workstation in headless Chrome and Firefox, with cold browser profiles. Network conditions and hardware affect these values.

| Measurement | Chrome | Firefox |
| --- | ---: | ---: |
| Toolchain assets | 60,347,928 bytes | 60,347,928 bytes |
| Cold robotics toolchain load | 1.55 s | 2.41 s |
| Warm load from Cache Storage | 0.17 s | 0.54 s |
| Compile class obstacle controller | 1.75 s | 1.41 s |
| Link controller | 0.029 s | 0.013 s |
| Controller module | 328,991 bytes | 328,991 bytes |
| Largest sampled compiler + filesystem linear memory | 52,101,120 bytes | 52,101,120 bytes |

Memory is a sampled WebAssembly linear-memory measure, **not total browser memory or a process peak**; compiled code, JS objects and browser overhead are additional. Cold hello-world loads ranged around 2–5 s across runs. Warm tests downloaded zero toolchain bytes. Cache Storage may be unavailable or evicted; execution falls back to fetching the pinned assets.

Assets load only when C++ runs. Python-only students never download this toolchain. There is no service worker and no COOP/COEP or SharedArrayBuffer requirement. The current upstream raw GitHub host must remain reachable on first use. For an institutional mirror, keep exact versions and notices and rerun both browser suites.

## Reproduce

~~~bash
npm test
npm run build
npm run test:cpp -- chrome --built
npm run test:cpp -- firefox --built
npm run test:cpp-course -- chrome --built --wave=3
npm run test:cpp-course -- firefox --built --wave=3
~~~

The suite compiles hello-world, functional and class controllers, checks callbacks and obstacle avoidance, measures cold/warm loading, checks a compiler error, terminates an infinite loop and exercises Compare/Reset in the actual UI. Reference C++ programs live under tests/cpp and are excluded from production.

## Visibility and deployment audit

| Location | Production effect |
| --- | --- |
| src/exercises/programming.js | supported plus visibility: public exposes tested variants; experimental variants otherwise require the flag |
| public/lessons/session-02-*.json and session-06-01-topic-debug.json | Five tested variants set supported: true and visibility: public; experimental remains a status label |
| src/ui/code-workspace.js | Reads experimentalCpp once and passes it to the capability check |
| src/ui/product.js | Carries an explicitly supplied developer flag across navigation; never adds it to ordinary URLs |
| tests/cpp-ui.html, tests/compare.html | Ordinary URLs validate public execution and draft preservation |

Historical VALIDATION.md entries describe the earlier gate. Capture tooling previously used the flag; it now uses ordinary URLs. No hidden server switch controls C++. The production build includes bridge.js, compat.hpp, toolchain.js, worker.js and vendor host/licences; large compiler binaries remain pinned remote downloads triggered by Run.

Historical visibility diagnosis: local public C++ was already working. The live site still served 13f0acc, where the older gate hid both modes without experimentalCpp=1. Chrome and Firefox probes confirmed both URL cases. That gate diagnosis preceded this parity implementation. It is not the current production SHA.

The current stacked cpp-parity branch completes Session 2 and wrong-topic debugging first. Camera pixels and service clients, parameters/actions, odometry/TF and integrated debugging remain subsequent gated waves. Each new executable variant needs a real compiler run, behavioural success and failure cases, Stop/Reset and both browsers. Rust, native package builds and Session 7 remain deferred.

## Public-release remeasurement

Both browser suites passed after the brand/support pass. The normal Session 2 Python view transferred 270,614 bytes (document plus main-page Resource Timing transferSize, local static server, fresh browser) and fetched no src/cpp or compiler assets before C++ use. This is page startup before Run, not the Pyodide/NumPy download or total browser traffic.

| Measurement | Chrome | Firefox |
| --- | ---: | ---: |
| Cold compiler/toolchain transfer | 60,347,928 bytes | 60,347,928 bytes |
| Cold robotics toolchain load | 1.84 s | 1.91 s |
| Warm cache load | 0.12 s | 0.52 s |
| Warm compiler transfer | 0 bytes | 0 bytes |
| Class controller compile | 1.94 s | 1.43 s |
| Class controller link | 0.035 s | 0.013 s |
| Generated controller module | 328,991 bytes | 328,991 bytes |

Fresh browser profiles define cold; concurrent workstation activity and network conditions affect timings. No compiler preload was added.

## Parity Wave 1 — 4 October 2026

Five references (2.1–2.4, 6.1), five negatives, three alternates, Unicode String round-trip, compiler-error recovery, three non-finite values and runaway/Stop-during-load passed Chrome and Firefox: 19 cases per browser. Shared Python checkers are unchanged. New C++ wording/hints use all seven UI languages; Python content is retained. See [wave evidence](cpp-parity/WAVE_1.md). Public availability here describes the branch candidate, not an automatic production deployment.
