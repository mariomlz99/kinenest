# KineNest

Build it. Run it. Understand it.

[Open KineNest](https://kinenest.com/) · [Linux & Terminal](https://kinenest.com/linux.html) · [ROS 2 Basics](https://kinenest.com/basics.html)

Learn with a shared terminal, filesystem and editor. ROS 2 Basics has seven units, Python and C++, an optional robotics playground, and an ungraded Free Lab. TF & Odometry is coming soon, before Communication & QoS.

Workspaces and progress save in this browser. Export source for a portable backup. Running programs stop when you leave; restart them after reopening.

## Develop and check

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:8017/. Python and C++ runtimes download only when needed.

```sh
npm test
npm run build
npm run preview
```

Run the relevant browser checks before release; see [contributing](CONTRIBUTING.md). Deploy only `dist/`. Preserve previous versioned assets for open tabs. `npm run deploy` publishes the built site to the configured KineNest Worker.

[Supported behavior](docs/SUPPORTED.md) · [Modules](docs/MODULES.md) · [Architecture](docs/ARCHITECTURE.md) · [Interface provenance](docs/INTERFACES.md)
