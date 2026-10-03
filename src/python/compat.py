"""Small teaching API, executed by real CPython in Pyodide. Not ROS middleware."""
import sys
import types
import json
import traceback
import numpy as np
from js import emit_json

_nodes = {}
_subscriptions = {}
_futures = {}
_counter = 0
_current_frame = None
_initialized = False

def _send(kind, **values):
    emit_json(json.dumps(dict(kind=kind, **values)))

def _id():
    global _counter
    _counter += 1
    return str(_counter)

def _module(name, **values):
    module = types.ModuleType(name)
    module.__dict__.update(values)
    sys.modules[name] = module
    if '.' in name:
        parent, child = name.rsplit('.', 1)
        setattr(sys.modules[parent], child, module)
    else:
        module.__path__ = []
    return module

class Vector3:
    def __init__(self):
        self.x = self.y = self.z = 0.0

class Twist:
    def __init__(self):
        self.linear, self.angular = Vector3(), Vector3()

class Image:
    def __init__(self, metadata=None, data=b''):
        metadata = metadata or {}
        self._width = metadata.get('width', 0)
        self._height = metadata.get('height', 0)
        self.encoding = metadata.get('encoding', 'rgb8')
        self.step = metadata.get('step', self._width * 3)
        self.is_bigendian = 0
        self.header = types.SimpleNamespace(**metadata.get('header', {}))
        self._data = data
        self._access = set()
    @property
    def width(self):
        self._access.add('width')
        return self._width
    @property
    def height(self):
        self._access.add('height')
        return self._height
    @property
    def data(self):
        self._access.add('data')
        return self._data

class CvBridge:
    def imgmsg_to_cv2(self, msg, desired_encoding='passthrough'):
        if not isinstance(msg, Image):
            raise TypeError('CvBridge expects sensor_msgs.msg.Image')
        if desired_encoding not in ('passthrough', 'rgb8', 'bgr8') or msg.encoding != 'rgb8':
            raise ValueError('This lab supports rgb8 and bgr8 only')
        image = np.frombuffer(msg.data, dtype=np.uint8).reshape(msg._height, msg._width, 3).copy()
        if desired_encoding == 'bgr8':
            image = image[:, :, ::-1].copy()
        msg._access.add('converted')
        return image

class Trigger:
    class Request:
        pass
    class Response:
        def __init__(self, success=False, message=''):
            self.success, self.message = success, message

class Future:
    def __init__(self):
        self._done = False
        self._result = None
        self._error = None
        self._callbacks = []
    def done(self):
        return self._done
    def result(self):
        if not self._done:
            raise RuntimeError('Response not received yet; use add_done_callback')
        if self._error:
            raise RuntimeError(self._error)
        return self._result
    def add_done_callback(self, callback):
        if self._done:
            callback(self)
        else:
            self._callbacks.append(callback)

class Publisher:
    def __init__(self, node, topic):
        self.node, self.topic = node, topic
    def publish(self, msg):
        if not isinstance(msg, Twist):
            raise TypeError('This publisher expects Twist')
        _send('publish', node=self.node, topic=self.topic, message={
            'linear': vars(msg.linear), 'angular': vars(msg.angular)})

class Client:
    def __init__(self, node, name):
        self.node, self.name = node, name
    def wait_for_service(self, timeout_sec=None):
        return self.name == '/reset_robot'
    def call_async(self, request):
        if not isinstance(request, Trigger.Request):
            raise TypeError('Expected Trigger.Request()')
        key = _id()
        future = Future()
        _futures[key] = future
        _send('service_call', id=key, node=self.node, name=self.name)
        return future
    def call(self, request):
        raise NotImplementedError('Use call_async and future.add_done_callback in this browser lab')

