# Python launch subset

The parser accepts literal `from launch import LaunchDescription`, `from launch_ros.actions import Node`, and `generate_launch_description()` returning a `LaunchDescription` list of `Node(...)` actions. Node supports package, executable, optional name, namespace, scalar parameter maps and topic remapping pairs. It parses data and never executes arbitrary launch Python. The package must be built, sourced and contain an installed `launch/*.launch.py` file.

| Native ROS 2 feature | KineNest support | Notes / limitation |
|---|---|---|
| `LaunchDescription` and `Node` | Yes | Literal beginner shape only |
| Package/executable resolution | Yes | Current modeled install registry |
| Name and namespace | Yes | Applied to graph identities and relative topics |
| Scalar parameters | Yes | Delivered to supported client-library shim |
| Topic remappings | Yes | Applied before shared graph registration |
| Launch arguments, substitutions, includes, events | No | Explicit unsupported syntax error |
| XML/YAML launch and arbitrary Python | No | No arbitrary code evaluation |
| Native process supervision | No | Browser workers with group ownership |

References: [Jazzy launch tutorial](https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Intermediate/Launch/Creating-Launch-Files.rst), [Lyrical launch tutorial](https://github.com/ros2/ros2_documentation/blob/lyrical/source/Developer-Tools/Launch/Creating-Launch-Files.rst). Both describe `ros2 launch <package> <launch_file>` and recommend `ros2launch` as an execution dependency. The newer docs reorganize the page but show no material change to this subset.
