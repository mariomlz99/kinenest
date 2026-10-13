# Architecture

`src/app.js` connects the UI and saved workspaces. `src/units.js` defines ROS lessons; `src/units/` contains guidance, preparation and checks. Linux has its own module. Visible examples also supply runtime test fixtures.

The shared environment follows:

```text
files → package → build → install → source → process → ROS graph
```

`Lab` connects the virtual filesystem, shell, builder and process manager. Terminals share files and graph state, with independent directories and environments. Lessons, Playground, Free Lab and Frames & TF use the same implementation in separate saved scopes.

`Runtime.publish` feeds TF messages into one `TransformStore`. The simulator
publishes pose on every integration tick and on reset. The TF view computes
its coordinates from store lookups; it never maintains a second robot pose.
Language workers receive versioned transform snapshots and use the same
composition code. The bridge checks each successful student operation
against the snapshot it observed, and lesson checks require the current
installed executable's latest run. Reset/navigation clears evidence and
stops the TF session's processes. The view updates through the existing
application refresh loop, without its own timer or animation loop.

Python runs in CPython/Pyodide workers. C++ compiles with browser Clang/LLD and runs as WebAssembly. The canonical interface registry supplies CLI inspection, Python types, C++ headers and validation. Process cleanup removes owned endpoints, timers and pending callbacks.

Image messages use typed byte storage and bulk C++ decoding. Subscription queues retain one running callback and one replaceable latest message.

IndexedDB stores workspaces, installed artifacts, history and progress, not running processes. Content-versioned assets keep existing tabs compatible during updates. See [supported behavior](SUPPORTED.md) and [interface provenance](INTERFACES.md).
