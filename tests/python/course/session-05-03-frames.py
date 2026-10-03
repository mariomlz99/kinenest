import rclpy
from rclpy.node import Node
from tf2_ros import Buffer, TransformListener, TransformException
from rclpy.time import Time
from ros2learn import report_transform

rclpy.init()
node = Node('student_controller')

buffer = Buffer()
listener = TransformListener(buffer, node)
def tick():
    try:
        transform = buffer.lookup_transform('odom', 'laser_link', Time())
        p = transform.transform.translation
        print('Laser in odom:', p.x, p.y)
        report_transform(p.x, p.y)
    except TransformException:
        pass
node.create_timer(0.2, tick)
rclpy.spin(node)
