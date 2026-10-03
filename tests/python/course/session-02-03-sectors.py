import rclpy
from rclpy.node import Node
import math
from sensor_msgs.msg import LaserScan
from ros2learn import report_sectors

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
def scan(msg):
    front, left, right = sector(msg, 0), sector(msg, math.pi/2), sector(msg, -math.pi/2)
    print(front, left, right)
    report_sectors(front, left, right)
node.create_subscription(LaserScan, '/scan', scan, 10)
rclpy.spin(node)
