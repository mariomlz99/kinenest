import rclpy
import numpy as np
from rclpy.node import Node
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
from ros2learn import report_detection, report_image_stats

class CameraReader(Node):
    def __init__(self):
        super().__init__('camera_reader')
        self.bridge = CvBridge()
        self.subscription = self.create_subscription(
            Image, '/camera/image_raw', self.image_callback, 10)

    def image_callback(self, msg):
        image = self.bridge.imgmsg_to_cv2(msg, desired_encoding='rgb8')
        mask = (image[:, :, 0] > 180) & (image[:, :, 1] < 100) & (image[:, :, 2] < 100)
        report_detection(mask.sum() > 500)

rclpy.init()
node = CameraReader()
rclpy.spin(node)
