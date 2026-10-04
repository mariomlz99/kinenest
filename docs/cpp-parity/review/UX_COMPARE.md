# UX / Compare review

Candidate: `5c7d93254d18182f9ee9f095ae895f27c1773962`; production asset `71f28e8ff533`. Reviewed 4 October 2026.

## Verdict and evidence boundary

Accept the engineering-workstation direction with the P2 follow-ups below. No P0 or P1 defect is established by this review. Functional coverage does not eliminate the usability gaps in Compare: it makes both languages available, but comparing the meaning and results of their programs still takes unnecessary effort.

I inspected the indexed candidate screenshots **before source**: desktop welcome, Italian 390px welcome, Session 1, Session 2 C++ and Compare, Session 3, Session 5 TF details, Session 6, and footer. Screenshot paths below refer to [the candidate evidence index](../media/README.md). Then I read the narrowly relevant workspace, layout, execution, and language-bridge code. I performed **no browser interactions**, builds, or new test runs. Thus reachability, persistence, execution success, and link destinations are not independently verified here. The coordinator reports all 25 UI exercises and actual-preview Python/C++ exercises passing in both browsers, draft preservation through seven UI languages/theme/layout, 390px Compare, and 361 responsive cases in both browsers; these are supplied validation, not my observations. The older Wave 9 document names another asset and is not substituted for current candidate evidence.

## Findings

### P2 — Compare does not visibly establish output ownership

**Evidence:** [Session 2 Compare](../media/session-02-dark-1440-compare.png) has two Run buttons, one unlabeled empty output region, one Stop, and a top-right status reading “Python not loaded.” [C++ mode](../media/session-02-dark-1440-cpp.png) retains that Python status while C++ is selected. This is an observed idle-state labeling mismatch, not proof of incorrect execution. Source: `src/ui/code-workspace.js` labels the output accessibly as generic “Code output”; `src/ui/session3.js:23–30,80–84` appends to one region and clears it/world evidence before every run; `src/runtime/languages.js` stops the previous adapter before a new run. Language-specific loading statuses partially mitigate the problem.

**Risk:** After switching modes, a learner may mistake retained status/results for the selected editor, or expect Compare to preserve both results. Sequential execution is sound, but that model is not explicit in the screenshots.

**Small follow-up:** Label the region “Python output” / “C++ output” from the last actual run, and state once in Compare that running either language resets the shared simulation and replaces output. Neutralize the initial status when C++ is selected.

**Confidence:** High for screenshots and code behavior; medium for frequency/impact because no run/switch interaction was observed. **Tradeoff:** Retain one execution/world/output rather than adding two competing simulations; attribution is sufficient for this workstation.

### P2 — Restore has an undisclosed Python-only target in Compare

**Evidence:** The same [Compare screenshot](../media/session-02-dark-1440-compare.png) puts “Restore starter code” between the two Run controls. `src/ui/code-workspace.js`, final `restore()` method, restores C++ only when mode is exactly `cpp`; Compare always restores Python, regardless of focused pane.

**Risk:** A learner editing C++ can restore the wrong draft and discard Python edits unintentionally. This is a source-confirmed target ambiguity; I did not perform or observe data loss.

**Small follow-up:** Label the Compare control “Restore Python starter” or provide explicitly targeted restore controls. **Confidence:** High. **Tradeoff:** Two controls add density; changing the current label is the smallest adequate clarification.

### P2 — Side-by-side code helps orientation but hides the conceptual correspondence

**Evidence:** [Session 2 Compare](../media/session-02-dark-1440-compare.png) and [TF Compare](../media/session-05-tf-details.png) allocate roughly 436px per editor at 1440px. Callback signatures, subscription types, and TODO prose clip horizontally. The Python node/spin structure and longer C++ class/main structure do not line up. TF inspector's explicit `lookup_transform(target_frame, source_frame, …)` / `lookupTransform(target_frame, source_frame, …)` pairing is a useful exception. CSS stacks editors below 1200px; screenshot evidence does not independently show mobile Compare.

**Risk:** Compare encourages syntax scanning while subscription/callback/ownership equivalence remains implicit. **Small follow-up:** Add brief exercise-specific concept pairings where these differ, and retain single-language views for actual editing. **Confidence:** High for clipping; medium for learning impact. **Tradeoff:** Preserve unwrapped source and the sensor panel; automatic wrapping or a new IDE layout would make different compromises and is not required.

### P2 — The robot map is generous in Session 1, constrained in Compare

**Evidence:** [Session 1](../media/session-01-en-dark-1440.png) presents an approximately 462 × 260px grid with separate pose/travel metrics. [Session 6 Compare](../media/session-06-en-dark-1440.png) shows an approximately 225 × 181px map; world/base_link labels overlap and LiDAR rays compete with labels. The adjacent frame checkboxes and inspector provide useful escape routes. These captures alone cannot establish improvement over a prior release.

**Risk:** Learners can read exact transform values but struggle to visually distinguish coincident frames. **Small follow-up:** Preserve the existing frame controls; consider a local map enlargement or default fewer labels when several frames coincide. **Confidence:** High for this captured state; medium across other exercises. **Tradeoff:** Enlarging the map permanently would consume scarce Compare space. Do not broaden this into a page redesign.

## Readability, navigation, and contact

- **Pass, screenshot evidence:** The dark desktop welcome exposes all six named lesson links and a clear Start Session 1 action. The Italian 390px welcome keeps all six textual links legible in a single column. Its horizontal session navigation visibly scrolls; this is not demonstrated body overflow. Link activation and translation completeness were not independently tested.
- **Pass with limitation:** Header branding, session identity, preferences, mission hierarchy, and restrained panel styling suit an engineering workstation. Code is legible despite line clipping. The sticky action bar visibly overlays the lowest code lines in Session 3/6 captures, but the screenshots do not prove any unreachable content.
- **Pass, screenshot evidence:** [Footer](../media/footer.png) and desktop welcome expose source, licences, About, real environment, support, and `hello@kinenest.com`. Contact is clearly in the footer, not the header; no header contact control is visible. Email delivery/link behavior is outside this review. Small footer text is subordinate but readable at the captured desktop scale.
- **P2 copy consistency:** Session 1 says “6 sessions · Python · No installation”; Sessions 3/6 show “Python · 90 min” despite visible C++/Compare controls. The welcome correctly advertises both languages. Replace the session strapline with language-neutral course wording. Confidence high; low functional risk.

## Explicit tradeoff judgment

Keep the current restrained workstation, shared simulation, sensor accordions, and direct six-session landing navigation. I would **not** sign off on a claim that functional parity alone makes Compare a complete teaching comparison: output attribution, restore targeting, and concept pairing need the small clarifications above. Conversely, none of the evidence justifies a general redesign or a new release-blocking severity.
