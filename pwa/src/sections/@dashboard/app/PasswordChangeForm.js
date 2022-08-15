import react, {useEffect, useState} from 'react'
import { get, head } from 'lodash'
import { useForm } from "react-hook-form"
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createId } from '../../../utils/uuid-generator'
import { editUserProfile} from '../../../actions/Profile'

export default function PasswordChangeForm() {
  const [userProfile, setUserProfile] = useState(null)
  const formProps = useForm({ defaultValues: userProfile })
  

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

  const onSubmit = (values) => {
    if (userProfile) {
      console.log(values)
      editUserProfile(values)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          type="password"
          label="Current Password"
          {...register('current_password')}
        />
        <TextField
          fullWidth
          type="password"
          label="New Password"
          {...register('new_password')}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm New Password"
          {...register('confirm_new_password')}
        />
        {/* {userProfile && (
          <>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={false}
            variant="contained">
            Update Password
          </LoadingButton>
          </>
        )} */}
      </Stack>
    </form>
  )
}