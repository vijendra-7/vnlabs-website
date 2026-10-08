const CACHE_NAME = 'vnlabs-pdf-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  '../styles.css',
  '../favicon.png',
  'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200 && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(cached => cached || (e.request.mode === 'navigate' ? caches.match('./index.html') : null)))
  );
});
