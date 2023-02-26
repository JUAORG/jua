import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { emailAndPasswordSignIn, setAuthId, setAuthTokenCookie } from '../../../actions/Auth';
import notificationManager from '../../../actions/NotificationManager';
import Iconify from '../../../components/Iconify';
import PasswordResetForm from '../PasswordReset';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showLoadingBackdrop, setShowLoadingBackdrop] = useState(false);
  const defaultValues = {};
  const formProps = useForm({ defaultValues });

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = formProps;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const onSubmit = () => {
    setShowLoadingBackdrop(true);
    emailAndPasswordSignIn(getValues())
      .then((res) => {
        setAuthId(res.data.token);
        setShowLoadingBackdrop(false);
        setAuthTokenCookie(res.data.token);
        notificationManager.success('Succesfully authenticated', 'Success');
        navigate('/dashboard/app', { replace: true });
      })
      .catch((error) => {
        setShowLoadingBackdrop(false);
        if (error.response) {
          notificationManager.error(error.response.data.non_field_errors, 'Error');
        }
        notificationManager.error('Something went wrong. Please try again later.', 'Error');
      });
  };

  const openPasswordResetForm = () => {
    setShowPasswordResetForm(true)
  }

  const handleClosePasswordResetForm = () => {
    setShowPasswordResetForm(false)
  }

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
        {/* <FormControlLabel */}
        {/*   control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />} */}
        {/*   label="Remember me" */}
        {/* /> */}
        <Link to="#" underline="hover" variant="subtitle2" component={RouterLink} onClick={openPasswordResetForm}>
          Forgot password?
        </Link>
      </Stack>
      {showPasswordResetForm && <PasswordResetForm handleClose={handleClosePasswordResetForm}/>}
      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={false}>
        Login
      </LoadingButton>
    </form>
  );
}
