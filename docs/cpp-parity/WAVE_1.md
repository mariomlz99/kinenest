# Wave 1: callback state, sectors and topic debugging

Starting candidate96986c8; foundation63410ab. This branch is not deployed to production.

| Exercise | Reference Chrome/Firefox | Negative Chrome/Firefox | Alternate |
|---|---|---|---|
|2.1 LaserScan|PASS/PASS|wrong topic rejected|Existing style|
|2.2 state/String/timer|PASS/PASS|wrong String subscription rejected|class and captured shared state PASS/PASS|
|2.3 scan sectors|PASS/PASS|constant sectors rejected|angle and index approaches PASS/PASS|
|2.4 avoidance|PASS/PASS|zero travel rejected|existing class controller|
|6.1 topic debugging|PASS/PASS|starter /velocity rejected|different threshold helper PASS/PASS|

19/19 C++ scenarios passed per browser. Every case checks Stop endpoint cleanup and Reset evidence/mailbox/sample cleanup. Additional cases: UTF-8 String with quotes/newline/literal Infinity; compiler filename/line diagnostic then corrected Run; Twist NaN,+Infinity,-Infinity rejected before publication with a specific field error; infinite loop and Stop during loading.

First run exposed a real pre-existing UTF-8 bug: vendor filesystem input truncated source code points to bytes, and WASI output was decoded byte-by-byte. Source/header TextEncoder plus streaming output TextDecoder fixed both paths. Failed artifacts retained under /tmp/kn-cpp-wave1; corrected full results under /tmp/kn-cpp-wave1-utf8/{chrome,firefox}-wave-1.json. No test was marked passing from partial evidence.

Unit56/56; buildPASS. Relevant Python Session2 (including NumPy alternate) and Session6 passed both browsers. Footer and361responsive cases passed both. Public support enabled only after both real-compiler course gates passed. Ordinary URL UI tests then compile/run allfive, preserve Compare/Python/C++ drafts through language/theme/layout, Reset endpoints, and6.1→unsupported6.2→6.1 fallback/draft restoration.

The runtime checker remains language-neutral. String/small metadata uses structured worker envelopes and typed C++ traits. Scan binary ABI remains intact; report sample IDs are assigned by the worker, not provided by student helpers. Python-only startup still has no compiler preload.
