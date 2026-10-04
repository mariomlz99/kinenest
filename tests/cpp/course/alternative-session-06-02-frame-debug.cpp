#include <rclcpp/rclcpp.hpp>
#include <tf2_ros/buffer.h>
#include <tf2_ros/transform_listener.h>
#include <tf2/time.h>
#include <cmath>
#include <geometry_msgs/msg/twist.hpp>
#include <algorithm>

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("student_controller");
  auto buffer = std::make_shared<tf2_ros::Buffer>(node->get_clock());
  auto listener = std::make_shared<tf2_ros::TransformListener>(*buffer, node);
  auto publisher = node->create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
  auto timer = node->create_wall_timer(std::chrono::milliseconds(100), [buffer, listener, publisher]() {
    geometry_msgs::msg::Twist command;
    if (!buffer->canTransform("target", "base_link", tf2::TimePointZero)) {
      publisher->publish(command);
      return;
    }
    const auto transform = buffer->lookupTransform("target", "base_link", tf2::TimePointZero);
    const auto &q = transform.transform.rotation;
    const double yaw = 2 * std::atan2(q.z, q.w);
    const auto &translation = transform.transform.translation;
    geometry_msgs::msg::Vector3 p;
    p.x = -std::cos(yaw) * translation.x - std::sin(yaw) * translation.y;
    p.y =  std::sin(yaw) * translation.x - std::cos(yaw) * translation.y;
    const double distance = std::hypot(p.x, p.y);
    const double angle = std::atan2(p.y, p.x);
    if (distance > 0.08) {
      command.angular.z = std::max(-1.2, std::min(1.2, 1.8 * angle));
      if (std::abs(angle) < 0.25) command.linear.x = std::min(0.6, 0.9 * distance);
    }
    publisher->publish(command);
  });
  rclcpp::spin(node);
}
