# Wave 6 — latest planar TF

Candidate based on `6d1fc0099fecfbb4aa90910a8e016af1cc1b1399`. Validation build: `6ca6906d9b57` (dirty candidate). C++ browser acceptance passed; public enablement and UI validation are recorded separately below.

## Contract

`geometry_msgs::msg::TransformStamped` and `tf2_msgs::msg::TFMessage` carry the simulator’s actual published edges. `tf2_ros::TransformListener` subscribes to `/tf`; `Buffer` composes/inverts the latest received planar snapshot. There is no separate simulated geometry, history, extrapolation, DDS or native tf2 library. `rclcpp::Clock` is a constructor-compatibility handle, not a clock/history implementation.

`lookupTransform(target, source, tf2::TimePointZero)` expresses source in target. `canTransform` is the normal guard while the first snapshot is pending and for unknown/disconnected frames. Unsupported lookup terminates the student worker with an actionable message; C++ exception handling is not advertised. The buffer must outlive its listener. Lesson closures retain both explicitly. KineNest report helpers remain in `kinenest`, not `rclcpp`.

The Python Buffer now rejects unknown-frame identity lookups, matching the shared runtime and C++ instead of returning a misleading zero transform. Known-frame identities remain valid.

## Intended coverage

5.3 sensor frame; 5.4 relative target; 5.5 goal controller; 5.6 TF plus scan safety; 6.2 wrong-frame debugging. The 6.2 starter compiles but uses the wrong reference frame. Inverse-transform alternatives verify that the checker accepts equivalent mathematics. All five variants have seven-language C++ task/hint content; Python tasks are preserved.

## Results

- Unit tests: 56/56.
- Python Sessions 5 and 6: all nine references and empty-program negatives pass Chrome and Firefox, including goal control and beacon docking.
- Real Pyodide identity/inverse-geometry checks pass twice per browser with Stop/Reset between runs.
- Focused C++ Wave 6: Chrome 18/18 and Firefox 18/18. Each browser ran five references, five negative controls, three alternates, four TF API scenarios and the runaway/Stop scenario. The manifest now contains 21 coding exercises; this focused gate does not claim a full-course rerun.
- TF numerical agreement: eight poses × all 36 known source/target pairs, yielding 288 real C++ lookups and 288 real Python lookups per browser. Both agree with the shared runtime and the actual TF inspector `relativeValues` model within 1e-9, with angular differences compared modulo 2π.
- Unknown identity, disconnected-frame guards, known identity, snapshot replacement, failed-lookup evidence, compile-error recovery, runtime-error recovery and endpoint cleanup all pass.
- Public UI validation: all five newly enabled exercises pass Chrome and Firefox on ordinary URLs, frozen asset `fa5ed7191581`. Seven languages, independent drafts, theme/layout, real compilation/checking and Stop/Reset pass; 5.5 additionally covers 390 px Compare and an exercise switch while running. Legacy Compare round trips pass both browsers. Public branch coverage is now 21/25; production remains untouched.

UI logs: `/tmp/kn-cpp-wave6-ui-{chrome,firefox}.log` and `/tmp/kn-cpp-wave6-compare-{chrome,firefox}.log`.

Python logs: `/tmp/kn-wave6-python-{chrome,firefox}.log`. See `WAVE_6_SEMANTICS.md` for the separate native and browser evidence.

## Browser artifacts and harness correction

The tested dirty build was created at `2026-10-04T11:12:22.626Z`, asset version `6ca6906d9b57`. Chrome completed at `2026-10-04T11:20:15.061Z`; Firefox at `2026-10-04T11:20:30.490Z`. Recorded scenario durations sum to 120.579 seconds and 135.410 seconds respectively; these are scenario times, not browser process memory or classroom timings.

Machine-readable results: `/tmp/kn-cpp-wave6-paced/chrome-wave-6-focus.json` and `/tmp/kn-cpp-wave6-paced/firefox-wave-6-focus.json`. Logs: `/tmp/kn-cpp-wave6-paced-{chrome,firefox}.log`.

The first run passed all 13 lesson cases in each browser, then the numerical harness exceeded the intentional production output limit of 40 lines per second: its second 36-line pose batch yielded only four lines. The harness now spaces pose batches by 1.1 seconds. The production limiter was preserved. The numerical C++ fixture also retains its buffer/listener with shared ownership across callbacks instead of relying on stack lifetime after the browser executor yields. Both complete focused suites then passed without modifying the production build.
