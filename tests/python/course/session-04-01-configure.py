import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

rclpy.init()
node = Node('student_controller')

node.declare_parameter('speed', 0.2)
publisher = node.create_publisher(Twist, '/cmd_vel', 10)
def tick():
    speed = node.get_parameter('speed').value
    cmd = Twist()
    cmd.linear.x = max(0.0, min(0.8, speed))
    publisher.publish(cmd)
node.create_timer(0.2, tick)
rclpy.spin(node)
