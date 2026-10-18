# ROS 2 bag feasibility, 18 October 2026

**ROSBAG LESSON FEASIBLE NOW: NO.** Outcome B: native format is possible, but
the required serialization, storage, export and lifecycle work is disproportionate
to this stabilization pass. No browser bag command or lesson was added. The frozen
Basics Lab is excluded from this feature.

## Native Jazzy evidence

Primary references: [official Jazzy tutorial](https://docs.ros.org/en/jazzy/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.html),
[official tutorial source](https://github.com/ros2/ros2_documentation/blob/jazzy/source/Tutorials/Beginner-CLI-Tools/Recording-And-Playing-Back-Data/Recording-And-Playing-Back-Data.rst),
[rosbag2 Jazzy CLI](https://github.com/ros2/rosbag2/tree/jazzy),
[Jazzy MCAP plugin](https://github.com/ros2/rosbag2/blob/jazzy/rosbag2_storage_mcap/README.md),
and [MCAP ROS 2 format registry](https://mcap.dev/spec/registry#ros2).

The installed native Jazzy CLI was queried, and actual local recordings made
with `scripts/native-bag-feasibility.py`. It uses an isolated localhost ROS domain
and temporary directories. Evidence is in `artifacts/stabilization/`.

```sh
ros2 bag record /odom /scan
ros2 bag record --topics /odom /scan
ros2 bag record -o subset --topics /odom /scan
ros2 bag record -s sqlite3 -o subset --topics /odom /scan
ros2 bag record -a
ros2 bag info subset
ros2 bag play subset
```

Positional topics remain accepted, but the installed Jazzy help marks them
deprecated; use `--topics` for new instructions. `-o`/`--output` selects the
directory. The default is `rosbag2_YYYY_MM_DD-HH_MM_SS` in the current directory.
Default storage is **mcap**; **sqlite3** is also installed. The recorded directory
contains `metadata.yaml` and `<directory>_0.mcap` or `<directory>_0.db3`.
The installed CLI's `-a` records all topics and service event topics, excluding
hidden topics; `--all-topics` narrows that to topics. Selected topics suffice for
a beginner lesson and avoid recording camera data accidentally.

Both storage formats recorded eight Odometry and eight LaserScan messages.
`ros2 bag info` reported the real 16-message totals and types; the reference
reader deserialized the CDR bytes. The live publishers were destroyed before
`ros2 bag play`; new subscribers received all eight messages on each topic with
the expected values. These are **native-to-native reference checks**, not a
KineNest export round trip or a claim of browser compatibility.

## Browser architecture assessment

The existing graph already offers topic/type validation and owner-scoped
subscriptions; a recorder could subscribe through it, and a player could publish
through the same graph. It would need a cancellable process owned by its terminal,
with cleanup on Ctrl+C, terminal close, Reset and module exit. A single scheduled
next-message task, rather than one timer per stored message, would bound playback
resources. Stopping a simulator must leave playback usable without recreating a
live simulator publisher. `info` must compute metadata from the stored artifact.

Storage should remain entirely local. The existing filesystem is a path-to-entry
Map in memory; `FileSystem.write` coerces content to strings. Session persistence
copies that filesystem into IndexedDB snapshots. Export currently builds a text
source-workspace tar. Neither path currently supports a durable binary bag file
or incremental recording. Embedding binary data as base64 in whole-session
snapshots would inflate memory and repeated autosave writes.

For a future bounded version, use virtual filesystem entries backed by binary
Blobs/chunks in IndexedDB, with small metadata references in the ordinary session.
Keep `ls`, `tree`, deletion and an explicit **Download bag** action consistent.
Memory-only storage loses recordings on reload; OPFS adds an unnecessary second
persistence system for this first small lesson. Do not use server storage or
teach `wget` as browser export.

Suggested initial limits, not implemented guarantees: two explicitly selected
topics, 30 seconds, 8 MiB per recording and 32 MiB total stored recordings. Enforce
whichever limit is reached first, before adding the next record. Show elapsed
time and actual bytes, provide Stop/Delete, handle IndexedDB transaction failure,
and consult `navigator.storage.estimate()` as advisory only. An RGB frame is
230,400 payload bytes at 320 × 240; at 10 Hz that is 2,304,000 bytes/s before
metadata or encoding, so unrestricted recording is inappropriate.

## Why native format is deferred

The current registry provides field definitions and generated Python/C++ classes,
but its worker transport uses JavaScript objects/JSON plus a byte-array fast path.
It is **not ROS CDR**. A native-compatible artifact needs schema-derived CDR
serialization (alignment, endian encapsulation, strings, nested messages, fixed
and variable arrays, primitive widths), embedded type definitions/schema records,
valid MCAP channels/message timestamps/indexes or the correct rosbag2 SQLite
schema, and consistent rosbag2 metadata. Exact 64-bit fields/timestamps also need
care beyond JavaScript Number. Schema information is useful input, not a ready
native bag writer. Writing JSON under a `.mcap`, `.db3` or `metadata.yaml` disguise
would be incorrect.

The MCAP container has browser-capable implementations, so this is an engineering
scope decision, not a claim that browser export is impossible. A later separate
prototype should first encode supported `/odom` and `/scan` messages, validate
every field with native deserialization, then pass native `info` and `play` with
real subscribers, including reload/export and interrupted recordings. Native
import is optional for v1. No browser artifact was created, so native validation
of a KineNest-generated artifact has **not** been performed.

A clearly branded educational recording such as `.kinenest-recording` would be
easier, but would add a second format and require explicit modeling explanations
while still needing storage/export/lifecycle changes. Its incremental teaching
value does not justify implementing it in this audit.

## Future lesson

One small KineNest-only lesson: **Record first, inspect later.** Start the robot,
record `/odom` (optionally `/scan`) for a few seconds, stop recording, stop the
simulator, inspect the bag, play it, and observe a subscriber receiving the old
messages. The insight is that messages have a history even after the live
publisher has gone. Do not add storage internals, DDS/RMW, or advanced QoS theory.
