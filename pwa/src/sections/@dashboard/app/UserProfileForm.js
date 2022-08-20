import react, {useEffect, useState} from 'react'
import { get, head } from 'lodash'
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form"
import {
  Stack,
  Badge,
  Avatar,
  TextField,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { createId } from '../../../utils/uuid-generator'
import { editUserProfile} from '../../../actions/Profile'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

export default function UserProfileForm(userProfileDoc) {
  const [userProfile, setUserProfile] = useState(null)
  const formProps = useForm({})

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
    reset({
      first_name: get(userProfileDoc, ['userProfileDoc', 'first_name']),
      last_name: get(userProfileDoc, ['userProfileDoc', 'last_name']),
      town: get(userProfileDoc, ['userProfileDoc', 'town']),
      date_of_birth: get(userProfileDoc, ['userProfileDoc', 'date_of_birth']),
    })
    watch()
  },[userProfileDoc, reset])

  const onSubmit = (values) => {
    if (userProfile) {
      console.log(values)
      editUserProfile(values)
    }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
        >
          <Avatar
            alt={get(userProfileDoc, ['userProfileDoc', 'first_name'])}
            src={get(userProfileDoc, ['userProfileDoc', 'profile_photo_url'])}
          />
        </StyledBadge>
        <TextField
          fullWidth
          label="First Name"
          { ...register('first_name') }
        />
        <TextField
          fullWidth
          label="Last Name"
          { ...register('last_name') }
        />
        <TextField
          fullWidth
          label="Country"
          value="South Afica"
        />
        <TextField
          fullWidth
          label="Town/City"
          { ...register('town') }
        />
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          { ...register('date_of_birth') }
          InputLabelProps={{
            shrink: true,
          }}
        />
        { userProfile && (
          <>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              loading={ false }
              variant="contained">
              Update
            </LoadingButton>
          </>
        )}
      </Stack>
    </form>
  )
}
