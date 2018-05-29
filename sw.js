const cacheName = 'RapydSell-App';
const staticAssets = [
    './',
    './css/style.css',
    './index.html',
    './rapydsell.html',
    './adpost.html',
    './js/app.js',
    './media/favicon.ico',
    './media/slider1.jpg',
    './media/slider2.jpg',
    './media/1.png',
    './media/animation-intro.mp4'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(staticAssets);
        })
    );
})
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req))
    } else {
        event.respondWith(networkFirst(req))
    }
})

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res
    } catch (error) {
        return await cache.match(req)
    }
}
