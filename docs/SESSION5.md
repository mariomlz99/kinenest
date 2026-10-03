# Session 5 — pose, frames and closed-loop control

Six exercises: odometry, quaternion-to-yaw helper, laser frame composition, target relative to robot, closed-loop goal reaching, then LiDAR safety. The final integrated exercise is an extension if the cohort needs more time on frames. Suggested pacing: 15 minutes explanation, 10 + 10 + 10 + 10 + 15 minutes practice, 15 minutes integration, 5 minutes discussion.

Odometry uses valid planar quaternions and odom/base_link frame IDs. tf_transformations.euler_from_quaternion returns roll, pitch, yaw in radians. The actual published TF tree is world → odom → base_link, base_link → laser_link and camera_link, world → target. World/odom coincide in this ideal model. Sensor offsets are 0.2 m and 0.15 m ahead of the base respectively.

Buffer and TransformListener compose/invert the latest received planar transforms. lookup_transform(target_frame, source_frame, Time()) expresses the source origin in the target frame. The browser uses a simplified latest-only time model, no history/interpolation, and periodically republishes every edge on /tf; it does not model /tf_static durability. A real machine distinguishes static and dynamic transform broadcasters. report_transform and report_relative are formative teaching helpers.

The controller calculates distance and heading from target coordinates in base_link. Speeds are clamped. The safety extension uses scan callback state and a brief bypass phase to avoid oscillating at a block edge. It is not a planner and is intentionally demonstrated in a world where it can succeed. No Nav2, SLAM or PID package is included.
