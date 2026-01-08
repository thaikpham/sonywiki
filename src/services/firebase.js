import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = import.meta.env.VITE_FIREBASE_CONFIG
  ? JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG)
  : {
      apiKey: "AIzaSyDummyKey",
      authDomain: "sony-wiki.firebaseapp.com",
      projectId: "sony-wiki",
      storageBucket: "sony-wiki.appspot.com",
      messagingSenderId: "00000000000",
      appId: "1:00000000000:web:00000000000"
    };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const appId = import.meta.env.VITE_APP_ID || 'sony-wiki-default';
