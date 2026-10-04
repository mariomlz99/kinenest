#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
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
    RCLCPP_INFO(get_logger(), "Image: %u x %u", width, height);
  }
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<CameraReader>());
}
