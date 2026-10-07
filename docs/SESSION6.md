# Session 6 — debugging and integration

Three tasks: repair a wrong command topic, repair a wrong target frame, and approach a red beacon using camera plus LiDAR. The supplied-controller repairs 6.1–6.2 are Core; the beacon mission 6.3 is optional Further practice. Suggested pacing: 10 minutes diagnostic demonstration, 15 + 15 minutes repairs, 35 minutes beacon challenge, 15 minutes student explanation and real-ROS transition.

The debugging starters intentionally contain faults. Students should first use graph/CLI/TF evidence, then make the smallest correction. The checker tests resulting motion, not source strings. A final discussion can include wrong parameter values, missing subscriptions or unavailable service/action names without introducing another API.

The beacon challenge requires real image processing, repeated callbacks, safe approach, target centering and a stopped robot. It combines a subset of the course rather than requiring every API at once. Completion badges remain formative, inspectable client-side feedback. The Build & launch finale uses a bounded educational workspace/build/launch model with real Python execution and C++ compilation. The native transition explains how to export and build the same package on ROS 2 Jazzy.
