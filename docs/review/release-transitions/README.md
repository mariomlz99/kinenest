# Release transition evidence

4 October 2026, clean browser profiles, production dist served at the domain root. The test server delays transitions.css by 600 ms. The stylesheet is now in initial HTML, before boot; every page initializes the shared handler exactly once.

Final clean candidate bdcf92a (asset version 784328576e05): outgoing dwell approximately one second in both browsers; reduced motion 9 ms in Chrome and 4 ms in Firefox. Exact timings are in chrome.json and firefox.json. Each regular navigation samples fixed full-viewport rendering, opaque theme-matched background, decoded icon and changing CSS animation at 100 and 450 ms. Back/Forward and first-destination ownership pass.

Screenshots captured around 330–500 ms show LiDAR beams, rotating red/green TF axes and robot yaw. They were visually inspected; page content no longer bleeds through. Full numeric results are alongside them. Five variants were exercised in each browser.

Reproduce:

~~~bash
node scripts/check-transitions.mjs chrome
node scripts/check-transitions.mjs firefox
# After a real deployment (not yet performed):
node scripts/check-transitions.mjs chrome --url=https://kinenest.com/
~~~

This is local production-build evidence, not proof of a kinenest.com deployment. Existing course transition tests additionally cover modified/external clicks, no-repeat selection, failure recovery and factual runtime loaders.

Additional workers-chrome.json and workers-firefox.json record all required routes, including Session 3 → 5, against the actual local Workers static-assets server. Both passed real Python/C++ smoke as well.
