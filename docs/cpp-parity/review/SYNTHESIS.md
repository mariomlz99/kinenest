# Final independent review synthesis

Frozen source: 5c7d93254d18182f9ee9f095ae895f27c1773962; clean application asset: 71f28e8ff533. Seven independent reviewers examined C++, Python, ROS semantics, pedagogy, checkers, UX/Compare and performance. Reviews are source/evidence assessments, not seven independent repetitions of the browser suite. No concrete P0/P1 was established. Unexecuted reproduction recipes remain explicitly unverified.

## Decisions and disagreements

- **C++ fidelity versus reliable isolation:** the C++ reviewer identifies endpoint-handle lifetime and automatic service/action callback timeout gaps. The ROS reviewer accepts an explicitly limited educational API rather than native executor/DDS fidelity. Keep fresh workers and manual Stop; document the gaps instead of rewriting ownership during release freeze.
- **Checker strictness versus valid algorithms:** the adversarial reviewer identifies possible constant-answer and empty-feedback shortcuts. Stronger source patterns or intrusive field wrappers would reject legitimate alternatives and do not prove understanding. Keep formative behavioral grading; investigate varied-pose checks separately. Python's sensor-callback TF report limitation predates this branch, although the new C++ route exposes the difference.
- **Compare teaching versus screen space:** the educator finds the robotics concepts equivalent; the UX reviewer does not consider two working editors sufficient conceptual explanation. Preserve one shared world and sequential execution. Output ownership and restore-target labels deserve follow-up; adding a second simulation or permanently enlarging the map would cost scarce Compare space.
- **Performance versus reuse complexity:** warm caching avoids the measured download, not repeated compiler preparation. Fresh workers improve termination and cleanup. Current measured latency does not justify a compiler-lifecycle rewrite. Bounded mailboxes are per subscription, not a guarantee on student-retained image memory or browser process memory.

## Prioritized follow-ups (not silently marked fixed)

| Priority | Finding | Decision |
| --- | --- | --- |
| P2 | 2.1 member callback hint should show an object-bound lambda | Small teaching-copy follow-up; reference programs pass |
| P2 | Compare output ownership and Python-only Restore target are unclear | Clarify labels in a focused UI follow-up, preserving drafts |
| P2 | Some session straplines still say Python only | Copy follow-up; landing and capability controls state actual support |
| P2 | Long C++ lines/concept correspondence and small map in Compare | Retain internal editor scrolling and frame controls; no redesign |
| P2 | Publisher/client handle destruction does not immediately unregister graph endpoint | Disclosed in CPP.md; node Stop/Reset still cleans up |
| P2 | Service/action-only runaway callbacks lack automatic timeout | Disclosed; manual Stop remains available |
| P2 | Empty feedback, stationary pose/TF constants can satisfy formative evidence | Source-inferred recipes, not fresh reproduced whole-exercise bypasses; strengthen only after focused tests |
| P2 | Python TF report inside a sensor callback is discarded | Pre-existing limitation; focused two-language alternate test recommended |
| P2 | Repeated compilation and per-subscription image retention costs | Document measured scope; no zero-copy or total-memory claim |
| P3 | Timer wall-name versus simulation-clock scheduling | Documentation clarified, 0.05–60 s bounds |
| P3 | NL/FR hint depth differs for 5.1 and 3.6 | Translation refinement, not a demonstrated solvability failure |

Reports: [C++](CPP_EXPERT.md), [Python](PYTHON_EXPERT.md), [ROS](ROS_SEMANTICS.md), [educator](EDUCATOR.md), [checkers](CHECKER_ADVERSARY.md), [UX/Compare](UX_COMPARE.md), [performance](PERFORMANCE_REVIEW.md).

## Release judgment

The tested candidate supports all 25 coding exercises in Chrome and Firefox. This is course support within the documented browser compatibility subset, not arbitrary native ROS/C++ parity. No further application changes were made after the freeze. Documentation and the Firefox live-runner profile correction do not alter application assets. Maintainer teaching/visual approval, PR #3's approved merge and the subsequent rebase/revalidation remain required before the parity merge. Production remains unchanged.
