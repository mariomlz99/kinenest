# C++ parity release candidate

Status: all 25 coding exercises passed local and live-preview Chrome/Firefox acceptance; seven-role independent review complete. CI passed all required jobs. Awaiting maintainer review; not merged or deployed to production.

## Identity and isolation

- Starting SHA: `96986c86223c575a1acb2f3525f5728bd5fddf6d` (PR #3, `boot-experience`).
- Branch: `cpp-parity`, stacked from that open PR. C++ commits do not enter PR #3.
- Local acceptance asset: `6ad7e489683f`, built from `e282d52f555a4b3521c390a3903cef4bbfb54879` with the Wave 9 changes present (`dirty: true`). The later commits record those same changes; the final clean candidate identity is recorded above.
- Clean tested source candidate: 5c7d93254d18182f9ee9f095ae895f27c1773962; clean application asset: 71f28e8ff533. Final follow-up commits contain only review documentation/evidence and the live Firefox test-profile correction (633be43); no application changes after this freeze.
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

All 25 variants are enabled on this branch after their individual Chrome/Firefox wave gates. Session 1 remains language-neutral. Full-course local and actual-preview acceptance passed as detailed below.

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

Toolchain is pinned at 60,347,928 bytes, downloaded lazily on explicit C++ Run. Warm Cache Storage reuse does not mean one persistent compiler instance across Runs. Invalid cache entries are refetched; unavailable storage is optional. Python-only pages do not preload compiler assets. On historical functional asset 6ad7e489683f, cold load was 1.836/3.562 s and warm load 0.121/0.485 s in Chrome/Firefox, with zero warm downloaded payload. Reference compile medians were 2.493/2.180 s; largest module 406,541 bytes; largest sampled compiler plus filesystem linear-memory capacity 96,862,208 bytes. Full 112-case suites took 639.742/711.067 s concurrently. These are workstation observations, not total process peaks or mobile benchmarks. [Retained JSON metrics](cpp-parity/results/performance-summary.json). Startup resource assertions and lazy-adapter source inspection support no compiler preload; these are not exhaustive worker-network traces.

The actual 8 Hz camera stress on this candidate generated 48/47 frames in Chrome/Firefox, processed 20/20 and replaced 28/27, with one in-flight plus one newest pending frame. Median real WASM callback time was 318.1/319 ms. Sampled program linear memory remained 1,376,256 bytes; this is not total browser/process memory. Stop at 100 ms during an incomplete callback discarded the active and queued frames, and no late evidence appeared before a real Reset/recompile/rerun. See [CAMERA_STRESS.md](cpp-parity/CAMERA_STRESS.md).

## Clean candidate and actual preview

Preview: https://cpp-parity-kinenest.malizia-mario99.workers.dev/

Build-info verified source 5c7d93254d18182f9ee9f095ae895f27c1773962, asset 71f28e8ff533, dirty false. Both Chrome and Firefox passed all 25 C++ references and all 25 Python references through the deployed UI, including Session 1, empty checks and Stop/Reset. Both passed actual-preview transitions and destination boot tests. All required public routes returned 200; unknown route returned 404. Full details and the resolved Firefox profile-harness issue: [LIVE_PREVIEW.md](cpp-parity/LIVE_PREVIEW.md).

Clean local candidate additionally passed 64 unit tests, both legacy C++ suites, Workers routing, both transition/boot suites and visual capture. The full Python suite included 361 responsive cases per browser with no reported page overflow. Screenshots cover the welcome page, explicit Session 1 route, Python/C++/Compare, sensors/TF, both About themes and transition handoffs: [visual evidence](cpp-parity/media/README.md).

The outgoing overlay was already present; the inherited PR fixes destination first-paint/layout rearrangement by applying saved theme early and covering the static shell until branding, lesson, layout and initial translation declare readiness. Outgoing dwell is 1,000 ms (animation about 850 ms); incoming reveal is 160 ms with no artificial readiness delay. Reduced motion skips the outgoing dwell; history/direct entry/failure recovery passed. Delayed test fixtures make the first-paint cover observable; application initialization itself is not artificially delayed.

CI run: https://github.com/mariomlz99/ros2learn/actions/runs/37200950076 — SUCCESS on source 5c7d93254d18182f9ee9f095ae895f27c1773962. Unit/build/Workers routing and complete Chrome/Firefox jobs passed, including Python, 112-case C++, provenance, network/cache, output/cancellation, all-exercise UI/Compare, slow camera, transitions, first paint and root-domain smoke. Production deployment jobs were skipped by the branch gate. [Machine-readable CI result](cpp-parity/results/ci-37200950076.json).

## Independent review and remaining limitations

Seven role reports and explicit trade-off decisions: [review synthesis](cpp-parity/review/SYNTHESIS.md). No established P0/P1. Nonblocking findings include a member-callback hint, Compare output/restore labels, legacy Python sensor-callback TF-report behavior, formative-checker limitations, graph endpoint lifetime and automatic timeout coverage for service/action-only callbacks. These are disclosed, not claimed fixed. Browser references and alternates do not prove every possible student program.

Safari/iOS and physical-device behavior remain unverified. Rust, native package builds, Session 7 and production rmw_wasm remain deferred. Rollback remains production source 63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff (asset 784328576e05); neither apex nor default Worker was updated. Wave commits remain individually scoped.

## Maintainer gate

PR #3 remains open. No parity PR against main has been opened and neither branch was merged. Please review the actual preview, especially 2.2, 3.3, 3.5, 4.2, 4.5, 5.3, 5.5 and 6.3, plus landing → Session 1 → 2 → 3. After explicit teaching/visual approval and PR #3 merge, rebase cpp-parity onto main and repeat required gates before opening/merging the parity PR. CI success alone is not merge authorization.

## Implementation and validation commits

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
09d4b0b test: cover C++ output bounds and compilation cancellation
9f5d8e3 test: gate full C++ course and public UI in both browsers
38c9b9e docs: describe tested Python and C++ course coverage
d850c66 test: support full C++ course verification on live previews
5c7d932 docs: record complete browser C++ candidate acceptance
633be43 test: use workspace Firefox profile for live course validation
```

The review/evidence commit containing this report follows these commits. The final branch SHA is reported with the handoff and preview build-info; a commit cannot embed its own SHA without changing it.

## Final handoff identity

After test-runner and report commits, preview source 2317e739562d033ac18b639f315a9b33cfc92788 was verified with dirty false and asset 71f28e8ff533. Rebuilding that clean branch produced a byte-identical dist to tested 5c7d932, excluding build-info.json: sorted path/content SHA-256 digest a5560ba50f5d171ed5bfbc09a555d20bd90b5736a9134c314071c9fb92b9a2e0. The final CI-result documentation commit does not change application files; its exact SHA is supplied in the handoff and preview build-info. No duplicate full run is claimed for documentation-only commits.

READY FOR MAINTAINER REVIEW: YES. Merge authorization: pending. The received single-character reply was not treated as approval.
