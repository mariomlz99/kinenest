# Session 3: camera, perception and services

## Six exercises

3.1 subscribes to Image and accesses dimensions. 3.2 converts to NumPy and reports shape/channel means. 3.3 detects red pixels. 3.4 computes their horizontal centroid. 3.5 creates a Trigger client and receives the reset response. 3.6 rotates a robot until the target is centered and stops. Lessons and starter programs are JSON under public/lessons. No Session 2 is invented or required by the implementation.

## Runtime and camera

Session 3 enables /camera/image_raw (sensor_msgs/msg/Image), /reset_server and /reset_robot (std_srvs/srv/Trigger) in the existing Runtime. Lab 01 keeps its original graph. The camera uses a small pinhole projection and RGB rasteriser; movement changes projection, size and visibility. Canvas displays the resulting pixels. No target coordinates are attached to the Python Image. Default targets include red and blue blocks; assessment also uses green distractors and absent/red states.

Image fields: width, height, encoding, step, is_bigendian, header, data. CvBridge.imgmsg_to_cv2 accepts rgb8, bgr8 and passthrough. Its return value is a genuine NumPy ndarray, not a JavaScript emulation. NumPy indexing, means, masks, sums and where work normally. The educational cv2 implements inRange, countNonZero and moments with m00/m10/m01 only; no HSV conversion, contours or native OpenCV is provided.

## Python lifecycle

Pyodide 0.28.3 and its NumPy 2.2.5 package load from a pinned jsDelivr URL. Python runs in a worker, with a bounded one-frame-in-flight policy per subscription. Slow callbacks drop frames. UI output is bounded and rate-limited. The initial download has a timeout, user execution and callbacks have watchdogs, and Stop terminates the worker without requiring SharedArrayBuffer or cross-origin isolation headers. Old worker messages are ignored after replacement. Reset and lesson changes stop Python before restoring the graph; Reset preserves code and Restore starter code explicitly replaces it.

Supported rclpy subset: init, shutdown, ok, create_node, Node, create_subscription for camera Image, create_publisher for Twist, create_client for Trigger, get_logger, destroy_node and spin. spin yields the worker to incoming callbacks; execution after spin is not resumed. Stop terminates the worker and does not promise finally-block execution. General executors, timers, Python service servers, QoS negotiation, ROS actions and arbitrary ROS packages are outside this release.

Service calls use call_async and Future.add_done_callback/result/done. The request and response cross the worker boundary; responses arrive asynchronously. /reset_robot resets robot pose/velocity while preserving nodes, camera subscriptions and lesson evidence. Full Reset clears the whole lab. Synchronous client.call explicitly raises an unsupported-operation error.

## Behavioural checking and multiple solutions

No checker matches code strings or requires specific variable/class/node names. Image property access, completed callbacks, valid publications and actual service responses provide evidence. The helper report_image_stats(shape, channel_means) reports student calculations. report_detection(visible, cx=None) reports a student's classification and centroid, enabling checking and an optional student-derived overlay. These are teaching helpers, not ROS APIs.

Detection and position checks run four varied image scenes in shuffled order with varying target positions and an absent-target case. Three correct frames per scene are required; wrong answers reset that scene's streak. Values are compared with pixels from the same frame. A constant True answer fails. The challenge requires camera callbacks, array conversion, several Python publications, and eight consecutive centered/stopped frames. These are formative checks, not proof against a student intentionally modifying JavaScript. They do not prove arbitrary semantic understanding.

Both NumPy masks and an alternative functional cv2.inRange/moments implementation pass the browser suite. Direct np.frombuffer(msg.data) processing is accepted too; CvBridge is a convenience, not a source-code requirement. The checker cannot require an exact printed phrase: the report helper communicates the computed result. cv2 remains optional; NumPy is the preferred teaching route.

## Browser support and deployment

Native ES modules, workers, WebAssembly, typed arrays and Canvas; no student installations or server-side processing. Current Chrome and Firefox are acceptance targets. Edge uses the same browser APIs but still needs its own smoke test. Safari is not yet verified. The build uses content-versioned src/public paths to prevent mixing old and new deployment assets. Startup errors are visible instead of silently remaining on Loading lesson.

## Source visibility

Static Pages hosting cannot conceal client-side checks or hint text. The dist allowlist excludes tests and reference solutions; the public source repository still contains them. Public-source availability is deliberate and compatible with open-source teaching. Do not use the browser's completion badge as a trusted grade. For summative work, assess a fresh task and explanation separately; no server/account infrastructure is introduced here.

## Teaching context

The page includes optional callback-state and real-machine panels. Camera callbacks may store perception results as node state; this pattern is not enforced by grading. The real-machine panel illustrates ament_python package structure and colcon/source/ros2 run commands. The browser does not execute these build commands. Session 3 remains six camera/perception/service exercises, without parameters, actions or TF exercises.
