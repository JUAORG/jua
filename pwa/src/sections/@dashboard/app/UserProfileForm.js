import { useEffect, useState } from 'react'
import { get, map } from 'lodash'
import { useForm, Controller } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  Stack,
  Badge,
  Avatar,
  MenuItem,
  Tooltip,
  Select,
  TextField,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { fetchIndustriesAsDropdownOptions } from '../../../actions/JuaNetwork'
import notificationManager from '../../../actions/NotificationManager'
import { editUserProfile } from '../../../actions/Profile'
import { industries } from '../../../_mock/industries'
import ProfilePictureUploader from './ProfilePictureUploadForm'

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

export default function UserProfileForm(user) {
  const queryClient = useQueryClient()
  const formProps = useForm({})
  const userProfile = get(user, 'userProfile')
  const [openProfilePictureUploader, setOpenProfilePictureUploader] = useState(false)

  const { register, reset, control, handleSubmit, setValue } = formProps

  useEffect(() => {
    reset({
      first_name: get(userProfile, 'first_name'),
      last_name: get(userProfile, 'last_name'),
      bio: get(userProfile, 'bio'),
      industry: get(userProfile, 'industry'),
      rate_per_hour_in_rands: get(userProfile, 'rate_per_hour_in_rands'),
      linkedIn: get(userProfile, 'linkedIn'),
    })
    setValue('industry', get(userProfile, 'industry'))
  }, [userProfile, reset, industries])

  const handleCloseProfilePictureUploader = () => {
    setOpenProfilePictureUploader(false)
  }

  const { data, error, isLoading } = useQuery(['industry_list'], fetchIndustriesAsDropdownOptions, {
    enabled: true,
    refetchIntervalInBackground: false,
  })

  const industryOptions = get(data, 'data')

  const { mutate } = useMutation({
    mutationFn: (values) => editUserProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      notificationManager.success('Profile updated', 'Success')
      reset()
    },
    onError: () => alert('Something went wrong'),
  })

  const onClickProfilePicture = () => {
    setOpenProfilePictureUploader(true)
  }

  const handleIndustryChange = (value) => {
    console.debug(value)
  }

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
      {openProfilePictureUploader && <ProfilePictureUploader handleClose={handleCloseProfilePictureUploader} />}
      <Stack spacing={3}>
        <div display={'flex'}>
          <Tooltip title="Update Profile Picture">
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{ cursor: 'pointer' }}
            >
              <Avatar
                onClick={onClickProfilePicture}
                alt={get(userProfile, 'first_name')}
                src={get(userProfile, 'profile_picture')}
              />
            </StyledBadge>
          </Tooltip>
        </div>
        <TextField fullWidth label="First Name" {...register('first_name')} />
        <TextField fullWidth label="Last Name" {...register('last_name')} />

        {/* <TextField */}
        {/*   fullWidth */}
        {/*   label="Country" */}
        {/*   value="South Afica" */}
        {/* /> */}
        {/* <TextField */}
        {/*   fullWidth */}
        {/*   label="Town/City" */}
        {/*   { ...register('town') } */}
        {/* /> */}
        {/* <TextField */}
        {/*   fullWidth */}
        {/*   label="Date of Birth" */}
        {/*   type="date" */}
        {/*   { ...register('date_of_birth') } */}
        {/*   InputLabelProps={{ */}
        {/*     shrink: true, */}
        {/*   }} */}
        {/* /> */}
        <FormControl fullWidth>
          <InputLabel>Industry</InputLabel>
          <Select {...register('industry')} defaultValue={get(userProfile, 'industry')} label="Industry">
            {map(industryOptions, (v, index) => (
              <MenuItem value={v.name} key={index}>
                <span>{v.name}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField fullWidth multiline minRows={4} label="About" placeholder="Add summary" {...register('bio')} />
        <TextField
          fullWidth
          type="number"
          label="Rate per hour"
          placeholder="1500"
          helperText="Amount for an hour of your time. In other words what you charge for a Service Request on JUA"
          {...register('rate_per_hour_in_rands')}
          InputProps={{
            startAdornment: <InputAdornment position="start">R</InputAdornment>,
          }}
        />
        <TextField
          fullWidth
          type="url"
          label="LinkedIn"
          {...register('linkedIn')}
          placeholder="https://za.linkedin.com/in/..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkedInIcon />
              </InputAdornment>
            ),
          }}
          helperText="LinkedIn profile URL"
        />
        <LoadingButton fullWidth size="large" type="submit" loading={false} variant="contained">
          Update
        </LoadingButton>
      </Stack>
    </form>
  )
}
