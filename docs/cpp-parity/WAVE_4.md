# Wave 4: parameters, live tuning and TargetInfo

The complete available C++ suite passed **64/64 cases in Chrome and Firefox**,
covering 14 of 25 coding exercises. A subsequent TargetInfo float32 correction
passed a focused **22/22 cases in both browsers**. Full course parity remains
incomplete.

## Exercise acceptance

| Exercise | Reference | Alternate | Negative control |
| --- | --- | --- | --- |
| 4.1 Parameter-driven motion | PASS in both browsers | PASS in both browsers | Parameter reads and prints without motion publication rejected |
| 4.2 Live parameter tuning | PASS in both browsers | PASS in both browsers | Reading the update but continuing to command a cached speed rejected |
| 4.3 Custom TargetInfo message | PASS in both browsers | PASS in both browsers | Valid message on the wrong topic rejected |

The runner changes speed through the shared setParameter function after three
timer callbacks. Both valid implementations read the new value while running and
change actual command speeds. The stale-value negative continues publishing its
startup value and fails the same behavioral checker.

TargetInfo publication uses the existing /target_info endpoint and shared runtime
validation. Its local C++ struct is generated-like educational support, not an
in-browser rosidl build.

## API and lifecycle checks

The tests compile and run a program declaring bool, integer-valued number,
double-valued number and UTF-8 string parameters. Both accessor methods and typed
get_parameter output arguments are exercised. Host updates change all four values
without replacing the execution worker.

Wrong-type access and an undeclared parameter produce specific errors, followed
by successful corrected runs. A saved listener from a disposed worker cannot
change a replacement run with the same node name. Stop removes its parameter
listener and node endpoints; Reset restores fresh state.

TargetInfo tests cover typed publication and subscription, UTF-8 text and rejection
of confidence outside [0, 1]. Compiler errors retain source filenames and API
names. Every case checks Stop/Reset cleanup; runaway execution is still terminated.

## Review corrections and numeric limits

Source review found a missing range check before narrowing a numeric parameter
into a requested C++ type. The implementation now rejects negative-to-unsigned
conversion, 128 into int8_t, and 1e300 into float. An integer declaration above
JavaScript's safe integer range is also rejected before precision is lost.
The new browser controls verify all four errors and valid boundary values:
uint8_t = 255, int8_t = -128 and int64_t = 9007199254740991.

A separate interface review corrected TargetInfo.confidence to float, matching
the educational interface's float32 definition. Both browsers then reran the
affected exercise, parameter, custom-message and lifecycle cases.

The host parameter model still has bool, string and JavaScript number categories.
It does not model native ROS integer-versus-double parameter type rules. C++ typed
access adds checked conversion; it does not make the shared host model native ROS.

## Exact candidate history

All builds below were dirty candidate working trees based on commit
61874c9e060a5494464dd43b9e493f003c975e14. The commit alone does not contain these
uncommitted Wave 4 changes.

| Asset version | Build time, UTC, 4 October 2026 | Gate | Chrome / Firefox |
| --- | --- | --- | --- |
| 2a0049197a98 | 10:39:38.327 | Initial available course | 59/59 / 59/59 |
| 5fe7412a6514 | 10:48:07.306 | Full rerun including narrowing limits | 64/64 / 64/64 |
| 44954c72fed2 | 10:55:53.926 | Focused float32 correction gate | 22/22 / 22/22 |

The full bounds runs finished at 10:53:05.564 UTC in Chrome and 10:53:47.676 UTC
in Firefox. The focused runs finished at 10:57:09.417 UTC and 10:57:18.603 UTC
respectively. Unit tests passed 56/56 before each rebuilt correction candidate.

## Reproduction

~~~bash
npm run test:cpp-course -- chrome --built --wave=4
npm run test:cpp-course -- firefox --built --wave=4

# Explicitly targeted gate, not a replacement for final full-course acceptance:
npm run test:cpp-course -- chrome --built --wave=4 --focus
npm run test:cpp-course -- firefox --built --wave=4 --focus
~~~

New-wave lesson cases run first. Default mode retains all previous references,
negatives, alternates and API regressions. Focus mode runs the three new exercises,
their nine solution/control cases, twelve relevant API cases and runaway recovery.
Its JSON explicitly reports focus = true, exercises = 3 and availableExercises = 14.
It never claims full parity.

Machine-readable evidence is under:

- /tmp/kn-cpp-wave4/{chrome,firefox}-wave-4.json
- /tmp/kn-cpp-wave4-bounds/{chrome,firefox}-wave-4.json
- /tmp/kn-cpp-wave4-float/{chrome,firefox}-wave-4-focus.json

Reports now include a whitelist of build-info fields: project, commit, build time,
asset version and dirty state. They do not include workstation paths or secrets.

The Python Session 4 suite and checker-hardening suite passed in both browsers.
Logs are /tmp/kn-wave4-python-session4-{chrome,firefox}.log and
/tmp/kn-wave4-python-hardening-{chrome,firefox}.log.

Public variants 4.1–4.3 are enabled in candidate asset cbd567f1e45f. Its
ordinary-URL UI gate passed in Chrome and Firefox: all three references, seven
languages, drafts, Stop/Reset and representative phone Compare plus switching
exercise while running. Logs: /tmp/kn-cpp-wave4-ui-{chrome,firefox}.log. These local tests
do not claim production deployment or Safari support.
