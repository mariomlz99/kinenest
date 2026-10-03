import rclpy
import cv2
import numpy as np
from sensor_msgs.msg import Image
from cv_bridge import CvBridge
from ros2learn import report_detection

rclpy.init()
robot_eyes = rclpy.create_node('different_name')
converter = CvBridge()

def see(frame):
    pixels = np.frombuffer(frame.data, dtype=np.uint8).reshape(frame.height, frame.width, 3)
    mask = cv2.inRange(pixels, (181, 0, 0), (255, 99, 99))
    found = cv2.countNonZero(mask) > 500
    m = cv2.moments(mask, binaryImage=True)
    report_detection(found, m['m10'] / m['m00'] if found else None)

subscription = robot_eyes.create_subscription(Image, '/camera/image_raw', see, 10)
rclpy.spin(robot_eyes)
