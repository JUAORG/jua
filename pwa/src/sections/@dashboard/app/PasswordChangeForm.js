import ReactGA from 'react-ga';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../actions/firebase'; // Adjust to your firebase config
import notificationManager from '../../../actions/NotificationManager';

export default function PasswordChangeForm({ handleClose }) {
  const formProps = useForm({ defaultValues: {} });
  const { register, reset, handleSubmit } = formProps;
  const [loading, setLoading] = useState(false);

  const logPasswordChangeNotification = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const notifRef = collection(db, 'users', user.uid, 'notifications');
      await addDoc(notifRef, {
        title: 'Password Changed',
        message: 'Your password was successfully updated.',
        type: 'account_security',
        createdAt: serverTimestamp(),
        read: false,
      });
    } catch (error) {}
  };

  const onSubmit = async values => {
    const { oldPassword, newPassword, confirmNewPassword } = values;

    if (newPassword !== confirmNewPassword) {
      notificationManager.error('New passwords do not match.', 'Error');
      return;
    }

    try {
      setLoading(true);

      ReactGA.event({
        value: 1,
        category: 'User Profile',
        action: 'Password Change',
      });

      const user = auth.currentUser;
      if (!user || !user.email) {
        notificationManager.error('User is not authenticated.', 'Error');
        return;
      }

      // 🔐 Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // ✅ Update password
      await updatePassword(user, newPassword);

      // 📝 Log notification to Firestore
      await logPasswordChangeNotification();

      notificationManager.success('Password updated successfully.', 'Success');
      reset();
      handleClose();
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        notificationManager.error('Current password is incorrect.', 'Error');
      } else if (error.code === 'auth/weak-password') {
        notificationManager.error('Password is too weak. Use at least 6 characters.', 'Error');
      } else {
        notificationManager.error('Failed to update password.', 'Error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField required fullWidth type="password" label="Current Password" {...register('oldPassword')} />
        <TextField required fullWidth type="password" label="New Password" {...register('newPassword')} />
        <TextField
          required
          fullWidth
          type="password"
          label="Confirm New Password"
          {...register('confirmNewPassword')}
        />
        <LoadingButton fullWidth size="large" type="submit" loading={loading} variant="contained">
          Update Password
        </LoadingButton>
      </Stack>
    </form>
  );
}
