# Wave 7: action lifecycle and Python regression

## Shared host behavior

The reviewed adapter requires a registered action client, diagnoses unknown action names, and preserves Python's existing omission of name by defaulting to /drive_distance. Goal notifications capture their originating worker. A stale notification returns before touching actionIds, so a new execution may safely reuse numeric request IDs. Terminal mapping cleanup occurs before delivering the result.

Cancellation preserves the current synchronous order: terminal result first, cancellation acknowledgement second. The C++ prototype keeps those callback records independent. Its native lifecycle review covers rejection, duplicate events, retained terminal handles and client destruction from callbacks. Callback APIs remain educational, without native blocking futures or UUID-shaped cancel results.

Terminal runtime history is capped at 100 records while retaining active goals. The initial cleanup replaced g.notify, but review found a second retention path through g.dispose → scheduler job → callback → original notify. An isolated WeakRef/GC experiment confirmed that replacing the disposer releases the captured object while retaining the terminal record. Deterministic unit assertions now require release of the original disposer in both ordinary completion and failing-consumer paths; GC timing is not part of the unit suite. The application correction is coordinated by the root after the frozen browser run.

## Browser gate

Python session4, checker-hardening and diagnostics PASS in Chrome and Firefox on frozen asset 9ddc31cf6ead (HEAD b876872 plus initial Wave 7 implementation). All six Session 4 reference programs and empty-exercise controls pass. The hardening suite passes 15 cases across parameter control, custom messages and beacon integration: references, alternates, rejected old bypasses, print-only and empty programs, with Stop/Reset evidence cleanup. Diagnostics passes seven fault/recovery cases: syntax, wrong message, NaN/infinite velocity, missing parameter, unknown TF frame and wrong service, preserving drafts and accepting a corrected Run. Logs: /tmp/kn-wave7-python-chrome.log and /tmp/kn-wave7-python-firefox.log. These browser runs precede the additional disposer cleanup; final regression must cover the subsequent build.

No compiler/WASM result is claimed from this Python run. C++ action acceptance is coordinated separately.

## Final disposer-cleanup gate

After both terminal notify and disposer closures were cleared, Python Session 4 was rerun against final public asset e3b540071291. Chrome and Firefox PASS all six references, empty-exercise negative checks, NL/FR draft preservation, theme and layout. Logs: /tmp/kn-wave7-final-python-session4-chrome.log and /tmp/kn-wave7-final-python-session4-firefox.log. The broader hardening/diagnostics results above remain tied to their earlier asset; this final rerun specifically closes the action-course regression gate after disposer cleanup.
