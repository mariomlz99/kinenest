// KineNest educational C++ API. This is not the ROS rclcpp implementation.
#pragma once
#include <memory>
#include <functional>
#include <vector>
#include <map>
#include <string>
#include <chrono>
#include <cstdio>
#include <cstdlib>
#include <cstdarg>
#include <type_traits>
#include <cmath>

extern "C" {
__attribute__((import_module("kinenest"),import_name("emit"))) void kn_emit(const char*,int);
__attribute__((import_module("kinenest"),import_name("spin"))) void kn_spin();
__attribute__((import_module("kinenest"),import_name("range_access"))) void kn_range_access();
}
namespace kinenest {
inline std::string quote(const std::string& s){std::string out="\"";for(unsigned char c:s){if(c=='"'||c=='\\'){out+='\\';out+=c;}else if(c<32){char b[7];std::snprintf(b,7,"\\u%04x",c);out+=b;}else out+=c;}return out+'"';}
inline void emit(const std::string& s){kn_emit(s.data(),static_cast<int>(s.size()));}
inline int next_id=0;
struct Ranges:std::vector<float>{
 using std::vector<float>::vector;
 size_t size()const{kn_range_access();return std::vector<float>::size();}
 bool empty()const{kn_range_access();return std::vector<float>::empty();}
 float& operator[](size_t i){kn_range_access();return std::vector<float>::operator[](i);}
 const float& operator[](size_t i)const{kn_range_access();return std::vector<float>::operator[](i);}
 float& at(size_t i){kn_range_access();return std::vector<float>::at(i);}
 const float& at(size_t i)const{kn_range_access();return std::vector<float>::at(i);}
 iterator begin(){kn_range_access();return std::vector<float>::begin();}
 iterator end(){kn_range_access();return std::vector<float>::end();}
 const_iterator begin()const{kn_range_access();return std::vector<float>::begin();}
 const_iterator end()const{kn_range_access();return std::vector<float>::end();}
 const_iterator cbegin()const{kn_range_access();return std::vector<float>::cbegin();}
 const_iterator cend()const{kn_range_access();return std::vector<float>::cend();}
 float* data(){kn_range_access();return std::vector<float>::data();}
 const float* data()const{kn_range_access();return std::vector<float>::data();}
 float& front(){kn_range_access();return std::vector<float>::front();}
 float& back(){kn_range_access();return std::vector<float>::back();}
};
struct Stamp{int sec=0;unsigned int nanosec=0;};
struct Header{Stamp stamp;std::string frame_id;};
}
namespace geometry_msgs {namespace msg {
struct Vector3{double x=0,y=0,z=0;};
struct Twist{using SharedPtr=std::shared_ptr<Twist>;Vector3 linear,angular;};
}}
namespace sensor_msgs {namespace msg {
struct LaserScan{using SharedPtr=std::shared_ptr<LaserScan>;using ConstSharedPtr=std::shared_ptr<const LaserScan>;kinenest::Header header;float angle_min=0,angle_max=0,angle_increment=0,time_increment=0,scan_time=.2,range_min=.05,range_max=10;kinenest::Ranges ranges;std::vector<float> intensities;};
}}
namespace kinenest {
inline std::map<int,std::function<void(sensor_msgs::msg::LaserScan::SharedPtr)>> scans;
inline std::map<int,std::function<void()>> timers;
}
namespace rclcpp {
class Node;
inline bool initialized=false;
inline void init(int argc=0,char** argv=nullptr);
class Logger{std::string name_;public:explicit Logger(std::string name):name_(name){}const char* get_name()const{return name_.c_str();}};
inline void log(const Logger& logger,const char* format,...){std::printf("[%s] ",logger.get_name());va_list args;va_start(args,format);std::vprintf(format,args);va_end(args);std::printf("\n");std::fflush(stdout);}
template<class T> class Publisher {
 std::string node_,topic_;
public:
 using SharedPtr=std::shared_ptr<Publisher<T>>;
 Publisher(std::string node,std::string topic):node_(node),topic_(topic){static_assert(std::is_same<T,geometry_msgs::msg::Twist>::value,"KineNest C++ prototype publishes Twist only");kinenest::emit("{\"kind\":\"publisher\",\"node\":"+kinenest::quote(node_)+",\"topic\":"+kinenest::quote(topic_)+",\"type\":\"geometry_msgs/msg/Twist\"}");}
 void publish(const T& msg){kinenest::emit("{\"kind\":\"publish\",\"node\":"+kinenest::quote(node_)+",\"topic\":"+kinenest::quote(topic_)+",\"type\":\"geometry_msgs/msg/Twist\",\"message\":{\"linear\":{\"x\":"+std::to_string(msg.linear.x)+",\"y\":"+std::to_string(msg.linear.y)+",\"z\":"+std::to_string(msg.linear.z)+"},\"angular\":{\"x\":"+std::to_string(msg.angular.x)+",\"y\":"+std::to_string(msg.angular.y)+",\"z\":"+std::to_string(msg.angular.z)+"}}}");}
};
template<class T> class Subscription {
 int id_;
public:
 using SharedPtr=std::shared_ptr<Subscription<T>>;
 explicit Subscription(int id):id_(id){}
 ~Subscription(){kinenest::scans.erase(id_);kinenest::emit("{\"kind\":\"unsubscribe\",\"id\":"+std::to_string(id_)+"}");}
};
class TimerBase {
 int id_;
public:
 using SharedPtr=std::shared_ptr<TimerBase>;explicit TimerBase(int id):id_(id){}
 void cancel(){kinenest::timers.erase(id_);kinenest::emit("{\"kind\":\"timer_cancel\",\"id\":"+std::to_string(id_)+"}");}
 ~TimerBase(){cancel();}
};
class Node:public std::enable_shared_from_this<Node> {
 std::string name_;
public:
 using SharedPtr=std::shared_ptr<Node>;
 explicit Node(std::string name):name_(name.size()&&name[0]=='/'?name:"/"+name){kinenest::emit("{\"kind\":\"node\",\"node\":"+kinenest::quote(name_)+"}");}
 virtual ~Node(){kinenest::emit("{\"kind\":\"destroy\",\"node\":"+kinenest::quote(name_)+"}");}
 Logger get_logger()const{return Logger(name_);}const char* get_name()const{return name_.c_str();}
 template<class T> typename Publisher<T>::SharedPtr create_publisher(const std::string& topic,int){return std::make_shared<Publisher<T>>(name_,topic);}
 template<class T,class Callback> typename Subscription<T>::SharedPtr create_subscription(const std::string& topic,int,Callback callback){
  static_assert(std::is_same<T,sensor_msgs::msg::LaserScan>::value,"KineNest C++ prototype subscribes to LaserScan only");const int id=++kinenest::next_id;kinenest::scans[id]=callback;
  kinenest::emit("{\"kind\":\"subscribe\",\"node\":"+kinenest::quote(name_)+",\"topic\":"+kinenest::quote(topic)+",\"type\":\"sensor_msgs/msg/LaserScan\",\"id\":"+std::to_string(id)+"}");return std::make_shared<Subscription<T>>(id);
 }
 template<class Rep,class Period,class Callback> TimerBase::SharedPtr create_wall_timer(std::chrono::duration<Rep,Period> period,Callback callback){const int id=++kinenest::next_id;const double seconds=std::chrono::duration<double>(period).count();kinenest::timers[id]=callback;kinenest::emit("{\"kind\":\"timer\",\"node\":"+kinenest::quote(name_)+",\"id\":"+std::to_string(id)+",\"period\":"+std::to_string(seconds)+"}");return std::make_shared<TimerBase>(id);}
};
inline void init(int,char**){initialized=true;}
inline bool ok(){return initialized;}
inline void shutdown(){initialized=false;kinenest::emit("{\"kind\":\"shutdown\"}");}
inline std::vector<Node::SharedPtr> spinning;
inline void spin(Node::SharedPtr node){spinning.push_back(node);kn_spin();}
}
#define RCLCPP_INFO(logger, ...) ::rclcpp::log(logger, __VA_ARGS__)
#define RCLCPP_WARN(logger, ...) ::rclcpp::log(logger, __VA_ARGS__)
#define RCLCPP_ERROR(logger, ...) ::rclcpp::log(logger, __VA_ARGS__)

extern "C" __attribute__((export_name("kn_receive_scan"))) void kn_receive_scan(int id,const float* data,int count,float angle_min,float angle_max,float increment,float range_min,float range_max,int sec,unsigned int nanosec,float scan_time){
 auto callback=kinenest::scans.find(id);if(callback==kinenest::scans.end())return;auto msg=std::make_shared<sensor_msgs::msg::LaserScan>();msg->header.frame_id="laser_link";msg->header.stamp={sec,nanosec};msg->angle_min=angle_min;msg->angle_max=angle_max;msg->angle_increment=increment;msg->range_min=range_min;msg->range_max=range_max;msg->scan_time=scan_time;msg->ranges.assign(data,data+count);callback->second(msg);
}
extern "C" __attribute__((export_name("kn_tick"))) void kn_tick(int id){auto callback=kinenest::timers.find(id);if(callback!=kinenest::timers.end())callback->second();}
extern "C" __attribute__((export_name("kn_alloc"))) void* kn_alloc(int bytes){return std::malloc(bytes);}
extern "C" __attribute__((export_name("kn_free"))) void kn_free(void* data){std::free(data);}
