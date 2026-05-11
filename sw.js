const CACHE = 'quien-soy-v1';
const ASSETS = [
  '/Juego_Quien_Soy/',
  '/Juego_Quien_Soy/index.html',
  '/Juego_Quien_Soy/style.css',
  '/Juego_Quien_Soy/app.js',
  '/Juego_Quien_Soy/data.js',
  '/Juego_Quien_Soy/image/icon-192.png',
  '/Juego_Quien_Soy/image/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
