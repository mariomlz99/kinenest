# ROS2Learn

Learn the mental model of ROS 2 in your browser. A static introductory university lab, without student installation, accounts or backend.

Target: https://mariomlz99.github.io/ros2learn/

This project deploys from the ros2learn repository, independently of the existing personal website. No root-site changes are needed.

## Lab 01

Discover nodes/topics, inspect Twist, publish velocity and observe a robot. Progressive hints and behavioural checks help students travel 1 m. Reset restores graph, robot, hints, terminal and assessment.

ROS2Learn is an educational ROS 2 simulator. Its Python API and CLI reproduce the ROS 2 concepts used in these lessons, but the browser environment is not a complete DDS-based ROS 2 installation.

Lab 01 provides the CLI introduction. Session 3 adds real Python/Pyodide, NumPy, camera callbacks and services. Session 2 has not been implemented in this repository. Commands use a documented subset of common Humble/Jazzy syntax.

## Local preview

From this repository on Ubuntu:

    python3 -m http.server 8000 --bind 127.0.0.1

Open http://localhost:8000 in Chrome. Serve over HTTP rather than opening index.html directly. To test the project subpath, serve the parent directory and open http://localhost:8000/ros2learn/.

## Tests and build

Maintainers need Node.js 22+. Students do not. No npm dependencies or installation step.

    npm test
    npm run build

The static build publishes the two HTML entry pages, licence notices and an allowlist of src/ and public/ under a content-versioned asset directory. Tests, reference solutions and development files are excluded. All application URLs support a project subpath. Lab 01 has no external runtime downloads; Session 3 fetches pinned Pyodide and NumPy assets when Run is first pressed.

## GitHub setup

1. In https://github.com/mariomlz99/ros2learn choose Settings → Pages → Build and deployment → Source → GitHub Actions. Leave the personal website repository unchanged.
2. Review and commit prepared files, then push:

       git status
       git add README.md CONTRIBUTING.md LICENSE NOTICE .gitignore .github package.json index.html session-03.html src public scripts tests docs
       git commit -m "Update browser lessons and static Pages deployment"
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

The simulated controller holds a command for two seconds then stops; this is not a ROS 2 guarantee. Only linear.x and angular.z can be nonzero. Limits: 2 m/s and 3 rad/s. Unsupported axes are rejected. The parser supports JSON or simple YAML flow mappings, not full YAML. Publication defaults to 1 Hz, supports --rate / -r and --once, and runs until Ctrl+C or Stop command. /odom and /scan publish at 5 Hz of simulated time; scan uses 36 synthetic rays with infinite no-return distances in the empty Lab 01 world. The one-shot CLI publisher has exited before the next command runs.

## Multiple simulated terminals

Two terminals open initially. Use **+ New terminal** to add more, and Close to remove a terminal. They share the same robot and ROS graph within the current page, with independent history and output. Separate browser tabs are separate simulations.

In terminal 2, start observing position:

    ros2 topic echo /odom --field pose.pose.position

In terminal 1, publish:

    ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.6}, angular: {z: 0.3}}"

Position changes while the robot moves. Use Ctrl+C (with focus in that terminal) or Stop command to return to its prompt. Full messages and other fields are supported:

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

Original code and lesson content: Apache-2.0. See LICENSE and NOTICE. Third-party runtime components retain their own licences; see public/third-party.html. This independent project is not affiliated with or endorsed by Open Robotics. Review the ROS-derived project name before a wider branded launch; no trademark permission is claimed.

## Browser regression check

With the local server running, open /ros2learn/tests/browser.html (or /tests/browser.html when serving the repository itself). It runs the UI flow in an iframe and reports PASS/FAIL. The harness uses a deterministic animation clock so Chrome headless virtual time works; production uses requestAnimationFrame.

    google-chrome --headless --disable-gpu --virtual-time-budget=12000 --dump-dom http://localhost:8000/ros2learn/tests/browser.html

The browser test harness is excluded from the production build.

## Session 3: camera perception and services

Open session-03.html, choose an exercise, complete the TODOs and Run Python. The six exercises cover image callbacks, NumPy arrays, colour detection, centroid location, asynchronous Trigger clients and vision-driven robot control. Camera images are 320 × 240 RGB at 8 Hz of simulation time. Camera movement follows robot pose. Code executes in a dedicated worker; Stop and Reset terminate it and remove its graph entities. Internet is required for the initial Pyodide/NumPy download. No local installation is required.

A Python run and every terminal share one runtime within the page. Use these commands while Python is active:

    ros2 topic info /camera/image_raw
    ros2 topic hz /camera/image_raw
    ros2 topic echo /camera/image_raw --once
    ros2 service list
    ros2 service type /reset_robot
    ros2 service call /reset_robot std_srvs/srv/Trigger

See docs/SESSION3.md for APIs, limitations, assessment and teaching notes.

## Cross-browser acceptance tests

With Chrome or Firefox installed on the maintainer machine (not required on the student machine beyond a supported browser):

    npm run test:chrome
    npm run test:firefox

The tests start a temporary local static test server, launch a fresh headless browser, and run real Pyodide solutions. They need network access to the Pyodide CDN and may take a minute or more. The runner and reference programs are never deployed to Pages. Chrome/Firefox are selected by google-chrome/firefox on PATH.

## Source visibility and spoilers

Students can inspect all client-side code, lesson hints and checking logic. Production excludes reference programs, but the public GitHub repository contains test fixtures and therefore exposes those examples. Obfuscation cannot turn a static open-source app into a secure examination system. Use these checks for formative practice; use a separate assessment task if grades depend on independent work.

Checks are behavioural and do not match a particular source program. NumPy threshold masks and cv2.inRange/moments solutions are both exercised in tests. Multiple node names, functional callbacks and Node subclasses are accepted. Learners still need to use the documented API subset; this is not full rclpy.

## Shared ROS 2 basics

Every lab uses the same CLI implementation. Discover the actual topic/service graph for that lab; camera and reset service endpoints appear in Session 3, while dynamic topics appear when created. There is no per-lesson command allowlist. Type help or ros2 --help.

- Nodes: list, info.
- Topics: list [-t], type, info [-v], find, echo [--field PATH] [--once], hz, bw, delay, pub [--once | --rate HZ].
- Interfaces: list, packages, package, show, proto for the teaching message/service types.
- Services: list [-t], type, info, find, call.

A continuous publisher can run in one terminal while another uses echo or hz. Publishing supports Twist and String, including newly named topics. Only /cmd_vel drives the robot. Sensor topics are generated by the simulator. Rates use simulation time, which pauses when the page is hidden. bw reports an estimated payload size, not DDS wire traffic. delay requires a stamped message and measures simulated delivery delay. Publication rates are capped at 20 Hz for browser usability. DDS/QoS, daemon, doctor, service-event introspection, package execution, parameters and ROS action clients are not implemented; this remains an educational subset, not an entire ROS distribution.

    ros2 topic pub -r 2 /chatter std_msgs/msg/String '{"data":"hello"}'
    ros2 topic echo /chatter
    ros2 topic hz /chatter
    ros2 node info /simulator
    ros2 interface show sensor_msgs/msg/Image

## Course plan

Six sessions of 90 minutes, with Sessions 1–2 introductory. See docs/COURSE.md for the agreed progression and proposed final consolidation session. Future sessions are planning material, not implemented features.
