# C++ parity bridge implementation plan
Reviewed starting commit: 96986c86223c575a1acb2f3525f5728bd5fddf6d.
Read-only review; no source changes.

## Architectural boundary
Keep RuntimeAdapter as sole owner of graph, robot, services, action server,
parameters, mailboxes, evidence and cleanup. CppBridge supplies worker lifetime
and parameter forwarding; worker maps shared protocol to a small WASM ABI.
compat.hpp supplies typed educational ROS-shaped C++ APIs. Do not add another
simulator or language-specific checker.

## Wave 1 minimal ABI
Retain kn_receive_scan and kn_range_access initially.
Add:
- field_number(path_ptr, path_len): double; numeric type required, missing field
  is a precise runtime error, not silently zero. Incoming LaserScan Infinity is
  valid. Outgoing control/report fields must be finite.
- field_string_size(path_ptr, path_len): int UTF-8 byte length.
- field_string_copy(path_ptr,path_len,dest_ptr,capacity): int bytes copied.
  Contract says bytes, not JS UTF-16 code units; no implicit NUL required.
- kn_receive_message(subscription): exported C++ dispatcher.
Current event payload lives only in worker JS during this synchronous dispatch.
Resolve own properties only; array index segments must be numeric and in bounds.
No JSON parsing in C++, no asynchronous host access imports.
MessageTraits<T> supplies type_name(), decode(), encode(msg).
Subscription registry stores erased std::function<void()>; closure calls
MessageTraits<T>::decode() and then student callback.
String and Twist publishers use same generic Publisher<T>; callbacks remain real.
Keep existing LaserScan path until image/generic array work justifies replacing it.

Reports: C++ emits report name/values only. Worker attaches current sample.
range/sectors/pose require actual current sample; image report requires current
frame and payload access. Report helpers are kinenest::*, never rclcpp::*.
Preserve RuntimeAdapter's existing report validation against physical sample.
relative/transform are currently timer reports (sample absent). Do not attach an
unrelated scan/TF sample to them: adapter assessCourse does not handle those
report kinds when sample exists.

Numbers: replace std::to_string for outgoing numeric JSON with a shared finite
serializer (snprintf %.17g for double). NaN/inf should fail with
"Twist.linear.x must be a finite number". A host fail(ptr,len) import can throw
JS Error to stop WASM without claiming native C++ exception support.
Ensure an error stops before publication and no ready/processed success follows.

## Image (Wave 2)
Use existing RuntimeAdapter image event unchanged:
{kind:"image",subscription,frame,meta,bytes:Uint8Array}, transfer bytes.buffer.
LatestMailbox already gives one in-flight and one replaceable latest sample.
Avoid JSON arrays. Allocate owned C++ Image.data vector once per message,
copy Uint8Array into linear memory, dispatch callback, release temporary
storage after callback unless student retained shared_ptr.
Conventional fields width,height,encoding,step,is_bigendian,header and data.
Keep sample/frame IDs worker-private for evidence association.
Track data method/index/iterator accesses with vector-like wrapper.
Track width/height through scalar wrapper only if printf bridging is fixed:
rclcpp::log must be variadic template; unwrap tracked scalars to primitive types
before calling printf. Passing wrappers to C varargs is undefined/incorrect.
Do not track decoder assignments as student access.
Post processed only on successful callback, then frame_done in finally.
Owned message lifetime allows storing Image::SharedPtr safely; stale image reads
must not accidentally count as current frame evidence.

Measure: image payload bytes (230400 at 320x240rgb8), dispatch count and elapsed,
max pending mailbox (<=1 plus in flight), callback timing, dropped samples,
WASM memory capacity high-water. Distinguish WASM linear memory from process RAM.
At 8Hz payload is 1,843,200 B/s per subscriber before copies.

## Services (Wave 3)
Reuse client/service_call/service_response/response_received messages.
Client<Request>::async_send_request creates monotonically unique request id,
stores pending callback, emits service call, returns lightweight pending handle.
Callback may take educational SharedFuture whose get() returns response only
after dispatch. No blocking wait/std::future executor semantics.
Trigger response fields success/message. Errors remain explicit and actionable.
Delete pending entry before invoking callback. Unknown/stale responses ignored.
Stop/Reset terminates worker; adapter forwarding must capture run generation.

## Parameters (Wave 4)
Reuse parameter_declare/read and parameter_update.
CppBridge registers parameterListener exactly as PythonBridge does, and removes
on Stop. Capture worker identity and check current run ownership before forwarding.
C++ Parameter tagged bool/number/string (native integer/double distinction absent).
declare_parameter<T> sets local value + emits declaration; get_parameter reads
current local map and emits parameter_read value. Updates arrive serialized
between callbacks. Missing/wrong-type access should fail clearly, not return zero.
Reset clears worker + node parameters and pending listener.
TargetInfo traits supports visible bool, position string, confidence finite number;
shared Runtime.publish remains authority for confidence range and correct topic.

