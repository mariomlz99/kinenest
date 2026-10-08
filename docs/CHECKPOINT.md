# Local review checkpoint — 9 October 2026

Resume the ROS 2 Basics Lab classroom review at the terminal-topics lesson, then continue publisher/subscriber coding. The user asked to pause until tomorrow and save everything locally. This checkpoint supersedes older status notes below.

Both `ros2-basics-lab` and `ros2learn` contain the shared fixes. No remote push or deployment was performed in this review session. Keep future exercise changes mirrored between the two projects, with native Jazzy comparisons and realistic failure behavior (see AGENTS.md).

Completed:
- Populated simulated /opt/ros/jazzy, /bin, /lib from canonical interfaces/runtime assets; saved-session upgrades preserve user edits.
- Shell PATH/executable handling, per-terminal startup/.bashrc, setup/local_setup and workspace overlay behavior; wrong-directory colcon builds retain their actual build/install location, with previous successful executables surviving source edits and failed rebuilds.
- New lesson/unit 3: “Talking ROS 2: Topics & Terminals”, before publisher/subscriber coding. Covers String/Twist, once, continuous/default 1 Hz, fixed-count/rate publishing, matching subscribers, hz, Ctrl+C and volatile no-replay behavior. Seven lessons/units; saved selection/progress migrated.
- Native Jazzy usage/help for supported incomplete topic commands, including missing pub arguments/options; full reference help does not imply all native options (e.g. QoS) are implemented.
- CLI pub/echo nodes are hidden from default node list; --all/-a reveals them. --count-nodes/-c honors visibility. Lesson corrected.
- Original interface text, comments, blank lines and nested indentation captured from native Jazzy for all supported interfaces: 147 Basics Lab / 148 Kinenest. Three display modes: default, --all-comments, --no-comments. Original sources also populate simulated share files. Custom scalar messages preserve comments.
- Bash-style completion: first Tab completes a common prefix; second lists candidates; 100+ matches asks “Display all N possibilities? (y or n)”. Alphabetically ordered vertical columns fit terminal width, with --More-- paging (Space/Enter/q), cancellation and command preservation. Applied to ROS and filesystem completion.

Verification completed:
- Latest full npm test and npm run build pass in both repositories.
- Native terminal/build and topic communication checks passed; native hidden-node visibility verified.
- Native text comparison covers every supported interface and all three display modes; native topic help captures match Jazzy.
- Chrome checks pass in both projects: topics-lesson-check.mjs, topic-help-check.mjs, completion-check.mjs. Earlier real Python/C++ runtime and course checks passed; full Python course acceptance rerun after lesson insertion passed.
- Not all native Bash/ROS options are simulated. New lesson prose may fall back to English in other UI locales; a translation review remains useful.

Local URLs (restart servers if needed):
- Basics Lab: http://127.0.0.1:8017/ros2-basics-lab/ — run npm run dev in ros2-basics-lab.
- Kinenest: http://127.0.0.1:8024/basics.html — run PORT=8024 npm run dev in ros2learn.

Browser workspace state autosaves per browser profile and site origin; it is distinct from these source checkpoints. Running processes do not resume automatically after reload. Preserve the same local ports/origins when returning.

Maintenance commands:
- npm test; npm run build
- node scripts/completion-check.mjs
- node scripts/topics-lesson-check.mjs
- node scripts/topic-help-check.mjs
- For Kinenest browser scripts: LAB_URL=http://127.0.0.1:8024/basics.html
- source /opt/ros/jazzy/setup.bash; python3 scripts/capture-interface-text.py --check
- source /opt/ros/jazzy/setup.bash; python3 scripts/capture-topic-help.py --check

