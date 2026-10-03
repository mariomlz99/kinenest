import rclpy
from rclpy.node import Node
from sensor_msgs.msg import Image
class CameraReader(Node):
    def __init__(self):
        super().__init__('camera_reader')
        self.sub = self.create_subscription(Image, '/camera/image_raw', self.callback, 10)
    def callback(self, msg):
        print(f'Image: {msg.width} x {msg.height}')
rclpy.init()
node = CameraReader()
rclpy.spin(node)
