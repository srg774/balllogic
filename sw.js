// ==========================================
// 1. COI - SharedArrayBuffer Enabler Logic
// ==========================================
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate" || 
       (event.request.mode === "no-cors" && event.request.destination === "script")) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response.status === 0) return response;

                    const newHeaders = new Headers(response.headers);
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => console.error(e))
        );
    }
});

// ==========================================
// 2. PWA - Asset Caching Logic
// ==========================================
const CACHE_NAME = 'ball-logic-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './game.js',
  './love.js',
  './love.wasm',
  './game.data',
  './android-chrome-512x512.png'
];

// Append assets to cache without conflicting with COI installs
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use setting to quietly gather resources
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.log("Cache item missing: ", err));
    })
  );
});
