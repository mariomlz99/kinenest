#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/string.hpp>
#include <tf2_ros/buffer.h>
#include <tf2_ros/transform_listener.h>
#include <tf2/utils.h>
int main(){
 rclcpp::init();auto node=std::make_shared<rclcpp::Node>("tf_probe");
 auto buffer=std::make_shared<tf2_ros::Buffer>(node->get_clock());auto listener=std::make_shared<tf2_ros::TransformListener>(*buffer,node);
 static const char* frames[]={"world","odom","base_link","laser_link","camera_link","target"};
 auto sub=node->create_subscription<std_msgs::msg::String>("/tf_case",10,[buffer,listener](std_msgs::msg::String::SharedPtr m){
  for(int t=0;t<6;t++)for(int s=0;s<6;s++){
   auto tr=buffer->lookupTransform(frames[t],frames[s],tf2::TimePointZero);
   std::printf("TFROW %s %d %d %.17g %.17g %.17g %s %s\n",m->data.c_str(),t,s,tr.transform.translation.x,tr.transform.translation.y,tf2::getYaw(tr.transform.rotation),tr.header.frame_id.c_str(),tr.child_frame_id.c_str());
  }std::fflush(stdout);
 });rclcpp::spin(node);
}
