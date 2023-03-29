function log(...data) {
    console.log("SWv1.1", ...data);
  }
  
  log("SW Script executing");
  
  
  const STATIC_CACHE_NAME = 'spotifysocialize-static-v0';
  
  self.addEventListener('install', event => {
    log('install', event);
    event.waitUntil(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return cache.addAll([
            '/',
            //   '/offline',
            //CSS
            '/css/about.css',
            '/css/contact.css',
            '/css/home.css',
            '/css/login.css',
            '/css/logout.css',
            '/css/styles.css',
            //Images
            '/img/logo.png',
            '/img/musicapp.jpg',
            '/img/SoundWave.jpg',
            '/img/spotifyIcon.jpg',
            //Scripts
            '/js/APIClient.js',
            '/js/common.js',
            '/js/home.js',
            '/js/HTTPClient.js',
            '/js/Login.js',
            '/js/Logout.js',
            //External Resources
            'https://unpkg.com/leaflet@1.9.1/dist/leaflet.css',
            'https://unpkg.com/leaflet@1.9.1/dist/leaflet.js',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'
        ]);
      })
    );
  });
  
  self.addEventListener('activate', event => {
    log('activate', event);
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('spotifysocialize-') && cacheName != STATIC_CACHE_NAME;
          }).map(cacheName => {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    var requestUrl = new URL(event.request.url);
    //Treat API calls (to our API) differently
    if(requestUrl.origin === location.origin && requestUrl.pathname.startsWith('/api')) {
      //If we are here, we are intercepting a call to our API
      if(event.request.method === "GET") {
        //Only intercept (and cache) GET API requests
        event.respondWith(
          cacheFirst(event.request)
        );
      }
    }
    else {
      //If we are here, this was not a call to our API
      event.respondWith(
        cacheFirst(event.request)
      );
    }
  
  });
  
  
  function cacheFirst(request) {
    return caches.match(request)
    .then(response => {
      //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch(error => {
      return caches.match('/offline');
    })
  }
  
  
  
  function fetchAndCache(request) {
    return fetch(request).then(response => {
      if(response.ok) {
        caches.open(STATIC_CACHE_NAME).then((cache) => {
          cache.put(request, response);
        });
      }
      return response.clone();
    });
  }
  
  
  
  self.addEventListener('message', event => {
    log('message', event.data);
    if(event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });