# Destination handoff evidence

Captured locally against application asset version `214e47504463` in Firefox,
1440 × 1100, with controlled delayed boot modules/lesson requests. The later
UTF-8-head ordering correction does not change layout or animation.
These screenshots are review artifacts and are excluded from dist.

## Reproduced production problem

[Partial destination](before-partial-destination.png) and
[paint timeline](before-timeline.json) come from deployed commit `63bb5ff`,
with light/Italian/stacked saved, cold cache and a throttled connection.
The destination initially painted dark, English and in source order before
applying preferences and constructing the workstation.

## Protected handoff

Each row shows an outgoing frame around 350 ms, the protected destination
during initialization, then the ready page. The incoming image is intentionally
a static icon: there is no second one-second animation.

| Navigation | Outgoing | Destination cover | Ready |
| --- | --- | --- | --- |
| Session 1 → 2 | [Frame](session-01-outgoing.png) | [Frame](session-01-incoming.png) | [Frame](session-01-complete.png) |
| Session 2 → 3 | [Frame](session-02-outgoing.png) | [Frame](session-02-incoming.png) | [Frame](session-02-complete.png) |
| Session 5 → 6 | [Frame](session-05-outgoing.png) | [Frame](session-05-incoming.png) | [Frame](session-05-complete.png) |

The browser test samples paint-state changes, checks full-viewport opaque cover
geometry, and rejects visible content before readiness. Screenshots supplement
those assertions; they do not replace Mario's final live visual approval.

## Welcome

[Dark desktop](index-en-dark-1440.png) ·
[Light desktop](index-en-light-1440.png) ·
[Italian phone](index-it-light-390.png) ·
[German small phone](index-de-dark-320.png).

Reproduce with `node scripts/check-boot.mjs firefox --output=/tmp/boot` and
`node scripts/capture-workstation.mjs /tmp/views` after building.
