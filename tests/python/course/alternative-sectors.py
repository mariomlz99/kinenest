import rclpy
import numpy as np
from sensor_msgs.msg import LaserScan
from ros2learn import report_sectors
rclpy.init()
node = rclpy.create_node('array_reader')
def receive(scan):
    angles = scan.angle_min + np.arange(len(scan.ranges))*scan.angle_increment
    ranges = np.array(scan.ranges)
    results = []
    for center in [0, np.pi/2, -np.pi/2]:
        delta = np.arctan2(np.sin(angles-center), np.cos(angles-center))
        selected = ranges[(abs(delta)<=np.pi/12+1e-9) & np.isfinite(ranges)]
        results.append(selected.min() if len(selected) else np.inf)
    report_sectors(*results)
node.create_subscription(LaserScan, '/scan', receive, 10)
rclpy.spin(node)
