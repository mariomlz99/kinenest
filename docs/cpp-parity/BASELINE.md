# C++ parity baseline

Date: 2026-10-04. Branch: cpp-parity, stacked on open PR #3 boot-experience.
Reviewed SHA: 96986c86223c575a1acb2f3525f5728bd5fddf6d. Clean starting worktree.
Production main/domain/regular workers.dev: 63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff.
Boot preview: https://boot-experience-kinenest.malizia-mario99.workers.dev/ at reviewed SHA.
No merge, production deployment, domain or repository rename authorized by this pass.

| Check | Result |
| --- | --- |
| npm ci | PASS, 35 packages |
| npm test | PASS, 51/51 |
| npm run build | PASS, asset c194fa54403a, clean SHA above |
| npm run test:chrome -- --built | PASS on unchanged retry |
| npm run test:firefox -- --built | PASS |
| npm run test:cpp -- chrome --built | PASS, real 2.1/2.4, diagnostics, Stop/Reset/runaway |
| npm run test:cpp -- firefox --built | PASS, real 2.1/2.4, diagnostics, Stop/Reset/runaway |
| node scripts/check-transitions.mjs chrome / firefox | PASS both, all five variants, reduced motion, history |
| node scripts/check-boot.mjs chrome / firefox | PASS both, direct entry, first paint, preferences, history, failure |
| node scripts/check-worker-assets.mjs | PASS actual Wrangler routing, ten pages, assets, root, real 404 |
| Responsive (included full course) | PASS 361 cases per browser |

Full Python covers all 25 coding references, Session 1 terminals, existing alternates/negative controls and hardened 4.1/4.3/6.3 bypasses. Chrome 141.0.7390.107 and Firefox 151.0.4 on this workstation; Safari/physical iOS unverified.

## Explained baseline interruption

The first Chrome run reached a passing 2.1 behavior but the harness POST /progress failed with Failed to fetch; /done did not arrive. CDP showed the passing exercise and running callbacks. Node and a subsequent Chrome request both reached the same endpoint with HTTP 200. The failed run was retained as failed; the entire unchanged Chrome sequence was repeated and passed. No source/build edits occurred between runs. This is a transient local test-transport observation, not an inferred application fix.

Raw logs: /tmp/kn-parity-baseline-unit.log, /tmp/kn-parity-baseline-chrome.log (failed), /tmp/kn-parity-baseline-chrome-retry.log (passed), /tmp/kn-parity-baseline-firefox.log, /tmp/kn-parity-baseline-workers.log. Visual artifacts are workspace .release-artifacts/cpp-parity-baseline-{transitions,boot}; excluded from production.

## Existing C++ limits

Only 2.1 and 2.4 are public. Real Clang/LLD produces WASM; educational rclcpp-shaped API currently provides LaserScan, Twist, node/timer/logger. No full native ROS 2, DDS, arbitrary packages, threads or native filesystem. New support remains hidden until both browser gates pass.

## Baseline compiler observations

Runtime reference: Chrome cold1439ms/warm118ms, compile1706/1773ms; Firefox cold2145ms/warm479ms, compile1264/1401ms. Cold bytes60,347,928, warm transfer0/cache60,347,928. Modules321,911/328,991bytes. Sampled compiler+filesystem linear-memory high-water49,020,928/52,101,120bytes; these are not process RAM. Measurements vary with workload/network.
