#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <cstdint>

// Deliberate CPU work for the isolated mailbox stress test, not lesson guidance.
// Wall clocks/sleep are unavailable in this toolchain.
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("slow_camera");
  auto sub = node->create_subscription<sensor_msgs::msg::Image>(
    "/camera/image_raw", 10, [node](sensor_msgs::msg::Image::SharedPtr image) {
      volatile std::uint32_t sum = 0;
      for (std::uint32_t i = 0; i < 1000000; ++i) sum = sum + i;
      RCLCPP_INFO(node->get_logger(), "image bytes %zu, checksum %u",
        image->data.size(), std::uint32_t(sum));
    });
  rclcpp::spin(node);
}
