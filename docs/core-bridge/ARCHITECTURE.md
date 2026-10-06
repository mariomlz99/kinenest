# Bridge architecture

`bridge.html` attaches to the existing KineNest theme, navigation, translation controls and shared `Runtime`. `WorkspaceModel` owns a bounded data tree under `~/ros2_ws`. `BuildSystemAdapter` validates package structure and dispatches real Python syntax/import checks to Pyodide or actual C++ compilation to the existing browser Clang/LLD worker. A successful build records an immutable source snapshot as an installed package. Edits invalidate that package's install.

Each `BridgeTerminal` has a current directory and sourced state. It accepts a narrow command list and delegates graph inspection to the existing ROS teaching CLI. `ProcessManager` gives each `ros2 run` executable its own `PythonBridge` or `CppBridge`, all sharing one `Runtime`. The existing adapters own workers, nodes, timers, subscriptions, output and cleanup. Launch parses literal Python-shaped configuration without executing arbitrary Python; its group owns the resulting processes.

The Core flow uses an existing pub/sub idea, adds package/build/source/run integration, makes the learner start two nodes manually, then introduces launch. The installed starter launch contains one topic remapping fault; graph inspection and a rebuild resolve it. Checks inspect model state, process ownership, graph endpoints, delivered messages and propagated parameters.

This is an educational browser architecture. The graph is not DDS; modeled `colcon`, `ament`, CMake, filesystem, shell and launch support only the documented subset.
