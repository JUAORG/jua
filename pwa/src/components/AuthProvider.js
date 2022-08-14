import React, { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { firebaseAuth } from "../utils/firebase-config";
import Logo from "./Logo";

export const AuthContext = React.createContext();

const useStyles = makeStyles({
  circularLoader: {
    zIndex: 9,
    top: "40vh",
    margin: "auto",
    textAlign: "center",
    position: "relative"
  },
});

export const AuthProvider = ({ children }) => {
  const classes = useStyles();
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
    if (currentUser) {
      localStorage.setItem("user_display_name", currentUser.displayName)
      localStorage.setItem("user_email", currentUser.email)
    }
  }, [])

  if(pending){
    return <div className={classes.circularLoader}>
             <CircularProgress sx={{margin: "auto"}} />
             <Logo
               disabledLink
               sx={{margin: "auto"}}
             />
           </div>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
