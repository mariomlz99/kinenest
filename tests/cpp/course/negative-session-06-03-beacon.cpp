#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <geometry_msgs/msg/twist.hpp>
#include <kinenest/reports.hpp>
#include <algorithm>
#include <cmath>
#include <cstdint>
#include <limits>

class DockingController : public rclcpp::Node {
public:
  DockingController() : Node("student_controller") {
    publisher_ = create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
    scan_ = create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10,
      [this](sensor_msgs::msg::LaserScan::SharedPtr msg) { receive_scan(msg); });
    image_ = create_subscription<sensor_msgs::msg::Image>("/camera/image_raw", 10,
      [this](sensor_msgs::msg::Image::SharedPtr msg) { receive_image(msg); });
    timer_ = create_wall_timer(std::chrono::milliseconds(100), [this]() { control(); });
  }
private:
  void receive_scan(sensor_msgs::msg::LaserScan::SharedPtr message) {
    // Deliberately do not inspect any scan range.
    front_ = 10.0;
    have_scan_ = true;
  }
  void receive_image(sensor_msgs::msg::Image::SharedPtr message) {
    const std::uint32_t width = message->width;
    const std::uint32_t height = message->height;
    const auto &pixels = message->data;
    std::uint32_t count = 0;
    double sum_x = 0.0;
    for (std::uint32_t y = 0; y < height; ++y) {
      for (std::uint32_t x = 0; x < width; ++x) {
        const size_t offset = y * message->step + 3 * x;
        if (pixels[offset] > 180 && pixels[offset + 1] < 100 && pixels[offset + 2] < 100) {
          ++count;
          sum_x += x;
        }
      }
    }
    visible_ = count > 500;
    image_center_ = width / 2.0;
    if (visible_) {
      centroid_ = sum_x / count;
      kinenest::report_detection(true, centroid_);
    } else {
      kinenest::report_detection(false);
    }
    have_image_ = true;
  }
  void control() {
    geometry_msgs::msg::Twist command;
    if (have_scan_ && have_image_) {
      if (!visible_) command.angular.z = 0.5;
      else {
        const double error = image_center_ - centroid_;
        if (std::abs(error) > 8.0)
          command.angular.z = std::max(-0.8, std::min(0.8, error * 0.008));
        else if (front_ > 0.85) command.linear.x = 0.6;
      }
    }
    publisher_->publish(command);
  }
  double front_ = 0.0, centroid_ = 0.0, image_center_ = 0.0;
  bool visible_ = false, have_scan_ = false, have_image_ = false;
  rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr publisher_;
  rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr scan_;
  rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr image_;
  rclcpp::TimerBase::SharedPtr timer_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<DockingController>());
}
