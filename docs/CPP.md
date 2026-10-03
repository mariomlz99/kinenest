# Experimental browser C++

Open session-02.html. Tested exercises 2.1 and 2.4 offer Python, C++ and Compare by default, with an Experimental label. Future implemented variants can remain developer-gated by ?experimentalCpp=1. The normal course remains Python-first. Compare contains editable student drafts; it does not insert answers. Only the selected program runs at a time.

## Implemented

A worker downloads a pinned Clang/LLD toolchain, compiles controller.cpp as C++17, links WebAssembly and executes it locally. Compiler diagnostics retain filename and line numbers. The original educational header supports Node, Twist publishers, LaserScan subscriptions, real C++ callbacks, chrono-based timers and logger macros. Both adapters use RuntimeAdapter, the same graph, sensor mailbox, robot and behavioural checks. Stop terminates compilation or execution; Reset also discards stale messages and endpoints.

The shipped rclcpp-shaped header is not ROS rclcpp. It supports one translation unit and one worker executor. spin yields into browser events; statements following spin do not resume. No threads, blocking sleep, exception handling, native filesystem, package build or arbitrary ROS packages are supported. Services, parameters, actions, TF and camera access remain Python-only. No compilation server is used.

## Toolchain decision

The proof of concept pins [binji/wasm-clang](https://github.com/binji/wasm-clang/tree/648c4a89997a351eef75cdaec3ef5b89d4937dec), an explicitly experimental Clang 8.0.1 demonstration. It supplies a compact, reproducible compiler, linker, in-memory WASI host and sysroot without cross-origin isolation headers. Its age and limited host APIs are reasons to keep the feature experimental. It is not a long-term toolchain endorsement.

[LiveCodes clang-wasm](https://github.com/live-codes/clang-wasm) is a newer candidate with a different host/sysroot integration. It was reviewed, not integrated or benchmarked. Replacing the compiler should preserve the bridge and require the same browser acceptance suite.

The vendored JavaScript host differs from upstream only by an explicit additional-import hook and exported App constructor. Licence files are retained beside it. Compilation selects the sysroot's ABI version 2 and musl configuration, disables thread support and thread-safe static guards. This avoids unsupported atomic instructions in shared_ptr/static initialization in a single-threaded worker. No student source rewriting is involved.

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
~~~

The suite compiles hello-world, functional and class controllers, checks callbacks and obstacle avoidance, measures cold/warm loading, checks a compiler error, terminates an infinite loop and exercises Compare/Reset in the actual UI. Reference C++ programs live under tests/cpp and are excluded from production.

## Visibility and deployment audit

| Location | Production effect |
| --- | --- |
| src/exercises/programming.js | supported plus visibility: public exposes tested variants; experimental variants otherwise require the flag |
| public/lessons/session-02-01-subscriber.json, session-02-04-avoidance.json | Both set supported: true and visibility: public; experimental remains a status label |
| src/ui/code-workspace.js | Reads experimentalCpp once and passes it to the capability check |
| src/ui/product.js | Carries an explicitly supplied developer flag across navigation; never adds it to ordinary URLs |
| tests/cpp-ui.html, tests/compare.html | Ordinary URLs validate public execution and draft preservation |

Historical VALIDATION.md entries describe the earlier gate. Capture tooling previously used the flag; it now uses ordinary URLs. No hidden server switch controls C++. The production build includes bridge.js, compat.hpp, toolchain.js, worker.js and vendor host/licences; large compiler binaries remain pinned remote downloads triggered by Run.

On this pass, local public C++ was already working. The live site still served 13f0acc, where the older gate hid both modes without experimentalCpp=1. Chrome and Firefox probes confirmed both URL cases. Publishing the pending commits is required; broadening C++ parity remains deferred until that release is verified.
