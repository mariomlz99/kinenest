# Retained production assets

`8ca10eaea252` is the immutable KineNest release from source commit
`b0fc740f9ae6a2247d0199c2f91b5cecab200b38`. Source/public files were recovered
from that commit; generated UI assets and their licence notice were downloaded
from that exact production asset URL.

The build retains these URLs so existing open tabs can load their matching
workers after a deployment. Do not edit archived code or overwrite a version.
New pages use only the newly generated asset version.

`434d388747d8` retains the built assets from source commit
`26f108024cddf9c659fd304498729739c0254dde` before the compact homepage update.

`2cf5a1771fb8` retains the built assets from source commit
`3186bdc5a04171d6ceecae64bf112776282d5da6` before the locked-card layout update.

`d30653551011` retains the built assets from source commit
`7c41a1ab21e7a4da89a0a6372ebd605e48337828` before filesystem metadata and progress updates.

Retained c883c8609911 for sessions open before daemon and completion updates.

`cd17da0cdcf0` retains the production assets from source commit
`1f2744e6975b6f60e1fc4e748453e68a51e9cab9` before the student-readiness release.
All 98 archived files were compared byte-for-byte with the live deployment.

`836933e97cf5` retains all 115 production assets from source commit
`c1fefa19268fcd818149f3246d2dd9400b8962d4` before the topic-info argument-order fix.
These files were also compared byte-for-byte with the live deployment.

`fdd7cb638f68` retains all 115 assets from production source commit
`2ae347acc02c98b3cfaa96715ce79c27f1bb78e3`, before Frames & TF.
Every file was downloaded read-only and compared byte-for-byte on 14 October
2026. `tests/fixtures/production-assets-fdd7cb638f68.json` pins their hashes;
clean CI builds must include this version for already-open production tabs.

`256f0889df58` retains the first 14 October TF & Odometry release from
`507a558424ac37e40368d1dbdc8811b0a946a20e`. All current and retained asset bodies
were verified against kinenest.com before the module-isolation correction.
Keep these URLs for users who opened the first release before that correction.
