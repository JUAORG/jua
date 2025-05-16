import { useEffect, useState } from 'react';
import { get, map } from 'lodash';
import { useForm } from 'react-hook-form';
import { styled } from '@mui/material/styles';
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../../actions/firebase';
import notificationManager from '../../../actions/NotificationManager';

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
}));

export default function UserProfileForm() {
  const formProps = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [industryOptions] = useState([{ name: 'Finance' }, { name: 'Tech' }, { name: 'Legal' }]);
  const [photoURL, setPhotoURL] = useState('');

  const { register, reset, handleSubmit } = formProps;

  useEffect(() => {
    if (!auth.currentUser) return;
    const loadUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          reset({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            bio: data.bio || '',
            industry: data.industry || '',
            rate_per_hour_in_rands: data.rate_per_hour_in_rands || '',
            linkedIn: data.linkedIn || '',
          });
          setPhotoURL(data.photoURL || auth.currentUser.photoURL || '');
        }
      } catch (error) {
      }
    };

    loadUserProfile();
  }, [reset]);

  const handleProfileImageChange = async event => {
    const file = event.target.files[0];
    if (!file || !auth.currentUser) return;

    try {
      const fileRef = ref(storage, `users/${auth.currentUser.uid}/profile_picture`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      // 1. Update Firebase Auth profile
      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      // 2. Update Firestore user document
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      // 3. Update local state
      setPhotoURL(downloadURL);
      notificationManager.success('Profile picture updated', 'Success');
    } catch (error) {
      notificationManager.error('Failed to upload profile picture', 'Error');
    }
  };

  const onSubmit = async values => {
    if (!auth.currentUser) {
      notificationManager.error('Not authenticated', 'Error');
      return;
    }

    try {
      setIsLoading(true);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, values);
      notificationManager.success('Profile updated successfully', 'Success');
    } catch (error) {
      notificationManager.error('Something went wrong', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Tooltip title="Click to change profile picture">
          <label htmlFor="profile-picture-upload">
            <input
              type="file"
              accept="image/*"
              id="profile-picture-upload"
              style={{ display: 'none' }}
              onChange={handleProfileImageChange}
            />
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{ cursor: 'pointer' }}
            >
              <Avatar
                alt="Profile Picture"
                src={
                  typeof photoURL === 'string' && photoURL.trim() !== '' ? photoURL : '/static/avatar_placeholder.png'
                }
                sx={{ width: 80, height: 80 }}
              />
            </StyledBadge>
          </label>
        </Tooltip>

        <TextField fullWidth label="First Name" {...register('first_name')} />
        <TextField fullWidth label="Last Name" {...register('last_name')} />

        <FormControl fullWidth>
          <InputLabel>Industry</InputLabel>
          <Select {...register('industry')} defaultValue="">
            {map(industryOptions, (v, index) => (
              <MenuItem value={v.name} key={index}>
                {v.name}
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
        />
        <LoadingButton fullWidth size="large" type="submit" loading={isLoading} variant="contained">
          Update
        </LoadingButton>
      </Stack>
    </form>
  );
}
