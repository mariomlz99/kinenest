import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist

class Driver(Node):
    def __init__(self):
        super().__init__('student_controller')
        self.declare_parameter('speed', 0.3)
        self.output = self.create_publisher(Twist, '/cmd_vel', 10)
        self.create_timer(0.15, self.update)

    def update(self):
        command = Twist()
        command.linear.x = min(0.8, max(0.0, self.get_parameter('speed').value))
        self.output.publish(command)

rclpy.init()
rclpy.spin(Driver())
