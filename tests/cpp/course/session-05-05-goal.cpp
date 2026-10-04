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
    if (!buffer->canTransform("base_link", "target", tf2::TimePointZero)) {
      publisher->publish(command);
      return;
    }
    const auto transform = buffer->lookupTransform("base_link", "target", tf2::TimePointZero);
    const auto &p = transform.transform.translation;
    const double distance = std::hypot(p.x, p.y);
    const double angle = std::atan2(p.y, p.x);
    if (distance > 0.07) {
      command.angular.z = std::max(-1.5, std::min(1.5, 2 * angle));
      if (std::abs(angle) < 0.3) command.linear.x = std::min(0.7, distance);
    }
    publisher->publish(command);
  });
  rclcpp::spin(node);
}
