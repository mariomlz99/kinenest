# C++ parity release candidate

Status: implementation candidate; final validation and independent review in progress. Not merged or deployed to production.

## Identity and isolation

- Starting SHA: `96986c86223c575a1acb2f3525f5728bd5fddf6d` (PR #3, `boot-experience`).
- Branch: `cpp-parity`, stacked from that open PR. C++ commits do not enter PR #3.
- Local acceptance asset: `6ad7e489683f`, built from `e282d52f555a4b3521c390a3903cef4bbfb54879` with the Wave 9 changes present (`dirty: true`). The later commits record those same changes; final clean candidate identity will be recorded separately.
- Production/domain/Worker routing settings are unchanged.
- Baseline: [BASELINE.md](cpp-parity/BASELINE.md).

## Implemented course scope

| Session | Coding exercises | Added C++ capability |
| --- | --- | --- |
| 2 | 2.1–2.4 | String state, timers and scan sectors alongside existing scan/avoidance |
| 3 | 3.1–3.6 | Binary Image, RGB buffer processing, centroid, Trigger client, visual control |
| 4 | 4.1–4.6 | Parameters/live updates, TargetInfo, action result/feedback/cancellation |
| 5 | 5.1–5.6 | Odometry, yaw, latest-planar TF, relative and safety controllers |
| 6 | 6.1–6.3 | Topic/frame debugging and combined beacon docking |

All 25 variants are enabled on this branch after their individual Chrome/Firefox wave gates. Session 1 remains language-neutral. Full-course release acceptance is a separate gate below.

The interpreter, NumPy, Clang/LLD, generated WebAssembly and student algorithms are real. rclpy/rclcpp-shaped APIs, graph, CLI, messages, services, parameters, actions and TF are educational implementations; there is no DDS or native rclcpp. Both language adapters use the same physical world and behavioral checks.

## Presentation retained

The inherited PR supplies the welcome page with session links, explicit `session-01.html`, global translated tagline and static first-paint cover. Outgoing navigation retains the five branded variants and about 1 second dwell; destination reveal follows actual readiness with a short fade. The parity branch adds the modest map enlargement, the requested 🇮🇹 replacement in the creator footer, and the plain `mailto:hello@kinenest.com` contact link. See [PRESENTATION.md](cpp-parity/PRESENTATION.md).

## Validation on asset 6ad7e489683f

| Gate | Chrome | Firefox |
| --- | --- | --- |
| Unit suite | 64/64 (shared Node suite) | same suite |
| Full Python + UI course | PASS, 18 suites | PASS, 18 suites |
| Full C++ course (112 scenarios) | PASS, 112/112; 25/25 exercises | PASS, 112/112; 25/25 exercises |
| All 25 public C++ exercise UI/drafts/Compare | PASS, 25/25 | PASS, 25/25 |
| Sensor provenance, vector copies/const/reverse access | PASS, 10 assertions | PASS, 10 assertions |
| Actual network failure + truncated cache + storage failure | PASS | PASS |
| Sustained slow image callbacks + mid-callback Stop + Reset/rerun | PASS | PASS |
| 1,000-line output, real long diagnostics and compile cancellation | PASS, 6 cases | PASS, 6 cases |

Per-wave evidence is in `docs/cpp-parity/WAVE_1.md` through `WAVE_8.md`; full Python details in [WAVE_9_PYTHON.md](cpp-parity/WAVE_9_PYTHON.md). Full C++ JSON reports are in `/tmp/kn-cpp-wave9-full/{chrome,firefox}-wave-9.json`; both report `fullParity: true`. Detailed measurements are recorded in [WAVE_9_CPP.md](cpp-parity/WAVE_9_CPP.md).

## Compatibility differences

- One translation unit, single worker/event-loop executor; `spin` yields and subsequent statements do not resume. No threads, blocking sleep, C++ exception support, arbitrary packages or native filesystem.
- Image data is a vector-shaped sample-tracked buffer. Python 3.2 teaches real NumPy; C++ 3.2 teaches RGB row stride and pixel indexing.
- Trigger responses use asynchronous callbacks with an already-completed SharedFuture; there are no blocking waits.
- Parameters share a JavaScript numeric model; native integer/double distinction and descriptors are absent. Unsafe integer/narrowing reads fail explicitly.
- Latest planar TF only, no history/interpolation or simulated durable `/tf_static`. `canTransform` guards failure; errors do not pretend native catchable exceptions.
- DriveDistance uses educational request IDs and lightweight goal handles, not native futures/UUIDs. Cancellation result may precede the cancel acknowledgement.
- The legacy `ros2learn_interfaces` package name is retained as a technical compatibility identifier.
- Formative evidence is inspectable client-side; it is not secure grading.

## Performance and lifecycle

Toolchain is pinned at 60,347,928 bytes, downloaded lazily on explicit C++ Run. Warm Cache Storage reuse does not mean one persistent compiler instance across Runs. Invalid cache entries are refetched; unavailable storage is optional. Python-only pages do not preload compiler assets. Final cold/warm/compile measurements will be recorded after acceptance.

The actual 8 Hz camera stress on this candidate generated 48/47 frames in Chrome/Firefox, processed 20/20 and replaced 28/27, with one in-flight plus one newest pending frame. Median real WASM callback time was 318.1/319 ms. Sampled program linear memory remained 1,376,256 bytes; this is not total browser/process memory. Stop at 100 ms during an incomplete callback discarded the active and queued frames, and no late evidence appeared before a real Reset/recompile/rerun. See [CAMERA_STRESS.md](cpp-parity/CAMERA_STRESS.md).

## Release gates still open

- Freeze a clean candidate, finish visual captures and independent C++/Python/ROS/checker/educator/Compare/performance review.
- Push only `cpp-parity`, run CI and verify the exact Cloudflare branch preview build.
- Obtain maintainer teaching/visual approval. PR #3 remains open; rebase onto main and repeat required tests after its approved merge before opening the parity PR against main.

Safari/iOS and physical-device behavior remain unverified. Rust, native package builds, Session 7 and production rmw_wasm remain deferred. Rollback is the unchanged production deployment and individually scoped wave commits.

## Commits recorded so far

```text
844db11 test: freeze C++ parity baseline and bridge design
aa07c36 feat: add contact footer and slightly enlarge robot view
63410ab feat(cpp): add typed String and scan report transport
953dbc3 feat(cpp): complete Session 2 and topic debugging parity
14f4033 style: use Italian flag in creator attribution
9b8bf76 feat(cpp): add binary Image transport and perception parity
c8a3333 docs: record C++ image validation and transport measurements
61874c9 feat(cpp): add asynchronous Trigger service clients
d308b2c feat(cpp): add live parameters and TargetInfo message parity
6d1fc00 feat(cpp): add Odometry messages and quaternion yaw support
da08756 feat(cpp): add latest-planar TF and controller parity
b876872 test(cpp): verify slow camera callbacks and network recovery
51c564f feat(cpp): add action goals feedback and cancellation
e282d52 feat(cpp): add beacon docking integration parity
e58b2dd fix: preserve sensor provenance across C++ buffer access
a2cfa16 fix(cpp): recover toolchain downloads and remember first-run notice
462ed13 docs: clarify native C++ transfer across coding sessions
88d410f test: stop real C++ camera callbacks during execution
```
