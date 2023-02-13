import { useState } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material'
import { emailAndPasswordRegister } from '../../../actions/Auth'
import notificationManager from '../../../actions/NotificationManager'
import { SimpleBackdrop } from '../../../components/reusables/Backdrop'
import Iconify from '../../../components/Iconify';

export default function RegisterForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showLoadingBackdrop, setShowLoadingBackdrop] = useState(false)

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
    setShowLoadingBackdrop(true)
    emailAndPasswordRegister(getValues())
      .then((res)=> {
        setShowLoadingBackdrop(false)
        notificationManager.success('Please login', 'Success')
        navigate(`/login`, { replace: true })
      }).catch((error) => {
        setShowLoadingBackdrop(false)
        if (error.response) {
          notificationManager.error(error.response.data.username, 'Error')
        }
        notificationManager.error('Something went wrong. Please try again later.', 'Error')
      })
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {showLoadingBackdrop && <SimpleBackdrop/> }
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
          {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}> */}
          {/*   <TextField */}
          {/*     fullWidth */}
          {/*     label="Country" */}
          {/*     disabled */}
          {/*     value={"South Africa"} */}
          {/*     {...register('country')} */}
          {/*   /> */}
          {/*   <TextField */}
          {/*     fullWidth */}
          {/*     label="Town/City" */}
          {/*     {...register('town')} */}
          {/*   /> */}
          {/* </Stack> */}
          {/* <TextField */}
          {/*   fullWidth */}
          {/*   id="date_of_birth" */}
          {/*   label="Date of Birth" */}
          {/*   type="date" */}
          {/*   {...register('date_of_birth')} */}
          {/*   InputLabelProps={{ */}
          {/*     shrink: true, */}
          {/*   }} */}
          {/* /> */}
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
