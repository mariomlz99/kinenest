# KineNest release-candidate review

Reviewed commit: **8679ae1008806352ce89efeb2d9cc651de557261**.  
Implementation candidate: **b5315055b355416ec1ba6efc6f1a8a32c915c8b2**, asset version **aad49715ede0**.  
Branch: **review-hardening**. Later commits add test/reference/evidence documents; no subsequent production-source changes.  
Disposition: **ready for maintainer review, not deployed or merged**.

## Review scope and provenance

Nine specialist agents covered Python foundations, perception/control, C++ curriculum, ROS semantics, adversarial checkers, desktop/Compare, mobile/novice, diagnostics and browser/iOS. Accessibility was a separate reviewer pass; the coordinator performed synthesis and executed tests.

Child tool calls stalled, so final specialist reviews used coordinator-supplied exact source excerpts and measured results. They did not independently execute browsers or reliably receive screenshot pixels. The coordinator inspected screenshots. [Method](REVIEW_METHOD.md) records this limitation and reviewer disagreements.

All **26 exercises** were inventoried: one Session 1 CLI exercise and **25 Python exercises**. All 25 Sessions 2–6 exercises have a proposed C++ equivalent and explicit API/compiler/bridge gap classification in [CPP_PARITY_MATRIX.md](CPP_PARITY_MATRIX.md). C++ execution remains public only for **2.1 and 2.4**.

## Findings and implemented changes

**P0: none demonstrated. P1: four high-confidence findings fixed.**

- **4.1:** parameter reads plus unrelated text publications could pass without student motion commands. Require valid student /cmd_vel publications.
- **4.3:** TargetInfo on the wrong topic could pass. Count the requested /target_info endpoint.
- **6.3:** image steering plus an odometry/hard-coded-distance shortcut could pass without /scan. Require student scan-range access, command publications and no collisions, retaining physical centering/stop evidence.
- Light-theme editor help had approximately **1.83:1 contrast**. It now passes the 4.5:1 regression threshold.

Selected low-risk **P2** work: wrap narrow preferences and long reference identifiers; use 16px mobile editable controls and larger touch targets; disable source-altering keyboard assistance; show a seven-language factual first-run C++ download notice; correct timer feedback from “commands” to “messages”; add the real Python package resource marker and numeric parameter limitations.

Fault injection additionally exposed two diagnostic defects, fixed narrowly: undeclared parameters leaked an internal attribute error; non-finite Twist values produced browser-dependent JSON parsing errors. Both now identify the student error before dispatch. Actual tracebacks remain visible.

No simulator, sensor mounting, TF geometry, compiler, runtime adapter, theme assets, branding, navigation timing or deployment architecture was replaced.

## Results

| Validation | Before | Final |
|---|---|---|
| Unit tests | 46/46 | **49/49** |
| Static production build | PASS | **PASS**, allowlist still excludes tests/answers/review artifacts |
| Complete six-session course, Chrome | PASS | **PASS** |
| Complete six-session course, Firefox | PASS | **PASS** |
| Real C++ compiler/runtime/public 2.1 + 2.4, Chrome | PASS | **PASS** |
| Real C++ compiler/runtime/public 2.1 + 2.4, Firefox | PASS | **PASS** |
| 25 real Python print-only negatives + Reset | Added during audit | **PASS in both browsers** |
| Three reproduced checker bypasses | Incorrectly passed | **Rejected in both browsers** |
| Early-turning 1.8m obstacle alternate | PASS | **PASS in both browsers** |
| Reverse-TF lookup + explicit inversion, class controller | Added | **PASS in both browsers** |
| Shipped wrong-topic 6.1 / wrong-frame 6.2 starters | Added | **Rejected in both browsers**; corrected references pass |
| Seven real Python error inputs + corrected Run | Exposed two diagnostic issues | **PASS in both browsers** |
| Responsive capture matrix | 200 cases, 9 small overflows | **200 cases, zero overflows** |
| Public-page responsive regression | Added | **9 pages × 13 widths in both browsers**, seven-language Compare, 10/40/100-line editors |
| 390px C++/Python/Compare Run/Stop/Reset/language/theme flow | PASS desktop emulation | **PASS in both browsers** |

Installed browsers: **Chrome 141.0.7390.107**, **Firefox 151.0.4** on Ubuntu. These are tested versions, not a claim of current-stable coverage. npm was absent from PATH; the exact package-script Node entry points ran with Node 24.21.0.

The first final-validation attempt failed on Firefox’s non-finite diagnostic. It was stopped, repaired and fully restarted. Only the successful restarted logs are labeled final.

Evidence: [Chrome final log](evidence/final-chrome.log), [Firefox final log](evidence/final-firefox.log), [unit log](evidence/final-unit.log), [responsive Chrome](evidence/final-responsive-chrome.log), [responsive Firefox](evidence/final-responsive-firefox.log), [screenshots](screenshots/README.md). Baseline logs, production smoke, negatives, performance and alternate-control JSON are in evidence/.

## Curriculum and C++ conclusions

The progression is coherent and references work. Sessions 4 and 5 are the pacing risks: keep cancellation optional and treat final TF/scan integration as an extension when time is tight. These are lecturer estimates, not classroom measurements.

