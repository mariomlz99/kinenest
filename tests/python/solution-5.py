import rclpy
from rclpy.node import Node
from std_srvs.srv import Trigger
rclpy.init()
node = Node('reset_client')
client = node.create_client(Trigger, '/reset_robot')
future = client.call_async(Trigger.Request())
def done(future):
    print(future.result().success, future.result().message)
future.add_done_callback(done)
rclpy.spin(node)
