# Learning track roadmap

## Core

ROS 2 Foundations is available. The Real ROS 2 Bridge is the final major Core expansion on `core-real-ros-bridge`. Freeze Core after all release gates and maintainer approval. Thereafter Core accepts fixes, compatibility, accessibility, translation, documentation and small teaching improvements.

## Next

Communication & QoS: graph versus middleware, discovery, reliability, history/depth, durability, incompatible QoS, loss/latency and sensor tradeoffs. A future simulation might vary loss, delay, jitter and consumer rate. The conceptual chain is `rclpy/rclcpp → rcl → rmw → DDS/RTPS → network`; KineNest's current transport is not DDS.

## Then, based on teaching feedback

- Manipulation: begin with a 2D arm, joint states, forward/inverse kinematics, TF chains, limits, trajectories, gripper and pick/place. URDF, 3D, collision checks and MoveIt concepts may follow.
- Navigation & Planning: occupancy grids, configuration space, Dijkstra/A*, path following, avoidance versus planning, localization, global/local planning. Nav2 concepts may follow.

## Possible later tracks

Robot Control (feedback, PID intuition, saturation and tuning) and Advanced Perception (noise, depth, point clouds, pose and fusion).

## Research only

Real DDS/RMW/browser interoperability, Rust adapter, MoveIt-style and Nav2-style integration. No dates or delivery commitments are implied. Order after Core freeze stays flexible.