Equivalent NumPy sectors, class/cv2 centroid processing, earlier obstacle turning and inverse-transform control pass. This establishes several meaningful alternate styles, not exhaustive validation of every possible solution. Checks remain formative and inspectable in a static application; they cannot prove understanding or resist a determined grader bypass.

**23 of 25 Python exercises lack public C++ support.** Next modest gaps are String dispatch/state (2.2) and sample-associated sector reporting (2.3). 6.1 is API-feasible but needs its own content and acceptance before enablement. Image transport, asynchronous services, typed parameters, actions, odometry and TF require real adapter work. A C++ pixel loop is not a NumPy lesson; define the language-specific objective before claiming 3.2 parity. No unsupported C++ mode was enabled.

ROS transfer is broadly sound: planar TF source/target semantics, scan angles, image encoding and action lifecycle are coherent. The package marker omission and numeric-parameter simplification are corrected/documented. An alleged service exploit was withdrawn after checking the exposed API.

## UX, accessibility and performance

Desktop hierarchy, actual sensor feedback and focused TF defaults are strengths. Compare retains real independent drafts and stacks below the wide breakpoint. Phone editors remain horizontally scrollable for long code without causing page overflow. Light/dark About logos and footer/support remain correct.

Reviewer disagreements were retained:
- Mobile wanted stronger prioritization of input sizing; accessibility rejected claiming untested iOS zoom as a demonstrated P1. A small preventive CSS change was selected.
- Desktop favors simultaneous causal context; mobile favors reduced scrolling. Exclusive mobile panes were deferred because they can hide debugging evidence.
- Checker review favored stronger gates; ROS review protected equivalent algorithms. Only concrete endpoint/data-access contracts changed.
- A proposed early-turning false failure did not reproduce; avoidance logic stayed unchanged.

Python-only page tests fetch **no C++ toolchain**. Measured compiler transfer is **60,347,928 bytes** on cold load; warm cache runs fetched zero compiler bytes. Baseline load/compile and memory observations are in [PERFORMANCE.md](PERFORMANCE.md); linear memory is not total browser memory. Output-flood tests bounded displayed text to 24,000 characters. No mobile memory claim is made.

## Remaining risks and intentionally deferred work

- **Safari/iPhone/Android real-device behavior: UNVERIFIED.** Desktop viewport resizing does not test virtual keyboards, touch, suspension, memory pressure or storage eviction.
- Firefox passes locally but is not yet a continuing CI release gate. Current-stable Chrome should also be qualified before broader launch.
- All-frame TF labels can crowd; default lesson selections are clearer. No label-layout rewrite.
- Initial “Python not loaded” remains English in translated screenshots. Required-key tests do not inventory every dynamic string. No claim of complete editorial translation certification.
- In-page drafts are preserved; versioned local refresh recovery/progress/deep links remain design work.
- Actual CDN interruption, cache corruption, all timing races, every wrong-type/frame variant, huge source input, physical projection and full screen-reader/high-zoom audits are not exhaustive here.
- P2 diagnostics follow-ups include more contextual unknown-topic/frame recovery hints. C++ non-finite serialization deserves a focused follow-up test.
- No mobile-pane redesign, editor migration, account/backend, analytics, Rust, Session 7, rmw_wasm expansion or custom-domain migration.

## Deployment and repository state

Main and production remain **8679ae1**. Existing Pages workflow **37144563700** was successful. Both browsers tested the actual [GitHub Pages site](https://mariomlz99.github.io/ros2learn/) at that build, including public C++ execution and Python. **No new workflow, push or deployment was triggered for this branch.**

The local test build reports dirty=true because untracked review evidence and the pre-existing much/otherwise/provide files exist. Application changes were committed before final full tests. Those pre-existing files were left untouched; review artifacts and answers are excluded from dist/.

Logical commits before this final report:
- 697fc98 — freeze baseline and inventory
- 77887ac — review reports and synthesis
- bad4c8e — checker contracts
- 3a13c17 — narrow controls, contrast and compiler notice
- 88ae2df — transfer/reference corrections
- 775f6f2 — undeclared-parameter diagnostic and recovery tests
- b531505 — finite Twist diagnostic
- 0b79a37 — alternate TF/debugging and long-editor tests

## Recommended next three steps

1. Inspect this branch and before/after screenshots; choose whether to merge. Deploy only the reviewed commit and verify build-info afterward.
2. Add continuing Firefox coverage and perform current-Chrome plus physical Safari/iPhone/Android acceptance before moving to kinenest.com.
3. Conduct a short classroom dry run for Session 4/5 pacing, TF understanding and phone context. Scope durable local drafts separately; then prioritize C++ 2.2/2.3.

[Exercise matrix](EXERCISE_MATRIX.md) · [Python audit](PYTHON_AUDIT.md) · [curriculum synthesis](CURRICULUM_SYNTHESIS.md) · [UX synthesis](UX_SYNTHESIS.md) · [iOS risks](IOS_RISK_REVIEW.md) · [domain notes](DOMAIN_MIGRATION_NOTES.md)
