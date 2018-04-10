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
                          '/restaurant.html',
                          '/data/restaurants.json',
                          'restaurant.html?id=1',
                        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
                          'restaurant.html?id=2',
                          'restaurant.html?id=3',
                          'restaurant.html?id=4',
                          'restaurant.html?id=5',
                          'restaurant.html?id=6',
                          'restaurant.html?id=7',
                          'restaurant.html?id=8',
                          'restaurant.html?id=9',
                          'restaurant.html?id=10'
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
                  if (response !== void 0) {
                      return response;
                  } else {
                      return fetch(event.request)
                          .then((response) => {
                              let responseClone;
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



