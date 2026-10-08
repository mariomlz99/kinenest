# KineNest

Learn ROS 2 by building and running programs in your browser.

[Open KineNest](https://kinenest.com/) · [BASICS](https://kinenest.com/basics.html?start=1)

BASICS has seven units: environment, workspace/packages, terminal topics, pub/sub, messages/parameters, services/launch, and actions. Python executes in CPython/Pyodide; C++ compiles to WebAssembly. The playground has an independent saved workspace with robot, camera and LiDAR views. The shell, build system and ROS transport are browser models.

## Develop

Node.js 22 or newer:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:8017/ . Python and C++ runtimes download on first use.

## Check and build

```sh
npm test
npm run build
npm run preview
```

With the preview running, browser checks use Chrome:

```sh
LAB_URL=http://127.0.0.1:8017/basics.html npm run test:acceptance
LAB_LANGUAGE=cpp LAB_URL=http://127.0.0.1:8017/basics.html npm run test:acceptance
LAB_URL=http://127.0.0.1:8017/basics.html npm run test:actions
SITE_URL=http://127.0.0.1:8017/ npm run test:product
```

`npm run test:browser` checks real language runtimes against the source with its own temporary server. `dist/` is the only deployable output. CI builds and tests it before publishing GitHub Pages. `npm run deploy` publishes the tested build to the KineNest Cloudflare Worker.

## Repository map

- `src/`: application, seven units, runtimes, terminal/editor, translations and playground.
- `public/brand/`: KineNest identity.
- `tests/`: behavior and runtime checks.
- `scripts/`: development, build and browser validation.
- `docs/`: architecture, supported behavior, interface provenance and release notes.
- `index.html`, `basics.html`, `licences.html`: three public pages.

Earlier implementations and experiments remain available in Git history. There is one active application and one curriculum source.

## Saved work

Workspaces, terminal history and progress autosave in this browser. Processes must be restarted after reopening. Storage is local to the site and browser; source export provides a portable backup. No account or cloud sync is required. Session records are versioned.

See [supported behavior](docs/SUPPORTED.md), [architecture](docs/ARCHITECTURE.md), and [contributing](CONTRIBUTING.md).

Terminal completion follows the default Bash interaction: Tab completes an unambiguous prefix; a second Tab displays sorted matches in vertical columns. Lists of 100 or more matches ask `Display all N possibilities? (y or n)`. Long lists use `--More--` (Space for a page, Enter for one line, q to stop); declining or quitting preserves the command. Browser check: `node scripts/completion-check.mjs` (`LAB_URL` selects another local server).
