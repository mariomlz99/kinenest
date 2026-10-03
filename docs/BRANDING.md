# Public identity

Product name: **KineNest**. Working name; no trademark clearance is claimed.

Tagline: Learn robotics by making things move.

Tone: technical, concise, academic, approachable. Use functional panel labels and direct tasks. Avoid generated-sounding enthusiasm, decorative emoji, unverified superlatives, competitor marketing and official-looking ROS branding. Language flags may supplement text labels.

Use an independent product brand to avoid confusion with the ROS trademark. ROS 2 is referenced descriptively for teaching; this is a trademark distinction, not a copyright prohibition. Preserve ROS 2 APIs, CLI commands, rclpy, tf2 and message identifiers. Use ROS 2 with a space in prose; lowercase ros2 is the executable.

The About page introduces ROS™ 2 once and states: ROS is a trademark of Open Source Robotics Foundation, Inc. KineNest is not affiliated with or endorsed by Open Robotics. See the [ROS trademark guidelines](https://www.ros.org/imgs/TrademarkRulesAndGuidelines2022.pdf). Do not imply full compatibility or endorsement.

Identity and shared navigation live in src/ui/product.js. The static build and browser use this configuration. Tutorial text is static. Translate UI, instructions and hints; preserve Python, ROS identifiers and technical output.

## Repository migration

The current GitHub repository and Pages path remain mariomlz99/ros2learn and /ros2learn/. A separately approved move to kinenest is recommended before broad promotion. Update PRODUCT.source and PRODUCT.site, documentation URLs, package metadata and CI references when migrating; relative module/worker/lesson paths already support any project subpath. Verify Pages settings, redirects and existing links after the move. Do not rename the repository automatically.

Technical legacy occurrences intentionally remain in ros2learn_interfaces, localStorage keys (to retain preferences), package metadata, test-profile prefixes, repository URLs and historical attribution. They are not public product branding. Original attribution in NOTICE is retained.

Original code stays Apache-2.0. Dependencies retain their licences. The current release is free and open source; this document makes no permanent commercial-use restriction.

Creator: Mario Malizia. Attribution: development assistance from ChatGPT by OpenAI; neither a partnership nor endorsement. The shared footer links the creator, ChatGPT and OpenAI without using an OpenAI logo. No university logo is enabled in the public build. Institutional configuration defaults to disabled.

UI languages: EN NL FR ES DE PT IT. Keep small flags with full language names. The Belgium flag is also allowed in the understated footer; other decorative emoji are excluded.

The maintainer supplied logo.png. scripts/brand-assets.py derives the full image, transparent robot icon, favicon and social card without modifying the original. The source hash and crop are recorded in public/assets/brand/source.json. The Py and C++ marks are original text badges, not claimed official language logos.
