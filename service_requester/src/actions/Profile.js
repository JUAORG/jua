import {
  ref,
  set,
  child,
  update,
  onValue,
  getDatabase,
  serverTimestamp
} from "firebase/database"
import {
  get,
  head,
  unset,
  assign
} from 'lodash'
import { createId } from "../utils/uuid-generator"
import { getAuthId } from "./Auth"

const db = getDatabase()

export const createProfile = (values) => {
  localStorage.setItem("user_display_name", `${values.first_name} ${values.last_name}`)
  const uid = createId()
  values.join_date = serverTimestamp()
  update(ref(db, `users/${values.uid}/`), values)
  update(ref(db, `users/${ values.uid }/updates/${ uid }/`), {
      title: 'Joined Jua',
      body: 'Welcome to Jua',
      timestamp: serverTimestamp()
    })
  .then((res) => {
    window.location.href = '/dashboard/app';
    })
    .catch((error) => {
      alert("Error")
    })
}

export async function editUserProfile(values) {
  values.uid = getAuthId()
  update(ref(db, `users/${values.uid}`), values)
}
