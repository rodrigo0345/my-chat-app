import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging/sw';

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
export default app;
export { auth, storage, db, messaging }
