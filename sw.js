// Service worker: makes the site installable as an app and lets it open without a connection.
// The app itself is network-first, so every deploy shows up on the next launch; the cached copy is
// only used when the network fails. Card images and fonts are kept once loaded, so a board you've
// built still shows its cards offline. Scryfall searches (api.scryfall.com) always go to the network.

const SHELL_CACHE = "board-tracker-v1";
const ASSET_CACHE = "board-tracker-assets-v1";
const SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];
// card images, Google Fonts and the Mana icon font (pinned version) never change at a given URL, so they're served from the cache first
const ASSET_HOSTS = ["cards.scryfall.io", "fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const keep = [SHELL_CACHE, ASSET_CACHE];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (ASSET_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(req).then((hit) => hit || fetch(req).then((res) => {
          // card images load as opaque (no-cors) responses; those are fine to keep too
          if (res.ok || res.type === "opaque") cache.put(req, res.clone());
          return res;
        }))
      )
    );
    return;
  }

  // Only the site's own files beyond this point; everything else (Scryfall searches) goes straight to the network.
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("/index.html") : Response.error())))
  );
});
