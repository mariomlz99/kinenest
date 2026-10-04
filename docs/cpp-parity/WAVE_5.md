# Wave 5 — Odometry and yaw

Candidate based on d308b2c, 4 October 2026. Production remains unchanged.

C++ 5.1 and 5.2 passed reference, negative and alternate programs in Chrome and
Firefox. The focused gate passed 10/10 cases per browser on asset 71e1fc813a79:
actual published Odometry headers, timestamps and nested pose/twist fields;
nine yaw cases including scaled quaternions, nonplanar rotations and singular
conventions; real compiler-error recovery; runaway Stop and Reset cleanup.

Results: /tmp/kn-cpp-wave5/{chrome,firefox}-wave-5-focus.json.
The runner reports 2 exercised references and 16 available exercises separately.

Unit tests: 56/56. Production build passed. All six Python Session 5 references
and empty negatives passed both browsers, including goal and safety controllers.
Logs: /tmp/kn-wave5-python-session5-{chrome,firefox}.log.

After public enablement, asset 4eba6cbd12ad passed the ordinary-URL UI gate in both
browsers: 5.1/5.2, seven languages, drafts, Stop/Reset, phone Compare and active
exercise switching. Logs: /tmp/kn-cpp-wave5-ui-{chrome,firefox}.log.

See WAVE_5_SEMANTICS.md for independent native checks and primary-source review.
Covariance arrays are intentionally outside the current C++ message subset.
The yaw adaptation retains upstream Apache-2.0 attribution in NOTICE and the
compatibility header. No native tf2 library is bundled.
