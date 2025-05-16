import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../actions/firebase'; // Adjust the path to your firebase.js config
import notificationManager from '../../../actions/NotificationManager';
import Iconify from '../../../components/Iconify';
import PasswordResetForm from '../PasswordReset';

export default function LoginForm() {
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const formProps = useForm({});
  const { register, getValues, handleSubmit } = formProps;

  const handleShowPassword = () => {
    setShowPassword(show => !show);
  };

  const onSubmit = async () => {
    const { email, password } = getValues();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      notificationManager.success('Successfully authenticated', 'Success');
      window.location.href = '/dashboard/app';
    } catch (error) {
      const { code } = error;
      let message = 'Something went wrong. Please try again later.';

      if (code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (code === 'auth/wrong-password') {
        message = 'Incorrect password';
      }

      notificationManager.error(message, 'Error');
    } finally {
      setLoading(false);
    }
  };

  const openPasswordResetForm = () => {
    setShowPasswordResetForm(true);
  };

  const handleClosePasswordResetForm = () => {
    setShowPasswordResetForm(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField fullWidth autoComplete="username" type="email" label="Email address" {...register('email')} />
        <TextField
          fullWidth
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          {...register('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/* <Link to="#" underline="hover" variant="subtitle2" component={RouterLink} onClick={openPasswordResetForm}>
          Forgot password?
        </Link> */}
      </Stack>

      {showPasswordResetForm && <PasswordResetForm handleClose={handleClosePasswordResetForm} />}

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
        Login
      </LoadingButton>

      <p style={{ fontSize: '10px', marginTop: '10px', textAlign: 'center' }}>
        JUA Advisory is still in development mode. We are currently user testing the platform and adding final touches.
        Please feel free to register/sign in, experience the app, and give us feedback.
      </p>
    </form>
  );
}
