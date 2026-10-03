import rclpy
from rclpy.node import Node
from ros2learn_interfaces.msg import TargetInfo

rclpy.init()
node = Node('student_controller')
publisher = node.create_publisher(TargetInfo, '/target_info', 10)

def observation():
    result = TargetInfo()
    result.visible = True
    result.position = 'RIGHT'
    result.confidence = 0.75
    return result

node.create_timer(0.15, lambda: publisher.publish(observation()))
rclpy.spin(node)
