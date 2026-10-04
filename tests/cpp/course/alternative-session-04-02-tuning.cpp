#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/twist.hpp>
#include <algorithm>

int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<rclcpp::Node>("student_controller");
  node->declare_parameter<double>("speed", 0.3);
  auto output = node->create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
  auto timer = node->create_wall_timer(std::chrono::milliseconds(150), [node, output]() {
    geometry_msgs::msg::Twist message;
    const double current = node->get_parameter("speed").as_double();
    message.linear.x = std::min(0.8, std::max(0.0, current));
    output->publish(message);
  });
  rclcpp::spin(node);
}
