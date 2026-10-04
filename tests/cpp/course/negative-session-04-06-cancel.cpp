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
  options.feedback_callback = [node](GoalHandle::SharedPtr, std::shared_ptr<const Action::Feedback> feedback) {
    RCLCPP_INFO(node->get_logger(), "Travelled: %.3f", feedback->distance_travelled);
  };
  options.result_callback = [node](const GoalHandle::WrappedResult &result) {
    RCLCPP_INFO(node->get_logger(), "Cancelled: %s; travelled: %.3f",
      result.code == rclcpp_action::ResultCode::CANCELED ? "true" : "false", result.result->final_distance);
  };
  Action::Goal goal;
  goal.distance = 2.0;
  client->async_send_goal(goal, options);
  rclcpp::spin(node);
}
