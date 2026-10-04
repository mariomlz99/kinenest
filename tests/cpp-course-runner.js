const out = document.getElementById('result');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const wave = new URLSearchParams(location.search).get('wave') ?? '1';
const results = [];
let runtime, bridge, timer, lesson = null, output = '', state = '', metrics = null, running = false;

async function request(url) {
  const response = await fetch(url, {signal: AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error(url + ': HTTP ' + response.status);
  return response;
}
async function progress(prefix, value) {
  const text = prefix + ' ' + JSON.stringify(value);
  out.textContent += '\n' + text;
  await fetch('/progress', {method: 'POST', body: text});
}
async function until(condition, seconds = 120, allowError = false) {
  const deadline = performance.now() + seconds * 1000;
  while (performance.now() < deadline) {
    if (condition()) return;
    if (!allowError && (output.includes('C++:') || (!bridge.worker && output))) throw new Error(output);
    await wait(50);
  }
  throw new Error('Timeout: ' + state + '\n' + output);
}
function snapshot() {
  return {
    course: JSON.parse(JSON.stringify(runtime.course, (_, value) => value instanceof Set ? [...value] : value)),
    evidence: JSON.parse(JSON.stringify(runtime.evidence, (_, value) => value instanceof Set ? [...value] : value instanceof Map ? [...value] : value)),
    robot: {x: runtime.robot.x, y: runtime.robot.y, yaw: runtime.robot.yaw, distance: runtime.robot.distance},
    collisions: runtime.collisions, simulatedSeconds: runtime.time,
  };
}
async function cleaned() {
  running = false;
  bridge.stop();
  assert(!bridge.worker, 'Stop retained worker');
  assert(bridge.nodes.size === 0 && bridge.subscriptions.size === 0 && bridge.jobs.size === 0, 'Stop retained adapter endpoint');
  assert(bridge.mailbox.inFlight.size === 0 && bridge.mailbox.latest.size === 0, 'Stop retained sensor mailbox');
  assert(runtime.parameterListeners.size === 0, 'Stop retained parameter listener');
  assert(runtime.robot.linear === 0 && runtime.robot.angular === 0, 'Stop retained motion command');
  const allowed = new Set(['/simulator', '/reset_server', '/drive_distance_server']);
  assert([...runtime.nodes].every(node => allowed.has(node)), 'Stop retained student node');
  for (const topic of runtime.topics.values()) {
    assert([...topic.publishers, ...topic.subscribers].every(node => allowed.has(node)), 'Stop retained graph endpoint');
  }
  runtime.reset();
  await wait(100);
  assert(runtime.evidence.callbacks === 0 && runtime.evidence.codePublications === 0 && runtime.course.scan === 0, 'Reset retained evidence');
  assert(runtime.samples.size === 0 && runtime.frames.size === 0, 'Reset retained sensor samples');
  assert(runtime.goals.size === 0 && runtime.parameterListeners.size === 0, 'Reset retained asynchronous lifecycle state');
}
async function record(id, kind, action) {
  const started = performance.now();
  const result = {exercise: id, kind, compile: 'not-run', run: 'not-run', check: 'not-run', passed: false};
  output = ''; state = ''; metrics = null;
  try {
    await action(result);
    result.passed = true;
  } catch (error) {
    result.error = error.message;
    result.output = output.slice(-6000);
    throw error;
  } finally {
    result.durationMs = Math.round(performance.now() - started);
    result.metrics = metrics;
    try { await cleaned(); result.stopReset = 'passed'; }
    catch (error) { result.stopReset = 'failed'; result.passed = false; result.error ??= error.message; }
    results.push(result);
    await progress('CPP_COURSE_CASE', result);
    if (!result.passed) throw new Error(result.error ?? 'Scenario failed');
  }
}

try {
  assert(wave === '1', 'Only Wave 1 is implemented in this runner; full 25-exercise acceptance is not claimed.');
  const html = await (await request('../session-02.html')).text();
  const path = new DOMParser().parseFromString(html, 'text/html')
    .querySelector('script[src$="session3-boot.js"]').getAttribute('src').replace('ui/session3-boot.js', '');
  const {Runtime} = await import('../' + path + 'runtime/graph.js');
  const {CppBridge} = await import('../' + path + 'cpp/bridge.js');
  const {courseChecks, observeCourse} = await import('../' + path + 'exercises/course.js');
  const {sessionChecks} = await import('../' + path + 'exercises/perception.js');
  const {TRAINING_WORLD} = await import('../' + path + 'simulator/lidar.js');
  // Read lesson URLs relative to the versioned module tree, as the application does.
  const publicPath = path.replace(/src\/$/, 'public/');
  runtime = new Runtime();
  runtime.enableSession3();
  bridge = new CppBridge(runtime, {
    output: text => { output = (output + text + '\n').slice(-24000); },
    status: text => { state = text; },
    metrics: value => { metrics = structuredClone(value); },
  });
  timer = setInterval(() => {
    if (!running) return;
    runtime.step(1 / 60);
    if (lesson) observeCourse(runtime, lesson);
  }, 1000 / 60);
  const checks = () => lesson.session === 3 ? sessionChecks(runtime, lesson) : courseChecks(runtime, lesson);
  async function setup(id) {
    await cleaned();
    lesson = await (await request('../' + publicPath + 'lessons/' + id + '.json')).json();
    runtime.robot.x = lesson.startX ?? 0;
    runtime.robot.y = lesson.startY ?? 0;
    runtime.robot.yaw = lesson.startYaw ?? 0;
    runtime.world = lesson.world ?? (lesson.session === 2 ? structuredClone(TRAINING_WORLD) : null);
    runtime.targets = lesson.targets;
    runtime.targetFrame = lesson.goal ?? [5, 0];
    assert(!checks().every(check => check.passed), 'Empty exercise passed ' + id);
  }
  const ids = ['session-02-01-subscriber', 'session-02-02-callbacks', 'session-02-03-sectors', 'session-02-04-avoidance', 'session-06-01-topic-debug'];
  const alternates = new Set(['session-02-02-callbacks', 'session-02-03-sectors', 'session-06-01-topic-debug']);
  for (const id of ids) {
    for (const kind of ['reference', 'negative', ...(alternates.has(id) ? ['alternate'] : [])]) {
      await record(id, kind, async result => {
        await setup(id);
        const prefix = kind === 'negative' ? 'negative-' : kind === 'alternate' ? 'alternative-' : '';
        const code = await (await request('./cpp/course/' + prefix + id + '.cpp')).text();
        bridge.run(code);
        await until(() => state.includes('callbacks ready'));
        result.compile = 'passed'; result.run = 'passed';
        running = true;
        if (kind === 'negative') {
          const seconds = lesson.checks.some(check => check.type === 'avoidance') ? 10 : 3;
          await until(() => runtime.time >= seconds, seconds * 2 + 3);
          assert(!checks().every(check => check.passed), 'Negative control passed ' + id);
          result.check = 'rejected-as-expected';
        } else {
          await until(() => checks().every(check => check.passed), 40);
          result.check = 'passed';
        }
        result.expectedEvidence = checks();
        result.observed = snapshot();
      });
    }
  }
  await record('String API', 'utf8-quotes-newline-infinity-roundtrip', async result => {
    const expected = 'quote "\nUTF-8 caffè Infinity';
    const code = '#include <rclcpp/rclcpp.hpp>\n#include <std_msgs/msg/string.hpp>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("string_roundtrip");auto p=n->create_publisher<std_msgs::msg::String>("/chatter",10);auto s=n->create_subscription<std_msgs::msg::String>("/chatter",10,[n](std_msgs::msg::String::SharedPtr msg){RCLCPP_INFO(n->get_logger(),"%s",msg->data.c_str());});auto t=n->create_wall_timer(std::chrono::milliseconds(100),[p](){std_msgs::msg::String m;m.data=' + JSON.stringify(expected) + ';p->publish(m);});rclcpp::spin(n);}';
    bridge.run(code);
    await until(() => state.includes('callbacks ready'));
    running = true;
    await until(() => runtime.course.messages >= 3, 10);
    assert(output.includes(expected), 'String UTF-8, quote, newline or literal Infinity changed in transport: ' + output);
    result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
    result.observed = snapshot();
  });
  await record('diagnostics', 'compile-error-recovery', async result => {
    bridge.run('#include <geometry_msgs/msg/twist.hpp>\nint main(){geometry_msgs::msg::Twist m;m.linar.x=1;}');
    await until(() => !bridge.worker, 120, true);
    assert(output.includes('controller.cpp:') && output.includes('linar'), 'Compiler diagnostic lost filename/field');
    result.diagnostic = output.slice(-3000);
    output = '';
    await setup(ids[0]);
    bridge.run(await (await request('./cpp/course/' + ids[0] + '.cpp')).text());
    await until(() => state.includes('callbacks ready'));
    running = true;
    await until(() => checks().every(check => check.passed), 10);
    result.compile = 'error-then-recovered'; result.run = 'passed'; result.check = 'passed';
  });
  for (const expression of ['std::numeric_limits<double>::quiet_NaN()', 'std::numeric_limits<double>::infinity()', '-std::numeric_limits<double>::infinity()']) {
    await record('diagnostics', 'non-finite-' + expression, async result => {
      bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <geometry_msgs/msg/twist.hpp>\n#include <limits>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("invalid_value");auto p=n->create_publisher<geometry_msgs::msg::Twist>("/cmd_vel",10);geometry_msgs::msg::Twist m;m.linear.x=' + expression + ';p->publish(m);rclcpp::spin(n);}');
      await until(() => !bridge.worker, 120, true);
      assert(output.includes('finite') && /linear[.]x|Twist/.test(output), 'Missing precise invalid-value diagnostic: ' + output);
      assert(!/Unexpected token|JSON.*parse|not valid JSON/.test(output), 'Non-finite value leaked into JSON parser');
      assert(runtime.evidence.codePublications === 0, 'Invalid value was published');
      result.compile = 'passed'; result.run = 'rejected-as-expected'; result.check = 'passed';
      result.diagnostic = output.slice(-3000);
    });
  }
  await record('lifecycle', 'infinite-loop-and-stop-during-load', async result => {
    bridge.run('int main(){volatile int n=0;while(true){n=n+1;}}');
    await until(() => state.includes('executing'));
    bridge.stop();
    assert(!bridge.worker, 'Infinite loop survived Stop');
    bridge.run('int main(){return 0;}');
    bridge.stop();
    await wait(200);
    assert(!bridge.worker, 'Stop during loading recreated worker');
    result.compile = 'passed'; result.run = 'terminated'; result.check = 'passed';
  });
  await progress('CPP_COURSE_SUMMARY', {wave: 1, exercises: ids.length, targetExercises: 25,
    cases: results.length, passed: results.filter(result => result.passed).length,
    fullParity: false, result: 'passed'});
  out.textContent = 'PASS: C++ Wave 1 — 5/25 exercise references, negatives, alternates and lifecycle diagnostics';
} catch (error) {
  out.textContent = 'FAIL: C++ course Wave ' + wave + ': ' + error.message;
  await progress('CPP_COURSE_SUMMARY', {wave: Number(wave), cases: results.length,
    passed: results.filter(result => result.passed).length, fullParity: false, result: 'failed', error: error.message});
} finally {
  running = false;
  bridge?.stop();
  clearInterval(timer);
}
await fetch('/done', {method: 'POST', body: out.textContent});
