# Core / Further exercises implementation

Date: 2026-10-06. Implements the reviewed scope audit's option A. Existing session URLs, lesson IDs/files, saved-code keys and runtime architecture are retained.

## Required path

Start with the ROS mental model and use small physical examples to make it observable. Core does not require implementing a perception pipeline or a steering/avoidance algorithm.

| Existing session | Required exercises | Optional Further exercises |
|---|---|---|
| 1 — Nodes & Topics | 1.1: nodes, publishers/subscribers, typed topics, CLI, motion and stop | — |
| 2 — Subscribers & Callbacks | 2.1 subscriber; 2.2 state, callbacks and timer publication | 2.3 sectors; 2.4 avoidance |
| 3 — Messages & Services | 3.1 Image subscription/dimensions; 3.5 service request/response | 3.2 arrays; 3.3 detection; 3.4 centroid; 3.6 target centering |
| 4 — Parameters & Actions | 4.1 declaration/ownership; 4.2 live tuning; 4.3 typed interface; 4.4 goal/result; 4.5 feedback | 4.6 cancellation (optional ROS depth) |
| 5 — Odometry & Frames | 5.1 nested odometry; 5.2 yaw; 5.3 sensor TF; 5.4 relative target | 5.5 target steering; 5.6 LiDAR safety |
| 6 — Debugging | 6.1 wrong topic; 6.2 wrong frame | 6.3 beacon docking |
| Core finale | Workspace/package/build/source, concurrent run, inspect, launch/remap/debug, native handoff | — |

There are 16 required Foundations exercises (one terminal exercise and 15 coding exercises), 10 optional exercises, and the existing bridge finale. The short Image example remains Core to transfer subscription knowledge to a different message type; it requires no pixel algorithm. Cancellation remains available as optional communication depth.

## Learner-facing changes

- Grouped selector: Core first, Further exercises separately. Original numbering is intentionally preserved.
- A visible Core/optional notice and next-Core link on each lesson. Core 3.1 leads to 3.5; Core 6.2 leads to the bridge.
- `?lesson=<existing-id>` links select an exercise directly. Invalid IDs fall back to the first Core lesson. Existing plain URLs still work.
- Further exercises have linked preparation so optional algorithm chains remain coherent.
- The homepage offers all optional labs after the Core finale. They are available now, rather than advertised as unbuilt future modules.
- New navigation labels are translated into all six additional UI languages.
- Session 1 introduces node/publisher/subscriber/topic vocabulary before CLI commands.
- 4.4 Python now focuses on goal/result; feedback stays in 4.5.
- 6.1 and 6.2 explain their supplied controllers and the behavior checked after the topic/frame repair, in both languages and all UI translations. Optional algorithm exercises are not prerequisites. Existing behavior checks remain to verify that the repair actually works.
- 4.1's confirmed zero-command false positive is corrected, with a regression test.

## Starter-only validation method

`tests/starter-path.js` and `tests/core-starter-edits.js` load each actual supplied Core coding starter, fill its TODOs or repair the deliberate topic/frame fault using the visible lesson APIs, run it, and require its behavioral checks to pass. They do not fetch or import reference solution programs. Coverage is tied to the required Core registry so a newly required coding exercise cannot silently be skipped.

This is an automated walkthrough authored separately from the reference programs. It verifies executable scaffolds and a completion path. It does not establish that a first-time human learner will discover the same solution unaided or understand every reflection prompt.

## Validation recorded for this change

- 85 unit/build tests passed.
- All 15 Core coding starters passed in Python and C++ on Chrome and Firefox (60 exercise/language/browser combinations).
- Core/Further navigation passed in Chrome and Firefox: grouped options, translated labels, deep links, saved code, service independence and progression to the bridge.
- Built Session 1 CLI exercise passed, including cross-terminal echo and Stop/Close/Reset cleanup.
- Built Session 3: all six exercises, alternative centroid implementation, constant-detector negative control and Stop/Reset passed in Chrome.
- Built bridge: supplied Python scaffold passed create/build/source/manual run/echo/fault repair/relaunch/reset in Chrome; C++ passed the same sequence in Firefox.
- Desktop and mobile visual inspection completed; no horizontal overflow in the captured Core service, optional centroid and homepage layouts.
- Native package scaffolds/build/runtime are unchanged by this split; the preceding candidate's native Jazzy export validation remains applicable to those files. This pass does not claim a new native execution run.

## Freeze status

Implementation and executable starter coverage do not replace the external human teaching review. Keep Core as a release candidate until that review and the final candidate's required CI gates are complete. No merge, production release, tag or freeze is performed by this curriculum split.

## Handoff

The user requested deployment to the existing review preview, followed by putting work on hold. Preserve this draft branch for external review; do not merge or start further curriculum changes while on hold.
