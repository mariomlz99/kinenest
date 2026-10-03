# KineCourse

Learn the ROS 2 mental model in your browser. A static university teaching workstation: no student installation, accounts or backend.

Deployment: https://mariomlz99.github.io/ros2learn/ . This repository is independent of the existing personal website.

## Six-session course

Six approximately 90-minute sessions, with the first two introductory:

1. Graph, CLI, topics, messages and cmd_vel: index.html.
2. Subscribers, callback state, LiDAR sectors and obstacle avoidance: session-02.html.
3. Camera, real NumPy, colour/centroid processing, services and visual control: session-03.html.
4. Live parameters, TargetInfo, action goals/feedback and optional cancellation: session-04.html.
5. Odometry, heading, TF and target-relative control with obstacle safety: session-05.html.
6. Debugging repairs and a camera/LiDAR beacon challenge: session-06.html.

The final real-ros.html page explains the transition to a real Python ROS package and workspace. There are 25 Python exercises plus the original CLI lab. See docs/COURSE.md for pacing and scope. Class timings and translations should be reviewed with students before formal course adoption.

Use the header to select dark/light, EN 🇬🇧 / NL 🇳🇱 / FR 🇫🇷 and side-by-side/stacked workspace layouts. Preferences are stored locally. Language changes affect interface and tutorial text; Python, ROS identifiers, commands and technical output remain English. Code is preserved when changing language, theme or layout. Free dragging of panels is deferred.

## Run locally

Maintainers can preview with:

    python3 -m http.server 8000 --bind 127.0.0.1

Open http://localhost:8000 . To check the project path, serve the parent directory and open http://localhost:8000/ros2learn/ . Do not open the HTML through file://.

Maintainer tests/build require Node 22+, with no npm dependencies:

    npm test
    npm run build
    npm run test:chrome -- --built
    npm run test:firefox -- --built

Browser acceptance runs every session with real Pyodide/NumPy solutions, alternate solutions and negative controls. Chrome/Firefox must be installed for these maintainer tests. The runner starts only a temporary local test server. The production site consists entirely of static assets. Edge/Safari have not been independently verified.

For one suite: node scripts/check-browser.mjs chrome --built --suite=session2 . Valid suites include browser (Session 1), session2 through session6. Pyodide downloads require internet. Each suite has a bounded timeout and cleanup.

## Deployment

Set repository Settings → Pages → Source to GitHub Actions. The workflow runs unit/build tests and every Chrome acceptance suite before publishing dist. A push to main deploys; pull requests only test.

    git status
    git push origin main

The production allowlist excludes tests, reference answers, docs and Git metadata. Content-versioned relative asset paths support /ros2learn/ and avoid mixing old/new assets. If a stale tab fails to load after a deployment, reload with Ctrl+Shift+R; startup failures display diagnostics.

GitHub instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages . No changes to the personal-site repository are required. Use your existing credential helper or SSH; never commit credentials.

## Shared terminals and Python

Every terminal and the Python worker on a page share one graph and robot. Separate browser tabs are separate worlds. Add terminals to publish in one and observe in another. Ctrl+C / Stop command ends a foreground stream; Close and Reset clean up endpoints. Logs and history are bounded.

    ros2 node list
    ros2 node info /simulator
    ros2 topic list -t
    ros2 topic info /cmd_vel -v
    ros2 interface show geometry_msgs/msg/Twist
    ros2 topic echo /odom --field pose.pose.position
    ros2 topic pub --once /cmd_vel geometry_msgs/msg/Twist '{"linear":{"x":0.6}}'

The one-shot command travels 1.2 m in the empty introductory world. This controller holds velocity for two seconds; continuous publication defaults to 1 Hz, with --rate / -r supported up to 20 Hz. The timeout and limits (2 m/s, 3 rad/s) are simulator policies, not ROS guarantees.

Supported CLI families:

- node list/info.
- topic list/type/info/find/echo/hz/bw/delay/pub.
- interface list/packages/package/show/proto.
- service list/type/info/find/call.
- param list/get/set.
- action list/type/info/send_goal, including --feedback.

Topics exist according to actual endpoints, without per-lesson command filtering. Twist, String and TargetInfo publication is supported. Dynamic topics disappear when their final endpoint closes. Python supports the course message types, subscriptions, timers, publishers, Trigger clients, scalar parameters, the provided DriveDistance action client and latest planar TF lookup.

## Simulation and limitations

KineCourse reproduces the ROS 2 concepts and APIs used in these lessons, but it is not a complete DDS-based ROS 2 installation.

Python and NumPy run for real in a cancellable Pyodide worker. rclpy, cv_bridge, limited cv2, messages, TF and actions are educational compatibility layers. Camera: 320 × 240 RGB at 8 Hz. LiDAR: 120 rays at 5 Hz against rectangular obstacles and world boundaries where a lesson supplies them. Odometry: 5 Hz ideal pose/velocity with valid quaternions. No-return rays are infinite; covariance is zero. Time pauses when the page is hidden. Slow Python callbacks drop sensor samples rather than building an unbounded queue. Stop terminates even infinite loops; finally blocks are not guaranteed to run.

TF is latest-only and planar; all edges are republished on /tf. DDS, QoS negotiation, historical TF, native OpenCV, student-written service/action servers, shell/package execution, CMake/colcon execution, Nav2, SLAM, C++, RViz, Gazebo and cloud infrastructure are outside this release. See docs/ARCHITECTURE.md and the session documents for precise API boundaries.

## Authoring and assessment

Lessons, starter code, worlds, hints, translated teaching text and check types are data under public/lessons. Runtime logic lives in src/runtime, src/simulator and src/python; shared command parsing in src/terminal; check implementations in src/exercises; UI in src/ui.

Checks observe messages, callbacks, reports and motion, not source-code strings. Multiple solutions are accepted. Reference solutions live in tests/python and are excluded from dist, but remain visible in the public source repository. A static, open-source client cannot conceal hints/checkers or provide tamper-proof grades. Use this for formative learning and assess explanations or fresh tasks separately.

## Licence and name

Original code and lessons use Apache-2.0; see LICENSE and NOTICE. Third-party licences remain applicable; see public/third-party.html. This project is independent of Open Robotics.

KineCourse is the working public name; no trademark clearance is claimed. See docs/BRANDING.md.
