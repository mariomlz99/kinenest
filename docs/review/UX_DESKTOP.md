# Desktop and Compare review

Frozen 8679ae1. Specialist: desktop_compare; source/measurement review only. Coordinator inspected screenshots. See REVIEW_METHOD.md.

Strengths: consistent mission/code/sensor panels; Session 3 camera prominence; Session 5 shared numeric/spatial TF; actual independent drafts in Compare; secondary graph/world panels; restrained footer/support. Preserve branding, Canvas/SVG, textarea and sensor geometry.

| ID | Area / session / exercise / language | Severity/category/priority | Observation/evidence | Reproduction | Impact | Suggested change | Risk/confidence/implement |
|---|---|---|---|---|---|---|---|
| DESK-01 | Drafts / 2 / 2.1,2.4 / both | medium / UX / P2 pending reproduction | Workspace drafts are a memory Map; refresh recovery absent by design | edit both languages, refresh; not executed in this review | Accidental refresh may lose work | Versioned local drafts with explicit Restore/Reset policy in a separate change | medium/high source confidence/no now |
| DESK-02 | Compare / 2 / 2.1,2.4 / both | low / UX / P2 | 1440px yields roughly435px editors; 390px stacks ~301px wide; long C++ lines scroll | screenshots and responsive JSON | Side-by-side syntax comparison needs sufficient content width | Keep current stack breakpoint; evaluate content-width threshold with real students | medium/medium/no |
| DESK-03 | Projection / all / all / both | low / UX / P3 | Editor14px and output13px optimize desk use | 1920x1080 geometry; no projected-room study | Distant students may struggle | Test browser zoom/projector before global density change | low/medium/no |
| DESK-04 | TF / 5 / all-frame exploration / Python | medium / hierarchy / P2 | All-frame labels overlap near robot/world origins; lesson defaults are clearer | tf-all-frames screenshot vs target/sensor defaults | Exploring mounts becomes harder | Later label placement/selection affordance; keep actual geometry | medium/high/no now |

Compare retains both student drafts, clearly marks language controls, and uses one active execution adapter. Existing browser tests cover mode switching, unsupported fallback, UI language/theme and current drafts; no full solution injection. Output remains one shared panel and deserves future active-program usability testing. Default390px editor height is workable; 10/40/100-line usability and persistent resize preferences have not received a human study.

Editor recommendation: retain textarea this pass. CodeMirror is the smaller future candidate for syntax/line diagnostics, but must justify bytes, keyboard and mobile behavior. Monaco is not justified by current evidence. No framework/editor migration.

Do not solve phone scrolling by hiding desktop causal context. A lecturer needs code, sensor and graph visible together; novices in Session 2 do not need every Session 6 tool open.
