# Contributing

Use GitHub issues for reproducible bugs and focused proposals. Include the browser, interface/programming language, unit and step, commands, expected behavior and actual output. Remove personal data from workspace exports before sharing.

Keep one clear BASICS path. A feature should teach a concrete ROS concept, work through the visible terminal/editor workflow, and state its browser limits. Keep commands and code unchanged by interface translations.

Run `npm test` and `npm run build`. For runtime changes, run the relevant real-browser checks; action changes must cover both server languages, both client languages, rejection, feedback, success, cancellation and cleanup. For exported examples, check native ROS 2 Jazzy as well.

Generated builds, browser profiles, screenshots and local checkpoints do not belong in the source repository. Put short release evidence in `docs/RELEASE.md`; older evidence remains in Git history.
