import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export const SimpleBackdrop = () => {
  
  return (
    <div>
      <Backdrop
        open
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
