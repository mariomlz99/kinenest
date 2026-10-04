# C++ content implementation plan

Read-only review from 96986c8; proposed API content, not support claims.

| Exercise | Natural C++ concept | Educational hook | Focused negative |
|---|---|---|---|
| 2.1 | LaserScan ranges size/front | none | wrong /laser topic |
| 2.2 | LaserScan state → timer → String pub/sub | none | String subscription on /wrong_chatter |
| 2.3 | angle/minimum sectors | report_sectors(front,left,right) | constant zero sectors; require sample association |
| 2.4 | scan reactive Twist | none | publish only angular/zero travel |
| 3.1 | Image width/height callback | none | subscription without width/height access |
| 3.2 | row stride + byte channels + means | report_image_stats({height,width,3},{r,g,b}) | zero means with actual pixel access |
| 3.3 | RGB threshold red count>500 | report_detection(visible) | constant true across four varied scenes |
| 3.4 | RGB selected x sum/count | report_detection(visible,cx) | fixed center160 across varied scenes |
| 3.5 | Trigger async client response | none | wrong service/no response callback |
| 3.6 | Image centroid → bounded Twist yaw | report_detection(visible,cx) | wrong angular sign/no Twist |
| 4.1 | declare speed parameter/read each timer/Twist | none | read parameter but publish String only (old bypass) |
| 4.2 | parameter updates into running node | none | cache speed at startup, no reread |
| 4.3 | TargetInfo timer publication | none | valid TargetInfo on /wrong_target_info |
| 4.4 | DriveDistance goal+result callback | none | send goal without result observation |
| 4.5 | DriveDistance feedback+result callback | none | goal+result but no feedback handler |
| 4.6 | retained goal handle cancel after0.3m feedback | none | 2m goal without cancellation |
| 5.1 | Odometry nested position/quaternion | report_pose(x,y,yaw) | swap x/y or wrong yaw |
| 5.2 | tf2::getYaw accurately or explicit formula | report_pose(x,y,yaw) | quaternion.z treated as yaw |
| 5.3 | latest TF odom←laser_link | report_transform(x,y) | wrong child camera_link |
| 5.4 | latest TF base_link←target | report_relative(x,y) | reverse lookup without inversion |
| 5.5 | latest TF relative vector → bounded Twist | none | world coordinates used as local bearing |
| 5.6 | TF goal timer+scan safety state | none | ignore scan entirely (no access) |
| 6.1 | broken publisher topic then corrected | none | starter /velocity |
| 6.2 | broken odom←target controller then base_link←target | none | starter wrong reference remains |
| 6.3 | Image centroid+scan safety+Twist | report_detection(visible,cx) | camera controller with constant front/no scan |

## Evidence contracts

- Sensor report calls use the currently executing callback sample/frame. Do not allow arbitrary sample IDs in student API.
- Image dimensions require accessed width+height; payload requires data access. Transport population must not count as student access. Stats need 240x320x3 plus mean tolerance<1. Detection and centroid checks require three correct reports per each of four varied scenes; centroid tolerance8px.
- Sector reference uses wrapped angular distance ±pi/12. Bridge float conversion requires boundary tolerance care. Current checker demands finite three-sector values although explanatory hints permit infinity for an empty sector; existing course scenes provide finite ranges.
- Pose requires three real odometry callbacks and x/y distance<.03 plus wrapped yaw error<.03. Report inside callback.
- Transform report currently compares latest shared runtime transform within.05; TF lookup counter must arise from actual lookup. Pose and TF helpers are KineNest-only, never native rclcpp claims.
- Parameters4.1 require reads plus real /cmd_vel publications;4.2 requires live value changes and changed published speeds. Custom4.3 specifically needs /target_info. Preserve hardening.
- Actions require actual simulator goal acceptance and student consumption events: result status4 for4.4/4.5, feedback≥2 for4.5, feedback≥1+cancel resultstatus5+stopped for4.6. No evidence merely from transport receipt.
- Avoidance requires >2m travel, simulation time>8s, obstacle turn, no collisions, ≥3scan accesses+commands.
- Dock6.3 requires actual image pixel access/callbacks, ≥3scan accesses+commands, centered≥8frames, stopped≥30steps atfront.55–1.10m, no collision.

## API agreement needed

- Header <kinenest/reports.hpp> for report_* helpers.
- Image stats shape/means may use std::array or initializer_list; choose one concise conventional signature.
- Service callback should receive Client<Trigger>::SharedFuture with ready get(), or clearly documented shared-response callback if futures unavailable. No blocking wait.
- Action SendGoalOptions callbacks must match one chosen native-shaped signature; goal_result consumption only after registered callback invoked.
- TF lookup should use canTransform/lookupTransform and genuine exception semantics only if supported; otherwise explicit documented checked failure result. Reference controller must safely publish/retain zero when unavailable.
- C++ 3.2 title and instructions differ from Python NumPy; use programming.cpp.content. All seven translations required.
