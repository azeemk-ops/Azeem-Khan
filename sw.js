
const CACHE_NAME = 'parchipay-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/data.ts',
  '/services/geminiService.ts',
  '/components/LoginScreen.tsx',
  '/components/AdminDashboard.tsx',
  '/components/MemberDashboard.tsx',
  '/components/CommitteeDetailView.tsx',
  '/components/DrawAnimation.tsx',
  '/components/Header.tsx',
  '/components/Icons.tsx',
  '/components/DrawHistoryScreen.tsx',
  '/components/Notification.tsx',
  '/components/CreateCommitteeScreen.tsx',
  '/components/ProfileScreen.tsx',
  '/components/Logo.tsx',
  '/components/Footer.tsx',
  '/icon.svg',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/react@^19.2.3',
  'https://esm.sh/react-dom@^19.2.3/client',
  'https://esm.sh/@google/genai@^1.3.4'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
