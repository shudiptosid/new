/**
 * Service Worker for Circuit Crafters
 * Provides offline support and asset caching
 */

const CACHE_NAME = "circuit-crafters-v2";
const RUNTIME_CACHE = "runtime-cache-v2";

// Assets to cache on install
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/favicon.svg",
  "/favicon-32x32.png",
  "/opengraph-image.png",
];

// Install event - cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Precaching assets");
      return cache.addAll(PRECACHE_ASSETS);
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - use network-first for page navigations and cache-first for static assets
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests (POST, PUT, DELETE) - don't cache them
  if (event.request.method !== "GET") {
    return;
  }

  // Skip Supabase and external API calls
  if (
    event.request.url.includes("supabase.co") ||
    event.request.url.includes("resend.com") ||
    event.request.url.includes("/api/")
  ) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(async () => {
          const cachedIndex = await caches.match("/index.html");
          return cachedIndex || Response.error();
        }),
    );
    return;
  }

  const isStaticAsset = ["script", "style", "image", "font"].includes(
    event.request.destination,
  );

  if (!isStaticAsset) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement your background sync logic here
  console.log("Service Worker: Syncing data");
}

// Push notification support
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New update available",
    icon: "/favicon-32x32.png",
    badge: "/favicon-32x32.png",
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification("Circuit Crafters", options),
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
