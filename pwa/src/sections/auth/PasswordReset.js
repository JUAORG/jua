import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { sendPasswordResetOtp } from '../../actions/Auth';

export default function PasswordResetForm({handleClose}) {
    const [email, setEmail] = useState(null)

    const onSubmit = () => {

        sendPasswordResetOtp({email})
        .then(() => {

        }).catch(() => {

        })
    }

  return (
    <form>
      <Dialog open onClose={handleClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Don't worry, it happens to the best of us. To reset your password to JUA, please enter your email address. 
            If there's an account associated to your email address please expect an OTP shortly.
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button submit onClick={onSubmit}>Send Password OTP</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}