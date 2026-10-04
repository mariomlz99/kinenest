#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <std_msgs/msg/string.hpp>
#include <cmath>

class StudentNode : public rclcpp::Node {
public:
  StudentNode() : Node("student_controller") {
    publisher_ = create_publisher<std_msgs::msg::String>("/chatter", 10);
    scan_ = create_subscription<sensor_msgs::msg::LaserScan>("/scan", 10,
      [this](sensor_msgs::msg::LaserScan::SharedPtr msg) {
        const auto index = static_cast<size_t>(std::lround(-msg->angle_min / msg->angle_increment));
        if (index < msg->ranges.size()) latest_range_ = msg->ranges[index];
      });
    chatter_ = create_subscription<std_msgs::msg::String>("/chatter", 10,
      [this](std_msgs::msg::String::SharedPtr msg) {
        RCLCPP_INFO(get_logger(), "%s", msg->data.c_str());
      });
    timer_ = create_wall_timer(std::chrono::milliseconds(200), [this]() {
      std_msgs::msg::String msg;
      msg.data = std::to_string(latest_range_);
      publisher_->publish(msg);
    });
  }
private:
  double latest_range_ = 0.0;
  rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
  rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr scan_;
  rclcpp::Subscription<std_msgs::msg::String>::SharedPtr chatter_;
  rclcpp::TimerBase::SharedPtr timer_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  rclcpp::spin(std::make_shared<StudentNode>());
}
