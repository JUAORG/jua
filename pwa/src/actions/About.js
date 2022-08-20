import { getDatabase, ref, set, serverTimestamp } from "firebase/database"
import { createId } from "../utils/uuid-generator"
import { getAuthId } from "./Auth"

const db = getDatabase()
const uid = getAuthId()

export const submitJuaPlatformFeedback = (values) => {
  values.user_uid = uid
  values.created_at = serverTimestamp()

  set(ref(db, `general_feedback/${createId()}`), values)
  .then(() => {
    alert("Thank you for your feedback.")
  })
  .catch(() => {
    alert("Error Submitting feedback.")
  })
}