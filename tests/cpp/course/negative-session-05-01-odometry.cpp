#include <rclcpp/rclcpp.hpp>
#include <nav_msgs/msg/odometry.hpp>
#include <kinenest/reports.hpp>
#include <cmath>

class PoseReader : public rclcpp::Node {
public:
  PoseReader() : Node("student_controller") {
    subscription_ = create_subscription<nav_msgs::msg::Odometry>("/odom", 10,
      [this](nav_msgs::msg::Odometry::SharedPtr msg) { receive(msg); });
  }
private:
  void receive(nav_msgs::msg::Odometry::SharedPtr msg) {
    const auto &position = msg->pose.pose.position;
    const auto &q = msg->pose.pose.orientation;
    const double yaw = std::atan2(2 * (q.w * q.z + q.x * q.y),
                                  1 - 2 * (q.y * q.y + q.z * q.z));
    RCLCPP_INFO(get_logger(), "Pose: %.3f %.3f %.3f", position.x, position.y, yaw);
    kinenest::report_pose(position.x + 0.5, position.y, yaw);
  }
  rclcpp::Subscription<nav_msgs::msg::Odometry>::SharedPtr subscription_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<PoseReader>());
}
