# Curriculum synthesis — decision before implementation

Source8679ae1. Per-exercise assessment is in [Python audit](PYTHON_AUDIT.md); all25 proposed C++ designs, APIs, compiler/bridge gaps and effort are in [C++ parity matrix](CPP_PARITY_MATRIX.md). The complete inventory includes dependencies and references.

Three high-confidence P1 checker fixes are selected:4.1student motion publications;4.3requested custom-message topic;6.3actual student scan-range access. Preserve physical behavior checks and language-neutral evidence. No code-pattern requirements. No new C++ curriculum support in this pass.

| Session | Lecturer desk estimate, not measured class time | Recommendation |
|---|---|---|
|1|~40–50min tasks plus introductory explanation/debugging|Use remaining time for velocity versus position and shared graph mental model|
|2|~12–15min explanation +55–65tasks +15–20debugging|Tight90min; alternate implementations are extensions|
|3|~75–100min total|Keep camera/NumPy/service progression; no added APIs|
|4|~80–98min core; cancellation can add17–23|Cancellation stays optional; do not add build-system work|
|5|~85–115min total|5.6integration is extension if needed; visual frame semantics take priority|
|6|~70–100min total|Require explanation using observable graph/TF evidence, not guessing|

C++ disagreement: matching a checker is not always equivalent pedagogy. A C++ loop can compute pixel means but cannot teach real NumPy. Keep3.2Python-first or explicitly restate the language-neutral objective before future parity. Header stubs alone do not implement services/actions/TF; typed bridge, asynchronous state and lifecycle tests are necessary.

ROS review favors accepting mathematically equivalent frame/controller solutions; checker review favors preventing trivial bypasses. Resolution: strengthen observable endpoint/data-access contracts only, retain equivalent algorithms and treat checks as formative. The unsupported-service exploit was withdrawn. The early-turn avoidance hypothesis was not reproduced, so its implementation stays unchanged.

Transfer notes are broadly accurate. Add the real ament_python resource marker to the conceptual package tree; document numeric parameter simplification. Do not add Session7 or CMake execution. No evidence justifies a runtime refactor.
