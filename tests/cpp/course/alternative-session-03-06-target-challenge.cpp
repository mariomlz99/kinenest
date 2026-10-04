#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <kinenest/reports.hpp>
#include <algorithm>
#include <cmath>
#include <cstdint>
#include <geometry_msgs/msg/twist.hpp>

class CameraReader : public rclcpp::Node {
public:
  CameraReader() : Node("camera_reader") {
    publisher_ = create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
    subscription_ = create_subscription<sensor_msgs::msg::Image>(
      "/camera/image_raw", 10, [this](sensor_msgs::msg::Image::SharedPtr msg) { receive(msg); });
  }
private:
  void receive(sensor_msgs::msg::Image::SharedPtr msg) {
    const std::uint32_t width = msg->width;
    const std::uint32_t height = msg->height;
    const auto &pixels = msg->data;
    std::uint32_t count = 0;
    double sum_x = 0.0;
    for (std::uint32_t y = 0; y < height; ++y) {
      for (std::uint32_t x = 0; x < width; ++x) {
        const size_t offset = y * msg->step + 3 * x;
        if (pixels[offset] > 180 && pixels[offset + 1] < 100 && pixels[offset + 2] < 100) {
          ++count;
          sum_x += x;
        }
      }
    }
    const bool visible = count > 500;
    geometry_msgs::msg::Twist command;
    if (!visible) {
      kinenest::report_detection(false);
      command.angular.z = 0.4;
    } else {
      const double cx = sum_x / count;
      kinenest::report_detection(true, cx);
      const double error = width / 2.0 - cx;
      if (std::abs(error) >= 8.0)
        command.angular.z = std::max(-1.0, std::min(1.0, error * 0.008));
    }
    publisher_->publish(command);
  }
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
  rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr publisher_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<CameraReader>());
}
