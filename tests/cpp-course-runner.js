const out = document.getElementById('result');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const wave = new URLSearchParams(location.search).get('wave') ?? '1';
const focus = new URLSearchParams(location.search).get('focus') === '1';
const includeApi = number => Number(wave) >= number && (!focus || Number(wave) === number);
const results = [];
let availableExercises = 0;
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
  for (const service of runtime.services.values()) assert(service.clients.size === 0, 'Stop retained service client');
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
  assert(['1', '2', '3', '4', '5', '6'].includes(wave), 'Only Waves 1–6 are implemented in this runner; full 25-exercise acceptance is not claimed.');
  const html = await (await request('../session-02.html')).text();
  const path = new DOMParser().parseFromString(html, 'text/html')
    .querySelector('script[src$="session3-boot.js"]').getAttribute('src').replace('ui/session3-boot.js', '');
  const {Runtime} = await import('../' + path + 'runtime/graph.js');
  const {CppBridge} = await import('../' + path + 'cpp/bridge.js');
  const {courseChecks, observeCourse} = await import('../' + path + 'exercises/course.js');
  const {setParameter} = await import('../' + path + 'runtime/course.js');
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
  if (Number(wave) >= 2) {
    ids.push('session-03-01-camera-subscriber', 'session-03-02-image-data', 'session-03-03-color-detection', 'session-03-04-object-position', 'session-03-06-target-challenge');
    for (const id of ids.filter(id => id.startsWith('session-03') && !id.includes('camera-subscriber'))) alternates.add(id);
  }
  if (Number(wave) >= 3) { ids.push('session-03-05-services'); alternates.add('session-03-05-services'); }
  if (Number(wave) >= 4) {
    for (const id of ['session-04-01-configure', 'session-04-02-tuning', 'session-04-03-custom']) { ids.push(id); alternates.add(id); }
  }
  if (Number(wave) >= 5) {
    for (const id of ['session-05-01-odometry', 'session-05-02-heading']) { ids.push(id); alternates.add(id); }
  }
  const wave6Ids = ['session-05-03-frames', 'session-05-04-relative', 'session-05-05-goal', 'session-05-06-safety', 'session-06-02-frame-debug'];
  if (Number(wave) >= 6) {
    ids.push(...wave6Ids);
    for (const id of ['session-05-04-relative', 'session-05-05-goal', 'session-06-02-frame-debug']) alternates.add(id);
  }
  const newest = id => Number(wave) === 6 ? wave6Ids.includes(id) : Number(wave) === 5 ? ['session-05-01-odometry', 'session-05-02-heading'].includes(id) : Number(wave) === 4 ? id.startsWith('session-04-') : Number(wave) === 3 ? id === 'session-03-05-services' : Number(wave) === 2 ? id.startsWith('session-03-') : ['session-02-02-callbacks', 'session-02-03-sectors', 'session-06-01-topic-debug'].includes(id);
  ids.sort((a, b) => Number(newest(b)) - Number(newest(a)));
  availableExercises = ids.length;
  const selectedIds = focus ? ids.filter(newest) : ids;
  for (const id of selectedIds) {
    for (const kind of ['reference', 'negative', ...(alternates.has(id) ? ['alternate'] : [])]) {
      await record(id, kind, async result => {
        await setup(id);
        const prefix = kind === 'negative' ? 'negative-' : kind === 'alternate' ? 'alternative-' : '';
        const code = await (await request('./cpp/course/' + prefix + id + '.cpp')).text();
        bridge.run(code);
        await until(() => state.includes('callbacks ready'));
        result.compile = 'passed'; result.run = 'passed';
        running = true;
        if (id === 'session-04-02-tuning') {
          await until(() => runtime.course.timers >= 3, 10);
          setParameter(runtime, '/student_controller', 'speed', 0.6);
        }
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
        if (id === 'session-03-05-services' && kind !== 'negative') assert(runtime.robot.x === 0 && runtime.robot.y === 0, 'Service did not physically reset the robot');
        result.expectedEvidence = checks();
        result.observed = snapshot();
        if (lesson.checks.some(check => check.type === 'camera_subscriber')) {
          assert(metrics?.imageFrames >= 3, 'Missing image callback metrics');
          assert(metrics.imageBytes === metrics.imageFrames * 320 * 240 * 3, 'Image binary payload accounting mismatch');
          result.imageTransport = {bytes: metrics.imageBytes, frames: metrics.imageFrames, bytesPerFrame: 230400};
        }
      });
    }
  }
  if (includeApi(2)) {
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
  if (includeApi(3)) {
    const serviceProgram = '#include <rclcpp/rclcpp.hpp>\n#include <std_srvs/srv/trigger.hpp>\nusing Trigger=std_srvs::srv::Trigger;\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("service_probe");auto c=n->create_client<Trigger>("/reset_robot");c->async_send_request(std::make_shared<Trigger::Request>(),[n](rclcpp::Client<Trigger>::SharedFuture f){auto response=f.get();RCLCPP_INFO(n->get_logger(),"SERVICE_RESPONSE %d %s",response->success,response->message.c_str());});rclcpp::spin(n);}';
    await record('Service API', 'handler-error-does-not-credit-response', async result => {
      await setup('session-03-05-services');
      const service = runtime.service('/reset_robot'), original = service.handler;
      service.handler = () => { throw new Error('Controlled reset service failure'); };
      try {
        bridge.run(serviceProgram);
        await until(() => !bridge.worker, 120, true);
        assert(output.includes('Controlled reset service failure'), 'Service error lost actionable cause: ' + output);
        assert(!runtime.evidence.response && !runtime.evidence.reset, 'Failed service credited success evidence');
        assert(!output.includes('SERVICE_RESPONSE'), 'Failed service invoked success callback');
        assert(runtime.robot.x === 2, 'Failed service unexpectedly moved the robot');
        result.compile = 'passed'; result.run = 'rejected-as-expected'; result.check = 'passed';
        result.diagnostic = output.slice(-3000);
      } finally { service.handler = original; }
    });
    for (const mode of ['Stop', 'Reset']) {
      await record('Service API', mode.toLowerCase() + '-pending-response-and-rerun', async result => {
        await setup('session-03-05-services');
        bridge.run(serviceProgram);
        const oldWorker = bridge.worker, oldOnMessage = oldWorker.onmessage;
        const originalPost = oldWorker.postMessage.bind(oldWorker);
        let heldResponse;
        // Deterministic transport fault injection: hold only the real response.
        // Compilation, service execution and request routing remain unmodified.
        oldWorker.postMessage = (message, ...transfer) => {
          if (message.kind === 'service_response') { heldResponse = message; return; }
          return originalPost(message, ...transfer);
        };
        await until(() => heldResponse !== undefined);
        assert(runtime.evidence.client && runtime.evidence.request && !runtime.evidence.response, 'Missing pending service lifecycle');
        assert(runtime.robot.x === 0, 'Real reset handler did not run before response');
        bridge.stop();
        if (mode === 'Reset') runtime.reset();
        assert(runtime.service('/reset_robot').clients.size === 0, mode + ' retained service client');
        output = '';
        await setup('session-02-01-subscriber');
        bridge.run(await (await request('./cpp/course/session-02-01-subscriber.cpp')).text());
        await until(() => state.includes('callbacks ready'));
        // A queued event from the disposed worker must fail its identity guard.
        oldOnMessage({data: {kind: 'response_received', success: true}});
        oldOnMessage({data: {kind: 'stdout', text: 'STALE_SERVICE_CALLBACK'}});
        try { originalPost(heldResponse); } catch { /* A terminated worker may reject posting. */ }
        running = true;
        await until(() => checks().every(check => check.passed), 10);
        assert(!runtime.evidence.response, 'Stale response credited the replacement run');
        assert(!output.includes('STALE_SERVICE_CALLBACK') && !output.includes('SERVICE_RESPONSE'), 'Stale callback reached replacement output');
        result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
        result.injectedFault = 'Held real service response until its worker was terminated';
      });
    }
    await record('Service API', 'compile-error-recovery', async result => {
      bridge.run('#include <std_srvs/srv/trigger.hpp>\nint main(){std_srvs::srv::Trigger::Response response;response.sucess=true;}');
      await until(() => !bridge.worker, 120, true);
      assert(output.includes('controller.cpp:') && output.includes('sucess'), 'Service diagnostic lost filename/field');
      result.diagnostic = output.slice(-3000);
      output = '';
      await setup('session-03-05-services');
      bridge.run(await (await request('./cpp/course/session-03-05-services.cpp')).text());
      await until(() => state.includes('callbacks ready'));
      await until(() => checks().every(check => check.passed), 10);
      assert(runtime.robot.x === 0, 'Corrected service did not reset the displaced robot');
      result.compile = 'error-then-recovered'; result.run = 'passed'; result.check = 'passed';
    });
  }
  if (includeApi(4)) {
    const parameterProgram = '#include <rclcpp/rclcpp.hpp>\n#include <string>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("parameter_probe");n->declare_parameter<bool>("enabled",false);n->declare_parameter<int>("count",7);n->declare_parameter<double>("speed",0.2);n->declare_parameter<std::string>("label","caffè");auto t=n->create_wall_timer(std::chrono::milliseconds(100),[n](){double speed=0;n->get_parameter("speed",speed);RCLCPP_INFO(n->get_logger(),"PARAM %d %lld %.2f %s",n->get_parameter("enabled").as_bool(),static_cast<long long>(n->get_parameter("count").as_int()),speed,n->get_parameter("label").as_string().c_str());});rclcpp::spin(n);}';
    async function runParameterProbe() {
      bridge.run(parameterProgram);
      await until(() => state.includes('callbacks ready'));
      running = true;
      await until(() => output.includes('PARAM 0 7 0.20 caffè'), 10);
    }
    for (const [kind, operation, expected] of [
      ['negative-to-unsigned', 'n->declare_parameter<int>("value",-1);unsigned int value=0;n->get_parameter("value",value);', 'requested C++ type'],
      ['signed-byte-overflow', 'n->declare_parameter<int>("value",128);std::int8_t value=0;n->get_parameter("value",value);', 'requested C++ type'],
      ['float-overflow', 'n->declare_parameter<double>("value",1e300);float value=0;n->get_parameter("value",value);', 'requested C++ type'],
      ['unsafe-integer-declaration', 'n->declare_parameter<std::int64_t>("value",9007199254740993LL);', 'JavaScript safe integer range'],
    ]) {
      await record('Parameter API', kind + '-rejected', async result => {
        bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <cstdint>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("parameter_bounds");' + operation + 'rclcpp::spin(n);}');
        await until(() => !bridge.worker, 120, true);
        assert(output.includes(expected), 'Parameter numeric conversion did not fail precisely: ' + output);
        result.compile = 'passed'; result.run = 'rejected-as-expected'; result.check = 'passed';
        result.diagnostic = output.slice(-3000);
      });
    }
    await record('Parameter API', 'valid-numeric-boundaries', async result => {
      bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <cstdint>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("parameter_bounds");n->declare_parameter<int>("unsigned_byte",255);n->declare_parameter<int>("signed_byte",-128);n->declare_parameter<std::int64_t>("safe",9007199254740991LL);std::uint8_t u=0;std::int8_t s=0;std::int64_t large=0;n->get_parameter("unsigned_byte",u);n->get_parameter("signed_byte",s);n->get_parameter("safe",large);RCLCPP_INFO(n->get_logger(),"BOUNDS %u %d %lld",static_cast<unsigned int>(u),static_cast<int>(s),static_cast<long long>(large));rclcpp::spin(n);}');
      await until(() => state.includes('callbacks ready'));
      assert(output.includes('BOUNDS 255 -128 9007199254740991'), 'Valid typed parameter boundary was changed or rejected: ' + output);
      result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
    });
    await record('Parameter API', 'scalar-types-and-live-updates', async result => {
      await runParameterProbe();
      const worker = bridge.worker;
      setParameter(runtime, '/parameter_probe', 'enabled', true);
      setParameter(runtime, '/parameter_probe', 'count', 11);
      setParameter(runtime, '/parameter_probe', 'speed', 0.6);
      setParameter(runtime, '/parameter_probe', 'label', 'ciao, città');
      await until(() => output.includes('PARAM 1 11 0.60 ciao, città'), 10);
      assert(bridge.worker === worker, 'Parameter update restarted the worker');
      assert(runtime.course.paramValues.has(0.2) && runtime.course.paramValues.has(0.6), 'Typed getter did not read changed speed');
      assert(runtime.course.paramValues.has(false) && runtime.course.paramValues.has(true), 'Boolean parameter update was lost');
      assert(runtime.course.paramValues.has('ciao, città'), 'UTF-8 string parameter update was lost');
      result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
      result.observed = snapshot();
    });
    for (const [kind, operation] of [
      ['wrong-type', 'n->declare_parameter<double>("speed",0.2);n->get_parameter("speed").as_bool();'],
      ['missing-name', 'n->get_parameter("not_declared").as_double();'],
    ]) {
      await record('Parameter API', kind + '-error-recovery', async result => {
        bridge.run('#include <rclcpp/rclcpp.hpp>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("parameter_probe");' + operation + 'rclcpp::spin(n);}');
        await until(() => !bridge.worker, 120, true);
        assert(/parameter/i.test(output) && /bool|type|declared|missing|unknown/i.test(output), 'Parameter error was not specific: ' + output);
        result.diagnostic = output.slice(-3000);
        await cleaned();
        output = '';
        await runParameterProbe();
        result.compile = 'passed'; result.run = 'error-then-recovered'; result.check = 'passed';
      });
    }
    await record('Parameter API', 'stale-listener-cannot-update-next-run', async result => {
      await runParameterProbe();
      const oldListener = bridge.parameterListener;
      assert(typeof oldListener === 'function' && runtime.parameterListeners.size === 1, 'Parameter forwarding listener missing');
      await cleaned();
      output = '';
      await runParameterProbe();
      oldListener('/parameter_probe', 'speed', 0.9);
      const first = runtime.course.timers;
      await until(() => runtime.course.timers >= first + 3, 10);
      assert(runtime.parameterListeners.size === 1, 'Rerun accumulated parameter listeners');
      assert(!runtime.course.paramValues.has(0.9) && !output.includes('0.90'), 'Old listener changed the replacement run');
      assert(runtime.parameters.get('/parameter_probe').get('speed') === 0.2, 'Fresh parameter default changed');
      result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
    });
    await record('Parameter API', 'compile-error-recovery', async result => {
      bridge.run('#include <rclcpp/rclcpp.hpp>\nint main(){auto n=std::make_shared<rclcpp::Node>("broken");n->get_parametr("speed");}');
      await until(() => !bridge.worker, 120, true);
      assert(output.includes('controller.cpp:') && output.includes('get_parametr'), 'Parameter compiler diagnostic lost filename/API');
      result.diagnostic = output.slice(-3000);
      output = '';
      await runParameterProbe();
      result.compile = 'error-then-recovered'; result.run = 'passed'; result.check = 'passed';
    });
    await record('TargetInfo API', 'typed-utf8-publish-subscribe', async result => {
      const code = '#include <rclcpp/rclcpp.hpp>\n#include <ros2learn_interfaces/msg/target_info.hpp>\nusing Target=ros2learn_interfaces::msg::TargetInfo;\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("custom_probe");auto p=n->create_publisher<Target>("/target_info",10);auto s=n->create_subscription<Target>("/target_info",10,[n](Target::SharedPtr m){RCLCPP_INFO(n->get_logger(),"CUSTOM %d %s %.3f",m->visible,m->position.c_str(),m->confidence);});auto t=n->create_wall_timer(std::chrono::milliseconds(100),[p](){Target m;m.visible=true;m.position="LEFT caffè";m.confidence=0.75;p->publish(m);});rclcpp::spin(n);}';
      bridge.run(code);
      await until(() => state.includes('callbacks ready'));
      running = true;
      await until(() => runtime.course.customCode >= 3 && output.includes('CUSTOM 1 LEFT caffè 0.750'), 10);
      result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
      result.observed = snapshot();
    });
    await record('TargetInfo API', 'confidence-validation', async result => {
      bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <ros2learn_interfaces/msg/target_info.hpp>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("custom_invalid");auto p=n->create_publisher<ros2learn_interfaces::msg::TargetInfo>("/target_info",10);ros2learn_interfaces::msg::TargetInfo m;m.visible=true;m.position="LEFT";m.confidence=2;p->publish(m);rclcpp::spin(n);}');
      await until(() => !bridge.worker, 120, true);
      assert(/confidence/i.test(output), 'TargetInfo did not use shared confidence validation: ' + output);
      assert(!runtime.course.customCode, 'Invalid TargetInfo publication received evidence');
      result.compile = 'passed'; result.run = 'rejected-as-expected'; result.check = 'passed';
      result.diagnostic = output.slice(-3000);
    });
  }
  if (includeApi(5)) {
    await record('Odometry API', 'nested-fields-match-published-samples', async result => {
      await setup('session-05-01-odometry');
      runtime.robot.x = 1.25; runtime.robot.y = -0.75; runtime.robot.yaw = 0.6;
      const samples = new Map();
      const dispose = runtime.subscribe('/odom', '/odometry_oracle', message => {
        samples.set(message.header.stamp.sec + ':' + message.header.stamp.nanosec, message);
      });
      try {
        bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <nav_msgs/msg/odometry.hpp>\nint main(){rclcpp::init();auto n=std::make_shared<rclcpp::Node>("odometry_probe");auto s=n->create_subscription<nav_msgs::msg::Odometry>("/odom",10,[](nav_msgs::msg::Odometry::SharedPtr m){const auto &p=m->pose.pose.position;const auto &q=m->pose.pose.orientation;const auto &v=m->twist.twist.linear;const auto &w=m->twist.twist.angular;std::printf("ODOM %d %u %s %s %.17g %.17g %.17g %.17g %.17g %.17g %.17g %.17g %.17g %.17g %.17g %.17g %.17g\\n",m->header.stamp.sec,m->header.stamp.nanosec,m->header.frame_id.c_str(),m->child_frame_id.c_str(),p.x,p.y,p.z,q.x,q.y,q.z,q.w,v.x,v.y,v.z,w.x,w.y,w.z);std::fflush(stdout);});rclcpp::spin(n);}');
        await until(() => state.includes('callbacks ready'));
        runtime.robot.command(0.35, -0.4);
        running = true;
        await until(() => output.split('\n').filter(line => line.startsWith('ODOM ')).length >= 3, 10);
        running = false;
        const rows = output.split('\n').filter(line => line.startsWith('ODOM '));
        for (const row of rows) {
          const [, sec, nanosec, parent, child, ...values] = row.split(' ');
          const message = samples.get(sec + ':' + nanosec);
          assert(message, 'C++ odometry stamp did not match an actual published sample');
          assert(parent === message.header.frame_id && child === message.child_frame_id, 'Odometry frame identity changed');
          const p = message.pose.pose.position, q = message.pose.pose.orientation;
          const v = message.twist.twist.linear, w = message.twist.twist.angular;
          const expected = [p.x, p.y, p.z, q.x, q.y, q.z, q.w, v.x, v.y, v.z, w.x, w.y, w.z];
          assert(values.length === expected.length && values.every((value, i) => Number.isFinite(Number(value)) && Math.abs(Number(value) - expected[i]) < 1e-10), 'C++ odometry nested fields disagreed with the shared published message');
        }
        result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
        result.comparedSamples = rows.length;
        result.observed = snapshot();
      } finally { dispose(); }
    });
    await record('Odometry API', 'yaw-scaled-boundary-and-singular-quaternions', async result => {
      const half = angle => [Math.sin(angle / 2), Math.cos(angle / 2)];
      const [z, w] = half(0.7);
      const roll = 0.4, pitch = -0.7, yaw = 1.2;
      const cr = Math.cos(roll / 2), sr = Math.sin(roll / 2), cp = Math.cos(pitch / 2), sp = Math.sin(pitch / 2), cy = Math.cos(yaw / 2), sy = Math.sin(yaw / 2);
      const cases = [
        {name: 'unit-planar', q: [0, 0, z, w], yaw: 0.7},
        {name: 'scaled-planar', q: [0, 0, 3 * z, 3 * w], yaw: 0.7},
        {name: 'negative-scale', q: [0, 0, -2 * z, -2 * w], yaw: 0.7},
        {name: 'positive-pi', q: [0, 0, 1, 0], yaw: Math.PI},
        {name: 'negative-pi', q: [0, 0, -1, 0], yaw: -Math.PI},
        {name: 'nonplanar', q: [sr * cp * cy - cr * sp * sy, cr * sp * cy + sr * cp * sy, cr * cp * sy - sr * sp * cy, cr * cp * cy + sr * sp * sy], yaw},
        // Expected singular values follow the documented upstream tf2 convention.
        {name: 'positive-pitch-singularity', q: [0.5, 0.5, -0.5, 0.5], yaw: Math.PI / 2},
        {name: 'negative-pitch-singularity', q: [0.5, -0.5, 0.5, 0.5], yaw: Math.PI / 2},
        {name: 'scaled-singularity', q: [-1, -1, 1, -1], yaw: Math.PI / 2},
      ];
      const expressions = cases.map((item, index) => 'std::printf("YAW ' + index + ' %.17g\\n",tf2::getYaw(geometry_msgs::msg::Quaternion{' + item.q.join(',') + '}));').join('\n');
      bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <tf2/utils.h>\nint main(){' + expressions + 'std::fflush(stdout);}');
      await until(() => state.includes('callbacks ready'));
      const rows = output.split('\n').filter(line => line.startsWith('YAW '));
      assert(rows.length === cases.length, 'Missing quaternion outputs');
      for (const row of rows) {
        const [, index, raw] = row.split(' '), value = Number(raw), expected = cases[Number(index)];
        const error = Math.atan2(Math.sin(value - expected.yaw), Math.cos(value - expected.yaw));
        assert(Number.isFinite(value) && Math.abs(error) < 1e-10, 'Unexpected tf2 yaw for ' + expected.name + ': ' + raw);
      }
      result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
      result.quaternionCases = cases.map(item => item.name);
      result.angularToleranceRadians = 1e-10;
    });
    await record('Odometry API', 'compile-error-recovery', async result => {
      bridge.run('#include <nav_msgs/msg/odometry.hpp>\nint main(){nav_msgs::msg::Odometry m;m.pose.pose.positon.x=1;}');
      await until(() => !bridge.worker, 120, true);
      assert(output.includes('controller.cpp:') && output.includes('positon'), 'Odometry diagnostic lost source/field');
      result.diagnostic = output.slice(-3000);
      output = '';
      await setup('session-05-01-odometry');
      bridge.run(await (await request('./cpp/course/session-05-01-odometry.cpp')).text());
      await until(() => state.includes('callbacks ready'));
      running = true;
      await until(() => checks().every(check => check.passed), 10);
      result.compile = 'error-then-recovered'; result.run = 'passed'; result.check = 'passed';
    });
  }

  if (includeApi(6)) {
    await record('TF API', 'cpp-python-inspector-numerical-agreement', async result => {
      const {transforms, lookup} = await import('../' + path + 'runtime/course.js');
      const {relativeValues} = await import('../' + path + 'ui/tf-model.js');
      const {PythonBridge} = await import('../' + path + 'python/bridge.js');
      const frames = ['world', 'odom', 'base_link', 'laser_link', 'camera_link', 'target'];
      const poses = [[0, 0, 0], [1.25, -0.75, 0.6], [-2, 3, -1.2], [0.2, -0.3, Math.PI],
        [0.2, -0.3, -Math.PI], [4, -2, Math.PI / 2], [-3, -1, -Math.PI / 2], [0.001, -0.002, 2.9]];
      const cppRows = new Map();
      let python = null, pythonOutput = '', pythonState = '';
      async function poll(condition, seconds = 120) {
        const deadline = performance.now() + seconds * 1000;
        while (performance.now() < deadline) {
          if (condition()) return;
          if (python && !python.worker) throw new Error('Python TF probe stopped: ' + pythonOutput);
          if (!python && !bridge.worker) throw new Error('C++ TF probe stopped: ' + output);
          await wait(25);
        }
        throw new Error('TF probe timeout: ' + (python ? pythonState + '\n' + pythonOutput : state + '\n' + output));
      }
      try {
        for (const language of ['cpp', 'python']) {
          await setup('session-05-03-frames');
          if (language === 'cpp') {
            bridge.run(await (await request('./cpp/tf-numerical.cpp')).text());
            await until(() => state.includes('callbacks ready'));
          } else {
            python = new PythonBridge(runtime, {output: value => { pythonOutput += value + '\n'; }, status: value => { pythonState = value; }});
            python.run(await (await request('./cpp/tf-numerical.py')).text());
            await poll(() => pythonState.includes('callbacks ready'));
          }
          for (const [index, [x, y, yaw]] of poses.entries()) {
            // Preserve the production 40-lines/second output cap: each pose
            // deliberately emits 36 numeric rows, then allows its window to reset.
            if (index > 0) await wait(1100);
            output = ''; pythonOutput = '';
            runtime.robot.x = x; runtime.robot.y = y; runtime.robot.yaw = yaw;
            runtime.targetFrame = [5 - index * 0.3, index * 0.4 - 1];
            runtime.time = 10 + index;
            // Both real workers receive the exact published edge snapshot, then
            // a separate command on their FIFO worker transport. No hidden pose API.
            runtime.emit('/tf', transforms(runtime));
            runtime.emit('/tf_case', {data: String(index)});
            await poll(() => (language === 'cpp' ? output : pythonOutput).split('\n').filter(line => line.startsWith('TFROW ')).length === 36, 15);
            const rows = (language === 'cpp' ? output : pythonOutput).split('\n').filter(line => line.startsWith('TFROW '));
            for (const row of rows) {
              const [, pose, targetIndex, sourceIndex, rawX, rawY, rawYaw, parent, child] = row.trim().split(/\s+/);
              const target = frames[Number(targetIndex)], source = frames[Number(sourceIndex)];
              const actual = [Number(rawX), Number(rawY), Number(rawYaw)];
              const shared = lookup(runtime, target, source), inspector = relativeValues(runtime, target, source);
              assert(Number(pose) === index && parent === target && child === source, language + ' changed TF frame identity');
              const equal = (a, b) => Number.isFinite(a[0]) && Number.isFinite(a[1]) && Number.isFinite(a[2]) &&
                Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9 &&
                Math.abs(Math.atan2(Math.sin(a[2] - b[2]), Math.cos(a[2] - b[2]))) < 1e-9;
              assert(equal(actual, [shared.x, shared.y, shared.yaw]), language + ' disagreed with shared TF: ' + row);
              assert(equal(actual, [inspector.x, inspector.y, inspector.yaw]), language + ' disagreed with inspector TF: ' + row);
              const key = index + ':' + targetIndex + ':' + sourceIndex;
              if (language === 'cpp') cppRows.set(key, actual);
              else assert(equal(actual, cppRows.get(key)), 'Python and C++ TF disagree: ' + key);
            }
          }
          assert(runtime.course.tf === poses.length * 36, language + ' TF evidence does not match successful lookups');
          if (python) { python.stop(); python = null; }
          else bridge.stop();
        }
        result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
        result.numericalAgreement = {poses: poses.length, pairsPerPose: 36, pairsPerLanguage: cppRows.size,
          languages: ['real C++ WASM', 'real Python'], comparedWith: ['shared Runtime lookup', 'TF inspector relativeValues'], tolerance: 1e-9};
      } finally { python?.stop(); }
    });
    await record('TF API', 'unknown-identity-disconnected-and-snapshot-replacement', async result => {
      bridge.run('#include <rclcpp/rclcpp.hpp>\n#include <tf2_ros/buffer.h>\nint main(){tf2_ros::Buffer b;std::printf("GUARD_EMPTY %d\\n",b.canTransform("ghost","ghost"));tf2_msgs::msg::TFMessage m;geometry_msgs::msg::TransformStamped a;a.header.frame_id="world";a.child_frame_id="odom";a.transform.rotation.w=1;m.transforms.push_back(a);a.header.frame_id="island";a.child_frame_id="moon";m.transforms.push_back(a);b.setSnapshot(m);std::printf("GUARD_KNOWN %d %d %d\\n",b.canTransform("odom","odom"),b.canTransform("ghost","ghost"),b.canTransform("world","moon"));auto t=b.lookupTransform("odom","odom");std::printf("IDENTITY %.17g %.17g %.17g\\n",t.transform.translation.x,t.transform.translation.y,t.transform.rotation.w);b.setSnapshot(tf2_msgs::msg::TFMessage{});std::printf("GUARD_REPLACED %d\\n",b.canTransform("odom","odom"));std::fflush(stdout);}');
      await until(() => state.includes('callbacks ready'));
      assert(output.includes('GUARD_EMPTY 0') && output.includes('GUARD_KNOWN 1 0 0') && output.includes('IDENTITY 0 0 1') && output.includes('GUARD_REPLACED 0'), 'TF frame guards/snapshot semantics failed: ' + output);
      assert(runtime.course.tf === 1, 'canTransform or failed guards incorrectly credited successful lookup');
      result.compile = 'passed'; result.run = 'passed'; result.check = 'passed';
    });
    await record('TF API', 'unknown-lookup-runtime-error-recovery', async result => {
      bridge.run('#include <tf2_ros/buffer.h>\nint main(){tf2_ros::Buffer b;b.lookupTransform("ghost","ghost",tf2::TimePointZero);}');
      await until(() => !bridge.worker, 120, true);
      assert(output.includes('TF lookup failed: ghost -> ghost') && output.includes('canTransform'), 'Unknown identity lookup lacked actionable error: ' + output);
      assert(runtime.course.tf === 0, 'Failed lookup credited evidence');
      result.diagnostic = output.slice(-3000); output = '';
      await setup('session-05-03-frames');
      bridge.run(await (await request('./cpp/course/session-05-03-frames.cpp')).text());
      await until(() => state.includes('callbacks ready')); running = true;
      await until(() => checks().every(check => check.passed), 15);
      result.compile = 'passed'; result.run = 'error-then-recovered'; result.check = 'passed';
    });
    await record('TF API', 'compile-error-recovery', async result => {
      bridge.run('#include <geometry_msgs/msg/transform_stamped.hpp>\nint main(){geometry_msgs::msg::TransformStamped t;t.transform.translaton.x=1;}');
      await until(() => !bridge.worker, 120, true);
      assert(output.includes('controller.cpp:') && output.includes('translaton'), 'TF diagnostic lost filename/field');
      result.diagnostic = output.slice(-3000); output = '';
      await setup('session-05-03-frames');
      bridge.run(await (await request('./cpp/course/session-05-03-frames.cpp')).text());
      await until(() => state.includes('callbacks ready')); running = true;
      await until(() => checks().every(check => check.passed), 15);
      result.compile = 'error-then-recovered'; result.run = 'passed'; result.check = 'passed';
    });
  }
  if (includeApi(1)) {
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
    await setup('session-02-01-subscriber');
    bridge.run(await (await request('./cpp/course/' + 'session-02-01-subscriber' + '.cpp')).text());
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
  await progress('CPP_COURSE_SUMMARY', {wave: Number(wave), focus, exercises: results.filter(result => result.kind === 'reference').length, availableExercises, targetExercises: 25,
    cases: results.length, passed: results.filter(result => result.passed).length,
    fullParity: false, result: 'passed'});
  out.textContent = 'PASS: C++ Wave ' + wave + (focus ? ' focused' : '') + ' — ' + selectedIds.length + '/25 exercise references, negatives, alternates and lifecycle diagnostics';
} catch (error) {
  out.textContent = 'FAIL: C++ course Wave ' + wave + ': ' + error.message;
  await progress('CPP_COURSE_SUMMARY', {wave: Number(wave), focus, exercises: results.filter(result => result.kind === 'reference').length, availableExercises, cases: results.length,
    passed: results.filter(result => result.passed).length, fullParity: false, result: 'failed', error: error.message});
} finally {
  running = false;
  bridge?.stop();
  clearInterval(timer);
}
await fetch('/done', {method: 'POST', body: out.textContent});
