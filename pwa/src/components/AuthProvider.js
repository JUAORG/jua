import React, { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { firebaseAuth } from "../utils/firebase-config";
import CircularIndeterminate from './reusables/CircularIndeterminate'

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [pending, setPending] = useState(true)

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    })
    if (currentUser) {
      localStorage.setItem("user_display_name", currentUser.displayName)
      localStorage.setItem("user_email", currentUser.email)
    }
  }, [])

  if(pending){
    return <CircularIndeterminate />
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      { children }
    </AuthContext.Provider>
  );
};
