/// <reference lib="webworker" />

import { immutable, assets as staticFiles } from "$app/manifest";
import { version } from "$app/env";
import { asset } from "$app/paths";

const worker = self as unknown as ServiceWorkerGlobalScope;
const FILES = `cache${version}`;

// SvelteKit 3 removed `$service-worker`. `immutable` is everything generated
// by the bundler, with paths relative to the worker's scope; `assets` is
// everything in the `static` directory, which needs `asset()` to pick up the
// configured base/assets prefix.
const to_cache = [
  ...immutable.map(({ path }) => path),
  ...staticFiles.map(({ path }) => asset(path)),
];
const staticAssets = new Set(
  to_cache.map((path) => new URL(path, worker.location.href).pathname)
);

worker.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(FILES)
      .then((cache) => cache.addAll(to_cache))
      .then(() => {
        worker.skipWaiting();
      })
  );
});

worker.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      // delete old caches
      for (const key of keys) {
        if (key !== FILES) await caches.delete(key);
      }

      worker.clients.claim();
    })
  );
});

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
  const cache = await caches.open(`offline${version}`);

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const response = await cache.match(request);
    if (response) return response;

    throw err;
  }
}

worker.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range"))
    return;

  const url = new URL(event.request.url);

  // don't try to handle e.g. data: URIs
  const isHttp = url.protocol.startsWith("http");
  const isDevServerRequest =
    url.hostname === self.location.hostname && url.port !== self.location.port;
  const isStaticAsset =
    url.host === self.location.host && staticAssets.has(url.pathname);
  const skipBecauseUncached =
    event.request.cache === "only-if-cached" && !isStaticAsset;

  if (isHttp && !isDevServerRequest && !skipBecauseUncached) {
    event.respondWith(
      (async () => {
        // always serve static files and bundler-generated assets from cache.
        // if your application has other URLs with data that will never change,
        // set this variable to true for them and they will only be fetched once.
        const cachedAsset =
          isStaticAsset && (await caches.match(event.request));

        return cachedAsset || fetchAndCache(event.request);
      })()
    );
  }
});
