# Debugging and diagnostic review

Frozen8679ae1; diagnostics specialist interpreted coordinator evidence without fault injection. Coordinator confirmed initial catalogue import is caught by session3-boot.js and renders Session could not start plus error/reload instruction. Thus no demonstrated endless initial Loading defect.

| ID | Area/session/exercise/language | Severity/category/priority | Observation/evidence | Reproduction | Why | Suggested change | Risk/confidence/implementation |
|---|---|---|---|---|---|---|---|
| DBG-01 | Terminal/all/1,6.1/CLI | low/copy/P2 | Unknown topic identifies name but omits discovery hint | Query absent topic | Novice needs next command | Suggest ros2 topic list | low/high/defer text change pending translation review |
| DBG-02 | TF/5–6/lookups/Python | medium/API/P2 | Transform not received yet or unknown frame conflates causes | Unknown frame vs early lookup; not injected here | Waiting cannot repair typo | Include requested frames; distinguish only with authoritative state | low for context, medium synchronization/high observation/defer |
| DBG-03 | Coverage/all/all/both | medium/browser/P2 | References do not cover every requested fault | Compare inventory with below | Avoid false confidence | Focused fault/recovery suite | low/high/recommend |

Verified: genuine compiler diagnostics and correction, C++ infinite-loop Stop/Reset, stale cleanup, output flood bounded24k chars, Python references and print-only negatives, topic/frame debugging reference repair. Graph exposes wrong /velocity endpoint; nonzero heading exposes odom-versus-base_link fault.

Source safeguards: Python fetch attempts15s, load watchdog120s, callback watchdog5s; C++ fetch60s and preparation watchdog90s; lesson fetch15s. These do not prove interrupted-download retry or cache corruption recovery. No generic reassuring message should replace compiler line numbers or Python traceback.

Unexecuted fault combinations: wrong namespace/type in every lesson; missing subscriber; invalid timer; wrong sector/sign; reversed TF then correction; unavailable service/parameter; action rejection/cancel races; non-finite C++ serialization; failed CDN/cache; enormous paste; tab suspension. Shared tests cover some validation boundaries but are not a full novice diagnostic study.

Disagreement: Session6 needs discoverable graph/terminal/TF evidence even on mobile. Other sessions should emphasize their relevant sensor. Exclusive panes could hide causes; postpone until user evidence. Keep streaming output non-live to avoid screen-reader flooding; concise execution status remains live.

## Additional executed finding DBG-04

Area: parameters; Session4; exercise4.1/4.2; languagePython; severitymedium; categorydiagnostics; priorityP2; confidencehigh; implementationyes. Real Chrome fault injection calls get_parameter('missing') before any declaration. Baseline raises an internal AttributeError for absent _parameters rather than naming the undeclared parameter. This hides the student error. Selected low-risk fix: raise a specific KeyError naming the parameter and declare_parameter. Preserve real traceback and cleanup. Reproduction: tests/diagnostics.html; correction/re-run must succeed. No broader parameter API change.

## Additional executed finding DBG-05

Area: publication diagnostics; sessions2–6; languagePython; severitymedium; categorybrowser/diagnostics; priorityP2; confidencehigh; implementationyes. Real Firefox publishes Twist.linear.x=NaN: JSON.parse fails before runtime validation, omitting the invalid field. Chrome emits a different parser message. Add finite-vector validation at the Python publisher boundary; retain host validation for all adapters. Test NaN/infinity plus correction. Risklow: only values already rejected by the runtime change diagnostic. Initial final-suite attempt stopped for this repair; no failed attempt is reported as a pass.
