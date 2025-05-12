import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../actions/firebase"; // Adjust the path to your firebase.js config
import notificationManager from '../../actions/NotificationManager';

export default function PasswordResetForm({ handleClose }) {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await sendPasswordResetEmail(auth, email);
      notificationManager.success('Password reset email sent. Please check your inbox.', 'Success');
      handleClose();
    } catch (error) {
      console.error('Password reset error:', error);
      notificationManager.error('Failed to send reset email. Please check the email address.', 'Error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Dialog open onClose={handleClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Don't worry, it happens to the best of us. To reset your password to JUA, please enter your email address.
            If there's an account associated with your email address, you will receive a reset link shortly.
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSending}>Cancel</Button>
          <Button type="submit" disabled={isSending}>Send Password Reset Email</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
}
