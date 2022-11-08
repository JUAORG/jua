import { get, head, unset, assign } from 'lodash'
import {
  getAuth,
  signOut,
  deleteUser,
  updatePassword,
  updateProfile,
  signInWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword
} from "firebase/auth"
import {
  getDatabase,
  ref,
  child,
  push,
  remove,
  update,
  serverTimestamp,
  increment
} from 'firebase/database'
import notificationManager from './NotificationManager'
import { firebaseAuth } from '../utils/firebase-config'
import { createProfile } from './Profile'
import { createId } from '../utils/uuid-generator'

const auth = getAuth()
const db = getDatabase()

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
     //     createProfile(values)
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
   return user
  }
}

export async function updateUserPassword(values) {
  const docId = createId()
  const credential = EmailAuthProvider.credential(
    getUser().email,
    values.current_password
  )
  reauthenticateWithCredential(auth.currentUser, credential)
  updatePassword(auth.currentUser, values.new_password).then((res) => {
    update(ref(db, `users/${auth.currentUser.uid}/activity/${docId}`), {
      "id": docId,
      "Account": "Password changed",
      "Date": serverTimestamp()
    })
    notificationManager.success('Password updated', 'Success')
  }).catch((error) => {
    notificationManager.error(`${error}`, 'Error')
  })
}


export async function updateUserAccountProfilePicture() {
  const auth = getAuth()
  updateProfile(auth.currentUser, {
    displayName: "dujiewojdidwiodwendwn", photoURL: "https://example.com/jane-q-user/profile.jpg"
  }).then((res) => {
    // Profile updated!
    // ...
    console.log(auth)
  }).catch((error) => {
    // An error occurred
    // ...
});
  
  //  await updateProfile({displayName: "Jane Q. User",  photoURL: "https://example.com/jane-q-user/profile.jpg"})
}

export async function deleteUserAccount(values) {
  const credential = EmailAuthProvider.credential(
    getUser().email,
    values.current_password
  )
  await reauthenticateWithCredential(auth.currentUser, credential)
  remove(ref(db, `users/${auth.currentUser.uid}/`))
  await deleteUser(credential)
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
