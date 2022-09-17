import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage  } from 'firebase/messaging';

const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
});

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

// notification's token, throws error
const requestForToken = () => {
  getToken(messaging, { vapidKey: 'BPPGWdIzWyqMUttpd_IagqRDNt2bPsthLLAbbNIrlhsVFNiZSRALjCqBaxSgfnUgYTeT7SMcoCQxaJYTzTR8eCk' })
    .then((currentToken) => {
        console.log('current token for client: ', currentToken);
    })
    .catch((err) => {
      console.warn('An error occurred while retrieving token. ', err);
    });
};

// request permission for notifications
const requestForPermission = () => {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            requestForToken();
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
};
requestForPermission();

const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });

export default app;
export { auth, storage, db, messaging, onMessageListener }
