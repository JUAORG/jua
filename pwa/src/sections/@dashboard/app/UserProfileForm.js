import react, {useEffect, useState} from 'react'
import { get, head } from 'lodash'
import { useForm } from "react-hook-form"
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createId } from '../../../utils/uuid-generator'
import { editUserProfile} from '../../../actions/Profile'

export default function UserProfileForm(userProfileDoc) {
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

  useEffect(() => {
    setUserProfile(userProfileDoc.userProfileDoc)
  },userProfileDoc)

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
          label="First Name"
          {...register('first_name')}
        />
        <TextField
          fullWidth
          label="Last Name"
          {...register('last_name')}
        />
        <TextField
          fullWidth
          label="Country"
          value={"South Afica"}
        />
        <TextField
          fullWidth
          label="Town/City"
          {...register('town')}
        />
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            {...register('date_of_birth')}
            InputLabelProps={{
              shrink: true,
            }}
          />
        {userProfile && (
          <>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={false}
            variant="contained">
            Update
          </LoadingButton>
          </>
        )}
      </Stack>
    </form>
  )
}