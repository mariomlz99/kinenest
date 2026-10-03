# Release recommendations

Review target:8679ae1. The product has a coherent six-session Python course and two genuinely executable C++ exercises. Keep the shared simulator, graph and behavioural checks. Broader C++ work is an adapter project, not a set of language badges.

1. Review this branch and its screenshots, then decide whether to merge the small hardening changes. Do not deploy a redesign or migrate kinenest.com as part of this audit. Run the release workflow on the chosen merge commit and verify build-info afterward.
2. Close platform qualification gaps: run current stable Chrome, add continuing Firefox CI coverage, and test real Safari/iPhone/Android input, memory, cache and background recovery. The installed desktop versions passed; mobile-sized screenshots are not mobile certification.
3. Run a lecturer/student dry run focused on Session4/5 pacing, TF source/target understanding, Compare readability and phone context switching. Design versioned local draft recovery and stable exercise links separately. Then prioritize C++2.2String dispatch and2.3sample reports before camera/actions/TF parity.

Keep for later: precise TF label collision management; contextual unknown-frame/topic hints; interrupted-runtime-download regression; complete contrast/screen-reader audit; PWA/offline cache design. No evidence justifies Monaco, a SPA, backend, analytics, Rust, Session7, or replacing the runtime with rmw_wasm.

Public release wording should distinguish complete Python curriculum from C++2.1/2.4. Keep lazy~60MB compiler loading; the new inline notice is informational, not an access gate. No support contribution affects content.
