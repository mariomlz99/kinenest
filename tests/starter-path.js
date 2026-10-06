// Complete the changed starter TODOs using only the APIs named in the visible lessons.
// No reference-program fetches: a drift in a starter or an incomplete scaffold fails here.
const language=new URLSearchParams(location.search).get('language')==='cpp'?'cpp':'python';
const frame=document.querySelector('iframe'),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(fn,label,seconds=120){const end=Date.now()+seconds*1000;while(Date.now()<end){if(fn())return;await sleep(100);}throw Error(label+' / '+frame.contentDocument?.getElementById('python-output')?.textContent+' / '+frame.contentDocument?.getElementById('feedback')?.textContent);}
function replace(source,before,after){if(!source.includes(before))throw Error('Starter changed: '+before);return source.replace(before,after);}
const edits={
 '04-01-configure':{
  python:s=>replace(replace(s,'# TODO: declare speed with default 0.2 on this node.',"node.declare_parameter('speed', 0.2)"),'    # TODO: publish a Twist with fixed linear.x = 0.2.\n    pass','    command = Twist()\n    command.linear.x = 0.2\n    publisher.publish(command)'),
  cpp:s=>replace(replace(s,'// TODO: declare speed with default 0.2.','declare_parameter<double>("speed", 0.2);'),'// TODO: publish a Twist with fixed linear.x = 0.2.','geometry_msgs::msg::Twist command;\n      command.linear.x = 0.2;\n      publisher_->publish(command);')
 },
 '04-02-tuning':{
  python:s=>replace(s,'command.linear.x = 0.2',"command.linear.x = max(0.0, min(0.8, node.get_parameter('speed').value))"),
  cpp:s=>replace(s,'command.linear.x = 0.2;','command.linear.x = std::max(0.0, std::min(0.8, get_parameter("speed").as_double()));')
 },
 '04-05-feedback':{
  python:s=>replace(s,'    # TODO: print msg.feedback.distance_travelled.\n    pass','    print(msg.feedback.distance_travelled)'),
  cpp:s=>replace(s,'// TODO: attach feedback_callback and print feedback->distance_travelled.','options.feedback_callback = [node](GoalHandle::SharedPtr, std::shared_ptr<const Action::Feedback> feedback) { RCLCPP_INFO(node->get_logger(), "Distance: %.3f", feedback->distance_travelled); };')
 },
 '05-01-odometry':{
  python:s=>replace(s,'    pass','    position = msg.pose.pose.position\n    q = msg.pose.pose.orientation\n    print(position.x, position.y, q.z, q.w, msg.twist.twist.linear.x)\n    report_position(position.x, position.y)'),
  cpp:s=>replace(s,'// TODO: kinenest::report_position(x, y);','const auto &p = msg->pose.pose.position;\n    const auto &q = msg->pose.pose.orientation;\n    RCLCPP_INFO(get_logger(), "Position %.3f %.3f; quaternion %.3f %.3f; velocity %.3f", p.x, p.y, q.z, q.w, msg->twist.twist.linear.x);\n    kinenest::report_position(p.x, p.y);')
 },
 '05-02-heading':{
  python:s=>replace(s,'    pass','    p = msg.pose.pose.position\n    q = msg.pose.pose.orientation\n    yaw = euler_from_quaternion([q.x, q.y, q.z, q.w])[2]\n    report_pose(p.x, p.y, yaw)'),
  cpp:s=>replace(s,'// TODO: kinenest::report_pose(x, y, yaw);','const auto &p = msg->pose.pose.position;\n    const auto &q = msg->pose.pose.orientation;\n    kinenest::report_pose(p.x, p.y, tf2::getYaw(q));')
 }
};
try{
 let currentSession;
 for(const [suffix,variants] of Object.entries(edits)){
  const session=suffix.slice(0,2),id='session-'+suffix;
  if(session!==currentSession){frame.src='../session-'+session+'.html';await new Promise(resolve=>frame.onload=resolve);await until(()=>frame.contentDocument.documentElement.dataset.kinenestReady==='true','page ready');currentSession=session;}
  const d=frame.contentDocument,$=id=>d.getElementById(id);
  $('lesson-select').value=id;$('lesson-select').dispatchEvent(new Event('change',{bubbles:true}));
  await until(()=>d.body.dataset.lessonId===id&&d.body.dataset.lessonState==='ready','lesson ready');
  d.querySelector('[data-code-language="'+language+'"]').click();
  const editor=$(language==='cpp'?'cpp-code':'python-code');
  // Each case is first visited with a clean browser profile, so this is the supplied starter.
  if(!editor.value.includes('TODO'))throw Error('Expected a supplied starter for '+id);
  editor.value=variants[language](editor.value);editor.dispatchEvent(new Event('input',{bubbles:true}));
  $(language==='cpp'?'run-cpp':'run-python').click();
  await until(()=>$('python-state').textContent.includes('callbacks ready'),'runtime ready');
  if(suffix==='04-02-tuning'){await sleep(1000);$('command').value='ros2 param set /student_controller speed 0.6';$('terminal-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));}
  if(suffix==='04-01-configure'){for(const command of ['ros2 param list /student_controller','ros2 param get /student_controller speed']){$('command').value=command;$('terminal-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));await sleep(50);}}
  await until(()=>{$('check').click();return $('status').textContent.startsWith('Exercise complete');},'starter completion '+id,40);
  $('stop-python').click();await fetch('/progress',{method:'POST',body:'PASS starter '+language+' '+id});
 }
 await fetch('/done',{method:'POST',body:'PASS '+language+' changed starter path: declaration, live tuning, feedback, raw odometry, yaw'});
}catch(error){await fetch('/done',{method:'POST',body:'FAIL starter '+language+': '+error.stack});}
