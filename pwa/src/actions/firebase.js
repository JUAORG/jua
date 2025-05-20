// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getPerformance } from "firebase/performance";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MESSAGING_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);  
export const storage = getStorage(app);
export const functions = getFunctions(app);

const perf = getPerformance(app);

if (process.env.NODE_ENV === "development") {
  // Connect Auth emulator
  connectAuthEmulator(auth, "http://localhost:9099");

  // Connect Firestore emulator
  connectFirestoreEmulator(db, "localhost", 8047);

  // Connect Storage emulator
  // connectStorageEmulator(storage, "localhost", 9199);

  // Connect Functions emulator
  connectFunctionsEmulator(functions, "localhost", 5001);
} else {
  // Initialize Performance Monitoring and get a reference to the service
  getPerformance(app);
}
