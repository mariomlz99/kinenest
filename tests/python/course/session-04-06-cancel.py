import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from ros2learn_interfaces.action import DriveDistance

rclpy.init()
node = Node('student_controller')

client = ActionClient(node, DriveDistance, '/drive_distance')
handle = None
cancelled = False
def feedback(msg):
    global cancelled
    print(msg.feedback.distance_travelled)
    if handle and msg.feedback.distance_travelled > 0.3 and not cancelled:
        cancelled = True
        handle.cancel_goal_async()
def result(future):
    print('Final status:', future.result().status)
def accepted(future):
    global handle
    handle = future.result()
    if handle.accepted:
        handle.get_result_async().add_done_callback(result)
goal = DriveDistance.Goal()
goal.distance = 2.0
client.send_goal_async(goal, feedback_callback=feedback).add_done_callback(accepted)
rclpy.spin(node)
