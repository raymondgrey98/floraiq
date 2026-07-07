/* FloraIQ Service Worker — offline-first PWA
 *
 * Strategy:
 *  - App shell (HTML navigations): network-first, fall back to cached shell when offline
 *  - Hashed build assets (/assets/*): cache-first (immutable, safe forever)
 *  - Icons / manifest: cache-first
 *  - Map tiles + external species photos: stale-while-revalidate, capped cache
 *  - /api/* GET (weather, forage, species): network-first with cache fallback,
 *    so the last weather forecast / species data still shows in the jungle
 *  - All other API calls (POST identify, chat, etc.): network only
 */

const VERSION = "floraiq-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const API_CACHE = `${VERSION}-api`;
const IMG_CACHE = `${VERSION}-img`;

const SHELL_URLS = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png"];

const IMG_CACHE_LIMIT = 200; // map tiles + species photos

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    return trimCache(cacheName, maxEntries);
  }
}

function isImageOrTile(url) {
  return (
    /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(url.pathname) ||
    url.hostname.includes("tile.openstreetmap.org") ||
    url.hostname.includes("arcgisonline.com") ||
    url.hostname.includes("inaturalist") ||
    url.hostname.includes("gbif.org") && url.pathname.includes("media")
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never cache POST/PUT (identify, chat, sync)

  const url = new URL(req.url);

  // 1. Page navigations → network-first, offline fallback to cached shell
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((c) => c.put("/", copy));
          return res;
        })
        .catch(() => caches.match("/", { cacheName: SHELL_CACHE }))
    );
    return;
  }

  // 2. Hashed build assets → cache-first (immutable filenames)
  if (url.origin === self.location.origin && url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(ASSET_CACHE).then((c) => c.put(req, copy));
            return res;
          })
      )
    );
    return;
  }

  // 3. Icons + manifest → cache-first
  if (url.origin === self.location.origin && (url.pathname.startsWith("/icons/") || url.pathname.endsWith(".webmanifest"))) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
            return res;
          })
      )
    );
    return;
  }

  // 4. API GETs → network-first, cached fallback when offline
  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(API_CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req, { cacheName: API_CACHE }))
    );
    return;
  }

  // 5. Map tiles + external species images → stale-while-revalidate
  if (isImageOrTile(url)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const refresh = fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(IMG_CACHE).then((c) => {
                c.put(req, copy);
                trimCache(IMG_CACHE, IMG_CACHE_LIMIT);
              });
            }
            return res;
          })
          .catch(() => hit);
        return hit || refresh;
      })
    );
  }
});
