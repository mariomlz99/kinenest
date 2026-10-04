#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <cstdint>

int main() {
  rclcpp::init();
  auto node = std::make_shared<rclcpp::Node>("camera_stress");
  node->declare_parameter("work", 500000);
  auto subscription = node->create_subscription<sensor_msgs::msg::Image>(
      "/camera/image_raw", 10, [node](sensor_msgs::msg::Image::SharedPtr msg) {
        const auto iterations = node->get_parameter("work").as_int();
        volatile uint32_t value = msg->data.front() + 1u;
        for (int64_t i = 0; i < iterations; ++i) {
          value = value * 1664525u + 1013904223u;
          value = value ^ (value >> 13);
        }
        if (value == 0u) RCLCPP_INFO(node->get_logger(), "checksum zero");
      });
  rclcpp::spin(node);
}
