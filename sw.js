let cache_name = "v1";

let delete_caches = function (event) {
    return event.waitUntil(
        caches.keys()
              .then(function (cacheNames) {
                  return cacheNames
                      .filter(function (cacheName) {
                          return cacheName !== cache_name;
                      })
                      .map(function (cacheName) {
                          return caches.delete(cacheName);
                      });
              })
    );
};
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cache_name)
              .then(function (cache) {
                  return cache.addAll(
                      [
                          '/',
                          '/index.html',
                          '/sw.js',
                          '/js/main.js',
                          '/css/styles.css',
                          '/img/',
                '//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css',
                          '/restaurant.html',
                          '/data/restaurants.json'
                      ]
                  );
              })
    );
});

self.addEventListener('activate', function (event) {
    return delete_caches(event);
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
              .then(function (response) {
                  // comments from Mozilla MDN
                  // caches.match() always resolves
                  // but in case of success response will have value
                  if (response !== void 0) {
                      return response;
                  } else {
                      return fetch(event.request)
                          .then((response) => {
                              let responseClone;
                              // response may be used only once
                              // we need to save clone to put one copy in cache
                              // and serve second one
                              if (response && response.url) {
                                  responseClone = response.clone();
                                  caches
                                      .open(cache_name)
                                      .then((cache) => {
                                                cache.put(event.request, responseClone);
                                            }
                                      );
                              }
                              return response;
                          }).catch(function (err) {
                              console.log(err);
                              return response
                          });
                  }
              }));
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        return this.skipWaiting();
    }
});
