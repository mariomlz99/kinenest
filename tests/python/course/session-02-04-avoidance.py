import rclpy
from rclpy.node import Node
import math
from sensor_msgs.msg import LaserScan
from geometry_msgs.msg import Twist

rclpy.init()
node = Node('student_controller')

def sector(msg, center):
    values = []
    for i, distance in enumerate(msg.ranges):
        angle = msg.angle_min + i * msg.angle_increment
        delta = math.atan2(math.sin(angle-center), math.cos(angle-center))
        if abs(delta) <= math.pi/12 + 1e-9 and math.isfinite(distance):
            values.append(distance)
    return min(values) if values else float('inf')
publisher = node.create_publisher(Twist, '/cmd_vel', 10)
def scan(msg):
    front = sector(msg, 0)
    cmd = Twist()
    if front < 1.1:
        cmd.angular.z = 0.9
    else:
        cmd.linear.x = 0.6
    publisher.publish(cmd)
node.create_subscription(LaserScan, '/scan', scan, 10)
rclpy.spin(node)
