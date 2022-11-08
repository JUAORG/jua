import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form"
// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { emailAndPasswordSignIn } from '../../../actions/Auth';
// component
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const defaultValues = {}
  const formProps = useForm({ defaultValues })

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = formProps

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  }

  const onSubmit = () => {
    emailAndPasswordSignIn(getValues())
    //   .then((res) => {
    //     console.log(res)
    //      navigate('/dashboard/rate_card_setup', { replace: true });
    // })
    // .catch((error) => {
    //   console.log(error.message);
    // });
    
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          autoComplete="username"
          type="email"
          label="Email address"
          {...register('email')}
        />

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
        <Link
          to='#'
          underline='hover'
          variant='subtitle2'
          component={ RouterLink }
          onClick={ () => alert('Comming soon') }
        >
          Forgot password?
        </Link>
      </Stack>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={false}>
        Login
      </LoadingButton>
    </form>
  )
}
