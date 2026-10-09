# KineNest modules

The homepage offers Linux & Terminal (`linux.html`) and ROS 2 Basics
(`basics.html`). Both share the terminal, filesystem, editor and runtime fixes.
Linux's seven lessons teach navigation, text files, copying/moving, tree
inspection, nano/gedit, shell variables and a final file-management exercise.
The Linux playground is locked; the ROS playground stays available. Future
homepage modules remain locked. The SVG penguin identifies Linux; the header
keeps the existing KineNest logo. Official ROS 2 Jazzy tutorials are linked on
the homepage, ROS introduction and ROS workspace sidebar.

Linux uses IndexedDB `kinenest-linux-session`; existing ROS data stays in
`kinenest-basics-session`, including legacy session migration. Workspaces are
independent. Linux exports `linux_ws`; ROS exports `ros2_ws/src`.

Validation: `npm test`, `node scripts/linux-native-parity.mjs` (native Bash),
`node scripts/modules-check.mjs` (Chrome; SITE_URL override), existing product,
Python/C++ course acceptance and intelligence/layout checks. The shared Linux
commands and parity cases also live in ROS 2 Basics Lab. Native comparison
normalizes home paths, ls columns and tree nonbreaking spaces; ls metadata and
history differ by environment. Interactive editor saves are verified in Chrome.

The native installation inventory is partitioned into static assets under the
Cloudflare 25 MiB limit, with all 21,333 captured paths preserved. Regenerate
using `scripts/capture-native-installation.py`. Archived production assets are
retained under `legacy-assets` for tabs opened before this release.

Passing a lesson's “Check unit progress” adds a ✓ to its navigation button and
immediately saves the session. Each successful IndexedDB save also updates a
small localStorage summary for that module; the homepage reads these summaries
without loading the runtime or complete workspace. Seven completed lessons
show “✓ Completed”. Restarting a lesson or resetting a workspace clears the
corresponding completion state and updates the summary. Completion is specific
to this browser and device; it is not an account-synchronized certificate.
