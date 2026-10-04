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
#include <array>
#include <cstdint>

extern "C" {
__attribute__((import_module("kinenest"),import_name("emit"))) void kn_emit(const char*,int);
__attribute__((import_module("kinenest"),import_name("spin"))) void kn_spin();
__attribute__((import_module("kinenest"),import_name("range_access"))) void kn_range_access();
__attribute__((import_module("kinenest"),import_name("image_access"))) void kn_image_access(int,int);
__attribute__((import_module("kinenest"),import_name("fail"))) void kn_fail(const char*,int);
__attribute__((import_module("kinenest"),import_name("field_number"))) double kn_field_number(const char*,int);
__attribute__((import_module("kinenest"),import_name("field_string_size"))) int kn_field_string_size(const char*,int);
__attribute__((import_module("kinenest"),import_name("field_string_copy"))) int kn_field_string_copy(const char*,int,char*,int);
}
namespace kinenest {
inline std::string quote(const std::string& s){std::string out="\"";for(unsigned char c:s){if(c=='"'||c=='\\'){out+='\\';out+=c;}else if(c<32){char b[7];std::snprintf(b,7,"\\u%04x",c);out+=b;}else out+=c;}return out+'"';}
inline void emit(const std::string& s){kn_emit(s.data(),static_cast<int>(s.size()));}
inline int next_id=0;
inline void fail(const std::string& text){kn_fail(text.data(),static_cast<int>(text.size()));}
inline std::string number(double value,const char* field="Value"){
 if(!std::isfinite(value))fail(std::string(field)+" must be a finite number");
 char text[32];std::snprintf(text,sizeof(text),"%.17g",value);return text;
}
inline double field_number(const std::string& path){return kn_field_number(path.data(),path.size());}
inline std::string field_string(const std::string& path){
 const int size=kn_field_string_size(path.data(),path.size());
 std::string value(size,'\0');if(size)kn_field_string_copy(path.data(),path.size(),&value[0],size);return value;
}
// Learning hooks: the worker supplies the actual callback sample, not the student.
inline void report_range(double value){emit("{\"kind\":\"course_report\",\"report\":\"range\",\"values\":["+number(value,"Range")+"]}");}
inline void report_sectors(double front,double left,double right){emit("{\"kind\":\"course_report\",\"report\":\"sectors\",\"values\":["+number(front,"Front sector")+","+number(left,"Left sector")+","+number(right,"Right sector")+"]}");}
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

template<class T> struct ImageField {
 T value{};int frame=0,field=0;
 operator T()const{kn_image_access(frame,field);return value;}
 void assign(T next,int sample,int kind){value=next;frame=sample;field=kind;}
};
template<class T> inline T log_value(T value){return value;}
template<class T> inline T log_value(const ImageField<T>& value){return static_cast<T>(value);}
struct ImageBytes:std::vector<uint8_t>{
 int frame=0;
 using Base=std::vector<uint8_t>;using Base::vector;
 void accessed()const{kn_image_access(frame,3);}
 size_t size()const{accessed();return Base::size();}
 bool empty()const{accessed();return Base::empty();}
 uint8_t& operator[](size_t i){accessed();return Base::operator[](i);}
 const uint8_t& operator[](size_t i)const{accessed();return Base::operator[](i);}
 uint8_t& at(size_t i){accessed();return Base::at(i);}
 const uint8_t& at(size_t i)const{accessed();return Base::at(i);}
 iterator begin(){accessed();return Base::begin();}
 iterator end(){accessed();return Base::end();}
 const_iterator begin()const{accessed();return Base::begin();}
 const_iterator end()const{accessed();return Base::end();}
 const_iterator cbegin()const{accessed();return Base::cbegin();}
 const_iterator cend()const{accessed();return Base::cend();}
 uint8_t* data(){accessed();return Base::data();}
 const uint8_t* data()const{accessed();return Base::data();}
 uint8_t& front(){accessed();return Base::front();}
 const uint8_t& front()const{accessed();return Base::front();}
 uint8_t& back(){accessed();return Base::back();}
 const uint8_t& back()const{accessed();return Base::back();}
};
inline void report_detection(bool visible){emit(std::string("{\"kind\":\"detection\",\"visible\":")+(visible?"true":"false")+",\"cx\":null}");}
inline void report_detection(bool visible,double cx){emit(std::string("{\"kind\":\"detection\",\"visible\":")+(visible?"true":"false")+",\"cx\":"+number(cx,"Centroid")+"}");}
inline void report_image_stats(std::array<int,3> shape,std::array<double,3> means){
 emit("{\"kind\":\"image_stats\",\"shape\":["+number(shape[0])+","+number(shape[1])+","+number(shape[2])+"],\"means\":["+number(means[0])+","+number(means[1])+","+number(means[2])+"]}");
}

struct Stamp{int sec=0;unsigned int nanosec=0;};
struct Header{Stamp stamp;std::string frame_id;};
}
namespace geometry_msgs {namespace msg {
struct Vector3{double x=0,y=0,z=0;};
struct Twist{using SharedPtr=std::shared_ptr<Twist>;using ConstSharedPtr=std::shared_ptr<const Twist>;Vector3 linear,angular;};
}}
namespace std_msgs {namespace msg {
struct String{using SharedPtr=std::shared_ptr<String>;using ConstSharedPtr=std::shared_ptr<const String>;std::string data;};
}}
namespace sensor_msgs {namespace msg {
struct Image{using SharedPtr=std::shared_ptr<Image>;using ConstSharedPtr=std::shared_ptr<const Image>;kinenest::Header header;kinenest::ImageField<uint32_t> height,width;std::string encoding="rgb8";uint8_t is_bigendian=0;uint32_t step=0;kinenest::ImageBytes data;};
struct LaserScan{using SharedPtr=std::shared_ptr<LaserScan>;using ConstSharedPtr=std::shared_ptr<const LaserScan>;kinenest::Header header;float angle_min=0,angle_max=0,angle_increment=0,time_increment=0,scan_time=.2,range_min=.05,range_max=10;kinenest::Ranges ranges;std::vector<float> intensities;};
}}
namespace kinenest {
template<class T> struct MessageTraits;
template<> struct MessageTraits<std_msgs::msg::String>{
 static const char* type(){return "std_msgs/msg/String";}
 static std_msgs::msg::String decode(){std_msgs::msg::String msg;msg.data=field_string("data");return msg;}
 static std::string encode(const std_msgs::msg::String& msg){return "{\"data\":"+quote(msg.data)+"}";}
};
inline std::string vector_json(const geometry_msgs::msg::Vector3& v,const std::string& field){
 return "{\"x\":"+number(v.x,(field+".x").c_str())+",\"y\":"+number(v.y,(field+".y").c_str())+",\"z\":"+number(v.z,(field+".z").c_str())+"}";
}
template<> struct MessageTraits<geometry_msgs::msg::Twist>{
 static const char* type(){return "geometry_msgs/msg/Twist";}
 static geometry_msgs::msg::Twist decode(){geometry_msgs::msg::Twist msg;
  msg.linear={field_number("linear.x"),field_number("linear.y"),field_number("linear.z")};
  msg.angular={field_number("angular.x"),field_number("angular.y"),field_number("angular.z")};return msg;
 }
 static std::string encode(const geometry_msgs::msg::Twist& msg){return "{\"linear\":"+vector_json(msg.linear,"Twist.linear")+",\"angular\":"+vector_json(msg.angular,"Twist.angular")+"}";}
};
template<> struct MessageTraits<sensor_msgs::msg::Image>{static const char* type(){return "sensor_msgs/msg/Image";}};
inline sensor_msgs::msg::Image::SharedPtr incoming_image;
inline std::map<int,std::function<void(sensor_msgs::msg::Image::SharedPtr)>> images;
template<> struct MessageTraits<sensor_msgs::msg::LaserScan>{
 static const char* type(){return "sensor_msgs/msg/LaserScan";}
};
inline std::map<int,std::function<void(sensor_msgs::msg::LaserScan::SharedPtr)>> scans;
inline std::map<int,std::function<void()>> subscriptions;
inline std::map<int,std::function<void()>> timers;
}
namespace rclcpp {
class Node;
inline bool initialized=false;
inline void init(int argc=0,char** argv=nullptr);
class Logger{std::string name_;public:explicit Logger(std::string name):name_(name){}const char* get_name()const{return name_.c_str();}};
template<class... Args> inline void log(const Logger& logger,const char* format,Args... args){std::printf("[%s] ",logger.get_name());std::printf(format,kinenest::log_value(args)...);std::printf("\n");std::fflush(stdout);}
template<class T> class Publisher {
 std::string node_,topic_;
public:
 using SharedPtr=std::shared_ptr<Publisher<T>>;
 Publisher(std::string node,std::string topic):node_(node),topic_(topic){
  kinenest::emit("{\"kind\":\"publisher\",\"node\":"+kinenest::quote(node_)+",\"topic\":"+kinenest::quote(topic_)+",\"type\":"+kinenest::quote(kinenest::MessageTraits<T>::type())+"}");
 }
 void publish(const T& msg){
  const auto payload=kinenest::MessageTraits<T>::encode(msg);
  kinenest::emit("{\"kind\":\"publish\",\"node\":"+kinenest::quote(node_)+",\"topic\":"+kinenest::quote(topic_)+",\"type\":"+kinenest::quote(kinenest::MessageTraits<T>::type())+",\"message\":"+payload+"}");
 }
};
template<class T> class Subscription {
 int id_;
public:
 using SharedPtr=std::shared_ptr<Subscription<T>>;
 explicit Subscription(int id):id_(id){}
 ~Subscription(){kinenest::images.erase(id_);kinenest::subscriptions.erase(id_);kinenest::scans.erase(id_);kinenest::emit("{\"kind\":\"unsubscribe\",\"id\":"+std::to_string(id_)+"}");}
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
  const int id=++kinenest::next_id;
  if constexpr(std::is_same<T,sensor_msgs::msg::LaserScan>::value)kinenest::scans[id]=callback;
  else if constexpr(std::is_same<T,sensor_msgs::msg::Image>::value)kinenest::images[id]=callback;
  else kinenest::subscriptions[id]=[callback](){callback(std::make_shared<T>(kinenest::MessageTraits<T>::decode()));};
  kinenest::emit("{\"kind\":\"subscribe\",\"node\":"+kinenest::quote(name_)+",\"topic\":"+kinenest::quote(topic)+",\"type\":"+kinenest::quote(kinenest::MessageTraits<T>::type())+",\"id\":"+std::to_string(id)+"}");return std::make_shared<Subscription<T>>(id);
 }
 template<class Rep,class Period,class Callback> TimerBase::SharedPtr create_wall_timer(std::chrono::duration<Rep,Period> period,Callback callback){const int id=++kinenest::next_id;const double seconds=std::chrono::duration<double>(period).count();kinenest::timers[id]=callback;kinenest::emit("{\"kind\":\"timer\",\"node\":"+kinenest::quote(name_)+",\"id\":"+std::to_string(id)+",\"period\":"+kinenest::number(seconds)+"}");return std::make_shared<TimerBase>(id);}
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
 auto callback=kinenest::scans.find(id);if(callback==kinenest::scans.end())return;auto msg=std::make_shared<sensor_msgs::msg::LaserScan>();msg->header.frame_id="laser_link";msg->header.stamp={sec,nanosec};msg->angle_min=angle_min;msg->angle_max=angle_max;msg->angle_increment=increment;msg->range_min=range_min;msg->range_max=range_max;msg->scan_time=scan_time;msg->ranges.assign(data,data+count);auto invoke=callback->second;invoke(msg);
}
extern "C" __attribute__((export_name("kn_receive_message"))) void kn_receive_message(int id){
 auto found=kinenest::subscriptions.find(id);if(found!=kinenest::subscriptions.end()){auto invoke=found->second;invoke();}
}
extern "C" __attribute__((export_name("kn_tick"))) void kn_tick(int id){auto callback=kinenest::timers.find(id);if(callback!=kinenest::timers.end()){auto invoke=callback->second;invoke();}}
extern "C" __attribute__((export_name("kn_alloc"))) void* kn_alloc(int bytes){return std::malloc(bytes);}
extern "C" __attribute__((export_name("kn_free"))) void kn_free(void* data){std::free(data);}

extern "C" __attribute__((export_name("kn_image_prepare"))) uint8_t* kn_image_prepare(int bytes,int frame){
 auto msg=std::make_shared<sensor_msgs::msg::Image>();
 msg->width.assign(static_cast<uint32_t>(kinenest::field_number("width")),frame,1);
 msg->height.assign(static_cast<uint32_t>(kinenest::field_number("height")),frame,2);
 msg->step=kinenest::field_number("step");msg->encoding=kinenest::field_string("encoding");
 msg->header.frame_id=kinenest::field_string("header.frame_id");
 msg->header.stamp.sec=kinenest::field_number("header.stamp.sec");
 msg->header.stamp.nanosec=kinenest::field_number("header.stamp.nanosec");
 msg->data.frame=frame;msg->data.resize(bytes);kinenest::incoming_image=msg;
 return static_cast<std::vector<uint8_t>&>(msg->data).data();
}
extern "C" __attribute__((export_name("kn_receive_image"))) void kn_receive_image(int id){
 auto msg=std::move(kinenest::incoming_image);auto found=kinenest::images.find(id);
 if(found!=kinenest::images.end()){auto invoke=found->second;invoke(msg);}
}
