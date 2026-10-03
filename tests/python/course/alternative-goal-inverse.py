import math
import rclpy
from rclpy.node import Node
from rclpy.time import Time
from geometry_msgs.msg import Twist
from tf2_ros import Buffer, TransformListener, TransformException

class GoalController(Node):
    def __init__(self):
        super().__init__('inverse_goal_controller')
        self.frames = Buffer()
        self.listener = TransformListener(self.frames, self)
        self.commands = self.create_publisher(Twist, '/cmd_vel', 10)
        self.timer = self.create_timer(0.1, self.control)

    def control(self):
        try:
            # Invert the opposite lookup: an equivalent frame calculation.
            transform = self.frames.lookup_transform('target', 'base_link', Time()).transform
        except TransformException:
            return
        yaw = 2 * math.atan2(transform.rotation.z, transform.rotation.w)
        p = transform.translation
        forward = -math.cos(yaw) * p.x - math.sin(yaw) * p.y
        left = math.sin(yaw) * p.x - math.cos(yaw) * p.y
        distance = math.sqrt(forward * forward + left * left)
        bearing = math.atan2(left, forward)
        command = Twist()
        if distance > 0.08:
            command.angular.z = max(-1.2, min(1.2, 1.8 * bearing))
            if abs(bearing) < 0.25:
                command.linear.x = min(0.6, 0.9 * distance)
        self.commands.publish(command)

rclpy.init()
rclpy.spin(GoalController())
