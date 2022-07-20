import { unset, assign } from 'lodash'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { firebaseAuth } from '../utils/firebase-config'
import { createProfile } from './Profile'


export const emailAndPasswordRegister = (values) => {
  createUserWithEmailAndPassword(firebaseAuth, values.email, values.password)
    .then(() => {
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
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
