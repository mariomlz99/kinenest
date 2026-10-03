import rclpy
from rclpy.node import Node
import math
from nav_msgs.msg import Odometry
from ros2learn import report_pose

rclpy.init()
node = Node('student_controller')

def receive(msg):
    p = msg.pose.pose.position
    q = msg.pose.pose.orientation
    yaw = math.atan2(2*(q.w*q.z+q.x*q.y), 1-2*(q.y*q.y+q.z*q.z))
    print(p.x, p.y, yaw)
    report_pose(p.x, p.y, yaw)
node.create_subscription(Odometry, '/odom', receive, 10)
rclpy.spin(node)
