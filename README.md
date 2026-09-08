# Here and There

Live time and weather in two places at once — built to keep track of what time it is and what it's like where someone you care about is.

**→ [chadlxvi.github.io/here-and-there](https://chadlxvi.github.io/here-and-there/)**

## What it shows

- **Two live clocks**, in 12-hour and 24-hour at the same time
- **Current weather** in °F and °C together — conditions, feels-like, today's high and low, wind
- **A live sky** on each card: night, dawn, day and dusk, with the sun or moon on its real arc for that city's daylight hours
- **The time difference**, and whether right now is a reasonable hour to call in both places
- **Sunrise and sunset** for each city
- **A 24-hour strip** showing both days lined up on the same absolute timeline, with the hours you're both awake marked in green

Either city can be changed at any time — search any city worldwide. Your two picks and your recent cities are remembered in your own browser.

## Install it

It's a progressive web app, so it installs without any app store:

- **iPhone / iPad** — open the link in Safari, tap Share, then **Add to Home Screen**
- **Android** — open in Chrome and take the **Install app** prompt, or Menu → Add to Home screen
- **Desktop Chrome / Edge** — install icon at the right end of the address bar

Installed, it launches full screen with its own icon and no browser chrome.

## Offline

A service worker caches the page itself, so it opens with no connection at all and the clocks keep running — they're pure browser math, no network needed.

Weather is deliberately **not** cached. Showing a stale temperature as if it were current would be misleading, so offline those requests simply fail and the page says the weather is unavailable while the clocks stay correct.

## How it works

One HTML file plus a manifest, a service worker, and three icons. No build step, no framework, no server, no API key, no tracking.

- Weather and city search come from [Open-Meteo](https://open-meteo.com/), which is free and needs no key
- Clocks and time-zone math use the browser's own `Intl` API, so daylight saving is handled correctly on both ends
- The clocks keep running with no network — only the weather needs a connection
- First-time visitors open on their own time zone; after that it remembers what they chose

## Updating it

Replace `index.html` and commit. GitHub Pages redeploys in about a minute at the same URL.

To run it without GitHub at all, download `index.html` and open it — it works from a local file just as well.
