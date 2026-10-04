# Wave 9 — public C++ UI and recovery

Frozen application asset: `6ad7e489683f`, 4 October 2026. This describes local production-build acceptance, not a live deployment.

Chrome and Firefox both exited 0 with all 25 exercises passing `tests/cpp-parity-ui.html?wave=9`. No query flag was added to any course page. Each exercise exposes Python/C++/Compare, compiles its actual reference with the real browser toolchain, reaches shared behavioral success and passes Stop/Reset.

Each exercise preserves independent edited drafts through all seven UI languages, programming-language changes, theme and layout. C++ task translations and restored Python titles are checked. Preferences do not reset the idle world. Eight representative API families also exercise 390px stacked Compare, reachable controls and switching exercise during an active C++ run. Session 1 remains language-neutral.

Commands:
```sh
node scripts/check-browser.mjs chrome --built --suite=cpp-parity-ui --query=wave=9
node scripts/check-browser.mjs firefox --built --suite=cpp-parity-ui --query=wave=9
```

Logs: `/tmp/kn-wave9-ui-chrome.log`, `/tmp/kn-wave9-ui-firefox.log`.

## Compilation and output stress

`tests/cpp-ui-stress.html` passed 6/6 cases, exit 0, in each browser:

1. A real compiled program emits 1,000 long log lines. The existing 40-lines/second rate limit may drop lines; the rendered output never exceeds 24,000 characters.
2. Actual long compiler diagnostics reach but never exceed that same bound.
3. Correcting the source and immediately clicking Run three times recovers to actual behavioral success without refresh.
4. Stop during the observed real `Compiling C++…` stage leaves no stale activity.
5. Reset during that stage clears execution and prior evidence.
6. A subsequent real compile/run/check succeeds without refresh.

Logs: `/tmp/kn-wave9-ui-stress-{chrome,firefox}.log`. No fake compiler or worker delay was used.

## Asset failure and notice

`tests/cpp-network.html` passed in both browsers on the same asset. The first real compiler fetch is deliberately interrupted, and the error explains which asset failed and how to retry. The exact student source and usable UI remain. Restoring the real Worker allows compile/run/check. A separate actual worker run receives a truncated cache response and a controlled cache-write quota failure; it fetches the genuine pinned assets and succeeds.

The first-run ~60 MB notice is visible before explicit Run. The acknowledgement is saved locally after Run, with no repeated download notice or automatic preload. This is not a guarantee that browser cache persists.

Logs: `/tmp/kn-wave9-network-{chrome,firefox}.log`.

## Scope

These are Chrome/Firefox desktop engine tests with narrow-view emulation, not physical mobile/Safari certification. Final screenshots, independent review and live preview identity remain separate release gates.
