# Roadmap

## Now

Complete six-session browser course: original CLI lab; four Session 2 exercises; six Session 3 exercises; six Session 4 exercises including optional cancellation; six Session 5 exercises including integration; three Session 6 debugging/challenge tasks. Real Python/NumPy, camera, ray-cast LiDAR, parameters, custom messages, action client/server, planar TF and control share one runtime. Static hosting, light/dark, EN/NL/FR/ES/DE/PT/IT and split/stacked layouts are implemented.

Experimental C++ now compiles in-browser for exercises 2.1 and 2.4, with editable Compare drafts. It remains feature-gated; broader API parity and a modern toolchain require their own validation.

## Next

Lecturer review and classroom trials. Measure completion times, clarity and transfer to real ROS. Have native speakers review tutorial translations. Test Edge and Safari independently. KineNest is the working public name, not a cleared trademark. Review a separate repository migration before broad promotion.

## Later

Improve the editor and consider movable/resizable panels after classroom feedback. Add lessons only when a teaching need is clear. Student-written servers and deeper execution semantics need a separate focused design.

## Ideas

A broader curriculum may follow the six-session course. Real ROS integration, RViz/Gazebo, native CMake execution and cloud runtimes remain separate future work. No backend, accounts, grades database or LMS integration is planned for this phase.

Optional investigation: [rmw_wasm](https://github.com/ros2wasm/rmw_wasm) as a separate browser middleware adapter. Its README targets Humble and lists publishers, subscribers and services; actions, parameters and QoS are unsupported. No integration has been implemented or benchmarked.

Start with precompiled talker/listener workers, then bridge a Twist to the existing simulator and checker. Measure download size, startup, memory, message latency and Stop/Reset in Chrome and Firefox on Pages before considering adoption. Pyodide integration and editable C++ compilation remain separate problems: the project's [builder](https://github.com/ros2wasm/ros2wasm-builder) cross-compiles packages in GitHub Actions. Keep the current six-session runtime as the default throughout any experiment.
