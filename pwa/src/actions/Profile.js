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

const db = getDatabase()

export const createProfile = (values) => {
  localStorage.setItem("user_display_name", `${values.first_name} ${values.last_name}`)
  values.join_date = serverTimestamp()
  update(ref(db, `users/${values.uid}/`), values)
  .then((res) => {
    window.location.href = '/dashboard/app';
    })
    .catch((error) => {
      alert("Error")
    })
}

export const editUserProfile = (values) => {
  update(ref(db, `users/${values.uid}`), values)
  .then(() => {
    alert("Record Updated")
  })
  .catch(() => {
    alert("Error")
  })
}
