import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";

export default function handleEmailLogin(email, password) {
  const authentication = getAuth();
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
