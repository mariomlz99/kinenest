# BASICS release — 2026-10-07

One landing page, six BASICS units and a separate playground replace the previous implementations. Seven languages, local browser saving, source export and KineNest branding are included. Actions supports Python/C++ servers and clients, feedback, results, rejection and cancellation.

Validation: 35 unit tests; real browser runtime checks; full visible Python and C++ walkthroughs; all four Python/C++ Actions combinations with success and cancellation; seven-language, desktop/mobile layout, save/reload and source export checks. The same Actions examples were also compiled and exercised internally on ROS 2 Jazzy in all four language combinations, including cancellation.

Browser transport and shell remain bounded models. See SUPPORTED.md. Browser storage is local to each site origin and profile; accounts and cloud synchronization are future work.
