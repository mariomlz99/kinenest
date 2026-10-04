#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/string.hpp>
#include <algorithm>

class Driver : public rclcpp::Node {
public:
  Driver() : Node("student_controller") {
    declare_parameter<double>("speed", 0.2);
    publisher_ = create_publisher<std_msgs::msg::String>("/chatter", 10);
    timer_ = create_wall_timer(std::chrono::milliseconds(200), [this]() {
      const double speed = get_parameter("speed").as_double();
      std_msgs::msg::String command;
      command.data = std::to_string(speed);
      publisher_->publish(command);
    });
  }
private:
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<Driver>());
}
