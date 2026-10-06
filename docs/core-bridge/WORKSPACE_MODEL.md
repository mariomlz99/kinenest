# Workspace model

The bridge owns a bounded virtual tree rooted at `~/ros2_ws` (`/home/learner/ros2_ws` internally). Files and directories are data, independent of the DOM. `.` and `..` normalize but cannot escape the root. Each terminal starts in `~/ros2_ws` and displays its current directory. Learners use `cd src` to create a package, then `cd ..` to build from the workspace root, matching the beginner tutorial's path sequence. This is not a Linux filesystem or general shell.

`src/<package>` holds source packages. A build reads a package snapshot and creates modeled `build/`, `install/`, and `log/` entries. The visible install tree includes a setup marker, package metadata, launch files and executable markers; these are educational records, not native binaries or shell scripts. Installed executable records carry that package's revision; editing its source or metadata removes that package's install entries and invalidates the record. A failed rebuild removes the prior installed record. Sourcing changes one terminal environment, not the workspace tree.

Running processes are separate from build state. Each process owns one worker adapter and its graph endpoints. A launch group owns its children. Stop, Reset and page navigation stop workers before the shared runtime resets. The model supports only package workflows and rejects arbitrary filesystem and shell operations.
