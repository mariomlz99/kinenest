# Review method and provenance

Frozen source: 8679ae1008806352ce89efeb2d9cc651de557261. No application changes occurred before synthesis.

Nine specialist agents reviewed ten roles: python_foundations (Sessions 1/2/4, lecturer pacing); python_perception_control (3/5/6 and a separate accessibility pass); cpp_curriculum; ros_semantics; checker_adversarial; desktop_compare; mobile_novice; diagnostics; browser_ios. The coordinator executed tests, inspected source/screenshots, challenged findings and synthesized the release decision.

Child execution tools stalled. Isolated worktrees were prepared, but final specialist reports used exact coordinator-supplied source excerpts and measured evidence. They were independent interpretations, **not independent browser executions or exhaustive independent repository inspections**. Screenshot pixels were not delivered to agents reliably; visual inspection was performed by the coordinator. The desktop/mobile reports therefore distinguish measured layout analysis from visual judgment. This is a limitation of this audit, not evidence of product failure.

All executed evidence names its browser. Source-derived counterexamples are not called browser failures. All 25 Python references, two existing alternates, 25 print-only negatives and shared lifecycle tests ran; this does not cover every possible implementation or every fault in every exercise. Session 1 is one CLI exercise, not a Python exercise.

Reviewer disagreement preceded edits. Mobile reclassified sub-16px inputs from P1 to preventive P2 after accessibility challenged the untested iOS claim. Both rejected implementing exclusive mobile panes without student evidence. Desktop ranked draft loss higher; persistence remains a separate versioned-storage design. ROS review withdrew an alleged service-check bypass: the proposed alternate service is not exposed by the API. The suggested 1.8m early-turning controller actually passed both browsers, so avoidance is unchanged. A stationary camera-only beacon bypass was invalid because the checker requires travel and range; a different odometry/hard-coded-distance bypass was then reproduced in Chrome.

Review reports are engineering evidence, not classroom evaluation or proof of grading security. No deployment, domain change, analytics or curriculum expansion is authorized by this review.
