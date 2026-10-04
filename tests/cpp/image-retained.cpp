#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <kinenest/reports.hpp>

// Retain an old real message, then read it while newer callbacks run.
// Old-buffer access must never count as processing the current image.
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("retained_camera");
  auto retained = std::make_shared<sensor_msgs::msg::Image::SharedPtr>();
  auto sub = node->create_subscription<sensor_msgs::msg::Image>(
    "/camera/image_raw", 10, [node, retained](sensor_msgs::msg::Image::SharedPtr image) {
      if (!*retained) {
        *retained = image;
        return;
      }
      const unsigned int old_pixel = (*retained)->data[0];
      RCLCPP_INFO(node->get_logger(), "retained byte %u", old_pixel);
      kinenest::report_detection(true, 160.0);
    });
  rclcpp::spin(node);
}
