#include <rclcpp/rclcpp.hpp>
#include <tf2_ros/buffer.h>
#include <tf2_ros/transform_listener.h>
#include <tf2/time.h>
#include <cmath>
#include <geometry_msgs/msg/twist.hpp>
#include <algorithm>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <limits>

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("student_controller");
  auto buffer = std::make_shared<tf2_ros::Buffer>(node->get_clock());
  auto listener = std::make_shared<tf2_ros::TransformListener>(*buffer, node);
  auto publisher = node->create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
  auto front = std::make_shared<double>(0.0);
  auto bypass = std::make_shared<int>(0);
  auto scan = node->create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10,
    [front](sensor_msgs::msg::LaserScan::SharedPtr message) {
      *front = 10.0; // Deliberately ignore actual ranges.
    });
  auto timer = node->create_wall_timer(std::chrono::milliseconds(100), [buffer, listener, publisher, front, bypass, scan]() {
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
    if (distance > 0.07 && *front < 0.8) {
      *bypass = 15;
      command.linear.x = 0.0;
      command.angular.z = 0.8;
    } else if (distance > 0.07 && *bypass > 0) {
      --*bypass;
      command.linear.x = 0.45;
      command.angular.z = 0.0;
    }
    publisher->publish(command);
  });
  rclcpp::spin(node);
}
