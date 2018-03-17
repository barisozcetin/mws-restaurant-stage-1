importScripts('/js/idb.js');
importScripts('/js/utils.js');
// Caching static assets at install process
const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Caching static assets');
        cache.addAll([
          '/',
          '/index.html',
          '/restaurant.html',
          '/offline.html',
          '/js/main.js',
          '/js/app.js',
          '/js/idb.js',
          '/js/dbhelper.js',
          '/js/utils.js',
          '/js/restaurant_info.js',
          '/css/styles.css'
          // 'https://normalize-css.googlecode.com/svn/trunk/normalize.css',
        ]);
      })
  )
});

// const dbPromise = idb.open('restaurants-store', 1, function(db) {
//   if (!db.objectStoreNames.contains('restaurants')) {
//     db.createObjectStore('restaurants', {keyPath: 'id'});
//   }
// })

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  return self.clients.claim();
});


// First checking cache for matching response. If not fetching and putting a clone in dynamic cache
self.addEventListener('fetch', function(event) {
  const dbUrl = 'http://localhost:1337/restaurants';
  if (event.request.url.includes(dbUrl)) {
    event.respondWith(fetch(event.request)
    .then(res => {
      const cloneRes = res.clone();
      cloneRes.json()
      .then(data => {
        for (const rest of data) {
          writeToIdb('restaurants', rest);
        }
      })
      return res;
    }))
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              }).catch(error => {
                console.error(error);
                return caches.match('/offline.html')
              })
          }
        })
    );
  }
});


// function readFromIdb(st) {
//   return dbPromise
//     .then(function(db) {
//       var tx = db.transaction(st, 'readonly');
//       var store = tx.objectStore(st);
//       return store.getAll();
//     });
// }