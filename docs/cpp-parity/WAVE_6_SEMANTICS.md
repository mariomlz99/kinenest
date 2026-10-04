# Wave 6: planar TF agreement

The C++ Buffer consumes the actual /tf topic and resolves source-frame coordinates expressed in the target frame. It shares runtime sensor mounts and world geometry; there is no visualization-only transform model.

## Mathematical review

Composition and inverse edges match src/runtime/course.js and the Python Buffer. Isolated ASan/UBSan tests compared all six frame pairs at eight poses: 288 lookups, including translated/rotated bases and child sensor offsets. Equivalent quaternion signs are treated as the same rotation. All 26 Wave 5/6 C++ fixtures passed native syntax checking. These tests do not replace browser WASM acceptance.

The Buffer implements current planar snapshots, without historical interpolation or full native tf2 overloads. TransformListener references its Buffer, which must outlive the listener. Supplied fixtures retain both appropriately. C++ replaces the previous complete snapshot; Python retains edges by parent/child key. The runtime publishes the complete fixed tree, so this difference does not affect the course.

## Python correction

Previously, querying an unknown frame against itself returned an identity because BFS tested equality before graph membership. The new guard rejects unknown target/source frames, while known-frame identity queries remain valid. An isolated test verified 288 known transforms and 26 unknown/empty rejections with no success evidence emitted on rejection.

A browser regression, tests/python-tf-identity.html, runs actual Pyodide: empty-buffer failures, live TransformListener reception, all six identities, unknown lookup directions, inverse composition, then Stop/Reset and a second run.

## Browser gate

Python Session 5, Session 6 and the direct identity regression PASS in Chrome and Firefox against frozen asset 6ca6906d9b57 (HEAD 6d1fc00 plus integrated Wave 6 changes). All nine course references pass, including goal, LiDAR safety, frame debugging and beacon integration. The course harness checks empty-exercise negatives, NL/FR draft preservation, theme and layout; it clicks Stop after each reference. The separate live identity test passes both initial and post-Stop/Reset runs. It does not test infinite-loop termination. Logs: /tmp/kn-wave6-python-chrome.log and /tmp/kn-wave6-python-firefox.log. These are actual Pyodide browser results; the C++ results above remain native syntax/mathematical checks. Real WASM C++ acceptance is coordinated separately.
