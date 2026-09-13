# Here and There

Live time and weather in two places at once — built to keep track of what time it is, what it's like, and when you can actually reach someone you care about.

**→ [chadlxvi.github.io/here-and-there](https://chadlxvi.github.io/here-and-there/)**

## What it shows

- **Two live clocks**, in 12-hour and 24-hour at the same time
- **Current weather** in °F and °C together — conditions, feels-like, today's high and low, wind
- **A live sky** on each card: night, dawn, day and dusk, with the sun or moon on its real arc for that city's daylight hours, and a plain-English label for the moment of day (Early morning, Before sunrise, Morning, Afternoon, Sunset, Evening, Night)
- **Sunrise and sunset** for each city, plus when that city's weather was last fetched
- **A call status line** that says in plain words whether to pick up the phone, with a live countdown to the next window
- **A "When to call" chart** — the next 24 hours for both cities, with the hours you can reach each other in between them
- **The time difference** between the two

Either city can be changed at any time — search any city worldwide. Your two picks and your recent cities are remembered in your own browser.

## When to call

This is the part the page exists for. Three bars stacked on one timeline:

- **Top and bottom** — each city's own day. Bright yellow while the sun is up, dark orange after it sets, with a sun and a moon marking the middle of each stretch. Each bar has its own hour axis, because the two cities are on different clocks.
- **The middle bar** — whether a call is possible. Three shades of green for three grades of "awake enough to pick up", and faint red for the hours somebody is asleep.
- **A purple line** marks right now.

The three green tiers are one table in the source, and the status line above reads from the same table — so the words, the countdown and the chart can't drift apart:

| Tier | Local hours, both cities | Meaning |
| --- | --- | --- |
| Brightest green | 8:00 am – 8:30 pm | Comfortable for both |
| Mid green | 6:45 am – 10:00 pm | A bit early or a bit late |
| Faint green | 6:00 am – 11:00 pm | The early-morning and late-evening stretch |
| Faint red | outside all of the above | Someone is asleep |

The status box works out the exact intersection of the two cities' windows rather than scanning hour by hour, so it gives real clock times on both ends ("Wait 58m and it's 9:00 PM in Olympia and 6:00 AM in Angers") instead of rounding to the nearest hour. The glow behind it is the band's current block blown up: whichever of the three greens the NOW line is standing on, or red when nobody is reachable.

## Install it

It's a progressive web app, so it installs without any app store:

- **iPhone / iPad** — open the link in Safari, tap Share, then **Add to Home Screen**
- **Android** — open in Chrome and take the **Install app** prompt, or Menu → Add to Home screen
- **Desktop Chrome / Edge** — install icon at the right end of the address bar

Installed, it launches full screen with its own icon and no browser chrome.

## Offline

A service worker caches the page itself, so it opens with no connection at all and the clocks keep running — they're pure browser math, no network needed.

Weather is deliberately **not** cached. Showing a stale temperature as if it were current would be misleading, so offline those requests simply fail and each card says its weather is unavailable while the clocks stay correct.

## How it works

One HTML file plus a manifest, a service worker, and three icons. No build step, no framework, no server, no API key, no tracking.

- Weather and city search come from [Open-Meteo](https://open-meteo.com/), which is free and needs no key
- Clocks and time-zone math use the browser's own `Intl` API, so daylight saving is handled correctly on both ends
- The clocks keep running with no network — only the weather needs a connection
- First-time visitors open on their own time zone; after that it remembers what they chose
- Skies are drawn on a `<canvas>`; the timeline bars are plain CSS
- Type is Archivo for the interface, IBM Plex Mono for clocks and figures, and Young Serif for the wordmark, all from Google Fonts
- Light and dark themes both follow the system setting

## Updating it

Replace `index.html` and commit. GitHub Pages redeploys in about a minute at the same URL.

**Bump `CACHE` in `sw.js` in the same commit** (`here-and-there-v13` → `v14`). The service worker serves the cached copy first, so without a new cache name anyone who has already opened the page keeps getting the old one.

To run it without GitHub at all, download `index.html` and open it — it works from a local file just as well.
