#include <rclcpp/rclcpp.hpp>
#include <std_srvs/srv/trigger.hpp>

using Trigger = std_srvs::srv::Trigger;
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("service_reader");
  auto client = node->create_client<Trigger>("/reset_robot");
  auto request = std::make_shared<Trigger::Request>();
  client->async_send_request(request, [node](rclcpp::Client<Trigger>::SharedFuture future) {
    const auto reply = future.get();
    RCLCPP_INFO(node->get_logger(), "%s: %s", reply->success ? "success" : "failure", reply->message.c_str());
  });
  rclcpp::spin(node);
}
