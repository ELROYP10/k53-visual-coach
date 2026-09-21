const CACHE_NAME = 'k53-visual-coach-v2'
const APP_SHELL = [
  '/',
  '/site.webmanifest',
  '/favicon.svg',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
          }
          return response
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  if (!['script', 'style', 'image', 'font', 'manifest'].includes(request.destination)) return

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        }
        return response
      })
      return cached || network
    }),
  )
})

self.addEventListener('push', (event) => {
  const fallback = {
    title: 'K53 Visual Coach',
    body: 'A short practice session today can keep your progress moving.',
    url: '/?dashboard=1',
  }
  let message = fallback

  try {
    message = { ...fallback, ...event.data.json() }
  } catch {
    if (event.data?.text()) message.body = event.data.text()
  }

  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
      icon: '/pwa-icon-192.png',
      badge: '/pwa-icon-192.png',
      tag: 'k53-daily-coach',
      renotify: false,
      data: { url: message.url },
      actions: [{ action: 'practice', title: 'Practise now' }],
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const destination = new URL(event.notification.data?.url || '/', self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const openClient = clients.find((client) => client.url.startsWith(self.location.origin))
      if (openClient) {
        openClient.navigate(destination)
        return openClient.focus()
      }
      return self.clients.openWindow(destination)
    }),
  )
})
