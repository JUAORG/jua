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
import { submitJuaPlatformFeedback } from '../../../actions/About'
import notificationManager from '../../../actions/NotificationManager'

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

export default function JuaPlatformFeedbackForm() {
  const formProps = useForm({})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = formProps

  const onSubmit = (values) => {    
    submitJuaPlatformFeedback(values)
      .then(() => {
        notificationManager.success('Thank you for your feedback.', 'Success')
      }).catch((error) => {
        notificationManager.error(error, 'Error')
      })
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
                label="We welcome your feedback"
                {...register('feedback')}
                placeholder="Improvement suggestions for Jua/Support?"
              />
          <>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              loading={ false }
              variant="contained">
              Submit
            </LoadingButton>
          </>
      </Stack>
    </form>
  )
}
