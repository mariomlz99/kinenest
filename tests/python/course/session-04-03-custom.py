import rclpy
from rclpy.node import Node
from ros2learn_interfaces.msg import TargetInfo

rclpy.init()
node = Node('student_controller')

publisher = node.create_publisher(TargetInfo, '/target_info', 10)
def tick():
    msg = TargetInfo(visible=True, position='LEFT', confidence=0.8)
    publisher.publish(msg)
node.create_timer(0.2, tick)
rclpy.spin(node)
