# Checker adversarial review

Candidate: source SHA `5c7d93254d18182f9ee9f095ae895f27c1773962`; supplied frozen asset `71f28e8ff533`.

## Scope and result

Read-only source review of report association, sample provenance, course/perception predicates, C++ worker/header and Python compatibility. No application files, build outputs or tests were changed. No browser scenario or unit suite was executed by this reviewer: the review was stopped before its proposed isolated probes to respect the user's credit budget. Existing 112/112 C++ results in both browsers and Python suite results were supplied by the coordinator, not independently repeated here.

No independently reproduced P0/P1 application failure was found. The items below are source-confirmed mechanisms with unexecuted reproduction recipes. They are P2 teaching/checker limitations or a narrow alternate-solution parity concern, not release blockers established by this review. These checks are formative and inspectable, not secure grading; direct internal emit/import manipulation is outside this review.

## CA-01 — Empty feedback callback earns processed-feedback credit

- **Severity:** P2, teaching strictness decision; shared C++/Python behavior.
- **Evidence:** `src/cpp/compat.hpp:566–567` invokes the registered feedback callback then emits `action_observed` regardless of field access. `src/python/compat.py:424–427` does the equivalent. `src/runtime/adapter.js:59` increments feedback; `src/exercises/course.js:22` requires two feedback events and a successful result. Exercise 4.5 instructs learners to read/print distance travelled.
- **Reproduction recipe (not executed):** Start from the 4.5 reference and replace only the feedback callback body with an empty body, retaining the valid goal and result callback. Allow the action to finish, then Check.
- **Expected implication:** It can pass without consuming or displaying progress. Registering and successfully invoking a callback is nevertheless real action API work, so the current acceptance may be a deliberate minimum.
- **Fix option / risk:** Clarify the check label as callback delivery, or require a small progress report tied to the callback if consumption is essential. Do not require exact log wording or source patterns; these would reject valid alternatives. Tracking every C++ field access adds compatibility complexity.
- **Confidence:** High in the source mechanism; resulting whole-exercise pass inferred, not browser-confirmed.

## CA-02 — Static TF answers are independent of lookup provenance

- **Severity:** P2, formative assessment limitation; shared checker.
- **Evidence:** `src/runtime/adapter.js:60` credits every successful TF lookup without retaining requested frames. Line 62 compares report coordinates with current truth separately. `src/exercises/course.js:24,27` combines independent lookup/report counters. Exercise 5.3 starts at x=1, y=0, yaw=pi/2, so its stationary laser origin is (1, 0.2).
- **Reproduction recipe (not executed):** In the 5.3 reference timer, make a successful lookup for an unrelated available pair, discard it, and call `kinenest::report_transform(1.0, 0.2)`. Repeat three times while stationary.
- **Expected implication:** Correct constants can pass without computing the requested frame composition. A report without any successful lookup still fails the TF counter; this is not a report-only bypass.
- **Fix option / risk:** Prefer a small set of varied physical poses during checking, while retaining numerical tolerances. If associating requested frame pairs, permit mathematically valid manual compositions/inversions rather than demanding one exact API call.
- **Confidence:** High in independent counter admission; actual full pass inferred.

## CA-03 — Pose correctness does not establish pose-field consumption

- **Severity:** P2, formative assessment limitation.
- **Evidence:** `src/runtime/adapter.js:101` accepts an accurate pose report from a processed /odom sample without an access requirement. In contrast, lines 99–100 require range access for scan reports. `src/exercises/course.js:26` requires three odometry callbacks and three correct reports.
- **Reproduction recipe (not executed):** Subscribe to /odom and call `report_pose` with the initial stationary lesson pose without reading the callback argument. The simplest zero-pose lesson permits `report_pose(0, 0, 0)`.
- **Expected implication:** A stationary answer can pass without reading position or calculating yaw. It still needs real current /odom callbacks; wrong-topic and report-outside-callback attempts do not satisfy the same route.
- **Fix option / risk:** Check varied poses before certifying the calculation. A field-access mechanism alone also cannot prove that a learner used the value, and intrusive C++ wrappers risk rejecting ordinary valid code.
- **Confidence:** High in source admission mechanism; stationary full-exercise outcome inferred.

## CA-04 — Python sensor-callback TF report differs from C++

- **Severity:** P2, narrow valid-alternate parity concern.
- **Evidence:** `src/cpp/protocol.js:84–86` assigns null sample IDs to relative/transform reports. Python `report_transform` and `report_relative` instead send `_current_sample` (`src/python/compat.py:370–371,496–497`). If called inside an odometry/scan callback, `src/runtime/adapter.js:62` takes the existing-sample branch; `assessCourse` handles only range, sectors and pose, then deletes the report. Timer-based references avoid this condition.
- **Reproduction recipe (not executed):** Move a valid TF lookup and report from a timer into an /odom callback in each language, retaining the TransformListener and availability guard. Compare TF/report counters after several correct callbacks.
- **Expected implication:** C++ can credit the report while Python silently discards the numerically correct equivalent. The lesson explicitly suggests a timer, so this is an alternate callback design rather than failure of the prescribed solution.
- **Fix option / risk:** Route TF reports independently of sensor-sample association in the shared adapter, or normalize Python's sample binding to match C++. Preserve association for pose/range/sectors. Risk is low in principle but requires an actual two-language focused regression before implementation is accepted.
- **Confidence:** High in the divergent source paths; user-visible alternate failure inferred and not independently executed.

## Guardrails observed and unresolved limits

- C++ `associateReport` validates arity/finite values and requires a current callback for range, sectors, pose, detection and image statistics. It binds IDs in the worker rather than trusting supplied IDs.
- Scan reports require /scan plus current-sample range access. Image reports require data access and a matching recorded frame. Ordinary vector copies and retained-data behavior are explicitly documented in `docs/cpp-parity/SENSOR_PROVENANCE.md`; its prior browser evidence was read, not rerun.
- No-scan shortcuts cannot satisfy the current integrated/docking checks because both require at least three range accesses. Merely touching scan data without using it for safety remains possible by design; these counters alone do not establish causal dependence. No physical shortcut was tested here.
- Worker replacement guards and bridge map clearing are present. No new stale-evidence counterexample was reproduced. Whether accumulated evidence across an intentional Stop/Run is desirable is a product policy question, not established here as a defect.
- Wrong-topic scan/pose reports are rejected by exact topic predicates. No false-negative vector-access case was established beyond the previously repaired cases in SENSOR_PROVENANCE.

## Recommendation

Do not reopen implementation on these unexecuted P2 observations during the budget-limited freeze. If maintainers want stronger learning guarantees, first choose which checks certify callback delivery versus actual numerical processing. The smallest useful future reproduction is CA-04, followed by varied-pose validation for CA-02/03; empty feedback handling can be resolved as wording or a deliberately stronger teaching contract.
