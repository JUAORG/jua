import { get } from 'lodash'
import { useForm } from "react-hook-form"
import { Stack, TextField } from '@mui/material'
import { useMutation, useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab'
import notificationManager from '../../../actions/NotificationManager'
import { createUserEducation, updateUserEducation, deleteUserEducation } from '../../../actions/Profile'


export default function EducationHistoryForm(educationDoc) {
  const queryClient = useQueryClient();
  const education = get(educationDoc, 'educationDoc');
  const formProps = useForm({ defaultValues: education });

  const { register, reset, handleSubmit } = formProps;

  const { mutate, isLoading } = useMutation({
    mutationFn: (values) => (get(education, 'ref') ? updateUserEducation(values) : createUserEducation(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      notificationManager.success('Profile updated', 'Success');
      reset();
    },
    onError: () => alert('Something went wrong'),
  });

  const deleteItem = (values) => {
    deleteUserEducation(values)
      .then(() => {
        reset();
        queryClient.invalidateQueries({ queryKey: ['user'] });
        notificationManager.success('Profile updated', 'Success');
      })
      .catch((error) => {
        notificationManager.error(error, 'Error');
      });
  };
  
  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
      <Stack spacing={3} pb={5}>
        <TextField
          required
          fullWidth
          label="Institution/University"
          {...register('institution')}
        />
        <TextField
          required
          fullWidth
          label="Course"
          {...register('course')}
        />
        <TextField
          required
          fullWidth
          label="Field of study"
          {...register('field_of_study')}
        />
        <Stack
          sx={{float: "right"}}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
        >
          <TextField
            required
            fullWidth
            id="start_year"
            label="Start Year"
            type="date"
            {...register('date_from')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            id="end_year"
            label="End Year"
            type="date"
            {...register('date_to')}
            InputLabelProps={{
              shrink: true,
            }}
          />
          
        </Stack>
        <TextField
          fullWidth
          type="text"
          label="Description (optional)"
          {...register('description')}
        />
        {education && (
          <>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={false}
            variant="contained">
            Update
          </LoadingButton>
          <LoadingButton
            fullWidth
            size="large"
            loading={false}
            onClick={() => deleteItem(education)}
            variant="contained">
            Delete
          </LoadingButton>
          </>
        )}
        {!education && (
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={false}
            variant="contained">
            Add
          </LoadingButton>
        )}
      </Stack>
    </form>
  )
}
