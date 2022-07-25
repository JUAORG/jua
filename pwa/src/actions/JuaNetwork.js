import { map, filter } from "lodash"
import { getAuthId } from "./Auth"

export const activeJuaNetworkUsers = (users) => {
  const user = getAuthId()
  return map(filter(users, (x) => x.uid !== user), (x) => x, "user")
}