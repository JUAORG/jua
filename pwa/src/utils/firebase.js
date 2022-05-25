// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA_AFOez3-y5C3mt-L6vzBdJZNps5ZxQA",
  authDomain: "jua-test.firebaseapp.com",
  projectId: "jua-test",
  storageBucket: "jua-test.appspot.com",
  messagingSenderId: "216005444068",
  appId: "1:216005444068:web:3b496923f6d6d277dbc7f1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const firebaseDb = getFirestore();
export const firebaseAuth = getAuth();