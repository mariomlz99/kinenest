import rclpy
from rclpy.node import Node
import numpy as np
from sensor_msgs.msg import Image, LaserScan
from geometry_msgs.msg import Twist
from cv_bridge import CvBridge
from ros2learn import report_detection

rclpy.init()
node = Node('student_controller')

bridge = CvBridge()
front = 0.0
publisher = node.create_publisher(Twist, '/cmd_vel', 10)
def scan(msg):
    global front
    front = min(msg.ranges[55:66])
def image(msg):
    data = bridge.imgmsg_to_cv2(msg, 'rgb8')
    mask = (data[:,:,0]>180) & (data[:,:,1]<100) & (data[:,:,2]<100)
    ys, xs = np.where(mask)
    cmd = Twist()
    if len(xs)>500:
        cx = xs.mean()
        report_detection(True, cx)
        error = 160-cx
        if abs(error)>8:
            cmd.angular.z = max(-0.8, min(0.8, error*0.008))
        elif front>0.85:
            cmd.linear.x = 0.6
    else:
        report_detection(False)
        cmd.angular.z = 0.5
    publisher.publish(cmd)
node.create_subscription(LaserScan, '/scan', scan, 10)
node.create_subscription(Image, '/camera/image_raw', image, 10)
rclpy.spin(node)
