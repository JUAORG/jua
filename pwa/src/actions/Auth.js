import { get, head, unset, assign } from 'lodash'
import {
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
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
    .then((userCredential) => {
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          setAuthId(user.uid)
          unset(values, "password")
          assign(values, {uid: user.uid})
          createProfile(values)
        }
      })
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage)
    })
}

export const emailAndPasswordSignIn = (values) => {
  signInWithEmailAndPassword(auth, values.email, values.password)
    .then((userCredential) => {
      const user = userCredential.user
      setAuthId(get(user, "uid"))
      window.location.href = '/dashboard/app'
    })
    .catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      alert(errorMessage)
    })
}

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  const values = {}
  signInWithPopup(firebaseAuth, provider)
    .then((result) => {
      localStorage.setItem("user_display_name", get(result, ['user', 'displayName']))
      localStorage.setItem("user_email", get(result, ['user', 'email']))
      localStorage.setItem("profilePic", get(result, ['user', 'profilePic']))
      localStorage.setItem("auth_id", get(result, ['user', 'uid']))
      values.uid = get(result, ['user', 'uid'])
      values.first_name = get(result, ['user', 'displayName'])
      values.email = get(result, ['user', 'email'])
      createProfile(values)
      window.location.href = '/dashboard/app'
    })
    .catch((error) => {
      console.log(error)
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
  localStorage.clear()
  signOut(auth).then(() => {
    alert("Successfully signout")
    window.location.reload()
  }).catch((error) => {
    console.error(error)
  })
}
