const CACHE_NAME = 'nurtura-cache-v2';

// Core routes and shell assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/calculator',
  '/bmi',
  '/age',
  '/calendar',
  '/baby',
  '/tracking',
  '/journal',
  '/appointments',
  '/checklist',
  '/hospital-bag',
  '/names',
  '/faq',
  '/settings',
  '/more',
  '/offline',
  '/manifest.json',
  '/icon.svg',
];

// 1. Install event: pre-cache application shell & skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Use individual adds so a single route failure doesn't abort the entire install
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[SW] Pre-caching asset skipped (${url}):`, err.message);
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activate event: clean up outdated caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. Fetch event: optimal offline-first caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET, extension requests, or non-http protocols
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // A. Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;

          // If specific route not cached yet, try matching path without query or fallback to /offline
          const offlineFallback = await caches.match('/offline');
          if (offlineFallback) return offlineFallback;

          const rootFallback = await caches.match('/');
          if (rootFallback) return rootFallback;

          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Nurtura Offline</title></head><body style="background:#07111F;color:#F5F8FA;font-family:sans-serif;padding:2rem;text-align:center;"><h1>Nurtura Offline</h1><p>Your app is loaded and your data is safe on this device.</p><a href="/" style="color:#00C99A;">Go to Dashboard</a></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // B. Next.js static assets (_next/static/*) are immutable with content hashes -> Cache First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // C. Local static assets (icons, manifest, svgs) -> Stale While Revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.json') ||
      url.pathname.endsWith('.ico'))
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // D. Default Network First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});

// 4. Message event for manual update triggers
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
