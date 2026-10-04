#include <rclcpp/rclcpp.hpp>
#include <ros2learn_interfaces/msg/target_info.hpp>

using TargetInfo = ros2learn_interfaces::msg::TargetInfo;
class StatusPublisher : public rclcpp::Node {
public:
  StatusPublisher() : Node("student_controller") {
    publisher_ = create_publisher<TargetInfo>("/target_info", 10);
    timer_ = create_wall_timer(std::chrono::milliseconds(150), [this]() {
      TargetInfo status;
      status.visible = true;
      status.position = "RIGHT";
      status.confidence = 0.75;
      publisher_->publish(status);
    });
  }
private:
  rclcpp::Publisher<TargetInfo>::SharedPtr publisher_;
  rclcpp::TimerBase::SharedPtr timer_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<StatusPublisher>());
}
