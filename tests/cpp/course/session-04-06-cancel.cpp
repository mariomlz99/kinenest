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
  auto accepted = std::make_shared<GoalHandle::SharedPtr>();
  auto cancel_sent = std::make_shared<bool>(false);
  options.goal_response_callback = [node, accepted](GoalHandle::SharedPtr handle) {
    *accepted = handle;
    RCLCPP_INFO(node->get_logger(), "%s", handle ? "Goal accepted" : "Goal rejected");
  };
  options.feedback_callback = [node, client, accepted, cancel_sent](GoalHandle::SharedPtr, std::shared_ptr<const Action::Feedback> feedback) {
    RCLCPP_INFO(node->get_logger(), "Travelled: %.3f", feedback->distance_travelled);
    if (*accepted && !*cancel_sent && feedback->distance_travelled > 0.3) {
      *cancel_sent = true;
      client->async_cancel_goal(*accepted);
    }
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
