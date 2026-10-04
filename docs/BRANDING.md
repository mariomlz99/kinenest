# Public identity

Product name: **KineNest**. Working name; no trademark clearance is claimed.

Tagline: A safe place to learn robotics by making things move.

Tone: technical, concise, academic, approachable. Use functional panel labels and direct tasks. Avoid generated-sounding enthusiasm, decorative emoji, unverified superlatives, competitor marketing and official-looking ROS branding. Language flags may supplement text labels.

Use an independent product brand to avoid confusion with the ROS trademark. ROS 2 is referenced descriptively for teaching; this is a trademark distinction, not a copyright prohibition. Preserve ROS 2 APIs, CLI commands, rclpy, tf2 and message identifiers. Use ROS 2 with a space in prose; lowercase ros2 is the executable.

The About page introduces ROS™ 2 once and states: ROS is a trademark of Open Source Robotics Foundation, Inc. KineNest is not affiliated with or endorsed by Open Robotics. See the [ROS trademark guidelines](https://www.ros.org/imgs/TrademarkRulesAndGuidelines2022.pdf). Do not imply full compatibility or endorsement.

Identity and shared navigation live in src/ui/product.js. The static build and browser use this configuration. Tutorial text is static. Translate UI, instructions and hints; preserve Python, ROS identifiers and technical output.

## Repository migration

The canonical public site is https://kinenest.com/ and the release migration targets https://github.com/mariomlz99/kinenest. The maintainer explicitly authorized this rename after the domain was verified. PRODUCT.source and PRODUCT.site define current public links; relative module/worker/lesson paths support the root domain and project subpaths. Deployment and rename evidence is recorded in RELEASE_KINENEST_COM.md. Further naming or hosting changes need explicit direction.

Technical legacy occurrences intentionally remain in ros2learn_interfaces, localStorage keys (to retain preferences), the educational ros2learn Python helper, test-profile prefixes and historical review evidence/attribution. They are not public product branding. Original attribution in NOTICE is retained.

Original code stays Apache-2.0. Dependencies retain their licences. The current release is free and open source; this document makes no permanent commercial-use restriction.

Creator: Mario Malizia. Attribution: development assistance from ChatGPT by OpenAI; neither a partnership nor endorsement. The shared footer links the creator, ChatGPT and OpenAI without using an OpenAI logo. No university logo is enabled in the public build. Institutional configuration defaults to disabled.

UI languages: EN NL FR ES DE PT IT. Keep small flags with full language names. The Belgium flag is also allowed in the understated footer; other decorative emoji are excluded.

The maintainer supplied logo.png. scripts/brand-assets.py derives the full image, transparent robot icon, favicon and social card without modifying the original. The source hash and crop are recorded in public/assets/brand/source.json. The Py and C++ marks are original text badges, not claimed official language logos.

The final tagline refers to repeatable learning and easy Reset, not a safety certification. About explains Kine (kinematics/motion) and Nest (a place to begin). Transparent light/dark logo derivatives follow the application data-theme; robot, axes and teal Nest retain the supplied artwork. Only the dark Kine wordmark and the newly typeset tagline use light ink. The reproducible Pillow pipeline uses system DejaVu Sans for the new tagline; no font file is bundled. The original source is read-only. The header icon and favicon remain unchanged.

Support is optional: a plain external link to PRODUCT.support with noopener/noreferrer, accompanied by an original monochrome cup SVG. No Buy Me a Coffee logo, widget, tracker, access gate or tax-deductibility claim is included.
