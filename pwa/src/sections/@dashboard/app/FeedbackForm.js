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

export default function UserProfileForm() {
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
          label="Subject"
          { ...register('subject') }
        />
        <TextField
                rows={4}
                fullWidth
                multiline
                label="We welcom you feedback"
                {...register('feedback')}
                placeholder="Improvement suggestions for Jua?"
              />
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
      </Stack>
    </form>
  )
}
