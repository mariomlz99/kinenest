#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/laser_scan.hpp>
#include <geometry_msgs/msg/twist.hpp>
#include <algorithm>
#include <limits>
class Controller : public rclcpp::Node {
public:
 Controller():Node("student_controller") {
  pub_=create_publisher<geometry_msgs::msg::Twist>("/cmd_vel",10);
  sub_=create_subscription<sensor_msgs::msg::LaserScan>("/scan",10,[this](sensor_msgs::msg::LaserScan::SharedPtr msg){receive(msg);});
  timer_=create_wall_timer(std::chrono::milliseconds(500),[this](){RCLCPP_INFO(get_logger(),"controller active");});
 }
private:
 void receive(sensor_msgs::msg::LaserScan::SharedPtr msg){
  float front=std::numeric_limits<float>::infinity();
  for(size_t i=0;i<msg->ranges.size();++i){const double angle=msg->angle_min+i*msg->angle_increment;if(std::abs(angle)<3.141592653589793/12+1e-6&&std::isfinite(msg->ranges[i]))front=std::min(front,msg->ranges[i]);}
  geometry_msgs::msg::Twist cmd;if(front<1.1)cmd.angular.z=.9;else cmd.linear.x=.6;pub_->publish(cmd);
 }
 rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr pub_;
 rclcpp::Subscription<sensor_msgs::msg::LaserScan>::SharedPtr sub_;
 rclcpp::TimerBase::SharedPtr timer_;
};
int main(int argc,char** argv){rclcpp::init(argc,argv);rclcpp::spin(std::make_shared<Controller>());}
