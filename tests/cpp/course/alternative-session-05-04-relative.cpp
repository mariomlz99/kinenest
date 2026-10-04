#include <rclcpp/rclcpp.hpp>
#include <tf2_ros/buffer.h>
#include <tf2_ros/transform_listener.h>
#include <tf2/time.h>
#include <kinenest/reports.hpp>
#include <cmath>

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("student_controller");
  auto buffer = std::make_shared<tf2_ros::Buffer>(node->get_clock());
  auto listener = std::make_shared<tf2_ros::TransformListener>(*buffer, node);
  auto timer = node->create_wall_timer(std::chrono::milliseconds(200), [node, buffer, listener]() {
    if (!buffer->canTransform("target", "base_link", tf2::TimePointZero)) return;
    const auto transform = buffer->lookupTransform("target", "base_link", tf2::TimePointZero);
    const auto &q = transform.transform.rotation;
    const double yaw = 2 * std::atan2(q.z, q.w);
    const auto &translation = transform.transform.translation;
    geometry_msgs::msg::Vector3 p;
    p.x = -std::cos(yaw) * translation.x - std::sin(yaw) * translation.y;
    p.y =  std::sin(yaw) * translation.x - std::cos(yaw) * translation.y;
    RCLCPP_INFO(node->get_logger(), "Relative translation: %.3f %.3f", p.x, p.y);
    kinenest::report_relative(p.x, p.y);
  });
  rclcpp::spin(node);
}
