import rclpy
from rclpy.node import Node
from nav_msgs.msg import Odometry
from ros2learn import report_position

rclpy.init()
node = Node('student_controller')

def receive(msg):
    p = msg.pose.pose.position
    q = msg.pose.pose.orientation
    print(p.x, p.y, q.z, q.w)
    report_position(p.x, p.y)
node.create_subscription(Odometry, '/odom', receive, 10)
rclpy.spin(node)
