import rclpy
import numpy as np
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
from geometry_msgs.msg import Twist
from ros2learn import report_detection, report_image_stats

class CameraReader(Node):
    def __init__(self):
        super().__init__('camera_reader')
        self.publisher = self.create_publisher(Twist, '/cmd_vel', 10)
        self.bridge = CvBridge()
        self.subscription = self.create_subscription(
            Image, '/camera/image_raw', self.image_callback, 10)

    def image_callback(self, msg):
        image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='rgb8')
        mask = (image[:, :, 0] > 180) & (image[:, :, 1] < 100) & (image[:, :, 2] < 100)
        ys, xs = np.where(mask)
        visible = len(xs) > 500
        cx = float(xs.mean()) if visible else None
        report_detection(visible, cx)
        msg = Twist()
        if not visible:
            msg.angular.z = 0.5
        elif abs(160 - cx) >= 10:
            msg.angular.z = max(-1.0, min(1.0, (160 - cx) / 100))
        self.publisher.publish(msg)

rclpy.init()
node = CameraReader()
rclpy.spin(node)
