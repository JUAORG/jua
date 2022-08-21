/* eslint-disable */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3Ui3-3aQGbSWLh2SNJFYKA2ywr0STY08",
  authDomain: "jua-production.firebaseapp.com",
  databaseURL: "https://jua-production-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "jua-production",
  storageBucket: "jua-production.appspot.com",
  messagingSenderId: "614564836453",
  appId: "1:614564836453:web:ad72a6c02a35247c6bc28c",
  measurementId: "G-6XCX8VFKNX"
}


const app = initializeApp(firebaseConfig)
export const firebaseStorage = getStorage(app)
export const firebaseAuth = getAuth(app)
export const firebaseDb = getDatabase(app)
