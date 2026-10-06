// Solutions constructed from the supplied starter TODOs and visible lesson guidance.
// These transformations do not import or fetch the reference solution programs.
function replace(s,a,b){if(!s.includes(a))throw Error('Starter changed: '+a);return s.replace(a,b);}
export const coreEdits={
 '02-01-subscriber':{
 python:s=>replace(replace(s,'    pass','    print(len(msg.ranges), msg.ranges[60])'),'# TODO: create a subscription','node.create_subscription(LaserScan, "/scan", receive, 10)'),
 cpp:s=>replace(replace(s,'// TODO: create a LaserScan subscription on /scan.','scan_ = create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10, [this](sensor_msgs::msg::LaserScan::SharedPtr msg) { receive(msg); });'),'// TODO: print the beam count and forward distance.','RCLCPP_INFO(get_logger(), "%zu rays; forward %.3f", msg->ranges.size(), msg->ranges[60]);')
 },
 '02-02-callbacks':{
 python:s=>replace(s,'# TODO: scan callback updates front\n# TODO: timer publishes front as String on /chatter',`def scan(msg):
    global front
    front = msg.ranges[60]
publisher = node.create_publisher(String, '/chatter', 10)
def tick():
    message = String()
    message.data = str(front)
    publisher.publish(message)
node.create_subscription(LaserScan, '/scan', scan, 10)
node.create_timer(0.2, tick)`),
 cpp:s=>replace(s,'// TODO: scan callback updates latest_range_.\n    // TODO: publish latest_range_ as String on /chatter every 200 ms.',`scan_ = create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10, [this](sensor_msgs::msg::LaserScan::SharedPtr msg) { latest_range_ = msg->ranges[60]; });
    publisher_ = create_publisher<std_msgs::msg::String>("/chatter", 10);
    timer_ = create_wall_timer(std::chrono::milliseconds(200), [this]() { std_msgs::msg::String message; message.data = std::to_string(latest_range_); publisher_->publish(message); });`)
 },
 '03-01-camera-subscriber':{
 python:s=>replace(replace(s,'# TODO: create a subscription and keep it as self.subscription.', 'self.subscription = self.create_subscription(Image, "/camera/image_raw", self.image_callback, 10)'),'        pass','        print(msg.width, msg.height)'),
 cpp:s=>replace(replace(s,'// TODO: subscribe to Image on /camera/image_raw, call receive, and retain the handle.','subscription_ = create_subscription<sensor_msgs::msg::Image>("/camera/image_raw", 10, [this](sensor_msgs::msg::Image::SharedPtr msg) { receive(msg); });'),'// TODO: read and print width and height.','RCLCPP_INFO(get_logger(), "%u x %u", msg->width, msg->height);')
 },
 '03-05-services':{
 python:s=>replace(replace(s,'# TODO: self.client = self.create_client(...)','self.client = self.create_client(Trigger, "/reset_robot")'),'        pass','        request = Trigger.Request()\n        future = self.client.call_async(request)\n        future.add_done_callback(self.on_response)'),
 cpp:s=>replace(replace(s,'// TODO: create the Trigger client for /reset_robot.','client_ = create_client<Trigger>("/reset_robot");'),'// TODO: create a shared Trigger::Request.','auto request = std::make_shared<Trigger::Request>();\n    client_->async_send_request(request, [this](rclcpp::Client<Trigger>::SharedFuture future) { auto response = future.get(); RCLCPP_INFO(get_logger(), "%d %s", response->success, response->message.c_str()); });')
 },
 '04-03-custom':{
 python:s=>replace(s,'# TODO: create a TargetInfo publisher for /target_info\n# TODO: publish your status from a timer',`publisher = node.create_publisher(TargetInfo, '/target_info', 10)
def tick():
    publisher.publish(TargetInfo(visible=True, position='LEFT', confidence=0.8))
node.create_timer(0.2, tick)`),
 cpp:s=>replace(replace(s,'// TODO: create a TargetInfo publisher for /target_info.','publisher_ = create_publisher<TargetInfo>("/target_info", 10);'),'// TODO: fill visible, position and confidence, then publish.','TargetInfo message; message.visible = true; message.position = "LEFT"; message.confidence = 0.8; publisher_->publish(message);')
 },
 '04-04-goal':{
 python:s=>replace(replace(replace(s,'    # TODO: inspect status and result\n    pass','    response = future.result()\n    print(response.status, response.result.success, response.result.final_distance)'),'    # TODO: check handle.accepted, request result and attach on_result\n    pass','    handle = future.result()\n    if handle.accepted:\n        handle.get_result_async().add_done_callback(on_result)'),'# TODO: create goal, send_goal_async(goal), then attach accepted to its future','goal = DriveDistance.Goal()\ngoal.distance = 1.0\nclient.send_goal_async(goal).add_done_callback(accepted)'),
 cpp:s=>replace(replace(replace(s,'// TODO: check whether goal_response_callback receives an accepted handle.','options.goal_response_callback = [node](GoalHandle::SharedPtr handle) { RCLCPP_INFO(node->get_logger(), "Accepted: %d", bool(handle)); };'),'// TODO: attach result_callback and inspect code, success and final_distance.','options.result_callback = [node](const GoalHandle::WrappedResult &response) { RCLCPP_INFO(node->get_logger(), "%d %d %.3f", int(response.code), response.result->success, response.result->final_distance); };'),'// TODO: send an Action::Goal with distance = 1.0.','Action::Goal goal; goal.distance = 1.0; client->async_send_goal(goal, options);')
 },
 '05-03-frames':{
 python:s=>replace(s,'    pass','    try:\n        p = buffer.lookup_transform("odom", "laser_link", Time()).transform.translation\n        report_transform(p.x, p.y)\n    except TransformException:\n        return'),
 cpp:s=>replace(s,'// TODO: report the resulting x/y with kinenest::report_transform.','if (!buffer->canTransform("odom", "laser_link", tf2::TimePointZero)) return;\n    const auto t = buffer->lookupTransform("odom", "laser_link", tf2::TimePointZero);\n    kinenest::report_transform(t.transform.translation.x, t.transform.translation.y);')
 },
 '05-04-relative':{
 python:s=>replace(s,'    pass','    try:\n        p = buffer.lookup_transform("base_link", "target", Time()).transform.translation\n        report_relative(p.x, p.y)\n    except TransformException:\n        return'),
 cpp:s=>replace(s,'// TODO: report the resulting x/y with kinenest::report_relative.','if (!buffer->canTransform("base_link", "target", tf2::TimePointZero)) return;\n    const auto t = buffer->lookupTransform("base_link", "target", tf2::TimePointZero);\n    kinenest::report_relative(t.transform.translation.x, t.transform.translation.y);')
 },
 '06-01-topic-debug':{python:s=>replace(s,"'/velocity'","'/cmd_vel'"),cpp:s=>replace(s,'"/velocity"','"/cmd_vel"')},
 '06-02-frame-debug':{python:s=>replace(s,"lookup_transform('odom', 'target'","lookup_transform('base_link', 'target'"),cpp:s=>s.replaceAll('"odom", "target"','"base_link", "target"')}
};
