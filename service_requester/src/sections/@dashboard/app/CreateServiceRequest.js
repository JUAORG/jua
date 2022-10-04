import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import ServiceRequestForm from './ServiceRequestForm'

export default function CreateServiceRequest(isOpen) {
  const [open, setOpen] = React.useState(isOpen)
  const closeDialog = () => {
    setOpen(false)
  }
  
  return (
    <div>
      <Dialog fullScreen open={open}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={closeDialog} aria-label="close">
              <CloseIcon/>
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Service Request
            </Typography>
            <Button autoFocus color="inherit" onClick={closeDialog}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <ServiceRequestForm />
      </Dialog>
    </div>
  )
}