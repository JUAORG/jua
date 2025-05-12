// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCPpF6KokyFOFEgWlxKKwdmSh3KE9Tj6fc",
  authDomain: "jua-c49b9.firebaseapp.com",
  projectId: "jua-c49b9",
  storageBucket: "jua-c49b9.firebasestorage.app",
  messagingSenderId: "929505206836",
  appId: "1:929505206836:web:76e65872658f22e3bc2061",
  measurementId: "G-07W51VD9Q0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 