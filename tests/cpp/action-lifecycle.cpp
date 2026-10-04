#include <rclcpp/rclcpp.hpp>
#include <rclcpp_action/rclcpp_action.hpp>
#include <ros2learn_interfaces/action/drive_distance.hpp>
#ifndef PROBE_MODE
#define PROBE_MODE 0
#endif
using Action=ros2learn_interfaces::action::DriveDistance;
using Handle=rclcpp_action::ClientGoalHandle<Action>;
using Client=rclcpp_action::Client<Action>;
int main(){
 rclcpp::init();auto node=std::make_shared<rclcpp::Node>("action_probe");
 auto client=rclcpp_action::create_client<Action>(node,"/drive_distance");
 auto accepted=std::make_shared<Handle::SharedPtr>();auto sent=std::make_shared<bool>(false);
 Client::SendGoalOptions options;
 options.goal_response_callback=[client,accepted](Handle::SharedPtr handle){
  *accepted=handle;std::printf("EVENT ACCEPT %d %d\n",handle?1:0,handle?handle->get_status():0);std::fflush(stdout);
  if(PROBE_MODE==2&&handle)client->async_cancel_goal(handle,[](rclcpp_action::CancelResponse::SharedPtr r){std::printf("EVENT CANCEL_ACK %d %zu\n",r->return_code,r->goals_canceling.size());std::fflush(stdout);});
 };
 options.feedback_callback=[client,accepted,sent](Handle::SharedPtr handle,Action::Feedback::ConstSharedPtr feedback){
  std::printf("EVENT FEEDBACK %.9g %d\n",feedback->distance_travelled,handle->get_status());std::fflush(stdout);
  if(PROBE_MODE==3&&!*sent&&feedback->distance_travelled>=0.2f){*sent=true;client->async_cancel_goal(*accepted,[](rclcpp_action::CancelResponse::SharedPtr r){std::printf("EVENT CANCEL_ACK %d %zu\n",r->return_code,r->goals_canceling.size());std::fflush(stdout);});}
 };
 options.result_callback=[client,accepted](const Handle::WrappedResult& result){
  std::printf("EVENT RESULT %d %d %.9g %d\n",static_cast<int>(result.code),result.result->success,result.result->final_distance,*accepted?(*accepted)->get_status():0);std::fflush(stdout);
  if(PROBE_MODE==2||PROBE_MODE==3)client->async_cancel_goal(*accepted,[](rclcpp_action::CancelResponse::SharedPtr r){std::printf("EVENT TERMINAL_CANCEL %d %zu\n",r->return_code,r->goals_canceling.size());std::fflush(stdout);});
 };
 Action::Goal goal;goal.distance=PROBE_MODE==1?4.0f:PROBE_MODE>=2?2.0f:0.4f;
 client->async_send_goal(goal,options);rclcpp::spin(node);
}
