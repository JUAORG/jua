import * as React from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { makeStyles } from '@mui/styles'
import Logo from "../Logo"

const useStyles = makeStyles({
  circularLoader: {
    zIndex: 9,
    top: "40vh",
    margin: "auto",
    textAlign: "center",
    position: "relative"
  },
});

export default function CircularIndeterminate() {
  const classes = useStyles()

  return (
    <div className={classes.circularLoader}>
      <CircularProgress sx={{margin: 'auto'}} />
      <Logo disabledLink sx={{margin: 'auto'}} />
    </div>
  )
}
