import rclpy
from rclpy.node import Node
import math
from geometry_msgs.msg import Twist
from tf2_ros import Buffer, TransformListener, TransformException
from rclpy.time import Time

rclpy.init()
node = Node('student_controller')

buffer = Buffer()
listener = TransformListener(buffer, node)
publisher = node.create_publisher(Twist, '/cmd_vel', 10)
def tick():
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
    publisher.publish(cmd)
node.create_timer(0.1, tick)
rclpy.spin(node)
