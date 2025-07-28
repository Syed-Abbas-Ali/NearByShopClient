importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyC5EJ8Ehnk1CwmOS8kPCjSltMKsJSIUs38",
  authDomain: "testing-f97c1.firebaseapp.com",
  projectId: "testing-f97c1",
  storageBucket: "testing-f97c1.appspot.com",
  messagingSenderId: "344233100530",
  appId: "1:344233100530:web:f6460a21c28904f1287c6b",
  measurementId: "G-2FZM6CGFDV",
});

const messaging = firebase.messaging();

// Show Notification Helper
function showNotification(title, options) {
  return self.registration.showNotification(title, {
    icon: options.icon || "https://your-actual-domain.com/vite.svg",
    badge: options.badge || "https://your-actual-domain.com/vite.svg",
    ...options,
  });
}

// Handle Background Message
messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Background message received", payload);

  const notification = payload.notification || {};
  const data = payload.data || {};
  console.log("msggggg");
  console.log(payload?.data?.roomId);
  const title = notification.title || data.title || "New Notification";
  const body = notification.body || data.body || "";
  const icon = notification.icon || data.icon;
  const badge = notification.badge || data.badge;
  const click_action =
    notification.click_action ||
    data.click_action ||
    "https://your-actual-domain.com/";
  const sender = data.sender || "";
  const type = data.type || "default";

  const options = {
    body,
    icon,
    badge,
    data: {
      url: click_action,
      sender,
      type,
    },
    actions: [
      { action: "open-chat", title: "Open Chat" },
      { action: "dismiss", title: "Dismiss" },
    ],
    requireInteraction: true,
    tag: "chat-notification",
    renotify: true,
    vibrate: [200, 100, 200],
  };

  showNotification(title, options)
    .then(() => console.log("[Service Worker] Notification displayed"))
    .catch((err) =>
      console.error("[Service Worker] Notification display failed:", err)
    );
});

// Handle Notification Click
self.addEventListener("notificationclick", function (event) {
  console.log(
    "[Service Worker] Notification click received:",
    event.notification.data
  );

  event.notification.close();

  const targetUrl = payload?.data?.roomId
    ? `https://waytoshops.com/chat${payload?.data?.roomId}`
    : "https://waytoshops.com/chat";
  // const targetUrl = event.notification.data?.url ||'https://waytoshops.com/login';

  if (event.action === "open-chat" || !event.action) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((windowClients) => {
          for (let client of windowClients) {
            if (client.url.includes(targetUrl) && "focus" in client) {
              return client.focus();
            }
          }
          return clients.openWindow(targetUrl);
        })
    );
  }
});
