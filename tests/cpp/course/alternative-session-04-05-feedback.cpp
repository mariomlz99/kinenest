#include <rclcpp/rclcpp.hpp>
#include <rclcpp_action/rclcpp_action.hpp>
#include <ros2learn_interfaces/action/drive_distance.hpp>

using Action = ros2learn_interfaces::action::DriveDistance;
using GoalHandle = rclcpp_action::ClientGoalHandle<Action>;

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("student_controller");
  auto client = rclcpp_action::create_client<Action>(node, "/drive_distance");
  rclcpp_action::Client<Action>::SendGoalOptions options;
  options.goal_response_callback = [node](GoalHandle::SharedPtr handle) {
    RCLCPP_INFO(node->get_logger(), "%s", handle ? "Goal accepted" : "Goal rejected");
  };
  auto observed = std::make_shared<double>(0.0);
  options.feedback_callback = [node, observed](GoalHandle::SharedPtr, std::shared_ptr<const Action::Feedback> update) {
    const double increment = update->distance_travelled - *observed;
    *observed = update->distance_travelled;
    RCLCPP_INFO(node->get_logger(), "Distance: %.3f; change: %.3f", *observed, increment);
  };
  options.result_callback = [node](const GoalHandle::WrappedResult &result) {
    RCLCPP_INFO(node->get_logger(), "Result code: %d; success: %s; travelled: %.3f",
      static_cast<int>(result.code), result.result->success ? "true" : "false", result.result->final_distance);
  };
  Action::Goal goal;
  goal.distance = 1.0;
  client->async_send_goal(goal, options);
  rclcpp::spin(node);
}
