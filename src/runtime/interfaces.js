const vector={x:0,y:0,z:0};
export const INTERFACES={
 'geometry_msgs/msg/Twist':{definition:'geometry_msgs/Vector3 linear\n  float64 x\n  float64 y\n  float64 z\ngeometry_msgs/Vector3 angular\n  float64 x\n  float64 y\n  float64 z',prototype:{linear:vector,angular:vector}},
 'std_msgs/msg/String':{definition:'string data',prototype:{data:''}},
 'sensor_msgs/msg/Image':{definition:'std_msgs/Header header\nuint32 height\nuint32 width\nstring encoding\nuint8 is_bigendian\nuint32 step\nuint8[] data',prototype:{header:{stamp:{sec:0,nanosec:0},frame_id:''},height:0,width:0,encoding:'rgb8',is_bigendian:0,step:0,data:[]}},
 'sensor_msgs/msg/LaserScan':{definition:'std_msgs/Header header\nfloat32 angle_min\nfloat32 angle_max\nfloat32 angle_increment\nfloat32 time_increment\nfloat32 scan_time\nfloat32 range_min\nfloat32 range_max\nfloat32[] ranges\nfloat32[] intensities',prototype:{header:{stamp:{sec:0,nanosec:0},frame_id:'laser'},angle_min:0,angle_max:0,angle_increment:0,time_increment:0,scan_time:0.2,range_min:0.1,range_max:10,ranges:[],intensities:[]}},
 'nav_msgs/msg/Odometry':{definition:'std_msgs/Header header\nstring child_frame_id\ngeometry_msgs/PoseWithCovariance pose\n  geometry_msgs/Pose pose\n    geometry_msgs/Point position\n    geometry_msgs/Quaternion orientation\n  float64[36] covariance\ngeometry_msgs/TwistWithCovariance twist\n  geometry_msgs/Twist twist\n  float64[36] covariance',prototype:{header:{stamp:{sec:0,nanosec:0},frame_id:'odom'},child_frame_id:'base_link',pose:{pose:{position:vector,orientation:{x:0,y:0,z:0,w:1}},covariance:Array(36).fill(0)},twist:{twist:{linear:vector,angular:vector},covariance:Array(36).fill(0)}}},
 'std_srvs/srv/Trigger':{definition:'---\nbool success\nstring message',prototype:{}}
};
export function interfaceType(name){const type=INTERFACES[name];if(!type)throw new Error('Interface not implemented in this teaching environment: '+name);return type;}
