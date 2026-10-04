#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/twist.hpp>
#include <algorithm>

class Driver : public rclcpp::Node {
public:
  Driver() : Node("student_controller") {
    declare_parameter<double>("speed", 0.2);
    cached_speed_ = get_parameter("speed").as_double();
    publisher_ = create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
    timer_ = create_wall_timer(std::chrono::milliseconds(200), [this]() {
      const double reported = get_parameter("speed").as_double();
      RCLCPP_INFO(get_logger(), "New parameter: %.2f", reported);
      const double speed = cached_speed_;
      geometry_msgs::msg::Twist command;
      command.linear.x = std::max(0.0, std::min(0.8, speed));
      publisher_->publish(command);
    });
  }
private:
  double cached_speed_ = 0.0;
  rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Driver>());
}
