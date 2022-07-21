import { getDatabase, ref, set, update, remove } from "firebase/database"
import { getAuthId } from "./Auth"

const db = getDatabase()
const uid = getAuthId()

export const addEducation = (data) => {
  set(ref(db, `users/${uid}/education/${data.id}`), data)
  .then(() => {
    alert("Record Created")
  })
  .catch(() => {
    alert("Error")
  })
}

export const editEducation = (data) => {
  update(ref(db, `users/${uid}/education/${data.id}`), data)
  .then(() => {
    alert("Recored Updated")
  })
  .catch(() => {
    alert("Error")
  })
}

export const deleteEducation = (data) => {
  remove(ref(db, `users/${uid}/education/${data.id}`))
  .then(() => {
    alert("Record Removed")
  })
  .catch(() => {
    alert("Error")
  })
}

// export const getEducationList = async () => {
//   await onValue(ref(db, `/users/${uid}/education`), (snapshot) => {
//     const educationList = (snapshot.val() && snapshot.val())
//     console.log(educationList)
//     return educationList
//   }, {
//     onlyOnce: true
//   });
// }

// export const getEducationItem = async (id) => {
//   await onValue(ref(db, `/users/${uid}/education/${id}`), (snapshot) => {
//     const educationItem =  (snapshot.val() && snapshot.val())
//     return educationItem
//   }, {
//     onlyOnce: true
//   });
// }
