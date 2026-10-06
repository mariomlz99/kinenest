# Test plan and release gates

Unit: path bounds, XML/package declarations, Python entry point and dependency handling, CMake subset, build invalidation and failed rebuild, sourcing, executable lookup, launch literal parser, process ownership and crash cleanup, namespace/remapping/parameter propagation. Browser acceptance covers Python and C++ in Chrome and Firefox: create package, edit, real build, deliberate build failure and recovery, source, manual two-node run, live message crossing, stop one process, run again, faulty launch, graph diagnosis, two valid remapping repairs, relaunch, closing the launch terminal, pagehide cleanup and Reset. C++ acceptance also cancels a build. Responsive checks all public pages, including the bridge, at 320px and desktop in seven languages.

The final recommendation is **NO** until both browser/language paths and stress gates pass. Existing Foundations course tests must remain green. A native Jazzy build/run/launch of exported examples should be reported separately; browser success does not establish native compatibility.

Current CI has `test-build` and Chrome/Firefox `browser-acceptance`. This branch adds Python and C++ bridge acceptance steps to each browser matrix job. Branch protection API reports main unprotected. Recommend requiring `test-build` and both browser matrix results before merge. No protection was changed.
