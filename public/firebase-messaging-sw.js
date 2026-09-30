// Firebase Cloud Messaging Background Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  projectId: "skilful-beach-p5p7n",
  appId: "1:654509445805:web:e4229ce6372e967bacac24",
  apiKey: "AIzaSyCoi3KbrOT563cdOlx7GvnO2MdIjyOaHZM",
  authDomain: "skilful-beach-p5p7n.firebaseapp.com",
  messagingSenderId: "654509445805"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const notificationTitle = payload.notification?.title || '🚨 CareReach Doctor Match Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'A nearby verified doctor has accepted your emergency request.',
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    tag: 'doctor-match',
    data: payload.data || {},
    actions: [
      { action: 'open_consultation', title: 'Open Triage' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/student/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes('/student') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
