// A small registry for Core and future tracks. Exercises stay in their current files.
export const TRACKS=Object.freeze([
  {id:'ros-foundations',title:'ROS 2 Foundations',description:'Nodes, topics, sensors, services, parameters, actions, odometry, frames and debugging.',status:'available',languages:['python','cpp'],difficulty:'beginner',sessions:[
    {id:'session-01',title:'Nodes & Topics',href:'session-01.html'},
    {id:'session-02',title:'Callbacks & LiDAR',href:'session-02.html'},
    {id:'session-03',title:'Perception & Services',href:'session-03.html'},
    {id:'session-04',title:'Parameters & Actions',href:'session-04.html'},
    {id:'session-05',title:'Odometry & Frames',href:'session-05.html'},
    {id:'session-06',title:'Debugging Challenge',href:'session-06.html'}]},
  {id:'real-ros-bridge',title:'From KineNest to ROS 2',description:'Build a workspace, package nodes, run them and launch a small system.',status:'available',languages:['python','cpp'],difficulty:'beginner',sessions:[{id:'core-bridge',title:'Workspace, build, run and launch',href:'bridge.html'},{id:'native-transition',title:'Transition to native ROS 2',href:'real-ros.html'}]},
  {id:'communication-qos',title:'Communication & QoS',description:'Understand what happens underneath ROS 2 communication.',status:'exploring',sessions:[]},
  {id:'manipulation',title:'Manipulation',description:'Explore kinematics, trajectories and robotic arms.',status:'exploring',sessions:[]},
  {id:'navigation-planning',title:'Navigation & Planning',description:'Move from reactive behavior to deliberate motion planning.',status:'exploring',sessions:[]}
]);
