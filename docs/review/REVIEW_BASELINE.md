# Frozen review baseline

- Revision: 8679ae1008806352ce89efeb2d9cc651de557261.
- Date: 2026-10-03. Review source is this commit, not a moving branch.
- Main and deployed build-info both identify this revision; asset version f72334de2a11; deployed dirty=false.
- Pages workflow [37144563700](https://github.com/mariomlz99/ros2learn/actions/runs/37144563700): success.
- Node baseline: 46/46 tests; static build passes.
- Full built-site Python Chrome and Firefox suites: PASS, all 25 Python references across Sessions 2–6 plus Session 1 CLI and shared UI regressions.
- C++ Chrome and Firefox suites: PASS (compiler probe, runtime and public UI). Both 2.1 and 2.4 compile and pass shared checks; compiler diagnostics, warm cache, infinite-loop Stop, Reset, drafts and unsupported fallback pass.
- Baseline logs: `/tmp/kn-audit-baseline-{chrome,firefox}.log`; full suites completed before application edits.
- The environment does not expose npm on PATH; equivalent documented Node script entry points ran using Node 24.21.0.
- Public C++: Session 2.1 and 2.4 only. Camera, services, parameters, actions, odometry and TF C++ APIs remain unsupported.
- Desktop Chrome/Firefox are the acceptance targets. Edge/Safari/iOS and physical mobile input are unverified.
- Pre-existing untracked much, otherwise and provide are excluded and left untouched.

Reviewers use isolated detached worktrees at the revision above. No reviewer may change the main checkout or push. Reports must distinguish static inspection, executed evidence and untested hypotheses. Findings use the requested ID/area/session/exercise/language/severity/category/observation/evidence/reproduction/impact/change/risk/confidence/implementation fields. Independent disagreement is retained during synthesis.
