# Cloudflare release setup

The maintainer selected **Workers Builds with Static Assets** on 4 October 2026. This supersedes the earlier Pages target. KineNest still serves static files and runs Python/C++ in the student's browser; no application Worker, database or server-side compiler is added.

## Dashboard settings

| Field | Value |
| --- | --- |
| Project / Worker name | `kinenest` |
| Repository | `mariomlz99/ros2learn` until the verified rename |
| Production branch | `main` |
| Root directory | repository root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler preview` |
| Node | 22 or newer |

Wrangler 4.147.0 is pinned in package.json and package-lock.json. Workers Builds installs dependencies. For a local checkout, run `npm ci` first. Deployment tooling stays outside dist and is never downloaded by students.

The [current Workers Builds documentation](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/) supports these deploy/preview commands. Do not click Deploy until the required GitHub checks pass for the intended SHA.

## What the committed configuration does

`wrangler.jsonc` names the static Worker and serves only `./dist`. It has no account ID, credentials, domain routes or application script. HTML handling is disabled to preserve explicit lesson .html URLs; unknown paths return 404. The root-only `_redirects` rewrite serves index.html at / without redirecting lesson URLs. Without that rewrite, / returns 404 with HTML handling disabled. This was reproduced against actual local Wrangler.

The compatibility date is pinned to 2026-10-01, supported by the installed workerd build. Local Brussels calendar dates can be a day ahead of UTC; the initial 2026-10-04 date was rejected by workerd and corrected before publishing.

Verify locally:

~~~bash
npm ci
npm test
npm run build
npx wrangler deploy --dry-run
node scripts/check-worker-assets.mjs
~~~

The routing test checks all public pages, runtime assets and real 404s using Wrangler's local server. The [Cloudflare HTML routing documentation](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/) explains the explicit HTML behavior.

## Release sequence

1. Finish local acceptance, push and require green GitHub Actions for main: unit/build, complete Python Chrome/Firefox, real C++ Chrome/Firefox, responsive checks, visible transitions and root-path smoke.
2. Deploy that SHA to the temporary workers.dev host. Share the actual URL; do not guess the account subdomain.
3. Test the temporary URL in both browsers:

~~~bash
node scripts/check-deployed.mjs chrome --url=https://ACTUAL-WORKER-HOST/ --commit=FULL_SHA
node scripts/check-deployed.mjs firefox --url=https://ACTUAL-WORKER-HOST/ --commit=FULL_SHA
node scripts/check-transitions.mjs chrome --url=https://ACTUAL-WORKER-HOST/
node scripts/check-transitions.mjs firefox --url=https://ACTUAL-WORKER-HOST/
~~~

4. Attach kinenest.com only after those pass. Verify HTTPS, all pages, real Python/C++, visible transitions and build-info on the domain. Add www as a custom domain and configure a host-specific redirect to the apex, preserving path/query. Do not redirect preview hosts.
5. Rename the existing GitHub repository to kinenest only after the replacement site is verified. GitHub [does not redirect project-site URLs after a repository rename](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository); this ordering preserves the working development site until the replacement exists.
6. Update PRODUCT.site/source, README, source links, canonicals/OpenGraph, repository description, Git remote and the Cloudflare Git connection. Rebuild, rerun URL-sensitive tests and verify the new deployment identity. Keep history and the old known-good artifact. Tag only after actual domain validation.

Workers Builds rebuilds the selected commit; its build timestamp may differ from the CI artifact. Verify the same commit and application assetVersion. Do not describe an independently rebuilt artifact as byte-identical. The GitHub workflow retains the tested dist artifact for comparison/rollback.

Git-connected Workers Builds is independent of GitHub Actions: it does not automatically wait for this workflow. For initial launch use the requested manual wait-for-green sequence. Before enabling unattended production pushes, protect main with the browser checks and merge only tested revisions, or move publication into a post-CI upload workflow. Do not assume concurrent build triggers provide a deployment gate.

## Identity retained pending migration

Public branding is KineNest. The current site/source URLs remain the working GitHub URLs until the replacement is verified. Legacy storage keys retain student preferences; ros2learn and ros2learn_interfaces educational Python/message identifiers remain compatibility interfaces. Historical review evidence stays unchanged and excluded from dist. The private npm package name can change safely with the eventual repository-identity commit.

No R2 migration, runtime-host migration, analytics, domain route, contact backend or new course feature is part of this configuration.

## Boot-experience preview (4 October 2026)

The apex domain is already attached. At the start of this pass, both
`https://kinenest.com/` and the normal
`https://kinenest.malizia-mario99.workers.dev/` served commit
`63bb5ff8c2dfb3d234fe87bcc0144b400f9245ff`. The older sequence above records the
initial launch; do not detach the working domain to repeat it.

The new welcome/boot work must use an isolated branch Preview before merging.
Publishing to the regular workers.dev address updates the same production
Worker and would also change the apex.

After local and GitHub checks pass, from branch `boot-experience`:

~~~bash
npm ci
npm run build
npx wrangler preview
~~~

Use the actual Preview URL returned by Cloudflare; verify its build-info SHA
and assetVersion. The empty `previews` block enables branch previews; static
assets and compatibility date remain top-level configuration, as specified in
[Cloudflare's preview configuration](https://developers.cloudflare.com/workers/previews/configuration/).
No application Worker or backend is needed.

Run the deployed smoke, outgoing transitions and destination boot tests against
that URL in Chrome and Firefox. Mario must then review landing → Session 1,
Session 1 → 2 and Session 2 → 3 for visible flashes. Keep main unchanged until
that explicit visual approval. PR #2's identity migration is on hold until this
new experience is approved.

The root now serves the welcome page; Session 1 is `/session-01.html`.
Unknown paths must still return 404. The existing domain attachment does not
prove the new build is ready, and neither responsive emulation nor Chromium
screenshots establishes Safari/iOS support.
