# Supported behavior

KineNest models beginner ROS 2 Jazzy workflows. Python executes in CPython/Pyodide; C++ compiles with Clang/LLD to WebAssembly. The filesystem, shell, build system and ROS graph are browser models.

## Workspace and terminal

Terminals share files and graph state. Each keeps its own directory, history and environment. Source a workspace separately in every terminal:

```sh
cd ~/ros2_ws
colcon build
source install/setup.bash
```

The virtual `/opt/ros/jazzy` contains inspectable supported packages, interfaces, bindings and installation metadata. Reference binaries are explicitly simulated; their presence does not enable native applications. Browser commands never modify the host filesystem.

Common file commands, environment variables, bounded shell scripts, nano/gedit, history, completion and CLI topic job control are supported. Use command help for exact options. Pipes, command substitution, arbitrary native binaries and full Bash are unsupported. Closing a terminal stops its processes.

## Build and run

- `ament_python` and `ament_cmake`; package.xml dependencies; selected-package builds.
- Real Python syntax checks at build time; module imports and entry-point lookup at run time.
- Beginner CMake: project, required packages, executable targets, dependencies, install rules and ament_package. One source file per executable.
- Build/install/log are created where you build. Building inside src creates src/install.
- Source edits require rebuilding. Failed rebuilds preserve the last successful installation; a failed first build installs nothing. Uninstalled targets cannot run.

Arbitrary setup.py/launch execution, advanced CMake, external native libraries and full overlay precedence between duplicate package versions are unsupported.

## ROS and languages

Use `ros2 --help` and subcommand help. Supported groups include pkg, node, topic, interface, param, service, action, run and launch. Python and C++ exchange typed messages on the same graph. Supported APIs include nodes, pub/sub, timers, scalar parameters, services and asynchronous clients. Actions support goal acceptance/rejection, feedback, results and cancellation through the displayed API subset.

Standard interfaces and generated bindings come from one registry. Custom messages support scalar bool, int32, int64, float32, float64 and string fields after building. Exact integers are limited to JavaScript's safe-integer range. Declarative launch supports nodes, names, namespaces, parameters and remappings.

C++ wall and monotonic clocks use browser clocks. Native threads, C++ exceptions, general executors and arbitrary pip installs are unsupported. Pyodide-distributed packages can load on demand. DDS/RMW internals are outside the current module and are not release blockers.

## Playground and Free Lab

The optional playground provides `/cmd_vel`, `/odom`, `/tf`, `/tf_static`, `/scan` and `/camera/image_raw`. Camera output is RGB8 at 320×240. Motion targets 20 Hz; sensors target 10 Hz in an active tab. Browser scheduling is not a real-time guarantee. A two-second command timeout stops the robot. Camera pixels, scan geometry and ideal odometry share the simulated scene; physical sensor noise and drift are not modeled.

TF inspection uses standard messages, not a complete tf2 buffer or RViz. Start the simulator explicitly. Stop, pose reset and workspace reset have separate purposes.

Free Lab offers the same environment without a checker. It saves and resets independently from graded units and Playground.

## Saving and recovery

Files, installed artifacts, terminal environments/history, progress and workspace-editor drafts autosave locally. Save nano buffers before leaving. Processes and interpreter variables do not resume. Export source to keep a portable backup. Prepare this unit creates missing prerequisites from visible examples while preserving existing packages and their errors.
