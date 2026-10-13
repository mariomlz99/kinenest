# Terminal shortcut investigation

Baseline: KineNest main `2ae347acc02c98b3cfaa96715ce79c27f1bb78e3`.
Scope: KineNest only. No standalone lab or production publication.

## Reproduction and root cause

The existing line editor already implemented Ctrl+A (`\x01`), Ctrl+E (`\x05`),
Home (`\x1b[H`) and End (`\x1b[F`). Real Chrome and Firefox keyboard events
confirmed that xterm receives the key, emits the correct control character,
prevents the browser default, and updates the logical command cursor. Neither
browser selected the webpage. Ordinary single-line commands passed before the
change, so adding another keyboard interceptor would not fix the reproduced bug.

The failure is in `TerminalView.redraw()`. When prompt plus command occupies an
exact multiple of the terminal width, xterm uses delayed wrapping: the cursor
remains at the right edge until another printable character arrives. The redraw
arithmetic treated it as already on the next row. Carriage return then put the
visible cursor on the wrong row, and subsequent Ctrl+A/E or Home/End redraws
moved upward and erased earlier output. Ordinary typing through a wrap boundary
could also corrupt preceding output before a shortcut was pressed.

The baseline probe used 146 columns in Chrome and 147 in Firefox. With an
exact-width command, Ctrl+A set the logical cursor to zero but moved the visible
cursor from row 4 to row 2, overwriting the previous command's output. Both
browsers showed the same defect. Baseline screenshots and full key/data/buffer
traces are in `artifacts/terminal-shortcuts/`.

## Fix

`finishWrap()` resolves a pending exact-width wrap by writing one blank cell,
returning to column zero, and erasing that temporary cell. Prompt and redraw
therefore agree with their existing row/column calculation. This keeps the
existing xterm keyboard, selection, clipboard and interrupt paths intact.

Each terminal now has an optional **Keyboard** disclosure in its title bar.
Native summary keyboard handling, visible focus and Escape-to-close keep it
accessible. Help labels use the existing translation observer and all six
non-English translation columns. The key names themselves are not translated.

## Regression

Run after starting the local or built KineNest server:

```sh
node node_modules/playwright-core/cli.js install firefox
LAB_URL=http://127.0.0.1:8017/basics.html node scripts/terminal-shortcuts-check.mjs
```

The script uses installed Chrome (`CHROME_BIN` can override its path) and
Playwright Firefox (`FIREFOX_BIN` or `PLAYWRIGHT_BROWSERS_PATH` can override it).
The test context grants Chrome clipboard access; Firefox's async clipboard test
preference permits reading the real clipboard without a native permission menu.
It types through real browser keyboard events. Its observation hook records the
TerminalView instance and onData values; it never calls `input()` directly or
sets the command string/cursor.

Assertions cover:

- Exact requested PREFIX-/SUFFIX sequence using Ctrl+A/E and Home/End.
- Single lines, more than two wrapped rows, and exact one/two/three-width ends.
- Logical and visible command/cursor, preserved previous output, actual submitted
  shell history and the plain-text transcript.
- Ctrl+U/K/W on single and wrapped input, history and Tab completion.
- Selected Ctrl+C through the real clipboard write and read; unselected
  cancellation and foreground interruption. Ctrl+Shift+C still copies, and
  Ctrl+Z/fg preserve a supported topic job until Ctrl+C stops it.
- No browser selection inside the terminal; normal Select All outside it.
- Optional help via keyboard, Escape, translation, and TF session navigation.

Results and screenshots are written to `artifacts/terminal-shortcuts/`.

An apparent truncated prompt in a full-page TF screenshot was also investigated.
The xterm buffer contained the complete prompt and correct cursor; the terminal
was below the viewport, where xterm pauses canvas rendering. Scrolling it into
view before screenshot capture renders the full prompt. This was a screenshot
capture issue, not lost terminal state.
