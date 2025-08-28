const CACHE_NAME = 'golden-basket-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/golden-basket-rounded.png',
];

// Install event - cache static files
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(STATIC_FILES);
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(handleDefaultRequest(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);

    // Cache successful GET responses
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Try to serve from cache if network fails
    console.error('API request failed:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for API calls
    return new Response(
      JSON.stringify({ error: 'Network error, please check your connection' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Static asset request failed:', error);
    // Return a default response for failed static assets
    if (request.url.includes('.css')) {
      return new Response('/* Offline */', {
        headers: { 'Content-Type': 'text/css' },
      });
    }
    if (request.url.includes('.js')) {
      return new Response('// Offline', {
        headers: { 'Content-Type': 'application/javascript' },
      });
    }
    return new Response('Offline', { status: 503 });
  }
}

// Handle navigation requests for SPA (Single Page Application)
async function handleNavigation(request) {
  const url = new URL(request.url);

  // For SPA with HashRouter, all routes should serve index.html
  // Only handle the root path and let React Router handle the rest
  if (url.pathname === '/' || url.pathname === '/index.html') {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      console.error('Navigation request failed:', error);
      // Try to serve from cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Return offline page
      return (
        caches.match('/offline.html') ||
        new Response(
          `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Offline - Golden Basket Mart</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: #f7fbe8;
              }
              .offline-container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 6px 24px rgba(163, 130, 76, 0.12);
              }
              .offline-icon {
                font-size: 64px;
                color: #a3824c;
                margin-bottom: 20px;
              }
              h1 { color: #2e3a1b; margin-bottom: 20px; }
              p { color: #7d6033; line-height: 1.6; }
              .retry-btn {
                background: #a3824c;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
              }
              .retry-btn:hover { background: #866422; }
            </style>
          </head>
          <body>
            <div class="offline-container">
              <div class="offline-icon">📱</div>
              <h1>You're Offline</h1>
              <p>It looks like you've lost your internet connection. Please check your network and try again.</p>
              <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
            </div>
          </body>
        </html>
        `,
          { headers: { 'Content-Type': 'text/html' } }
        )
      );
    }
  }

  // For all other paths (like /reset-password), serve index.html
  // This allows React Router to handle the routing
  try {
    const indexRequest = new Request('/', { method: 'GET' });
    const response = await fetch(indexRequest);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(indexRequest, response.clone());
    }
    return response;
  } catch (error) {
    console.error('SPA route request failed:', error);
    // Try to serve index.html from cache
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page as fallback
    return (
      caches.match('/offline.html') ||
      new Response(
        `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Golden Basket Mart</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f7fbe8;
            }
            .offline-container {
              max-width: 500px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 6px 24px rgba(163, 130, 76, 0.12);
            }
            .offline-icon {
              font-size: 64px;
              color: #a3824c;
              margin-bottom: 20px;
            }
            h1 { color: #2e3a1b; margin-bottom: 20px; }
            p { color: #7d6033; line-height: 1.6; }
            .retry-btn {
              background: #a3824c;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 20px;
            }
            .retry-btn:hover { background: #866422; }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">📱</div>
            <h1>You're Offline</h1>
            <p>It looks like you've lost your internet connection. Please check your network and try again.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
      `,
        { headers: { 'Content-Type': 'text/html' } }
      )
    );
  }
}

// Handle default requests with network-first strategy
async function handleDefaultRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Default request failed:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.includes('.css') ||
    url.pathname.includes('.js') ||
    url.pathname.includes('.png') ||
    url.pathname.includes('.jpg') ||
    url.pathname.includes('.jpeg') ||
    url.pathname.includes('.gif') ||
    url.pathname.includes('.svg') ||
    url.pathname.includes('.woff') ||
    url.pathname.includes('.woff2') ||
    url.pathname.includes('.ttf') ||
    url.pathname.includes('.eot')
  );
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync implementation
async function doBackgroundSync() {
  try {
    // Get pending actions from IndexedDB
    const pendingActions = await getPendingActions();

    for (const action of pendingActions) {
      try {
        await processPendingAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to process pending action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get pending actions from IndexedDB
async function getPendingActions() {
  // This would typically use IndexedDB to store pending actions
  // For now, return empty array
  return [];
}

// Process a pending action
async function processPendingAction(action) {
  // Implementation would depend on the action type
  // For example, adding to cart, placing order, etc.
  console.log('Processing pending action:', action);
}

// Remove a processed pending action
async function removePendingAction(actionId) {
  // Remove from IndexedDB
  console.log('Removing pending action:', actionId);
}

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/golden-basket-rounded.png',
    badge: '/golden-basket-rounded.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/golden-basket-rounded.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/golden-basket-rounded.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Golden Basket Mart', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(self.clients.openWindow('/'));
  }
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
