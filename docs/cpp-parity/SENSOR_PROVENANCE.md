# Sensor buffer compatibility and sample provenance

## Reproduced before the fix

The isolated browser probe used real C++ compilation and real Python against production asset `c002e43a2ba4`, based on the completed Wave 8 application. Chrome and Firefox produced identical findings:

| Case | Observed behavior before fix |
| --- | --- |
| Direct C++ scan iteration | 5 callbacks, 5 range-access credits, 5 range reports |
| Ordinary `std::vector<float>` copy | Compiled and computed correctly, but 0 range-access credits |
| Direct Image buffer processing | Actual pixel processing credited |
| Ordinary `std::vector<uint8_t>` Image copy | Compiled and computed correctly, but pixel access was not credited |
| Retained old C++ scan | Four later callbacks incorrectly acquired current-sample range-access credit |
| Retained old Python scan | Correctly had no current-sample access, but four stale range reports still counted |
| Const reverse scan iteration | Compiled, but no range-access credit |
| Constant sector reports without reading a scan | Five reports counted in each language |
| Const `ranges.front()` / `back()` | Real Clang errors: methods lacked const overloads |

Logs: `/tmp/kn-cpp-buffer-before-world-{chrome,firefox}.log`. The probe initially omitted Session 2’s shared training world and correctly received a finite-range error from an empty scan; only the harness world setup was corrected before collecting this evidence. No application behavior was changed to accommodate the probe.

## Implementation and acceptance contract

The C++ sensor buffer now uses vector-shaped composition rather than inheritance. Current callback access is tracked for ordinary owned `std::vector` copies, direct indexing/iteration, const front/back and reverse iteration. A retained sensor buffer carries its original sample identity, so reading old data cannot credit a new callback. Copying data counts as actual access to that sample; this is formative behavioral feedback, not secure grading.

The shared adapter requires current-sample range access for both range and sector reports, regardless of language. Matching constants or a report based only on retained sensor data must not count as processing the current sample.

The isolated suite retains observational mode and adds an explicit regression mode:

```sh
node scripts/check-browser.mjs chrome --built --suite=cpp-buffer-probe --query=expect=fixed
node scripts/check-browser.mjs firefox --built --suite=cpp-buffer-probe --query=expect=fixed
```

The regression mode asserts all ten compatibility/provenance observations. Fixed production asset `6ad7e489683f` passes all ten assertions in both Chrome and Firefox. Ordinary scan/vector copies and const/reverse access each receive five current-sample read credits. Copied Image buffers receive real pixel-access credit. Retained scan data and constant sector reports receive zero report credits in both languages. Const front/back compiles and executes five callbacks.

Logs: `/tmp/kn-cpp-buffer-fixed-{chrome,firefox}.log`, including exact build-info and observations. These tests executed real Clang/WASM and real Python. Full C++ and Python course gates remain separate.
