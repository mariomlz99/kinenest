// A small registry for Core and future tracks. Exercises stay in their current files.
export const TRACKS=Object.freeze([
  {id:'ros-foundations',title:'ROS 2 Foundations',description:'Nodes, topics, sensors, services, parameters, actions, odometry, frames and debugging.',status:'available',languages:['python','cpp'],difficulty:'beginner',sessions:[
    {id:'session-01',title:'Nodes & Topics',href:'session-01.html'},
    {id:'session-02',title:'Subscribers & Callbacks',href:'session-02.html'},
    {id:'session-03',title:'Messages & Services',href:'session-03.html'},
    {id:'session-04',title:'Parameters & Actions',href:'session-04.html'},
    {id:'session-05',title:'Odometry & Frames',href:'session-05.html'},
    {id:'session-06',title:'Debugging Challenge',href:'session-06.html'}]},
  {id:'real-ros-bridge',title:'From KineNest to ROS 2',description:'Build a workspace, package nodes, run them and launch a small system.',status:'available',languages:['python','cpp'],difficulty:'beginner',sessions:[{id:'core-bridge',title:'Workspace, build, run and launch',href:'bridge.html'},{id:'native-transition',title:'Transition to native ROS 2',href:'real-ros.html'}]},
  {id:'communication-qos',title:'Communication & QoS',description:'Understand what happens underneath ROS 2 communication.',status:'exploring',sessions:[]},
  {id:'manipulation',title:'Manipulation',description:'Explore kinematics, trajectories and robotic arms.',status:'exploring',sessions:[]},
  {id:'navigation-planning',title:'Navigation & Planning',description:'Move from reactive behavior to deliberate motion planning.',status:'exploring',sessions:[]}
]);

// Stable lesson IDs preserve saved code and existing links. Optional labs retain their files.
export const FURTHER_EXERCISES = Object.freeze([
  "session-02-03-sectors",
  "session-02-04-avoidance",
  "session-03-02-image-data",
  "session-03-03-color-detection",
  "session-03-04-object-position",
  "session-03-06-target-challenge",
  "session-04-06-cancel",
  "session-05-05-goal",
  "session-05-06-safety",
  "session-06-03-beacon"
]);
export const isFurther = id => FURTHER_EXERCISES.includes(id);
export const CORE_EXERCISES = Object.freeze([
  "session-02-01-subscriber",
  "session-02-02-callbacks",
  "session-03-01-camera-subscriber",
  "session-03-05-services",
  "session-04-01-configure",
  "session-04-02-tuning",
  "session-04-03-custom",
  "session-04-04-goal",
  "session-04-05-feedback",
  "session-05-01-odometry",
  "session-05-02-heading",
  "session-05-03-frames",
  "session-05-04-relative",
  "session-06-01-topic-debug",
  "session-06-02-frame-debug"
]);
export const lessonHref = id => "./" + id.slice(0,10) + ".html?lesson=" + encodeURIComponent(id);
export const FURTHER_PREREQUISITES = Object.freeze({
  'session-02-03-sectors':['session-02-01-subscriber'],
  'session-02-04-avoidance':['session-02-03-sectors'],
  'session-03-02-image-data':['session-03-01-camera-subscriber'],
  'session-03-03-color-detection':['session-03-02-image-data'],
  'session-03-04-object-position':['session-03-03-color-detection'],
  'session-03-06-target-challenge':['session-03-04-object-position'],
  'session-04-06-cancel':['session-04-05-feedback'],
  'session-05-05-goal':['session-05-04-relative'],
  'session-05-06-safety':['session-05-05-goal','session-02-03-sectors'],
  'session-06-03-beacon':['session-02-02-callbacks','session-02-03-sectors','session-03-06-target-challenge']
});
