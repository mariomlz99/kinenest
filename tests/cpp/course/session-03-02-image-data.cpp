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
    std::array<double, 3> sums{0.0, 0.0, 0.0};
    for (std::uint32_t y = 0; y < height; ++y) {
      for (std::uint32_t x = 0; x < width; ++x) {
        const size_t offset = y * msg->step + 3 * x;
        for (size_t channel = 0; channel < 3; ++channel)
          sums[channel] += pixels[offset + channel];
      }
    }
    const double count = double(width) * height;
    if (count == 0) return;
    for (auto &sum : sums) sum /= count;
    kinenest::report_image_stats({int(height), int(width), 3}, sums);
  }
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<CameraReader>());
}
