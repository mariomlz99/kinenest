import math
import rclpy
from rclpy.node import Node
from rclpy.time import Time
from std_msgs.msg import String
from tf2_ros import Buffer, TransformListener
rclpy.init()
node=Node('tf_python_probe')
buffer=Buffer()
listener=TransformListener(buffer,node)
frames=['world','odom','base_link','laser_link','camera_link','target']
def receive(message):
    for t,target in enumerate(frames):
        for s,source in enumerate(frames):
            tr=buffer.lookup_transform(target,source,Time())
            p,q=tr.transform.translation,tr.transform.rotation
            print('TFROW',message.data,t,s,repr(p.x),repr(p.y),repr(2*math.atan2(q.z,q.w)),tr.header.frame_id,tr.child_frame_id)
sub=node.create_subscription(String,'/tf_case',receive,10)
rclpy.spin(node)
