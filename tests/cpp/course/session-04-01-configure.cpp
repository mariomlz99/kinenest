#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/twist.hpp>
#include <algorithm>

class Driver : public rclcpp::Node {
public:
  Driver() : Node("student_controller") {
    declare_parameter<double>("speed", 0.2);
    publisher_ = create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
    timer_ = create_wall_timer(std::chrono::milliseconds(200), [this]() {
      const double speed = get_parameter("speed").as_double();
      geometry_msgs::msg::Twist command;
      command.linear.x = std::max(0.0, std::min(0.8, speed));
      publisher_->publish(command);
    });
  }
private:
  rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Driver>());
}
