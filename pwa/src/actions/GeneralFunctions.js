import { getDatabase, ref, set, update, remove } from "firebase/database"
import { getAuthId } from "./Auth"
import notificationManager from './NotificationManager'

const db = getDatabase()
const uid = getAuthId()

export async function addRecordUnderUserDoc(values, subDocument=null) {

  const path = subDocument ?
        `users/${ uid }/${ subDocument }/${ values.id }`:
        `users/${ uid }/${ values.id }`

  set(ref(db, path), values).then(() => {
    notificationManager.success('Record added', 'Success')
  }).catch((error) => {
    notificationManager.error(error, 'Error')
  })

}

export async function updateRecordUnderUserDoc(values, subDocument=null) {
  
  const path = subDocument ?
        `users/${ uid }/${ subDocument }/${ values.id }`:
        `users/${ uid }/${ values.id }`
  
  update(ref(db, path), values).then(() => {
    notificationManager.success('Record updated', 'Success')
  }).catch((error) => {
    notificationManager.error(error, 'Error')
  })

}

export async function deleteRecordUnderUserSubDoc(values, subDocument=null) {
  remove(ref(db, `users/${ uid }/${ subDocument }/${ values.id }`))
    .then(() => {
      notificationManager.success('Record deleted', 'Success')
    }).catch((error) => {
      notificationManager.error(error, 'Error')
    })
}
