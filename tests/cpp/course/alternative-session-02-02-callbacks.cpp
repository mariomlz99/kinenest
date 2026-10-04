#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <std_msgs/msg/string.hpp>
#include <cmath>

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("callback_reader");
  auto front = std::make_shared<double>(0.0);
  auto publisher = node->create_publisher<std_msgs::msg::String>("/chatter", 10);
  auto scan = node->create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10,
    [front](sensor_msgs::msg::LaserScan::SharedPtr msg) {
      const auto index = static_cast<size_t>(std::lround(-msg->angle_min / msg->angle_increment));
      if (index < msg->ranges.size()) *front = msg->ranges[index];
    });
  auto chatter = node->create_subscription<std_msgs::msg::String>("/chatter", 10,
    [node](std_msgs::msg::String::SharedPtr msg) {RCLCPP_INFO(node->get_logger(), "%s", msg->data.c_str());});
  auto timer = node->create_wall_timer(std::chrono::milliseconds(200), [publisher, front]() {
    std_msgs::msg::String message;
    message.data = std::to_string(*front);
    publisher->publish(message);
  });
  rclcpp::spin(node);
}
