// Firebase CDN Kütüphaneleri (Service Worker İçin)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Kendi Firebase Yapılandırma Bilgilerinizi Buraya Ekleyin
const firebaseConfig = {
  apiKey: "AIzaSyBA4p7d9V29RxyRuDBHxvRPNkaI0I2S8Gc",
  authDomain: "sliderr-cf880.firebaseapp.com",
  projectId: "sliderr-cf880",
  storageBucket: "sliderr-cf880.firebasestorage.app",
  messagingSenderId: "224372391962",
  appId: "1:224372391962:web:10a69dd1fbcaae61bd51a3"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Site kapalıyken veya arka plandayken gelen mesaj bildirimi
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Arka planda mesaj alındı: ', payload);

  const senderName = payload.data?.senderName || "Bir Kullanıcı";
  const notificationTitle = `${senderName} Kişisinden Gelen Bildirim!`;
  
  const notificationOptions = {
    body: payload.data?.messageText || "Sana yeni bir mesaj gönderdi.",
    icon: payload.data?.senderAvatar || '/icon.png',
    badge: '/icon.png',
    data: {
      url: payload.data?.chatUrl || '/index.html'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Bildirime tıklandığında sohbeti açma
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});