#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
int main() {
  rclcpp::init();
  auto node = std::make_shared<rclcpp::Node>("scan_reader");
  auto sub = node->create_subscription<sensor_msgs::msg::LaserScan>(
    "/wrong_scan", 10, [node](sensor_msgs::msg::LaserScan::SharedPtr scan) {
      RCLCPP_INFO(node->get_logger(), "beams %zu front %.2f", scan->ranges.size(), scan->ranges.at(scan->ranges.size()/2));
    });
  rclcpp::spin(node);
}
