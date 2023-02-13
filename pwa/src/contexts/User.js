import React, { createContext, useState, useEffect } from 'react'
import { get, head } from 'lodash'
import CircularIndeterminate from '../components/reusables/CircularIndeterminate'
import { getUser } from '../actions/Auth'


const UserContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);


function UserProvider({ children }) {
  const [pending, setPending] = useState(true)
  const [currentUser, setCurrentUser] = useState()
    
  useEffect(() => {
    if (!currentUser) {
      getUser()
        .then((response) => {
          setCurrentUser(response.data);
            setTimeout(() => setPending(false), 2000)
        })
        .catch((err) => {
          if (get(err, ['response', 'status']) === 401) {
            setPending(false)
            window.history.pushState({}, '', '/login')
          }
        })
    }
  }, [currentUser])


  return (
      <>
      {pending && <CircularIndeterminate /> }
      {!pending && <UserContext.Provider value={currentUser}>
       <UserDispatchContext.Provider value={setCurrentUser}>{children}</UserDispatchContext.Provider>
       </UserContext.Provider>
      }
      </>
  )
}

export { UserProvider, UserContext, UserDispatchContext }
