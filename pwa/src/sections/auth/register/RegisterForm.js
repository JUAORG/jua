import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { emailAndPasswordRegister } from '../../../actions/Auth';
import notificationManager from '../../../actions/NotificationManager';
import { SimpleBackdrop } from '../../../components/reusables/Backdrop';
import Iconify from '../../../components/Iconify';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {};
  const formProps = useForm({ defaultValues });

  const {
    register,
    getValues,
    handleSubmit,
  } = formProps;

  const { mutate, isLoading } = useMutation({
    mutationFn: () => emailAndPasswordRegister(getValues()),
    onSuccess: () => {
      notificationManager.success('Please login', 'Success');
      navigate(`/login`, { replace: true });
    },
    onError: (error) => {
      notificationManager.error(error.response.data.username, 'Error');
    },
  });

  return (
    <form onSubmit={handleSubmit(() => mutate())}>
      {isLoading && <SimpleBackdrop />}
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField required fullWidth label="First name" {...register('first_name')} />
          <TextField required fullWidth label="Last name" {...register('last_name')} />
        </Stack>
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
                <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
          Register
        </LoadingButton>
      </Stack>
    </form>
  );
}
