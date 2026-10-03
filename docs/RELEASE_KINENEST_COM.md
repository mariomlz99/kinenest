# KineNest release hardening and domain handoff

## Welcome and destination-boot pass — 4 October 2026

This section supersedes the initial-attachment checklist below for the current
presentation pass. Production is already attached; it must remain unchanged
until the isolated preview receives Mario's visual approval.

### Frozen starting state

- Main / public starting commit: `63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff`.
- Cloudflare apex and regular workers.dev build: same commit,
  builtAt `2026-10-03T23:31:04.711Z`, assetVersion `784328576e05`.
- GitHub Pages fallback: same commit, builtAt `2026-10-03T23:18:54.361Z`.
- Work is isolated on branch `boot-experience`; no production merge, repository
  rename, domain change or release tag is part of the unapproved candidate.
- Identity PR #2 remains on hold.

Baseline npm ci, 49 unit tests, build, actual Workers routing, full course,
real C++ and outgoing transitions passed in Chrome and Firefox. The first
Chrome diagnostic run exposed a test timing race: endpoint cleanup was complete
but the graph's next scheduled paint had not happened. Commit `4e7ec9c` waits
for that bounded DOM update; it does not change runtime behavior or grading.

### Proven cause and implementation

Cold, throttled navigation on the deployed Worker painted the destination at
about 441 ms before preferences or layout initialization. The saved light,
Italian, stacked settings appeared around 1593 ms; the lesson was ready around
1959 ms. The outgoing transition was working, but could not protect the new
document. [Before/after evidence](review/boot-handoff/README.md).

All ten public HTML pages now contain a generated, fixed, opaque cover and a
tiny synchronous theme/language bootstrap. UTF-8 is declared before that
script. The shared page-ready contract follows initial translation, layout,
lesson and first visual setup, icon decode and two render frames. It does not
load Pyodide or C++. Outgoing motion remains about 850 ms within a 1000 ms
navigation dwell; the destination has no artificial dwell and fades in 160 ms.

Direct entry, reload and history use the same contract. Reduced motion skips
the intentional dwell and rotation. Initialization failures show a useful
reload view; a 10-second watchdog handles missing modules. Without JavaScript,
content and the noscript explanation remain visible.

### Welcome, routing and brand

- `/` and `/index.html`: concise welcome, Start Session 1, compact course links.
- `/session-01.html`: preserved original Session 1 workstation.
- Brand/home links return to the welcome page.
- The tagline appears beneath KineNest in the global lockup, translated in all
  seven UI languages and retained at phone widths.
- The welcome page omits the irrelevant workstation-layout control. Small-phone
  spacing keeps Start reachable without reducing text or touch target sizes.
- Python and executable C++ scope are unchanged: C++ 2.1 and 2.4 only.
- Root rewrite remains static; unknown paths remain real 404s.

### Candidate validation status

51 unit tests pass. The original expanded 360-case responsive matrix passed locally. CI then
exposed a German Session 5 heading overflow with wider system fonts; it was
reproduced with DejaVu Sans (342 px document at a 305 px client width), fixed
with a shrinkable grid and wrapping heading, and added as case 361. The final
361-case matrix passes Chrome and Firefox locally with no page overflow. Actual local Workers routing passes all ten
pages, root rewrite, assets and real 404s. Visual captures cover welcome
light/dark, small German/Italian layouts, Python/C++/Compare, camera, TF,
debugging, About and footer. Full six-session Python, hardened checker alternatives/negative controls, real
C++ 2.1/2.4 and all five outgoing transitions pass Chrome and Firefox.
Destination readiness, failure/watchdog recovery and actual reduced-motion
preferences also pass in both browsers.
Root-domain smoke passed both browsers on exact candidate e5610be, including
real Python, real C++ 2.1/2.4, ten footers and navigation. The live Cloudflare
preview also passed those checks, all five outgoing variants, destination
readiness/history/reduced motion, and all 25 Python exercises plus Session 1 CLI
in Chrome. The subsequent heading-only fix is commit 83845a3; final CI and
preview checks remain required for that revision.

Live timing tests now measure the navigation request separately from pagehide.
A remote Firefox response delay had been incorrectly counted as intentional
reduced-motion dwell. Both browsers pass the corrected test.

One intermediate local Chrome run was invalidated by a unit build test
regenerating dist while the browser was loading it. The complete course was
rerun against a frozen dist and passed; no readiness failure was ignored.
The initial small-phone Start-button regression was corrected and the full
responsive matrix rerun in both browsers.

### Deployment gate and remaining work

