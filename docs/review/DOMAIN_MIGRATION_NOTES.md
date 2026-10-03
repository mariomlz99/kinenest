# Domain and future delivery review

Frozen revision: 8679ae1. No DNS, hosting, repository or canonical URL changes made.

## Current coupling

- `src/ui/product.js` centralizes public site and repository URLs. `PRODUCT.site` feeds canonical and OpenGraph URLs; change it together with deployment when a domain move is approved.
- Navigation and brand assets use relative/module-relative URLs. Build assets live under a content-versioned directory. The browser tests deliberately serve under /ros2learn/, which tests a non-root base path.
- Pyodide 0.28.3 is loaded from jsDelivr; the C++ toolchain uses the pinned wasm-clang revision. These are separate external asset dependencies, not an application backend.
- `scripts/check-deployed.mjs` accepts --url and verifies the expected commit before testing. Its default remains the current Pages URL.
- README, documentation and CI Pages output links will need a coordinated update. Preserve the old URL or provide an explicit redirect plan; do not silently assume repository renaming preserves all assets.

## Eventual migration checklist (not implemented)

1. Agree on the canonical hostname and hosting provider. Keep repository migration separate.
2. Test the same build at / and /ros2learn/, including workers, Python resources and C++ assets.
3. Update PRODUCT.site, metadata and the smoke-test target together. Verify HTTPS, MIME types, worker loading and cross-origin asset access.
4. Verify build-info, all six sessions and both public C++ exercises in Chrome and Firefox on the new hostname.
5. Explain that browser preferences, compiler Cache Storage and future local drafts are origin-scoped: changing domain does not carry them automatically.
6. Publish a redirect/retention policy for the old Pages address before announcing the new URL.

## Contact proposal

A future static contact page may list info@kinenest.com once routing is configured and tested. Cloudflare Email Routing, a Pages Function and Turnstile are options for a separately approved design, not installed requirements. Start with an email link if sufficient. No credentials, contact backend or tracking were added.

## Local progress and deep links

Recommend an exercise query parameter using stable lesson IDs, with validation/fallback and history updates that do not restart a running program merely to rewrite the URL. A separate code-language parameter should select only supported modes. This helps lecturers, bug reports and reproducibility. Preserve internal IDs.

Recommend local-only drafts before completion badges: schema-versioned per-exercise/per-language content with explicit restore/reset behavior, quota/error handling and an export option. Label progress as local to this browser. Do not imply secure grades or synced accounts. Current drafts survive in-page mode/exercise changes but not a browser refresh; this matters more than a cosmetic progress strip.

## PWA/offline recommendation

Defer service workers until cache/version recovery has its own tests. The current app is not an offline-first product. First Python/C++ use needs external assets. A PWA could cache static lessons and explicitly requested runtimes, but must avoid automatically downloading the ~60 MB compiler, silently serving mixed build versions or retaining unbounded caches. Test failed upgrades, storage eviction and old open tabs before promising commuting/offline use.
