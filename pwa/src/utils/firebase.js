// Import the functions you need from the SDKs you need
/* eslint no-use-before-define: 0 */
import { initializeApp } from "firebase/app"
import "firebase/database";
import { getAuth } from "firebase/auth"
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// export const firebaseDb = getFirestore();
export const firebaseAuth = getAuth();