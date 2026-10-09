# Package continuity, local IntelliSense and terminal widths — 9 October 2026

- Lesson 3 keeps native ROS package-creation templates, then explicitly edits the visible hello source to print `Hi from my_first_package.` in either language. Lesson 4 removes only `src/my_first_package`, `build/my_first_package`, and `install/my_first_package`, then recreates that same package with publisher/subscriber dependencies. Later parameter/custom-message/launch examples use the same name. The removal is a visible exercise command; saved work is never silently rewritten. Native Python and C++ builds verify the greeting and removal of stale hello executables; browser runtime checks verify rebuilt publisher/subscriber delivery.
- NumPy is working: `np.concatenate(([1, 2], [3, 4]))` yields `[1 2 3 4]`; calling it without arrays raises the native TypeError. Both cases are checked in a real browser package build/run.
- Editor suggestions and call help run locally: Python imports/aliases/NumPy arrays and functions, Python/C++ ROS imports/includes/namespaces, nested fields, constants, service/action sections and workspace message schemas. NumPy signature data comes from the browser runtime (2.2.5), captured by scripts/capture-editor-catalog.mjs; message fields come from the canonical registry. This is syntax-based assistance, not a full language server. Ctrl+Space opens suggestions; Tab accepts; Esc closes. No user code is executed or sent to a server for completion.
- Terminal columns now have pointer- and keyboard-operable horizontal-width dividers, saved by column count. Narrow layouts stack terminals; Restore layout resets ratios. Browser tests cover desktop, half-width, mobile, persistence, and zero completion network requests.
- Review locks remain on lessons 4–7 and the playground. Shared fixes are mirrored in KineNest locally; only the standalone lab is published.

# Completed parity and suspension checks — 9 October 2026

- `topic hz` reports mean rate, min/max interval, population standard deviation and interval-window count from observed samples; it suppresses stale reports. Finite publishers repeat the native waiting line every second until a matching subscriber arrives.
- Ctrl+Z suspends CLI topic publishers, echo and hz without removing their nodes; jobs/fg/bg/kill control them. Publishers retain counters, subscribers buffer up to 10 messages. Worker programs and editors do not yet support suspension; unsupported foreground commands report that limitation. Native Bash/Jazzy and Chrome keyboard checks verify stop/resume/interrupt behavior.
- All 15 lesson 1 command steps are compared against native Bash/Jazzy by scripts/lesson-one-parity.mjs (home path and ls column layout normalized; root help filtered to implemented groups). Lesson 2 native runner and browser runner exercise the command sequence, delivery, exact message text fixtures, waiting and volatile no-replay behavior. Timings and native process identifiers naturally vary.
- Lesson 3 C++ package creation/build/source/run passes in both local Chrome and the pre-update live site. The prior deployed worker URL assets/dd89bc7a5d8d/src/cpp/worker.js returned HTTP 404: open tabs referencing deleted versions could fail with an empty worker error. scripts/stage-pages.mjs retains earlier immutable asset versions; the deployment restores the two previously removed lab versions. Empty worker errors now provide a recovery diagnostic. No generated CMake change was needed.
- Shared fixes remain local in KineNest; only the standalone lab is published.

# Native terminal review corrections — 9 October 2026

- `tree` now renders branches and native-style counts, hiding dotfiles by default. Interactive `ls`/`tree` use bold blue directories; executables are green. Plain transcripts strip color codes.
- Generated reference inventory captures every path under the local `/opt/ros/jazzy` plus installed Graphviz package files (21,333 paths). Text is compressed and decoded on inspection; binary artifacts carry size/hash and an explicit simulation marker. Native symlink targets are recorded. Existing runtime-backed files remain modeled; reference files do not enable RViz, rqt, Graphviz or other native executables. Run `python3 scripts/capture-native-installation.py --check` to compare the committed inventory with this host. Compact saved sessions keep references and preserve edited files.
- `ros2 --help` uses captured Jazzy formatting, filtered to implemented groups. `daemon start/stop/status` are modeled; node discovery starts the hidden daemon, `node list --all` includes it, and stopping it leaves publishers/subscribers running. Root and daemon help captures: `source /opt/ros/jazzy/setup.bash; python3 scripts/capture-cli-help.py --check`.
- Removed “student node”/“learner node” wording. A node is a participant in the ROS graph; hidden CLI nodes are explained explicitly.
- CLI publishers print `publisher: beginning loop` and typed Python message representations. All 135 canonical built-in message types match native captures for default and populated values (305 total fixtures including edge values), for publisher representations and echo YAML; the additional simulator rate/status sentence is removed for once, continuous and fixed-count publishing. Echo retains YAML.
- Shared corrections are mirrored locally to KineNest. Browser verification covers tree/colors/transcripts, all 28 Jazzy bin entries, root help, daemon lifecycle, topics exercises and workspace build/source/run. Unit suites pass in both projects.

# Lesson order updated — 9 October 2026

The first three lessons are now: 1. ROS 2 environment; 2. Talking ROS 2: Topics & Terminals; 3. Workspace & packages. Curriculum version 3 migrates existing selections, progress and guide positions by content. Later lessons retain their indices. The lab review locks on lessons 4–7 and the playground remain in effect; KineNest has no review locks. Shared source changes are mirrored locally; only the lab is deployed for this update. Both automated suites pass; lab Chrome checks cover topics, workspace build/source/run, onward navigation, locks and saved work.

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

