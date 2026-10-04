#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <kinenest/reports.hpp>
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
    std::uint32_t count = 0;
    double sum_x = 0.0;
    for (std::uint32_t x = 0; x < width; ++x) {
      for (std::uint32_t y = 0; y < height; ++y) {
        const size_t offset = y * msg->step + 3 * x;
        if (pixels[offset] >= 181 && pixels[offset + 1] <= 99 && pixels[offset + 2] <= 99) {
          ++count;
          sum_x += x;
        }
      }
    }
    const bool visible = count > 500;
    if (visible) {
      const double cx = sum_x / count;
      kinenest::report_detection(true, cx);
      RCLCPP_INFO(get_logger(), "%s", cx < width / 3.0 ? "LEFT" : cx > 2 * width / 3.0 ? "RIGHT" : "CENTER");
    } else {
      kinenest::report_detection(false);
      RCLCPP_INFO(get_logger(), "NONE");
    }
  }
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<CameraReader>());
}
