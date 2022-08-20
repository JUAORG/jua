import { getDatabase, ref, child, push, update, serverTimestamp, increment } from 'firebase/database'
import { map, get, size, filter } from 'lodash'
import { createId } from '../utils/uuid-generator'
import { getAuthId } from './Auth'

const db = getDatabase()
const uid = getAuthId()

export const serviceRequestStatusOptions = {
  unread: "Unread",
  read: "Read",
  cancelled: "Cancelled",
  accepted: "Accepted",
  declined: "Declined"
}

export const activeJuaNetworkUsers = (users) => {
  return map(
    filter(users, (x) => x.uid !== uid),
    (x) => x,
    'user'
  )
}

export const createServiceRequest = (values) => {
  const serviceRequestKey = createId()
  values.serviceRequester = uid
  values.id = serviceRequestKey
  values.status = get(serviceRequestStatusOptions, "unread")
  values.created_at = serverTimestamp()

  const updates = {}

  updates[`/service_requests/${serviceRequestKey}`] = values
  // updates[`/users/${uid}/service_requests/${serviceRequestKey}`] = values
  // updates[`/users/${values.serviceProvider}/service_requests/${serviceRequestKey}`] = values

  update(ref(db), updates)
  .then(() => {
    alert('Service Request created')
  })
  .catch(() => {
    alert('Error')
  })
}

export const updateServiceRequest = (values) => {
  values.updated_at = serverTimestamp()
  console.log(values)
  update(ref(db, `service_requests/${values.id}/`), 
    values
  )
    .then((res) => {
      alert('Service Request updated')
    })
    .catch((error) => {
      alert("Error")
    })
}

export async function submitServiceRequestFeedback(values) {
  values.submit_date = serverTimestamp()
  
  update(ref(db, `service_requests/${values.id}/feedback/${uid}`), 
    values
  )
}

export const getActiveServiceRequests = (serviceRequests) => {
  return map(
    filter(serviceRequests, (x) => x.serviceProvider === uid),
    (x) => x
  )
}

export const getMySentServiceRequests = (serviceRequests) => {
  return map(
    filter(serviceRequests, (x) => x.serviceRequester === uid),
    (x) => x,
    'user'
  )
}

export const getMyRecievedServiceRequests = (serviceRequests) => {
  return map(
    filter(serviceRequests, (x) => x.serviceProvider === uid),
    (x) => x,
    'user'
  )
}

export const getNumOfMyServiceRequests = (serviceRequests) => {
  return size(
    filter(serviceRequests, (x) =>
        x.serviceProvider === uid &&
        x.status !== get(serviceRequestStatusOptions, "declined")
    )
  )
}
