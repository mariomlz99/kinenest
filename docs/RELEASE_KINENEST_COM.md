# KineNest release hardening and domain handoff

Date: 4 October 2026 (Europe/Brussels).

**Status: application release candidate validated; kinenest.com release is not complete.** The maintainer is preparing the first Cloudflare deployment. No temporary Workers URL or custom-domain deployment has yet been verified.

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
| Cloudflare deployment SHA | Pending first deployment and build-info verification |
| Target public URL | https://kinenest.com/ — not yet verified |

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

## Remaining release blockers and rollback

- Temporary workers.dev URL must be deployed by the authenticated maintainer and tested.
- kinenest.com and www must be attached, with valid HTTPS and a path/query-preserving www → apex redirect.
- Domain build-info, Python/C++, visible navigation and nine-page smoke must pass.
- Existing repository must then be renamed, source/canonical metadata updated and revalidated.
- Domain release tag remains uncreated.

Until the new host is proven, the old Pages URL and its deployment remain the rollback path. GitHub retains the release-dist artifact; the complete commit history remains in the existing repository. If preview fails, leave the old site and domain configuration untouched. Preferences and compiler caches are origin-scoped; changing host does not transfer them automatically. Current drafts are in-page memory and should be copied before navigating away.

C++ camera/services/parameters/actions/odometry/TF parity, Rust, rmw_wasm production integration, Session 7, PWA, contact backend and physical-device certification remain deferred.
