import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan

rclpy.init()
node = Node('student_controller')

def receive(msg):
    print('Rays:', len(msg.ranges), 'Forward:', msg.ranges[60])
node.create_subscription(LaserScan, '/scan', receive, 10)
rclpy.spin(node)
