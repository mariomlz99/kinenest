#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <geometry_msgs/msg/twist.hpp>
#include <algorithm>
#include <cmath>
#include <limits>
constexpr double pi = 3.141592653589793;

double sector(const sensor_msgs::msg::LaserScan &scan, double center) {
  double nearest = std::numeric_limits<double>::infinity();
  for (size_t i = 0; i < scan.ranges.size(); ++i) {
    const double angle = scan.angle_min + i * scan.angle_increment;
    const double delta = std::atan2(std::sin(angle - center), std::cos(angle - center));
    const double distance = scan.ranges[i];
    if (std::abs(delta) <= pi / 12 + 1e-6 && std::isfinite(distance))
      nearest = std::min(nearest, distance);
  }
  return nearest;
}

class Controller : public rclcpp::Node {
public:
  Controller() : Node("student_controller") {
    publisher_ = create_publisher<geometry_msgs::msg::Twist>("/velocity", 10);
    subscription_ = create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10,
      [this](sensor_msgs::msg::LaserScan::SharedPtr msg) {
        geometry_msgs::msg::Twist command;
        if (sector(*msg, 0) < 1.1) command.angular.z = 0.9;
        else command.linear.x = 0.6;
        publisher_->publish(command);
      });
  }
private:
  rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr publisher_;
  rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Controller>());
}
