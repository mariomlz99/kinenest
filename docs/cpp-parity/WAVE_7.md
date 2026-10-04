# Wave 7 — asynchronous actions

Candidate based on `b8768720eac0426ecc7091f5bdb52ef654c04994`. The initial tested dirty build is asset `9ddc31cf6ead`, created at `2026-10-04T11:24:56.727Z`. The final retention-fix C++ gate also passed in both browsers; public UI validation is recorded separately.

## API and teaching contract

The browser compiles real C++ using `rclcpp_action::create_client<DriveDistance>`, `Client::SendGoalOptions`, accepted goal handles, feedback/result callbacks and `async_cancel_goal`. Goal, Feedback and Result use the existing educational DriveDistance action and shared physical simulator. Distance fields are float32, matching the declared educational interface.

This is a callback-based educational subset, not native rclcpp_action or DDS. Calls return educational numeric request IDs, not blocking/shared futures or native 128-bit UUIDs. Result codes retain succeeded/canceled/aborted semantics. Feedback and result evidence is credited only when the student actually consumes the callback. No callback should survive Stop or Reset.

The shared host pins action notifications to their owning worker and clears terminal request mappings. Cancel may synchronously deliver the cancelled result before the cancel acknowledgement; the C++ client retains the separate cancellation callback so both are delivered. A terminal goal handle returns an explicit terminated response to another cancel without sending a stale command.

## Initial real-browser gate

Chrome: **18/18 passed**. Firefox: **18/18 passed**. Each includes:

- 4.4 goal/result, 4.5 feedback and 4.6 cancellation references and negative controls.
- Alternate solutions for 4.5 and 4.6.
- Accepted → feedback → physically accurate result ordering; invalid goal rejection without later feedback/result.
- Immediate cancellation (0 m travel) and mid-goal cancellation (0.25 m travel), including result-before-ack ordering and terminal-handle reuse.
- Stop and Reset during an active action, then a new real C++ run; old host notifications and old worker events cannot credit evidence or output.
- Stop while the real acceptance response is deliberately held in transport.
- Invalid-handle runtime error recovery, real compiler error recovery and runaway termination.

Each case checks endpoint, timer, mailbox, parameter/action client, goal and evidence cleanup. The manifest now contains 24 exercises, but this focused run executes three references; it does not claim full-course parity or a full-course rerun. Exercise 4.6 remains pedagogically optional.

Chrome completed at `2026-10-04T11:26:49.374Z`, with 95.199 seconds summed scenario duration. Firefox completed at `2026-10-04T11:26:59.807Z`, with 105.106 seconds. These are automated scenario timings, not classroom completion estimates.

Artifacts: `/tmp/kn-cpp-wave7/chrome-wave-7-focus.json`, `/tmp/kn-cpp-wave7/firefox-wave-7-focus.json`; logs `/tmp/kn-cpp-wave7-{chrome,firefox}.log`. The JSON retains actual action callback order and physical distances.

## Final gates

The subsequent host cleanup improvement also clears the terminal goal disposer closure. Its final production asset `e3b540071291` passed the complete focused suite again: Chrome **18/18**, Firefox **18/18**. Results are in `/tmp/kn-cpp-wave7-final/{chrome,firefox}-wave-7-focus.json`; logs use `/tmp/kn-cpp-wave7-final-{chrome,firefox}.log`.

Final unit suite: 63/63. Python Session 4 passes all six references and empty-program controls in both browsers on `e3b540071291`; logs `/tmp/kn-wave7-final-python-session4-{chrome,firefox}.log`. The broader Python hardening/diagnostics suites also passed on the initial action build, as documented in WAVE_7_SEMANTICS.md.

Public UI 4.4–4.6 passes both browsers on `e3b540071291`: ordinary URLs, seven UI languages, independent drafts, preferences, physical checks and Stop/Reset. Exercise 4.5 additionally covers 390 px Compare and changing exercise during an active action with no residual endpoints or commands. Logs `/tmp/kn-cpp-wave7-ui-{chrome,firefox}.log`. Branch availability is now 24/25. No production deployment is claimed here.
