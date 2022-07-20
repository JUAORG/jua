import { unset, assign } from 'lodash'
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import { firebaseAuth } from '../utils/firebase-config'
import { createProfile } from './Profile'


const auth = getAuth()

export const setAuthId = (uid) => {
  localStorage.setItem("auth_id", uid)
  localStorage.setItem("date_auth_id_set", new Date())
}

export const getAuthId = () => {
  return localStorage.getItem("auth_id")
}

export const removeAuthId = () => {
  localStorage.removeItem("auth_id")
  localStorage.removeItem("date_auth_id_set")
}

export const isSignedIn = () => {
    const pathName = window.location.pathname
    const loginPath = "/login"
    const registerPath = "/register"
    const notFoundPath = "/404"
    const isSignedIn = getAuthId()

    if (!isSignedIn && pathName !== loginPath && pathName !== registerPath && pathName !== notFoundPath) {
      window.location.href = registerPath
    }
}

export const emailAndPasswordRegister = (values) => {
  createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
    .then(() => {
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          unset(values, "password")
          assign(values, {uid: user.uid})
          createProfile(values)
          setAuthId(user.id)
        }
      })
    })
  .catch((error) => {
    const errorMessage = error.message;
    alert(errorMessage)
  })
}

export const getUser = () => {
  const user = getAuth().currentUser
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      // ...
    } else {
      // No user is signed in.
    }
}

export const signOutUser = () => {
  removeAuthId()
  // signOut(auth).then(() => {
  //   alert("Successfully signout")
  // }).catch((error) => {
  //   console.error(error)
  // })
}