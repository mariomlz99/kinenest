#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <kinenest/reports.hpp>
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

class SectorReader : public rclcpp::Node {
public:
  SectorReader() : Node("student_controller") {
    subscription_ = create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10,
      [](sensor_msgs::msg::LaserScan::SharedPtr msg) {
        kinenest::report_sectors(0.0, 0.0, 0.0);
      });
  }
private:
  rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<SectorReader>());
}
