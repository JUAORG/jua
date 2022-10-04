import { getDatabase, ref, set, update, remove } from "firebase/database"
import { getAuthId } from "./Auth"

const db = getDatabase()
const uid = getAuthId()

export async function addWork(data) {
  set(ref(db, `users/${uid}/work/${data.id}`), data)
}

export async function editWork(data) {
  update(ref(db, `users/${uid}/work/${data.id}`), data)
}

export async function deleteWork(data) {
  remove(ref(db, `users/${uid}/work/${data.id}`))
}
