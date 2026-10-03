# Contributing

Read README.md and docs/ARCHITECTURE.md. Keep student execution static and installation-free. Run npm test and npm run build with Node.js 22+; no dependency installation is needed.

Edit public/lessons/topics-01.json for mission wording, hints and thresholds. New concepts may require runtime/checker extensions and tests.

Verify CLI → robot → check → reset in a browser under /ros2learn/, keyboard navigation and laptop layout. Discuss dependencies and backend changes first. Never commit credentials or dist. Contributions are under Apache-2.0; third-party dependencies keep their own licences.

For course lessons, include EN/NL/FR teaching text while keeping code and ROS identifiers unchanged. Add reference programs under tests/python/course and behavioural checks under src/exercises; never bundle reference answers into public/. Run the relevant browser suite before expanding a runtime API. Full course acceptance commands run all six sessions. Test layout/theme/language switches without resetting student work.
