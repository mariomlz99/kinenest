# Behavioural checker audit

Baseline 8679ae1. See [method](REVIEW_METHOD.md), [inventory](EXERCISE_MATRIX.md), and [reproducible probes](tools/checker-probes.mjs).

All 25 real Python print-only programs failed in Chrome and Firefox; Reset recovered each case. This closes the baseline's uneven per-exercise negative coverage. Existing NumPy-sector and class/cv2 centroid alternates passed. Checks consume runtime evidence, not source strings. Detection checks vary scenes and compare reports with actual frame pixels.

## Reproduced findings

| ID | Area / session / exercise / language | Severity / category / priority | Observation and evidence | Reproduction | Why it matters | Suggested change | Risk / confidence / implement |
|---|---|---|---|---|---|---|---|
| CHK-01 | Parameters / 4 / 4.1 / Python | high / checker / P1 | Parameter reads + String on /review_noise pass without student motion publisher; Chrome + Firefox | checker-probes: configured | Claimed motion concept is not tested | Require valid student /cmd_vel publications in addition to parameter reads | low / high / yes |
| CHK-02 | Interfaces / 4 / 4.3 / Python | high / checker / P1 | TargetInfo on /review_wrong_target_topic passes; both browsers | checker-probes: custom | Task explicitly names /target_info | Count valid code TargetInfo publications on the requested topic | low / high / yes |
| CHK-03 | Integration / 6 / 6.3 / Python | high / checker / P1 | Image + odometry with hard-coded distance passes with no /scan subscriber; Chrome | checker-probes: blind | Claims two-sensor integration without student LiDAR use | Require processed scan ranges and motion publications; preserve existing physical stop/centering criteria | low / high / yes |

These fixes establish endpoint/data-access contracts. They cannot prove causality or understanding: reading a parameter then ignoring it can still fool a formative check. Do not replace this with exact-source matching. Students can inspect all static assets; reference solutions remain excluded from production, but this is not secure assessment.

## Disputed or deferred findings

- Avoidance's central-ray reaction criterion could reject some cautious sector controllers. The concrete proposed 1.8m threshold alternate passed both browsers. No threshold change without a reproducible legitimate failure.
- The final beacon already requires >0.3m travel and a 0.55–1.10m stop. A stationary centering-only bypass was rejected during synthesis, not recorded as an executed failure.
- An alleged wrong-service bypass is unreachable through the current Python API, which exposes Trigger /reset_robot. Withdrawn.
- Goal/camera-control predicates count generic code publications. Physical completion and sensor evidence already constrain success, but provenance could be strengthened after an actual counterexample. Defer speculative changes.
- 4.4/4.6 check action completion/cancellation, not an exact distance/feedback threshold. Prefer conceptual equivalence over exact numeric algorithms; make example values clearly examples in a future editorial pass.
- 2.2's timer feedback says commands though it publishes String messages. Low-risk wording correction.

## Coverage limits

Reference, empty/reset and print-only negatives are not exhaustive faults. Wrong types, non-finite C++ JSON serialization, every wrong-frame variant, CDN interruption, huge pasted source and all timing races remain targeted follow-ups. Shared lifecycle tests cover infinite loops, repeated execution, stale cleanup and bounded output; do not multiply these claims into independent tests for every exercise.
