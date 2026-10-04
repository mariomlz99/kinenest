# Wave 5: odometry and yaw semantics

Reviewed the proposed C++ Odometry layer and next-wave TF prototype against the existing runtime and Python implementation. No runtime replacement or 3D scene support is introduced.

## API decisions

- Odometry retains native field nesting: header, child_frame_id, pose.pose.position/orientation, and twist.twist.linear/angular.
- Quaternion defaults to identity (w=1), matching the explicit [Humble](https://raw.githubusercontent.com/ros2/common_interfaces/humble/geometry_msgs/msg/Quaternion.msg) and [Jazzy](https://raw.githubusercontent.com/ros2/common_interfaces/jazzy/geometry_msgs/msg/Quaternion.msg) message defaults.
- The first getYaw proposal assumed a unit quaternion. The reviewed helper uses quaternion norm and the upstream pitch-singularity conventions, while runtime transforms remain planar.
- PoseWithCovariance and TwistWithCovariance currently omit covariance[36]. Runtime JavaScript messages contain those arrays; current exercises do not use them. This is an explicit compatibility gap.

## Source and licence

The semantics reference is [tf2/impl/utils.hpp](https://raw.githubusercontent.com/ros2/geometry2/rolling/tf2/include/tf2/impl/utils.hpp). Its own header states copyright 2014 Open Source Robotics Foundation, Inc. and Apache-2.0. This statement applies to that file, not automatically to every tf2 component. The concise helper adapts its mathematical behavior; preserve the source/copyright attribution with the implementation.

## Isolated checks completed

- Native C++17 syntax: all 26 Wave 5/6 starter, reference, alternate and negative fixtures compile using temporary Clock/get_clock and bridge scaffolding.
- ASan/UBSan: 252 quaternion cases cover ordinary and singular pitch, unit/nonunit scale, and negative scale.
- Eight actual runtime Odometry payloads decode correctly, including timestamp, frame IDs, pose and velocity.
- Next-wave TF prototype: 288 lookups (all frame pairs at eight robot poses) agree with course.js composition/inversion. Rotation comparison allows equivalent quaternion signs.
- Existing Python Buffer permits an unknown frame queried against itself. An isolated proposed guard rejects unknown frames and preserves known identities; 288 numeric comparisons and 26 rejection cases pass. This patch remains deferred to Wave 6.

These native checks verify shape and mathematics; they do not substitute for real browser compilation and execution.

## Browser gate

Python Session 5 passes in Chrome and Firefox against asset 71e1fc813a79 (build reports commit d308b2cf89b755a58d6c98451917efb2414cc806). All six reference programs, including goal control and LiDAR safety, pass the behavioral checks; empty-exercise negatives, NL/FR language preservation, theme and layout assertions also pass. The shared harness clicks Stop after each reference; this run does not independently assert Reset or infinite-loop recovery. Logs: /tmp/kn-wave5-python-session5-chrome.log and /tmp/kn-wave5-python-session5-firefox.log. Real C++ browser acceptance is coordinated separately before public enablement.
