import rclpy
from rclpy.node import Node
from tf_transformations import euler_from_quaternion
from nav_msgs.msg import Odometry
from ros2learn import report_pose

rclpy.init()
node = Node('student_controller')

def receive(msg):
    p = msg.pose.pose.position
    q = msg.pose.pose.orientation
    _, _, yaw = euler_from_quaternion([q.x, q.y, q.z, q.w])
    print(p.x, p.y, yaw)
    report_pose(p.x, p.y, yaw)
node.create_subscription(Odometry, '/odom', receive, 10)
rclpy.spin(node)
