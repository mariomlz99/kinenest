# Python and exercise audit

Frozen8679ae1. Reviewers python_foundations and python_perception_control; exact source snapshots plus coordinator-run evidence. 26 exercises, of which25 execute Python; Session1 is CLI. References passed both browsers. Every Python exercise also rejected a real print-only program and recovered on Reset. This is not proof that every function/class/timer variant or negative fault was tried.

| Exercise | Objective | Python/pedagogical quality | Likely novice error | Checker quality | Proposed disposition | Priority |
|---|---|---|---|---|---|---|
| 1 | Discover graph and command velocity | CLI rather than Python; observe /odom | Typing position into velocity; timeout mistaken for failure | Runtime motion evidence, no source matching | Keep; explain one graph/shared terminals | P3 |
| 2.1 | Subscribe and access LaserScan in callback | Good minimal first callback | Callback called manually or wrong topic | Data access + three callbacks; print-only rejected | Keep; C++ public equivalent | — |
| 2.2 | State, String pub/sub and timer | Good but multi-part | Local state lost between callbacks | Events counted, not exact state computation | Say messages rather than commands in timer feedback | P2 |
| 2.3 | Angle-based scan sectors | Good; NumPy alternate passes | Treat front as array beginning | Reported values matched to actual sample angles | Keep finite-range caveat; empty-sector edge not demonstrated | — |
| 2.4 | Reactive obstacle avoidance | Reference and early1.8m alternate pass | Wrong turn sign or no zero command | Motion, scan access, reaction, collision constraints | Do not change threshold based on failed hypothesis | — |
| 3.1 | Image subscriber and metadata | Good bridge from scan | Wrong Image import/topic | Metadata access; no exact print format | Keep; output is observation not grading contract | — |
| 3.2 | Image to real NumPy array | Good primary array path | Wrong channel order/shape | Actual-frame means and shape | C++ pixel statistics can mirror goal, not NumPy API | P2 future |
| 3.3 | Red threshold mask | Good concise concept | AND syntax or channels reversed | Varied scenes reject constant visible | Keep detection checks and progressive hints | — |
| 3.4 | Centroid and horizontal position | Good; class/cv2 alternate passes | Empty mask mean or sign | Actual frame centroid across scenes | Keep alternate expressions | — |
| 3.5 | Async Trigger service client | Good; tests both browsers | Ignoring future completion | Request and received successful response | Alleged alternate-service bypass withdrawn | — |
| 3.6 | Perception to Twist control | Strong visible cause/effect | Angular sign reversed | Image access, publications, physical centering | Generic publication provenance follow-up only | P2 |
| 4.1 | Declare/read motion parameter | Task coherent; checker gap | Read only once or no Twist | Unrelated String publisher falsely passes | Require student motion publications | P1 |
| 4.2 | Tune a running node | Good live-state exercise | Expect edit to change cached value | Parameter changes, reads, speed diversity | Keep; disclose scalar type simplification | P2 docs |
| 4.3 | Publish custom interface | Good generated-like class context | Wrong topic or field type | Wrong-topic TargetInfo falsely passes | Require /target_info contract | P1 |
| 4.4 | Send action and receive result | Good but starter mentions next concept | Treat send future as final result | Actual motion/result; exact distance not constrained | Keep values examples; reduce feedback distraction later | P2 |
| 4.5 | Process action feedback | Useful async progression | Confuse feedback wrapper/result | Feedback and final success evidence | Keep; budget debugging time | — |
| 4.6 | Cancel active action | Correct optional extension | Cancel after completed result | Feedback/cancel/stopped evidence | Keep optional; do not force into90min | — |
| 5.1 | Read odometry pose | Useful but overlaps5.2 | Quaternion.z mistaken for yaw | Correct sample x/y/yaw | Explain5.1position versus5.2orientation progression | P2 |
| 5.2 | Quaternion to yaw | Transferable planar math | Degrees/radians confusion | Wrapped yaw comparison accepts equivalent math | Keep helper or formula alternatives | — |
| 5.3 | Transform sensor origin | Strong visual/API connection | Reverse source and target | Actual transform values | Add real package resource marker in transition reference | P2 |
| 5.4 | Target relative coordinates | Clear frame concept | World position used as robot relative | Relative values compared to lookup | Keep source-in-target wording | — |
| 5.5 | Closed-loop target approach | Good culmination | No clamp or never stop | Physical goal dwell plus pose/TF evidence | Keep; generic publisher provenance follow-up | P2 |
| 5.6 | Goal control plus scan safety | Dense integration extension | Naive local avoidance oscillates | Scan access, TF, goal, no collision | Treat as extension if course runs long | P2 planning |
| 6.1 | Diagnose wrong topic | Observable graph fault | Assume any publisher moves robot | Avoidance behavior after repair | Preserve graph/terminal access on phones | — |
| 6.2 | Diagnose wrong reference frame | Observable nonzero-heading fault | Numerically valid wrong frame | Actual arrival and dwell | Preserve inspector and spatial context | — |
| 6.3 | Camera direction plus LiDAR safety | Strong final integration; checker gap | No state or hard-coded world distance | No-scan odometry shortcut falsely passes | Require actual scan access plus existing physical behavior | P1 |

Hints reviewed for concept → API → syntax progression. Existing hints are mostly concise; final hints sometimes supply a near-complete conditional structure, appropriate only after request. Do not expose reference solutions by default. No need to rewrite already direct instructions. Report helpers are educational instrumentation, not standard ROS APIs; real-environment material already explains replacing them with logging/tests.

Global Python execution is real Pyodide/NumPy. Stop terminates workers, clears endpoints and motion; Reset restores state/evidence. Shared lifecycle tests establish these contracts, while per-exercise print-only Reset checks confirm reuse. They do not prove every mid-callback race independently.

Diagnostics preserve actual Python errors. Common errors in the table should be investigated with graph, output, sensor and TF panels. The course intentionally does not teach native DDS/QoS/build machinery. No full-source pattern grading should be added.

Alternate coverage: existing NumPy sectors and class/cv2 centroid; added early-turn1.8m reference variation passes both. More class/function/timer alternatives per exercise remain future test work. This audit does not claim exhaustive solution-space validation.
