import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from std_msgs.msg import String

rclpy.init()
node = Node('student_controller')

front = 0.0
publisher = node.create_publisher(String, '/chatter', 10)
def scan(msg):
    global front
    front = msg.ranges[60]
def tick():
    publisher.publish(String(data=str(front)))
node.create_subscription(LaserScan, '/scan', scan, 10)
node.create_timer(0.2, tick)
rclpy.spin(node)
