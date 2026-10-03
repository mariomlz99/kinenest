# Accessibility review

Evidence review by python_perception_control in a separate role; coordinator ran keyboard/reduced-motion checks and measured styles. Not a screen-reader certification or WCAG audit.

| ID | Area/session/exercise/language | Severity/category/priority | Observation/evidence | Reproduction | Impact | Change | Risk/confidence/implement |
|---|---|---|---|---|---|---|---|
| A11Y-01 | Editor help/2–6/all/both | high/accessibility/P1 | rgb173,195,204 on white, approximately1.83:1 at13px in light theme | Session2 light, inspect #editor-help | Essential keyboard help is difficult to read | Use light-theme secondary text color | low/high/yes |
| A11Y-02 | Editable controls/all/all/both | low/mobile/P2 | 13–14px at390px | computed styles | Small text; device zoom risk unverified | 16px narrow editable controls | low/high/yes preventive |
| A11Y-03 | Touch/all/all/all | low/accessibility/P2 | Several controls36–42px | responsive geometry | Smaller touch area | 44px narrow-layout targets | low/high/yes;44px is ergonomic goal, not blanket AA requirement |

Chrome actual keyboard: Tab indents in editor; Escape then Tab exits to output. Focus styles exist; output is focusable with an accessible name. Concise status regions are live; making every streaming log line aria-live would be harmful. Reduced motion navigates in <200ms without intentional1s overlay. Firefox shared acceptance also passes transition behavior.

TF axes have x/y labels, not color alone. All-frame labels overlap; default exercise selections reduce clutter. No new transform geometry should be invented to fix labels. Native language select retains full text labels with flags. Frame selector keyboard paths and high zoom require more exhaustive assistive-technology testing.

Unknown: actual screen readers, physical touch, high-contrast OS modes, complete contrast inventory, iOS keyboard,400% zoom interaction. Screenshot fit alone cannot close these gaps.
