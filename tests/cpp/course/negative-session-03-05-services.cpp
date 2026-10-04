#include <rclcpp/rclcpp.hpp>
#include <std_srvs/srv/trigger.hpp>

using Trigger = std_srvs::srv::Trigger;
class ResetClient : public rclcpp::Node {
public:
  ResetClient() : Node("reset_client") {
    client_ = create_client<Trigger>("/reset_robot");
  }
  void send_reset() {
    auto request = std::make_shared<Trigger::Request>();
    client_->async_send_request(request,
      [this](rclcpp::Client<Trigger>::SharedFuture future) {
        auto response = future.get();
        RCLCPP_INFO(get_logger(), "Reset: %s; %s", response->success ? "true" : "false", response->message.c_str());
      });
  }
private:
  rclcpp::Client<Trigger>::SharedPtr client_;
};
int main(int argc, char **argv) {
  rclcpp::init(argc, argv);
  auto node = std::make_shared<ResetClient>();
  // A client endpoint alone does not perform a request.
  rclcpp::spin(node);
}