Cloudflare Git integration created the isolated branch preview automatically;
local CLI authentication is unnecessary. [PR #3](https://github.com/mariomlz99/ros2learn/pull/3)
remains unmerged. The [preview](https://boot-experience-kinenest.malizia-mario99.workers.dev/)
was verified at e5610be3015ed006b7f3b8665eff6a8211469624, builtAt
2026-10-04T00:30:13.769Z, assetVersion 2e1b5b1aeacc. Its immutable URL is
https://2356df70-kinenest.malizia-mario99.workers.dev/.
Production still served 63bb5ff at that check. Do not publish to the regular
workers.dev hostname before approval: it also updates the apex.

After the final heading-fix CI/preview checks, ask Mario to review landing → Session 1,
Session 1 → 2 and Session 2 → 3. No manual approval has been inferred from the
earlier approval of the old site. The new presentation is not yet production
verified. Safari/iOS and physical mobile devices remain independently untested.

---

Date: 4 October 2026 (Europe/Brussels).

**Status: kinenest.com verified in Chrome and Firefox; repository/canonical cutover and www/HTTP routing are being finalized.** The domain serves the tested 63bb5ff build over valid HTTPS. This report does not yet claim a completed identity migration.

## Revisions

| Item | Revision / state |
| --- | --- |
| Starting branch | review-hardening |
| Starting / reviewed SHA | f87d2e6cdbe5cdfd6a5da2539863bae61c6b9334 |
| Previous main / deployed Pages SHA at start | 8679ae1008806352ce89efeb2d9cc651de557261 |
| Tested application candidate | bdcf92afd81ee24f91449859fb7c33eefe30f5d1 |
| Application asset version | 784328576e05 |
| Implementation branch | final-release-polish |
| Final pre-rename SHA | Not established; rename waits for verified replacement hosting |
| Canonical repository currently | mariomlz99/ros2learn |
| Target repository | mariomlz99/kinenest |
| Cloudflare deployment SHA | 63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff |
| Verified public URL | https://kinenest.com/ |

The candidate was tested in a clean detached worktree. Its build-info reports dirty: false. The original checkout's pre-existing untracked files much, otherwise and provide were preserved.

## Changes

- `5eb15d5`: record clean baseline.
- `de46556`: statically load transition CSS on all nine pages, initialize once, use an opaque theme background and a larger compact icon; capture visible motion.
- `76d52df`: consolidate surface/status tokens, keep narrow session navigation on one scrollable row, distinguish Real environment, and update About's C++ wording in seven languages.
- `e793fe6`: add real reference/alternate/bypass/empty/print-only acceptance for 4.1, 4.3 and 6.3.
- `bdcf92a`: prepare pinned Wrangler static-assets deployment, root rewrite, real Workers routing tests and Chrome/Firefox CI using the same build artifact.
- Subsequent evidence-only/test-route commit records this report and adds the explicit Session 3 → 5 navigation check; application assets are unchanged.

## Validation

| Gate | Baseline f87d2e6 | Clean candidate bdcf92a |
| --- | --- | --- |
| Unit tests | 49/49 | 49/49 |
| Production build | PASS | PASS |
| Full Python course — Chrome | PASS | PASS |
| Full Python course — Firefox | PASS | PASS |
| Real C++ — Chrome | PASS | PASS |
| Real C++ — Firefox | PASS | PASS |
| Visible-transition sampling/captures | Race reproduced | PASS in both |
| Root-path production smoke | — | PASS in both |
| Actual local Workers Python/C++ smoke | — | PASS in both |
| Workers dry run and routing | — | PASS |
| Responsive review capture | Prior review retained | 200 cases, zero page overflow |

Full course means Session 1 CLI plus all 25 Python exercises, including camera/services, goal control, debugging, negative controls and Stop/Reset. The targeted checker suite accepts class/helper/NumPy alternatives while rejecting the previous bypasses, print-only and empty programs. The grading contract remains behavior; no source matching was added.

Public executable C++ remains **2.1 and 2.4 only**. Both compile and execute real C++ in ordinary URLs, reuse the Python behavioral checker, preserve Compare drafts and handle compiler errors, runaway Stop and Reset. Unsupported lessons stay Python-only. Python-only startup still fetches no compiler assets.

The complete browser suites also cover seven languages, sensor/TF agreement, theme state, responsive layouts and history cleanup. Safari/iOS and physical mobile devices remain independently unverified; Edge remains best effort.

[CI for the application candidate](https://github.com/mariomlz99/ros2learn/actions/runs/37160753565) independently runs build, complete Chrome/Firefox course/C++, visible transitions and root smoke. Publishing main must wait for the required checks; the main deployment's own build-info and smoke results remain the source of truth for what is public.

## Transition evidence

The original race was reproduced with a delayed transitions.css request: at 100 ms the element was position: static, below the page at y=2390 px, animation: none. The navigation timer still expired after one second.

All public pages now link the stylesheet in initial HTML before boot. Initialization is guarded by the installed handler, not by whether a CSS link exists. Tests delay the stylesheet, sample rendered geometry/opacity/animation at 100 and 450 ms, verify an actual changing transform/opacity, capture frames during motion, and check navigation timing and history.

[Evidence and screenshots](review/release-transitions/README.md):
[LiDAR](review/release-transitions/chrome-lidar-sweep-dark.png),
[TF](review/release-transitions/chrome-tf-rotate-light.png),
[robot yaw](review/release-transitions/firefox-robot-yaw-dark.png).
All five variants were exercised. Normal observed dwell was approximately one second; reduced motion navigates promptly. The overlay is opaque and matches the active light/dark page background. Actual runtime loading is unchanged.

## Visual review

Reviewed desktop/laptop/tablet/phone captures for Session 1, Python/C++/Compare, camera, actions, TF, debugging and About. The 200-case matrix includes 13 widths, landscape and seven languages. Light worlds remain white; code overflow stays inside editors; phone Compare stacks; the session strip scrolls without page overflow. About light/dark assets and the 1200 × 630 social card retain the final tagline. Original logo artwork was not regenerated or overwritten.

Support remains a plain, unobtrusive link. Footer creator attribution and links remain shared across all public pages. No analytics, tracking widget, institutional logos or new paid service dependency was introduced.

## Cloudflare handoff

The maintainer's selected dashboard is **Workers Builds with Static Assets**, superseding the earlier Pages target. There is no application Worker script. `wrangler.jsonc` serves dist; `_redirects` rewrites only / to /index.html. This avoids the root 404 produced by html_handling: none while preserving existing .html lesson URLs.

Configuration, exact dashboard commands and validation steps are in [CLOUDFLARE_RELEASE.md](CLOUDFLARE_RELEASE.md). Wrangler is pinned to 4.147.0 as a development dependency and excluded from student assets. Deploy and preview commands have been checked against the installed CLI.

The working GitHub Pages site is retained. Repository rename is delayed because GitHub does not redirect project-page URLs after a rename. After a temporary Workers URL passes both browsers, attach and verify kinenest.com, then coordinate repository/source/canonical migration. Do not advertise the domain as live or tag the initial domain release before that verification.

## Verified Cloudflare Worker deployment

Verified https://kinenest.malizia-mario99.workers.dev/ on 4 October 2026 (Europe/Brussels). Build identity: commit `63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff`, builtAt `2026-10-03T23:31:04.711Z`, assetVersion `784328576e05`, dirty `false`. This matches the tested application assets. [Main CI](https://github.com/mariomlz99/ros2learn/actions/runs/37161362560) is fully green, including GitHub Pages publication and deployed-site checks.

Both Chrome and Firefox passed `check-deployed.mjs` against the actual Worker URL: real C++ 2.1/2.4 with shared behavioral checks, real Python, no compiler requests at Python-only startup, all nine public-page footers, correct support/attribution links, and immediate light/dark About-logo switching. Root and explicit HTML routes return 200; unknown paths, tests and private review documentation return 404.

Both browsers also passed `check-transitions.mjs` against that host: 1→2, 2→3, 3→5, 5→6, About→1, all five deterministic variants, rendered-state samples, changing animation state, reduced motion and history cleanup. Observed ordinary dwell was 1033–1097 ms; reduced-motion dwell was 30–31 ms. Light TF and dark LiDAR captures were visually inspected. Captures and JSON results are retained outside production in `.release-artifacts/remote-worker-transitions/` beside the checkout.

This is a deployed-host smoke check, not a second full-course run on Cloudflare. Complete course and C++ suites passed locally and in CI for the same application version. No custom-domain success is claimed.

## Verified apex-domain deployment

The maintainer attached kinenest.com to the static Worker. Direct HTTPS requests now succeed with normal certificate verification and build-info matches `63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff`, assetVersion `784328576e05`, dirty `false`. Chrome and Firefox passed real Python/C++ 2.1/2.4, nine-page footer checks, light/dark About logos, all five transition variants, first navigation, history and reduced motion on https://kinenest.com/. Ordinary navigation measured 1026–1079 ms; reduced motion 26–31 ms. Full-course testing remains the green CI result for the same application version.

The identity-cutover branch updates source links, canonical/social URLs, README and private package metadata. Runtime interface names and localStorage keys stay compatible. Wrangler explicitly retains the verified apex custom domain and the workers.dev fallback. The www redirect and HTTP-to-HTTPS enforcement remain pending external verification; no success is inferred from the dashboard alone.

## Remaining release blockers and rollback

- Verify the path/query-preserving www → apex redirect and HTTP → HTTPS enforcement.
- Reverify domain build-info, Python/C++, visible navigation and public metadata after identity cutover.
- Existing repository must then be renamed, source/canonical metadata updated and revalidated.
- Domain release tag remains uncreated.

Until the new host is proven, the old Pages URL and its deployment remain the rollback path. GitHub retains the release-dist artifact; the complete commit history remains in the existing repository. If preview fails, leave the old site and domain configuration untouched. Preferences and compiler caches are origin-scoped; changing host does not transfer them automatically. Current drafts are in-page memory and should be copied before navigating away.

C++ camera/services/parameters/actions/odometry/TF parity, Rust, rmw_wasm production integration, Session 7, PWA, contact backend and physical-device certification remain deferred.
