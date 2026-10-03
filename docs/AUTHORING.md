# Authoring lessons

Fork the repository, edit lesson data, enable GitHub Pages and teach. Start by copying a nearby exercise rather than modifying the runtime.

## Files

- public/lessons/session-02.json through session-06.json: ordered catalogs with id, number, title and translated titles.
- public/lessons/<id>.json: one exercise, including programming.python.starterCode and optional C++ starter code.
- public/lessons/topics-01.json: Session 1 uses its smaller CLI lesson format.
- tests/python/course/<id>.py: reference programs for Sessions 2, 4, 5 and 6. Session 3 references are tests/python/solution-1.py through solution-6.py.

Keep IDs stable. UI language switches share the same starter, world and checks; only teaching text changes.

## Minimal exercise

This example uses the existing subscriber check. The callback must read ranges in at least three messages; no particular function name or source string is required.

~~~json
{
  "id": "session-02-05-front-range",
  "number": "2.5",
  "title": "Read the front range",
  "description": "Subscribe to /scan and print the forward distance.",
  "steps": [
    "Inspect /scan with ros2 topic info /scan.",
    "Complete the callback and run the node."
  ],
  "hints": [
    "A subscription calls your function when a message arrives.",
    "This world uses 120 rays; index 60 points forward."
  ],
  "programming": {"python": {"supported": true, "starterCode": "import rclpy\nfrom sensor_msgs.msg import LaserScan\nrclpy.init()\nnode = rclpy.create_node('range_reader')\ndef receive(msg):\n    pass  # TODO: print the forward range\nnode.create_subscription(LaserScan, '/scan', receive, 10)\nrclpy.spin(node)\n"}, "cpp": {"supported": false, "starterCode": ""}},
  "checks": [{"type": "subscriber"}],
  "startX": 0,
  "startY": 0,
  "startYaw": 0,
  "world": {
    "bounds": {"minX": -2, "maxX": 6, "minY": -3, "maxY": 3},
    "obstacles": [{"x": 2, "y": -0.5, "w": 0.5, "h": 1}]
  }
}
~~~

Add the matching catalog entry and a reference program. Before merging, add translations as described below; completeness tests reject the abbreviated example above until translations exist.

## Worlds and sensors

Coordinates are metres, yaw is radians, +x is forward at zero yaw and +y is left. Rectangles use x/y for the lower-left corner and positive w/h. Bounds require minX < maxX and minY < maxY. LiDAR and collision checks use these rectangles.

- startX/startY/startYaw set the initial pose.
- world supplies bounds and obstacles. Session 2 has a default training world if omitted; other sessions normally use an empty world.
- targets is a camera object array, for example [{"x":5,"y":0,"color":[235,45,45]}]. Python processes rendered pixels, not hidden target coordinates.
- goal: [x,y] sets the TF target and goal-check position. A camera target and a goal are separate fields: set both to the same physical location when that is the teaching intent.
- frames optionally selects visible axes, e.g. ["base_link","laser_link"]. Exercise 5.3 selects these by default; other TF exercises use world/base_link/target.
- testScenes: true enables Session 3’s varied-scene detector test. Use it for detection/centroid checks, not motion exercises.

The page determines which session checker runs. Adding a fundamentally new sensor or check requires a runtime/checker change and tests; JSON alone does not implement new APIs.

## Checks

Choose existing behaviours from src/exercises/course.js or perception.js.

| Type | Evidence |
| --- | --- |
| subscriber | LaserScan callback reads ranges three times |
| sectors | Correct front/left/right distances reported |
| avoidance | Reaction, travel, elapsed time and no collisions |
| configured / parameter | Parameter reads and live value changes |
| custom | Three valid TargetInfo publications |
| action_result / action / cancel | Actual goal result, feedback or cancellation |
| pose / transform / relative | Correct reported pose or TF calculation |
| goal / integrated | Goal reached and stopped; optional scan safety |
| camera_subscriber / image_array | Image callbacks and actual pixel access |
| detection / position | Correct results across varied rendered scenes |
| service | Python client, request, response and reset |
| control / centered | Commands, centered image and stopped robot |

Read the implementation for thresholds. report_pose, report_transform, report_relative, report_sectors and image-report helpers submit computed values for checking. They are educational helpers, not standard ROS APIs. Explain them in the task. Avoid source matching and allow alternate algorithms.

## Text and hints

Use short tasks: concept, action, observation and check. Keep long context in a reference panel. Hints should progress from concept to API to partial syntax. Starter code and comments remain English. Follow [BRANDING.md](BRANDING.md); use KineNest as the product name and ROS 2 descriptively.

## Seven languages

English lives at the top level. Add translations.nl, .fr, .es, .de, .pt and .it, each containing only title, description, steps and hints. Preserve step and hint counts. Update translated catalog titles too. Never copy starter code, worlds or checks into a translation.

Shared UI rows live in src/ui/locales.js, ordered NL, FR, ES, DE, PT, IT. Required controls must be translated. An explicit {"fallback":"en"} is reserved for technical/legal reference text; it is not a substitute for translated lesson material. Python, command syntax, message types and frame IDs remain English.

## Validate

Run npm test and npm run build. Add a valid reference program and, where useful, an alternate solution and a failing control. Run both complete browser suites before deployment. Check that an empty program fails, intended behaviour succeeds and Reset clears prior evidence. Slow or infinite student code must remain stoppable.

Production excludes tests and reference programs. The public repository still exposes them, and client-side checks are inspectable. Use checks for practice; assess understanding through explanation or a fresh task.

## Code variants

Use programming.python and programming.cpp. Set supported only for a tested adapter/lesson pair; experimental: true keeps an implemented variant developer-gated unless ?experimentalCpp=1. Add visibility: public only after both browser acceptance suites pass; its Experimental label can remain. supported: false never exposes execution, even with the flag. Keep world, ID, mission and checks shared. Tests and reference programs belong under tests/, never public/. Compare uses current drafts. The compatibility reader still accepts old starterCode, but new lessons should use programming. See [CPP.md](CPP.md) for the implemented C++ subset.
