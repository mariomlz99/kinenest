import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from ros2learn_interfaces.action import DriveDistance

rclpy.init()
node = Node('student_controller')

client = ActionClient(node, DriveDistance, '/drive_distance')
def feedback(msg):
    print('Travelled:', msg.feedback.distance_travelled)
def result(future):
    response = future.result()
    print('Status:', response.status, 'Distance:', response.result.final_distance)
def accepted(future):
    handle = future.result()
    if handle.accepted:
        handle.get_result_async().add_done_callback(result)
goal = DriveDistance.Goal()
goal.distance = 1.0
client.send_goal_async(goal, feedback_callback=feedback).add_done_callback(accepted)
rclpy.spin(node)
