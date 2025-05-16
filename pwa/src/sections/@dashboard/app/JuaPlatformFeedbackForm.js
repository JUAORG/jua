import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { Stack, Badge, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../../actions/firebase'; // Adjust the path to your firebase.js config
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

export default function JuaPlatformFeedbackForm() {
  const formProps = useForm();
  const { reset, register, getValues, handleSubmit } = formProps;

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const values = getValues();
      const uid = auth.currentUser?.uid || null;
      const email = auth.currentUser?.email || null;

      await addDoc(collection(db, 'platformFeedback'), {
        ...values,
        userId: uid,
        userEmail: email,
        submittedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      notificationManager.success('Thank you for your feedback.', 'Success');
      reset();
    },
    onError: error => {
      console.error(error);
      notificationManager.error('Something went wrong', 'Error');
    },
  });

  return (
    <form onSubmit={handleSubmit(() => mutate())}>
      <Stack spacing={3}>
        <TextField fullWidth label="Subject" {...register('subject', { required: 'Subject is required' })} />
        <TextField
          rows={4}
          fullWidth
          multiline
          label="We welcome your feedback"
          {...register('message', { required: 'Message is required' })}
          placeholder="Improvement suggestions for Jua/Support?"
        />
        <LoadingButton fullWidth size="large" type="submit" loading={isLoading} variant="contained">
          Submit
        </LoadingButton>
      </Stack>
    </form>
  );
}
