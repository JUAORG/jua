// Import the functions you need from the SDKs you need
/* eslint no-use-before-define: 0 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore,
  query,
  orderBy,
  onSnapshot,
  where,

  collection,
  getDoc,
  setDoc,
  getDocs, 
  addDoc,
  updateDoc,
  doc, 
  serverTimestamp, 
  arrayUnion
} from "firebase/firestore";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const firebaseAuth = getAuth();

// export const createUserProfile = (
//   user,
//   firstName,
//   lastName,
//   country,
//   town,
//   dob
// ) => {
  
//   const userProfileColRef = collection(db, 'users')

//   return addDoc(userProfileColRef, {
//     created: serverTimestamp(),
//     uid: user.uid,
//     email: user.email,
//     first_name: firstName,
//     last_name: lastName,
//     country,
//     town,
//     dob
//   })
// }

// export const getGroceryList = (groceryListId="SF") => {
//     const groceryDocRef = doc(db, 'cities', groceryListId)
//     return getDoc(groceryDocRef);
// };
// console.log(getGroceryList(), "eddede")

// export const updateUserEducationList = (
//   uid="s4ChvTl1Lwa1AZX4p9vKzWHc6U73",
//   institute="eee",
//   course="eee",
//   field="eee",
//   start="10101-22",
//   end="10101-22",
//   awards="ded",
//   misc="dwde"
// ) => {
  
//   const userDocRef = collection(db, 'users')
 
//   return updateDoc(userDocRef, {
//     education: arrayUnion({
//       institute,
//       course,
//       field,
//       start,
//       end,
//       awards,
//       misc,
//     })
//   });
// };

// const getUsers = async () => {
//   await setDoc(doc(citiesRef, "SF"), {
//     name: "San Francisco", state: "CA", country: "USA",
//     capital: false, population: 860000,
//     regions: ["west_coast", "norcal"] });
// }

// const getServiceProviders = () => {
//   const 
// }

// const getDocRef = async () => {
//   const docRef = doc(db, "cities", "SF");
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//   } else {
//     doc.data()
//     console.log("No such document!");
//   }
// }

// getDocRef()
// !roseGOLD01jua
