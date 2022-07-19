import { getDatabase, ref, push } from "firebase/database";

const db = getDatabase();

export const addEducation = (uid, data) => {
  push(ref(db, `users/${uid}/education/`), data)
  .then((res) => {
    alert("Data saved successfully")
  })
  .catch((error) => {
    alert("Error")
  })
}