"""Read native Jazzy CLI behavior in an isolated localhost ROS domain.

This creates native reference bags, not KineNest-exported bags.
"""
import json, os, pathlib, signal, subprocess, tempfile, time
root = pathlib.Path(tempfile.mkdtemp(prefix='kinenest-bag-reference-'))
os.environ.update(ROS_DOMAIN_ID='176', ROS_AUTOMATIC_DISCOVERY_RANGE='LOCALHOST', ROS_LOG_DIR=str(root/'logs'))
import rclpy
from rclpy.serialization import deserialize_message
from nav_msgs.msg import Odometry
from sensor_msgs.msg import LaserScan
import rosbag2_py
import yaml

out = pathlib.Path('artifacts/stabilization'); out.mkdir(parents=True, exist_ok=True)
def cli(*args):
    return subprocess.run(['ros2', 'bag', *args], capture_output=True, text=True, check=True, timeout=30).stdout
for verb in ['record', 'info', 'play']:
    (out/('bag-'+verb+'-help.txt')).write_text(cli(verb, '--help'))
report = {'referenceRoot': str(root), 'storagePlugins': cli('list', 'storage').split(), 'cases': []}
rclpy.init(); node = rclpy.create_node('bag_reference'); active = None
try:
    for storage in ['mcap', 'sqlite3']:
        pubs = [node.create_publisher(Odometry, '/odom', 10), node.create_publisher(LaserScan, '/scan', 10)]
        args = ['/odom', '/scan'] if storage == 'mcap' else ['-s', 'sqlite3', '-o', 'named_subset', '--topics', '/odom', '/scan']
        prior = set(root.iterdir()); log = open(root/(storage+'-record.log'), 'w')
        active = subprocess.Popen(['ros2','bag','record','--disable-keyboard-controls',*args],cwd=root,stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
        deadline = time.monotonic()+25
        while not all(p.get_subscription_count() for p in pubs):
            assert active.poll() is None, (root/(storage+'-record.log')).read_text()
            assert time.monotonic()<deadline, 'Recorder discovery timeout'
            rclpy.spin_once(node, timeout_sec=.05)
        for i in range(8):
            odom = Odometry(); odom.header.frame_id='odom'; odom.child_frame_id='base_link'
            odom.header.stamp=node.get_clock().now().to_msg(); odom.pose.pose.position.x=i/10; odom.pose.pose.orientation.w=1.
            scan = LaserScan(); scan.header.frame_id='laser_link'; scan.header.stamp=odom.header.stamp
            scan.angle_min=-3.14159265; scan.angle_increment=6.2831853/120; scan.angle_max=scan.angle_min+119*scan.angle_increment
            scan.range_min=.05; scan.range_max=10.; scan.ranges=[2.88-i/10]*120
            pubs[0].publish(odom); pubs[1].publish(scan); rclpy.spin_once(node, timeout_sec=.1)
        time.sleep(.4); os.killpg(active.pid,signal.SIGINT); active.wait(timeout=20); active=None; log.close()
        for p in pubs: node.destroy_publisher(p)
        bag = next(p for p in set(root.iterdir())-prior if (p/'metadata.yaml').exists())
        metadata = yaml.safe_load((bag/'metadata.yaml').read_text())['rosbag2_bagfile_information']
        assert metadata['storage_identifier']==storage
        assert metadata['message_count']==16, metadata
        info = cli('info',str(bag)); (out/('bag-'+storage+'-info.txt')).write_text(info)
        reader=rosbag2_py.SequentialReader(); reader.open(rosbag2_py.StorageOptions(uri=str(bag),storage_id=storage),rosbag2_py.ConverterOptions('',''))
        payloads=[]
        while reader.has_next():
            topic,data,stamp=reader.read_next(); msg=deserialize_message(data,Odometry if topic=='/odom' else LaserScan)
            payloads.append({'topic':topic,'bytes':len(data),'cdrPrefix':data[:4].hex(),'timestamp':stamp,'value':msg.pose.pose.position.x if topic=='/odom' else float(msg.ranges[0])})
        received={'/odom':[],'/scan':[]}
        subscriptions=[node.create_subscription(Odometry,'/odom',lambda m:received['/odom'].append(m.pose.pose.position.x),10),node.create_subscription(LaserScan,'/scan',lambda m:received['/scan'].append(float(m.ranges[0])),10)]
        with open(root/(storage+'-play.log'),'w') as log:
            active=subprocess.Popen(['ros2','bag','play',str(bag),'--delay','1','--disable-keyboard-controls','--wait-for-all-acked','2000'],stdout=log,stderr=subprocess.STDOUT,start_new_session=True)
            deadline=time.monotonic()+25
            while active.poll() is None and time.monotonic()<deadline:rclpy.spin_once(node,timeout_sec=.05)
            assert active.poll()==0, 'Playback failed or timed out'
            active=None
            for _ in range(10):rclpy.spin_once(node,timeout_sec=.05)
        assert len(received['/odom'])==len(received['/scan'])==8,received
        assert all(abs(x-i/10)<1e-9 for i,x in enumerate(received['/odom']))
        for s in subscriptions:node.destroy_subscription(s)
        report['cases'].append({'storage':storage,'args':args,'directory':bag.name,'files':[p.name for p in bag.iterdir()],'metadata':metadata,'payloads':payloads,'replayed':received})
        print('PASS native '+storage+': CLI record/info/play, 16 messages, live publishers destroyed before replay',flush=True)
finally:
    if active and active.poll() is None:os.killpg(active.pid,signal.SIGTERM);active.wait(timeout=10)
    node.destroy_node(); rclpy.shutdown()
(out/'native-bag-reference.json').write_text(json.dumps(report,indent=2)+'\n')
