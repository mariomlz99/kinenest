# ROS2Learn

Learn the mental model of ROS 2 in your browser. A static introductory university lab, without student installation, accounts or backend.

Target: https://mariomlz99.github.io/ros2learn/

This project deploys from the ros2learn repository, independently of the existing personal website. No root-site changes are needed.

## Lab 01

Discover nodes/topics, inspect Twist, publish velocity and observe a robot. Progressive hints and behavioural checks help students travel 1 m. Reset restores graph, robot, hints, terminal and assessment.

ROS2Learn is an educational ROS 2 simulator. Its Python API and CLI reproduce the ROS 2 concepts used in these lessons, but the browser environment is not a complete DDS-based ROS 2 installation.

Version 0.1 provides CLI only. Python/Pyodide is milestone 2. Commands use common Humble/Jazzy syntax with the subset documented below.

## Local preview

From this repository on Ubuntu:

    python3 -m http.server 8000 --bind 127.0.0.1

Open http://localhost:8000 in Chrome. Serve over HTTP rather than opening index.html directly. To test the project subpath, serve the parent directory and open http://localhost:8000/ros2learn/.

## Tests and build

Maintainers need Node.js 22+. Students do not. No npm dependencies or installation step.

    npm test
    npm run build

The build copies index.html, src/ and public/ to dist/. All application URLs are relative. No third-party fonts, scripts or downloads in v0.1.

## GitHub setup

1. In https://github.com/mariomlz99/ros2learn choose Settings → Pages → Build and deployment → Source → GitHub Actions. Leave the personal website repository unchanged.
2. Review and commit prepared files, then push:

       git status
       git add README.md CONTRIBUTING.md .gitignore .github package.json index.html src public scripts tests docs
       git commit -m "Build static ROS2Learn Lab 01 and Pages deployment"
       git push origin main

3. Watch Actions → Test and deploy GitHub Pages. Deployment follows successful tests/build. Pull requests do not deploy.
4. Open https://mariomlz99.github.io/ros2learn/ and run the smoke test below.

Use your existing GitHub credential helper or SSH configuration if prompted. Never commit credentials. If deployment fails, verify Pages uses GitHub Actions and inspect the failed workflow step.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Smoke test

    ros2 node list
    ros2 topic list
    ros2 topic type /cmd_vel
    ros2 topic info /cmd_vel
    ros2 interface show geometry_msgs/msg/Twist
    ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}, angular: {z: 0.0}}"

Wait two seconds and Check solution: all three checks pass, distance 1.20 m. Reset and check again: all incomplete. An invalid command should produce a readable error.

The simulated controller holds a command for two seconds then stops; this is not a ROS 2 guarantee. Only linear.x and angular.z can be nonzero. Limits: 2 m/s and 3 rad/s. Unsupported axes are rejected. The parser supports JSON or simple YAML flow mappings, not full YAML. Publication requires --once; continuous publishing is unsupported. /odom publishes ideal pose and velocity at 5 Hz of simulated time; /scan remains a placeholder without samples. The one-shot CLI publisher has exited before the next command runs.

## Multiple simulated terminals

Two terminals open initially. Use **+ New terminal** to add more, and Close to remove a terminal. They share the same robot and ROS graph within the current page, with independent history and output. Separate browser tabs are separate simulations.

In terminal 2, start observing position:

    ros2 topic echo /odom --field pose.pose.position

In terminal 1, publish:

    ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}, angular: {z: 0.3}}"

Position changes while the robot moves. Use Ctrl+C (with focus in that terminal) or Stop echo to return to its prompt. Full messages and other fields are supported:

    ros2 topic echo /odom
    ros2 topic echo /odom --field twist.twist
    ros2 topic echo /odom --once
    ros2 topic echo /cmd_vel

Start the /cmd_vel echo before publishing: it observes each new command once, without replaying old messages or inventing commands while the robot moves. /odom streams at 5 Hz even at rest, with position in the odom frame, quaternion orientation and velocity in base_link. Covariance is zero in this ideal, noiseless simulation; no TF is broadcast. Echo supports --field and --once after the topic, not the full ROS CLI flag set.

Echo nodes appear in node list and topic subscription counts while active. Stop, Close and Reset remove them. Reset preserves the open panels but clears all histories, output and running commands. Each terminal retains at most 100 history entries and 24,000 output characters; scrolling up pauses automatic scrolling. Live logs are keyboard-focusable but not continuously announced by screen readers.

Syntax reference: https://github.com/ros2/ros2cli/blob/jazzy/ros2topic/ros2topic/verb/echo.py

## Structure

- src/runtime: graph and validated publication API
- src/terminal: CLI and message parser
- src/simulator: deterministic kinematics
- src/exercises: lesson loader and behavioural checker
- src/ui: browser interface and SVG rendering
- public/lessons: editable JSON
- tests: Node built-in tests
- docs: architecture and roadmap

## Licensing

Owner licence selection is pending. Public visibility alone does not grant an open-source licence. Select a licence before inviting reuse.

## Browser regression check

With the local server running, open /ros2learn/tests/browser.html (or /tests/browser.html when serving the repository itself). It runs the UI flow in an iframe and reports PASS/FAIL. The harness uses a deterministic animation clock so Chrome headless virtual time works; production uses requestAnimationFrame.

    google-chrome --headless --disable-gpu --virtual-time-budget=12000 --dump-dom http://localhost:8000/ros2learn/tests/browser.html

The browser test harness is excluded from the production build.
