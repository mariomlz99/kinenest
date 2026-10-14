# TF & Odometry — 14 October 2026

KineNest’s third module now opens from the homepage. Five exercises connect live
frames, the TF tree, Python/C++ transform lookups, point transformation and an
odometry notebook. The notebook distinguishes sampled path length from
displacement, and body velocity from odom-frame velocity.

The learning flow explains how to register the reader executable, protects
existing packages when changing language, and preserves learner edits. Preparing
odometry supplies directories only; the visible commands and files do the work.
Stable live statuses are no longer rewritten on every sample.

TF work remains in its isolated saved workspace. The homepage’s Basics link
explicitly resumes the saved ROS course, and the third-module link resumes TF.
Existing TF users keep their files and guided positions. The other three future
modules remain marked Coming soon.

Shared runtime and the same five exercises are also present in the standalone
Lab, with canonical inspectable TF installation entries. Its public artifact
continues to be produced by `npm run build:public`.

Validation includes Python/C++ learner walkthroughs, native Jazzy odometry,
independent TF geometry and reader checks, saved-draft/session isolation,
translated status transitions, 56 homepage layout combinations, and retained
production assets. `test:odometry:ui` exercises the actual file controls and
checks the language of the running reader; CI runs it alongside runtime tests.

The notebook shows ideal planar odometry and zero covariance, with these limits
explained in the exercise. It is exploratory, without a completion badge. The
supported TF API uses latest transforms; historical caches and interpolation
remain outside its declared scope.

Local release identity, deployment and final live evidence are recorded in the
workspace checkpoint `checkpoints/2026-10-14-tf-odometry-release/`.
