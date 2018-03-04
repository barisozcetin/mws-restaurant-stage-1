// Caching static assets at install process

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('static')
      .then(function(cache) {
        console.log('[Service Worker] Caching static assets');
        cache.addAll([
          '/',
          '/index.html',
          '/js/main.js',
          '/js/dbhelper.js',
          '/js/restaurant_info.js',
          '/css/styles.css'
          // 'https://normalize-css.googlecode.com/svn/trunk/normalize.css',
        ]);
      })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  return self.clients.claim();
});


// First checking cache for matching response. If not fetching and putting a clone in dynamic cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open('dynamic')
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            });
        }
      })
  );
});