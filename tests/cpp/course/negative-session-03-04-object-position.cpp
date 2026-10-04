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
    if (visible) kinenest::report_detection(true, width / 2.0);
    else kinenest::report_detection(false);
  }
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<CameraReader>());
}
