import math
import numpy as np
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image, LaserScan
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
from ros2learn import report_detection

class Dock(Node):
    def __init__(self):
        super().__init__('student_controller')
        self.front = 0.0
        self.bridge = CvBridge()
        self.pub = self.create_publisher(Twist, '/cmd_vel', 10)
        self.create_subscription(LaserScan, '/scan', self.scan, 10)
        self.create_subscription(Image, '/camera/image_raw', self.image, 10)

    def scan(self, message):
        sector = [distance for i, distance in enumerate(message.ranges)
                  if abs(message.angle_min + i * message.angle_increment) < math.radians(6)]
        self.front = min(sector, default=0.0)

    def image(self, message):
        rgb = self.bridge.imgmsg_to_cv2(message, 'rgb8')
        red = np.logical_and(rgb[..., 0] > 180, np.max(rgb[..., 1:], axis=2) < 100)
        columns = np.nonzero(red)[1]
        command = Twist()
        if columns.size > 500:
            center = float(np.average(columns))
            report_detection(True, center)
            error = rgb.shape[1] / 2 - center
            if abs(error) > 8:
                command.angular.z = float(np.clip(error * 0.008, -0.8, 0.8))
            elif self.front > 0.9:
                command.linear.x = 0.55
        else:
            report_detection(False)
            command.angular.z = 0.5
        self.pub.publish(command)

rclpy.init()
rclpy.spin(Dock())