## Odometry (Wave 5)
Decode nested header,child_frame_id,pose.pose.position/orientation,
twist.twist.linear/angular. Omitted covariance explicitly documented.
getYaw uses normalized quaternion formula or explicit lesson formula.
pose reports bind current /odom sample and validate against shared evidence.

## TF (Wave 6)
Buffer subscribes via TransformListener to actual /tf TFMessage using generic
message decode, not hidden Runtime lookup imports.
Decode published edge snapshot; latest-only composition/inversion uses same
semantics as Python Buffer and runtime/course.js lookup(target,source).
No independent world state.
canTransform or tryLookupTransform(out) handles missing first sample/unknown frame.
A lookupTransform return-value API may fail with precise host error if unavailable,
but do not present catchable native TransformException until toolchain proves it.
Timer examples guard canTransform first.
Use TimePointZero/Time(0) as latest-only marker and reject unsupported history.
Emit tf_lookup only after successful resolution.
Numerical tests compare C++ result, Python Buffer and visual shared model, including
rotated parent and non-colocated camera/laser frames.
Snapshot lag can differ from current host pose by a tick; tests should compare
capture timestamps or stationary snapshots, not demand impossible exact simultaneity.

## Actions (Wave 7)
Reuse action_client,action_goal,action_cancel/action_event/action_observed.
DriveDistance:
Goal.distance
Feedback.distance_travelled
Result.final_distance,success
Lightweight ClientGoalHandle stores goal id, acceptance, terminal state and options.
SendGoalOptions has goal_response_callback, feedback_callback, result_callback.
async_send_goal creates pending record before emit; accepted dispatch resolves
handle; feedback dispatch invokes only installed callback; result invokes installed
callback exactly once, emits action_observed only for consumption.
Rejected goal: notify rejection, clear pending state, no result callback expected.
async_cancel_goal uses separate request id. Unknown/terminal cancel returns empty
goals_canceling safely. Clear state after terminal callback but preserve handle
terminal result for diagnostics.
IMPORTANT: current cancelGoal synchronously generates result before adapter posts
cancel response. Therefore RESULT before CANCEL_RESPONSE is possible and valid.
Do not assume the reverse ordering; test both result/cancel races.
Capture worker/generation for host notify closure; this.worker alone may point to
a subsequent run when stale callbacks arrive.

## Shared lifecycle pitfalls
- RuntimeAdapter action notify currently closes over this.worker. Capture original
  worker/run token; discard if current worker differs.
- Check owned node before forwarding services/action/parameter responses.
- Do not let old frame_done release new worker mailboxes after replacement.
- Existing CppBridge onmessage identity guard is good; preserve it.
- Worker chain queues promises but mailbox bounds message production. New APIs
  must not bypass mailbox and flood the event queue.
- Node destruction removes endpoints but owned C++ timer/subscription handles may
  still exist. Dispatch must ignore deleted node ownership.
- map lookups during callbacks must tolerate subscription/timer cancellation
  inside callback; copy callable if erasure can invalidate active std::function.
- Avoid C++ callback cycles: node->subscription->lambda shared_ptr(node); use
  weak_ptr or capture this while node lifetime is retained by spin.
- Timer/controller future APIs should never wait/block within host JS.
- Header paths for every advertised include must be registered before compile;
  tests should compile actual lesson sources with their exact includes.

## Source references
src/cpp/worker.js:10-21 — compiled include map, emit import, current scan ABI.
src/cpp/compat.hpp:24-42 — range access wrapper.
src/cpp/compat.hpp:63-108 — publishers/subscriptions/node/export dispatch.
src/runtime/adapter.js:48-66 — existing parameter/action/service events.
src/runtime/adapter.js:67-90 — mailbox, binary image transport, evidence.
src/runtime/adapter.js:59 — special timer TF reports vs sample reports.
src/runtime/mailbox.js — one-inflight plus replaceable pending.
src/runtime/course.js:14-33 — shared transform tree and lookup semantics.
src/runtime/course.js:45-57 — physical action lifecycle and synchronous cancel result.
src/python/bridge.js:12 — parameter listener registration.
src/python/compat.py:297-368 — image/message evidence and reports.
src/python/compat.py:379-436 — action futures and consumption evidence.
src/python/compat.py:438-470 — Python latest-planar Buffer/listener.
