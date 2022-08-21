import {
  ref,
  push,
  child,
  update,
  increment,
  getDatabase,
  serverTimestamp
} from 'firebase/database'
import {
  map,
  get,
  size,
  merge,
  filter,
} from 'lodash'
import { createId } from '../utils/uuid-generator'
import { getAuthId } from './Auth'

const db = getDatabase()
const uid = getAuthId()

export const serviceRequestStatusOptions = {
  unread: 'Unread',
  read: 'Read',
  cancelled: 'Cancelled',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired'
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
  values.status = get(serviceRequestStatusOptions, 'unread')
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
  update(ref(db, `service_requests/${values.id}/`), values)
    .then((res) => {
      alert('Service Request updated')
    })
    .catch((error) => {
      alert('Error')
    })
}

export async function submitServiceRequestFeedback(values) {
  values.submit_date = serverTimestamp()
  update(ref(db, `service_requests/${values.id}/feedback/${uid}`), values)
  update(ref(db, `service_requests/${values.id}/`), {status: serviceRequestStatusOptions.expired})
}

export const getActiveServiceRequests = (serviceRequests) => {
  return map(
    filter(serviceRequests, (x) => x.serviceProvider === uid),
    (x) => x
  )
}

export const filterExpiredOrDeclinedServiceRequests = (serviceRequests) => {
  return map(
    filter(serviceRequests, (x) =>
        x.status !== serviceRequestStatusOptions.declined &&
        x.status !== serviceRequestStatusOptions.expired &&
        x.status !== serviceRequestStatusOptions.cancelled
    )
  )
}

export const filterOldServiceRequests = (serviceRequests) => {
  return map(
    filter(serviceRequests, (x) =>
        x.status === serviceRequestStatusOptions.expired
    )
  )
}

export const getMyOldRecievedServiceRequests = (serviceRequests) => {
  const filteredOldServieRequests = filterOldServiceRequests(serviceRequests)
  return map(
    filter(filteredOldServieRequests, (x) => x.serviceProvider === uid),
    (x) => x,
    'user'
  )
}

export const getMySentServiceRequests = (serviceRequests) => {
  const filteredServiceRequests = filterExpiredOrDeclinedServiceRequests(serviceRequests)
  return map(
    filter(filteredServiceRequests, (x) => x.serviceRequester === uid),
    (x) => x,
    'user'
  )
}

export const getMyRecievedServiceRequests = (serviceRequests) => {
  const filteredServiceRequests = filterExpiredOrDeclinedServiceRequests(serviceRequests)
  return map(
    filter(filteredServiceRequests, (x) => x.serviceProvider === uid),
    (x) => x,
    'user'
  )
}

export const getNumOfMyServiceRequests = (serviceRequests) => {
  const filteredServiceRequests = filterExpiredOrDeclinedServiceRequests(serviceRequests)
  return size(filter(filteredServiceRequests, (x) => x.serviceProvider === uid))
}

export async function processCalendarEvents(sentServiceRequests, recievedServiceRequests) {
  const events = merge(sentServiceRequests, recievedServiceRequests)
  const result = map(events,(event) => {
    return {
      id: get(event, 'id'),
      title: get(event, 'subject'),
      description: get(event, 'description'),
      address: 'virtual',
      color: 'green',
      backgroundColor: "transparent",
      textColor: "#000",
      start: get(event, 'date'), 
      end: get(event, 'event_end'), 
      allDay: false, 
      status: get(event, 'status'),
      meetingLink: get(event, 'meetingLink'),
      extendedProps: {
        status: 'done'
      }
    }
  })
  return result
}