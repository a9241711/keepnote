//Add notification click
self.addEventListener('notificationclick', function(event) {
  // console.log("ON notification Click")
  event.notification.close();
  const url = event.notification.data.click_action;
  event.waitUntil(clients.openWindow(url));

});

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig ={
    apiKey: "AIzaSyCWPZxWnposbvVw0WH_SUD7pqVEIueob-M",
    authDomain: "keepproject-e7d2b.firebaseapp.com",
    projectId: "keepproject-e7d2b",
    storageBucket: "keepproject-e7d2b.appspot.com",
    messagingSenderId: "985196186017",
    appId: "1:985196186017:web:ceb9af7979df44ec48a3e0",
};




firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  // console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    data: {
      time: new Date(Date.now()).toString(),
      click_action:payload.data.click_action
    },
    icon:"/keepLogo.png"
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});