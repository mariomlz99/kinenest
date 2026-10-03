# Session 2 — subscribers and reactive control

Four exercises: receive LaserScan, share callback state through String pub/sub and a timer, calculate three angular sectors, then avoid a block. Suggested pacing: 15-minute explanation, 10 + 15 + 15 + 20 minutes of exercises, 10 minutes debugging and 5 minutes discussion.

The scan has 120 beams at 5 Hz, starts at −π, and uses actual rectangular-obstacle/boundary intersections. The laser_link origin is 0.2 m ahead of base_link. Angles are in radians, distances in metres, and no return is infinity. The circular robot has radius 0.18 m; attempted contacts stop translation and count as collisions. This is kinematics with a collision guard, not contact physics.

Real Python callbacks receive ranges and angular metadata. Timers run on simulation time and pause in hidden tabs. report_sectors is a teaching helper, not a ROS API. Checks require callback/data access, correct sector values and real collision-free motion with an obstacle reaction. Stop and Reset terminate the worker. Reference programs live in tests/python/course, never in the deployed assets.
