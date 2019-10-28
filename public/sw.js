const VERSION = 4;
const CACHE_NAME = 'cache_v' + VERSION;
const publicVapidKey = 'BPf0lj1Oa2hVbTl1u5w5RlBw7c_H71k96EYxnjUNhBACQkou6jF6VU-Bg5aYtMvS6EdoG07GMd7kLXpiBccWdJ8';
const CACHE_URLS = [
    '/',
    '/user/list',
    'index.js',
    'manifest.json',
    '/img/logo.png ',
    'js/vue.js',
    'js/axios.js',
];
function saveToCache(req, res) {
    return caches
        .open(CACHE_NAME)
        .then(cache => cache.put(req, res));
}
async function cacheFirst(req) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    return cached || fetch(req);
}
async function networkFirst(req) {
    try {
        const fresh = await fetch(req);
        saveToCache(req, fresh.clone());
        return fresh;
    } catch (error) {
        const cached = await cache.match(req);
        return cached;
    }

}
async function networkAndCache(req) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const fresh = await fetch(req);
        saveToCache(req, fresh.clone());
        return fresh;
    } catch (error) {
        const cached = await cache.match(req);
        return cached;
    }
}
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = this.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
function askPermission() {
    return new Promise(function (resolve, reject) {
        const permissionResult = self.Notification.requestPermission(function (result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function (permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}
async function sendMessage() {
    console.log('send ...')
    try {
        const options = {}
        const subscription = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        })
        console.log('send push ...');
        const result = await fetch('/subscribe', {
            method: 'post',
            body: JSON.stringify(subscription),
            headers: {
                'content-type': 'application/json'
            }
        })
        console.log(result);
        console.log('push send ...')

    } catch (err) {
        console.log('Error', err)
    }
}
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS)))
    console.log('instll ...')
    self.skipWaiting()
})
self.addEventListener('activate', async event => {
    console.log('activate ...');
  
    event.waitUntil(
    caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key !== CACHE_NAME) {
                console.log('[ServiceWorker] Removing old cache', key);
                return caches.delete(key);
            }
        }));
    })
   );
    self.clients.claim();

})
self.addEventListener('fetch', event => {
    if (new URL(event.request.url).origin !== self.origin) {
        return;
    }
    if (event.request.url.includes('/user/list')) {
        event.respondWith(networkAndCache(event.request));
        return;
    }
    event.respondWith(cacheFirst(event.request));

})
self.addEventListener('message', async event => {
    console.log('message ...');
    console.log(event);
    if (event.data === 'send-data') {
        sendMessage();
    }
})
self.addEventListener('push', async event => {
    console.log('push ...');
    const title = '测试消息推送';
    const options = {
        body: '我是PWA消息推送'
    };
    registration.showNotification(title, options);
})
