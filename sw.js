/* Here and There — service worker.
 *
 * Job: make the page open with no connection. The clocks are pure browser
 * math, so once the shell is cached the app is fully usable offline.
 *
 * Deliberately NOT cached: anything from open-meteo.com. Serving a stale
 * temperature as if it were current would be a lie. Offline, those requests
 * fail and the page shows its own "weather unavailable, clocks still correct"
 * state, which is the truth.
 */

var CACHE = "here-and-there-v6";

var SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png"
];

var FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      // addAll is all-or-nothing; add individually so one 404 can't break install
      .then(function (c) {
        return Promise.all(SHELL.map(function (u) {
          return c.add(u).catch(function () {});
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Weather and city search: live or not at all.
  if (url.hostname.indexOf("open-meteo.com") !== -1) return;

  // The page itself: network first, so a new deploy is picked up straight
  // away when online, and the cached copy answers when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
          return res;
        })
        .catch(function () {
          return caches.match("./index.html").then(function (hit) {
            return hit || caches.match("./");
          });
        })
    );
    return;
  }

  // Icons, manifest, fonts: cache first, they don't change between deploys.
  var cacheable = url.origin === self.location.origin ||
                  FONT_HOSTS.indexOf(url.hostname) !== -1;

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (cacheable && (res.ok || res.type === "opaque")) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
