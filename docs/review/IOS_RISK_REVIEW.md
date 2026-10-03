# iOS and Safari risk review

**UNVERIFIED on real Safari/iOS/Android.** browser_ios reviewed supplied evidence only. Desktop viewport emulation is not a substitute for device testing.

| ID | Classification | Evidence/risk | Reproduction needed | Recommendation | Confidence / implementation |
|---|---|---|---|---|---|
| IOS-01 | needs device validation | Workers/WASM are plausible, but desktop passes do not establish lifecycle/keyboard behavior | Run Python/Cpp2.1/2.4, Stop/Reset, background/resume, rotate, edit with keyboard | Qualify browser claims | high coverage-gap confidence / docs |
| IOS-02 | resource/cache risk, not demonstrated failure | Compiler60,347,928bytes; measured linear memory excludes RSS; CacheStorage may be evicted/denied | Cold/warm/cleared/interrupted cache and low-memory device | Keep lazy loading; test recovery, do not remove C++ merely for size | high limitation confidence / future tests |
| IOS-03 | input risk | Editable13–14px may focus-zoom; no device measurement | Focus/type/select/scroll with iOS keyboard | Preventive16px narrow controls, validate actual device next | conditional behavior / small CSS |
| IOS-04 | confirmed desktop-emulated overflow | 4px at320sharedpreferences | Repeat captured9cases | Local wrap fix | high / yes |

Likely compatible is an engineering hypothesis: static HTML/CSS, native controls, Canvas/SVG and disposable workers avoid platform plugins. Needs real-device validation: CacheStorage quotas/private mode, WASM compile memory, virtual keyboard occlusion, textarea selection/indent, orientation, background suspension, transition back-forward cache. No serviceworker means no new PWA stale-cache layer today.

Firefox CI: preserve Chrome gate; add representative Firefox PR smoke and full scheduled/release suite if full-per-push cost is excessive. Current local Firefox passes are real but do not provide ongoing CI protection. Installed Chrome141 is not described as current stable.

Do not advertise mobile execution as fully supported until a physical-device acceptance pass. No claim of a known Safari defect is made.
