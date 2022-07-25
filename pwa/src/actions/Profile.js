import { getDatabase, ref, set, child, get, update, onValue, serverTimestamp } from "firebase/database"

const db = getDatabase()

export const createProfile = (values) => {
  set(ref(db, `users/${values.uid}/`), {
    uid: values.uid,
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    country: values.country,
    town: values.town,
    date_of_birth: values.date_of_birth,
    join_date: serverTimestamp()
  })
  .then((res) => {
      alert("Profile created successfully")
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