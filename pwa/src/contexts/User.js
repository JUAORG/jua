import React, { createContext, useState, useEffect } from 'react'
import { get, head } from 'lodash'
import CircularIndeterminate from '../components/reusables/CircularIndeterminate'
import { getUser } from '../actions/Auth'

const LOGIN_PATH = '/login'
const REGISTER_PATH = '/register'

const UserContext = createContext(undefined);
const UserDispatchContext = createContext(undefined);

function UserProvider({ children }) {
    const currentPath = window.location.pathname
    const [pending, setPending] = useState(true)
    const [currentUser, setCurrentUser] = useState()
    const isOnAuthPage = Boolean(currentPath === LOGIN_PATH || currentPath === REGISTER_PATH)

    useEffect(() => {
        if (!currentUser) {
            getUser()
                .then((response) => {
                    setCurrentUser(response.data);
                    setPending(false)
                })
                .catch((err) => {
                    if (get(err, ['response', 'status']) === 401) {
                        if(!isOnAuthPage) {
                            window.location = '/login'
                        }
                        setPending(false)
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
