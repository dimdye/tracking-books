/*
 * Marginalia offline support. Your books are stored on the phone (IndexedDB),
 * not here — this only caches the app itself so it opens without a connection.
 * Bump VERSION whenever you upload a new index.html.
 */
const VERSION = "marginalia-v4";
const SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./favicon-32.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) =>
      // One file failing to download shouldn't stop the app from installing.
      Promise.all(SHELL.map((url) => cache.add(url).catch(() => {}))),
    ).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Book lookups always go to the network, never the cache.
  if (/googleapis\.com$/.test(url.hostname) && url.pathname.startsWith("/books")) return;
  if (url.hostname === "openlibrary.org") return;

  // The app page: try the network first so updates arrive, fall back offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put("./index.html", copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html").then((r) => r || caches.match("./"))),
    );
    return;
  }

  // Fonts, the barcode scanner library, icons and book covers: cache, refresh in the background.
  const cacheable = url.origin === self.location.origin ||
    ["fonts.googleapis.com", "fonts.gstatic.com", "unpkg.com", "books.google.com", "covers.openlibrary.org"].includes(url.hostname);
  if (!cacheable) return;
  event.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(req).then((hit) => {
        const net = fetch(req).then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()).catch(() => {});
          return res;
        }).catch(() => hit);
        return hit || net;
      }),
    ),
  );
});
