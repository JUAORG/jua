import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { getFirestore, addDoc, collection } from "firebase/firestore";

export const authentication = getAuth();
const db = getFirestore();

export function handleEmailLogin(email, password) {
  signInWithEmailAndPassword(authentication, email, password)
    .then((response) => {
      sessionStorage.setItem(
        "Auth Token",
        response._tokenResponse.refreshToken
      );
      useNavigate("/home");
    })
    .catch((error) => {
      console.log(error.code);
      toast.error("You have entered an invalid username or password");
    });
}

export const handleEmailSignup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(authentication,email,password)
    sessionStorage.setItem("Auth Token", userCredential._tokenResponse.refreshToken)
    const user = userCredential.user
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
    })
    window.location.href = "/home"
  } catch (error) {
    toast.error(error.code);
  }
 }
