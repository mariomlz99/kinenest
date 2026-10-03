import rclpy
from rclpy.node import Node
import math
from geometry_msgs.msg import Twist
from tf2_ros import Buffer, TransformListener, TransformException
from rclpy.time import Time
from sensor_msgs.msg import LaserScan

rclpy.init()
node = Node('student_controller')

front = float('inf')
bypass = 0
def scan(msg):
    global front
    front = min(d for i,d in enumerate(msg.ranges) if abs(msg.angle_min+i*msg.angle_increment)<math.pi/6)
node.create_subscription(LaserScan, '/scan', scan, 10)
buffer = Buffer()
listener = TransformListener(buffer, node)
publisher = node.create_publisher(Twist, '/cmd_vel', 10)
def tick():
    global bypass
    try:
        p = buffer.lookup_transform('base_link', 'target', Time()).transform.translation
    except TransformException:
        return
    distance = math.hypot(p.x, p.y)
    angle = math.atan2(p.y, p.x)
    cmd = Twist()
    if distance > 0.07:
        cmd.angular.z = max(-1.5, min(1.5, 2*angle))
        cmd.linear.x = min(0.7, distance) if abs(angle) < 0.3 else 0.0
    if distance > 0.07 and front < 0.8:
        bypass = 15
        cmd.linear.x = 0.0
        cmd.angular.z = 0.8
    elif distance > 0.07 and bypass > 0:
        bypass -= 1
        cmd.linear.x = 0.45
        cmd.angular.z = 0.0
    publisher.publish(cmd)
node.create_timer(0.1, tick)
rclpy.spin(node)
