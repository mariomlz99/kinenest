const out = document.getElementById('result');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const wave = new URLSearchParams(location.search).get('wave') ?? '1';
const results = [];
let runtime, bridge, timer, lesson = null, output = '', state = '', metrics = null, running = false, freezeMotion = false;

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
  freezeMotion = false;
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
  assert(['1', '2'].includes(wave), 'Only Waves 1–2 are implemented in this runner; full 25-exercise acceptance is not claimed.');
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
    if (freezeMotion) runtime.robot.command(0, 0);
    runtime.step(1 / 60);
    if (lesson && lesson.session !== 3) observeCourse(runtime, lesson);
  }, 1000 / 60);
  const checks = () => lesson.session === 3 ? sessionChecks(runtime, lesson) : courseChecks(runtime, lesson);
  async function setup(id) {
    await cleaned();
    lesson = await (await request('../' + publicPath + 'lessons/' + id + '.json')).json();
    lesson.session ??= Number(/^session-(\d+)-/.exec(id)?.[1]);
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
  if (wave === '2') {
    ids.push('session-03-01-camera-subscriber', 'session-03-02-image-data', 'session-03-03-color-detection', 'session-03-04-object-position', 'session-03-06-target-challenge');
    for (const id of ids.filter(id => id.startsWith('session-03') && !id.includes('camera-subscriber'))) alternates.add(id);
  }
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
        const variedScenes = lesson.checks.some(check => ['detection', 'position'].includes(check.type));
        if (variedScenes) {
          freezeMotion = true;
          const scenes = [{y: 2.4, color: [235, 45, 45]}, {y: 0.15, color: [220, 35, 50]}, {y: -2.7, color: [240, 65, 40]}, {y: 0, color: [40, 85, 230]}];
          for (const [index, scene] of scenes.entries()) {
            runtime.robot.reset(); runtime.testCase = 'test-' + index;
            runtime.targets = [{x: 5, ...scene}, {x: 6, y: -2, color: [30, 160, 65]}];
            const startTime = runtime.time;
            await until(() => runtime.time - startTime >= 1.5, 6);
          }
          freezeMotion = false;
        }
        if (kind === 'negative') {
          const seconds = lesson.checks.some(check => check.type === 'avoidance') ? 10 : 3;
          if (!variedScenes) await until(() => runtime.time >= seconds, seconds * 2 + 3);
          assert(!checks().every(check => check.passed), 'Negative control passed ' + id);
          result.check = 'rejected-as-expected';
        } else {
          await until(() => checks().every(check => check.passed), 40);
          result.check = 'passed';
        }
        result.expectedEvidence = checks();
        result.observed = snapshot();
        if (lesson.session === 3) {
          assert(metrics?.imageFrames >= 3, 'Missing image callback metrics');
          assert(metrics.imageBytes === metrics.imageFrames * 320 * 240 * 3, 'Image binary payload accounting mismatch');
          result.imageTransport = {bytes: metrics.imageBytes, frames: metrics.imageFrames, bytesPerFrame: 230400};
        }
      });
    }
  }
  if (wave === '2') {
    await record('Image API', 'binary-latest-mailbox-burst', async result => {
      await setup('session-03-01-camera-subscriber');
      bridge.run(await (await request('./cpp/image-slow.cpp')).text());
      await until(() => state.includes('callbacks ready'));
      const memory = [], batches = [], started = performance.now();
      for (let batch = 0; batch < 6; batch++) {
        const before = runtime.evidence.callbacks;
        // A same-turn burst cannot be acknowledged midway. All but the newest
        // waiting frame must be replaced, irrespective of machine speed.
        for (let frame = 0; frame < 20; frame++) runtime.cameraFrame();
        const latest = runtime.frameId;
        assert(bridge.mailbox.inFlight.size === 1 && bridge.mailbox.latest.size === 1, 'Image mailbox exceeded one active plus one pending frame');
        await until(() => runtime.evidence.callbacks >= before + 2 && bridge.mailbox.inFlight.size === 0, 15);
        assert(runtime.evidence.callbacks === before + 2, 'Stale image frames accumulated instead of being replaced');
        assert(bridge.processed.has(latest), 'Newest waiting image was not processed');
        assert(bridge.mailbox.latest.size === 0, 'Image mailbox failed to drain');
        assert(Number.isFinite(metrics?.programMemoryBytes), 'Missing sampled WASM memory');
        memory.push(metrics.programMemoryBytes);
        batches.push({generated: 20, processed: runtime.evidence.callbacks - before, latestFrame: latest});
      }
      const durationMs = performance.now() - started;
      assert(metrics.imageFrames === 12 && metrics.imageBytes === 12 * 230400, 'Binary frame accounting disagrees with completed callbacks');
      assert(Number.isFinite(metrics.imageCallbackMs) && metrics.imageCallbackMs > 0 &&
        Number.isFinite(metrics.imageMaxCallbackMs), 'Missing image callback timing');
      const stableMemory = memory.slice(2);
      assert(Math.max(...stableMemory) - Math.min(...stableMemory) <= 1024 * 1024, 'Repeated image dispatch grew WASM memory without bound');
      result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
      result.performance = {payloadBytes: metrics.imageBytes, durationMs: Math.round(durationMs),
        payloadBytesPerSecond: Math.round(metrics.imageBytes / (durationMs / 1000)),
        generatedFrames: 120, processedFrames: 12, replacedFrames: 108,
        maxInFlight: 1, maxPending: 1, sampledWasmLinearMemoryBytes: memory,
        imageCallbackMs: metrics.imageCallbackMs, imageMaxCallbackMs: metrics.imageMaxCallbackMs, imageElapsedMs: metrics.imageElapsedMs,
        note: 'Synthetic burst stress; WASM linear memory is not total browser memory.', batches};
    });
    await record('Image API', 'retained-image-does-not-credit-current-frame', async result => {
      await setup('session-03-03-color-detection');
      bridge.run(await (await request('./cpp/image-retained.cpp')).text());
      await until(() => state.includes('callbacks ready'));
      running = true;
      await until(() => runtime.evidence.callbacks >= 5, 10);
      assert(output.includes('retained byte '), 'Retained Image shared_ptr was not usable');
      assert(!runtime.evidence.converted, 'Old Image.data access was credited to a new frame');
      assert([...bridge.processed.values()].every(access => !access.has('data')), 'Current frame acquired stale pixel-access evidence');
      assert(runtime.evidence.detectionCases.size === 0, 'Retained image report bypassed physical scene checking');
      result.compile = 'passed'; result.run = 'passed'; result.check = 'rejected-as-expected';
      result.observed = snapshot();
    });
    await record('Image API', 'compile-error-recovery', async result => {
      bridge.run('#include <sensor_msgs/msg/image.hpp>\nint main(){sensor_msgs::msg::Image image;image.widht=10;}');
      await until(() => !bridge.worker, 120, true);
      assert(output.includes('controller.cpp:') && output.includes('widht'), 'Image compiler diagnostic lost filename/field');
      result.diagnostic = output.slice(-3000);
      output = '';
      await setup('session-03-01-camera-subscriber');
      bridge.run(await (await request('./cpp/course/session-03-01-camera-subscriber.cpp')).text());
      await until(() => state.includes('callbacks ready'));
      running = true;
      await until(() => checks().every(check => check.passed), 10);
      result.compile = 'error-then-recovered'; result.run = 'passed'; result.check = 'passed';
    });
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
  await progress('CPP_COURSE_SUMMARY', {wave: Number(wave), exercises: ids.length, targetExercises: 25,
    cases: results.length, passed: results.filter(result => result.passed).length,
    fullParity: false, result: 'passed'});
  out.textContent = 'PASS: C++ Wave ' + wave + ' — ' + ids.length + '/25 exercise references, negatives, alternates and lifecycle diagnostics';
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
