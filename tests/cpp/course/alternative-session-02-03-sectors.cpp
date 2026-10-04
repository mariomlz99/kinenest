#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <kinenest/reports.hpp>
#include <algorithm>
#include <cmath>
#include <limits>
constexpr double pi = 3.141592653589793;

double sector(const sensor_msgs::msg::LaserScan &scan, double center) {
  const double half_width = pi / 12;
  int first = static_cast<int>(std::ceil((center - half_width - scan.angle_min) / scan.angle_increment - 1e-5));
  int last = static_cast<int>(std::floor((center + half_width - scan.angle_min) / scan.angle_increment + 1e-5));
  first = std::max(0, first);
  last = std::min(static_cast<int>(scan.ranges.size()) - 1, last);
  double nearest = std::numeric_limits<double>::infinity();
  for (int i = first; i <= last; ++i)
    if (std::isfinite(scan.ranges[i])) nearest = std::min(nearest, double(scan.ranges[i]));
  return nearest;
}

class SectorReader : public rclcpp::Node {
public:
  SectorReader() : Node("student_controller") {
    subscription_ = create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10,
      [](sensor_msgs::msg::LaserScan::SharedPtr msg) {
        kinenest::report_sectors(sector(*msg, 0), sector(*msg, pi / 2), sector(*msg, -pi / 2));
      });
  }
private:
  rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<SectorReader>());
}
