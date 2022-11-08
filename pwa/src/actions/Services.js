import { get, last, head, filter, includes } from 'lodash'
import { getDatabase, ref, set, update, remove } from "firebase/database"
import { SERVICES } from '../content/services'
import { getAuthId } from "./Auth"

const db = getDatabase()
const uid = getAuthId()

export const getService = () => {
  const lastUrlPathSegment = last(window.location.pathname.split('/'))
  return head(filter(SERVICES, (service) => get(service, 'slug') === lastUrlPathSegment))
}
