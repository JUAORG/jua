import {
  ref,
  set,
  update,
  remove,
  getDatabase,
} from "firebase/database"
import { getAuthId } from "./Auth"

const db = getDatabase()
const uid = getAuthId()

export async function addEducation(data) {
  set(ref(db, `users/${uid}/education/${data.id}`), data)
}

export async function editEducation(data) {
  update(ref(db, `users/${uid}/education/${data.id}`), data)
}

export async function deleteEducation(data) {
  remove(ref(db, `users/${uid}/education/${data.id}`))
}
