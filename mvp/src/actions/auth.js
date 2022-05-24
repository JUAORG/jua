import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";

export const authentication = getAuth();

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
export function handleEmailSignup(email, password) {
  createUserWithEmailAndPassword(authentication, email, password)
.then((response) => {
  useNavigate("/home");
  sessionStorage.setItem(
    "Auth Token",
    response._tokenResponse.refreshToken
  );
})
.catch((error) => {
  if (error.code === "auth/email-already-in-use") {
    toast.error("Email Already in Use");
  }else{
    toast.error(error.code);
  }
});
}
