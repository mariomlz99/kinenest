#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <kinenest/reports.hpp>
#include <array>
#include <cstdint>

class CameraReader : public rclcpp::Node {
public:
  CameraReader() : Node("camera_reader") {
    subscription_ = create_subscription<sensor_msgs::msg::Image>(
      "/camera/image_raw", 10, [this](sensor_msgs::msg::Image::SharedPtr msg) { receive(msg); });
  }
private:
  void receive(sensor_msgs::msg::Image::SharedPtr msg) {
    const std::uint32_t width = msg->width;
    const std::uint32_t height = msg->height;
    const auto &pixels = msg->data;
    std::array<double, 3> means{0.0, 0.0, 0.0};
    for (size_t channel = 0; channel < 3; ++channel) {
      for (std::uint32_t row = 0; row < height; ++row) {
        const auto *bytes = pixels.data() + row * msg->step;
        for (std::uint32_t column = 0; column < width; ++column)
          means[channel] += bytes[column * 3 + channel];
      }
      means[channel] /= double(width) * height;
    }
    kinenest::report_image_stats({int(height), int(width), 3}, means);
  }
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<CameraReader>());
}
