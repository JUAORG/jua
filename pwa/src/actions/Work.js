import { getDatabase, ref, set, update, remove } from "firebase/database"
import { getAuthId } from "./Auth"

const db = getDatabase()
const uid = getAuthId()

export const addWork = (data) => {
  set(ref(db, `users/${uid}/work/${data.id}`), data)
  .then(() => {
    alert("Recored Created")
  })
  .catch(() => {
    alert("Error")
  })
}

export const editWork = (data) => {
  update(ref(db, `users/${uid}/work/${data.id}`), data)
  .then(() => {
    alert("Record Updated")
  })
  .catch(() => {
    alert("Error")
  })
}

export const deleteWork = (data) => {
  remove(ref(db, `users/${uid}/work/${data.id}`))
  .then(() => {
    alert("Record Removed")
  })
  .catch(() => {
    alert("Error")
  })
}