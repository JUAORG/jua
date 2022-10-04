import * as Yup from 'yup'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form"
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { emailAndPasswordRegister } from '../../../actions/Auth'
import { createProfile } from '../../../actions/Profile'
import Iconify from '../../../components/Iconify';

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

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
  
  const onSubmit = () => {
    setValue("country", "South Africa")
    emailAndPasswordRegister(getValues())
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...register('first_name')}
            />

            <TextField
              fullWidth
              label="Last name"
              {...register('last_name')}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Country"
              disabled
              value={"South Africa"}
              {...register('country')}
            />
            <TextField
              fullWidth
              label="Town/City"
              {...register('town')}
            />
          </Stack>
          <TextField
            fullWidth
            id="date_of_birth"
            label="Date of Birth"
            type="date"
            {...register('date_of_birth')}
            InputLabelProps={{
              shrink: true,
            }}
          />
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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={false}>
            Register
          </LoadingButton>
        </Stack>
      </form>
  )
}
