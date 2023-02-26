import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from 'react-query'
import { Stack, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { updateUserPassword } from '../../../actions/Auth'
import notificationManager from '../../../actions/NotificationManager'

export default function PasswordChangeForm({handleClose}) {
  const queryClient = useQueryClient();
  const formProps = useForm({ defaultValues: null });
  const { register, reset, handleSubmit } = formProps;

  const { mutate } = useMutation({
    mutationFn: (values) => updateUserPassword(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      notificationManager.success('Password updated', 'Success');
      reset();
      handleClose()
    },
    onError: () => notificationManager.error('Something went wrong.', 'Error')
  });

  
  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          type="password"
          label="Current Password"
          {...register('old_password')}
        />
        <TextField
          required
          fullWidth
          type="password"
          label="New Password"
          {...register('new_password')}
        />
        <TextField
          required
          fullWidth
          type="password"
          label="Confirm New Password"
          {...register('confirm_new_password')}
        />
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          loading={false}
          variant="contained">
          Update Password
        </LoadingButton>
      </Stack>
    </form>
  )
}