class Node:
    def __init__(self, name):
        if not _initialized:
            raise RuntimeError('Call rclpy.init() first')
        if not isinstance(name, str) or not name.replace('_', '').isalnum() or name[0].isdigit():
            raise ValueError('Use a simple ROS node name: letters, digits and underscores')
        self.name = '/' + name
        if self.name in _nodes:
            raise ValueError('Duplicate node name')
        _nodes[self.name] = self
        _send('node', node=self.name)
    def create_subscription(self, message_type, topic, callback, qos):
        if message_type is not Image or topic != '/camera/image_raw':
            raise NotImplementedError('Session 3 Python subscriptions support Image on /camera/image_raw')
        key = _id()
        _subscriptions[key] = (self.name, callback)
        _send('subscribe', node=self.name, topic=topic, id=key)
        return key
    def create_publisher(self, message_type, topic, qos):
        if message_type is not Twist or topic != '/cmd_vel':
            raise NotImplementedError('Session 3 publishes Twist on /cmd_vel')
        _send('publisher', node=self.name, topic=topic)
        return Publisher(self.name, topic)
    def create_client(self, service_type, name):
        if service_type is not Trigger or name != '/reset_robot':
            raise NotImplementedError('Session 3 supports Trigger on /reset_robot')
        _send('client', node=self.name, name=name)
        return Client(self.name, name)
    def get_logger(self):
        return types.SimpleNamespace(info=print, warning=print, error=print)
    def destroy_node(self):
        for key in [k for k, (node, _) in _subscriptions.items() if node == self.name]:
            del _subscriptions[key]
        _nodes.pop(self.name, None)
        _send('destroy', node=self.name)

class _Spin(BaseException):
    pass

def init(args=None):
    global _initialized
    _initialized = True

def shutdown():
    global _initialized
    for node in list(_nodes.values()):
        node.destroy_node()
    _initialized = False

def spin(node):
    # Yield the worker to browser events; callbacks execute in the same Python globals.
    if node.name not in _nodes:
        raise RuntimeError('Node was destroyed')
    raise _Spin()

def report_detection(visible, cx=None):
    if _current_frame is None:
        raise RuntimeError('Call report_detection inside the image callback')
    if not isinstance(visible, (bool, np.bool_)):
        raise TypeError('visible must be a boolean')
    _send('detection', frame=_current_frame, visible=bool(visible), cx=None if cx is None else float(cx))

def report_image_stats(shape, channel_means):
    if _current_frame is None:
        raise RuntimeError('Call report_image_stats inside the image callback')
    _send('image_stats', frame=_current_frame, shape=[int(v) for v in shape], means=[float(v) for v in channel_means])

# Deliberately tiny OpenCV-style subset; RGB input is explicit in these lessons.
def inRange(src, lowerb, upperb):
    src = np.asarray(src)
    selected = (src >= np.asarray(lowerb)) & (src <= np.asarray(upperb))
    if src.ndim == 3:
        selected = selected.all(axis=2)
    return selected.astype(np.uint8) * 255

def countNonZero(src):
    if np.asarray(src).ndim != 2:
        raise ValueError('countNonZero expects a single-channel image')
    return int(np.count_nonzero(src))

def moments(src, binaryImage=False):
    weights = np.asarray(src, dtype=float)
    if weights.ndim != 2:
        raise ValueError('moments expects a single-channel image')
    if binaryImage:
        weights = (weights != 0).astype(float)
    ys, xs = np.indices(weights.shape)
    return {'m00': float(weights.sum()), 'm10': float((weights * xs).sum()), 'm01': float((weights * ys).sum())}

_module('rclpy', init=init, shutdown=shutdown, ok=lambda: _initialized, spin=spin, create_node=Node)
_module('rclpy.node', Node=Node)
_module('rclpy.task', Future=Future)
_module('sensor_msgs')
_module('sensor_msgs.msg', Image=Image)
_module('geometry_msgs')
_module('geometry_msgs.msg', Twist=Twist)
_module('std_srvs')
_module('std_srvs.srv', Trigger=Trigger)
_module('cv_bridge', CvBridge=CvBridge)
_module('cv2', inRange=inRange, countNonZero=countNonZero, moments=moments)
_module('ros2learn', report_detection=report_detection, report_image_stats=report_image_stats)
_student_globals = {'__name__': '__main__'}

def _run_student(source):
    try:
        exec(compile(source, '<student>', 'exec'), _student_globals)
    except _Spin:
        pass

def _dispatch_image(key, metadata, raw, frame):
    global _current_frame
    if key not in _subscriptions:
        return
    msg = Image(json.loads(metadata), bytes(raw.to_py()))
    _current_frame = frame
    try:
        _subscriptions[key][1](msg)
        _send('processed', frame=frame, access=list(msg._access))
    finally:
        _current_frame = None

def _service_response(key, payload):
    future = _futures.pop(key, None)
    if future is None:
        return
    data = json.loads(payload)
    future._done = True
    future._error = data.get('error')
    future._result = Trigger.Response(data.get('success', False), data.get('message', ''))
    _send('response_received', success=future._result.success)
    for callback in future._callbacks:
        callback(future)
