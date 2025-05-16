import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import notificationManager from '../../../actions/NotificationManager';
import { auth, db } from '../../../actions/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';

export default function EducationHistoryForm(educationDoc) {
  const education = get(educationDoc, 'educationDoc');
  const formProps = useForm({ defaultValues: education });
  const { register, reset, handleSubmit } = formProps;
  const [loading, setLoading] = useState(false);

  const saveEducation = async values => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');

    setLoading(true);
    try {
      if (education?.id) {
        const ref = doc(db, 'users', uid, 'education', education.id);
        await updateDoc(ref, values);
      } else {
        const collectionRef = collection(db, 'users', uid, 'education');
        await addDoc(collectionRef, values);
      }
      notificationManager.success('Profile updated', 'Success');
      reset();
    } catch (err) {
      console.error(err);
      notificationManager.error('Something went wrong', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !education?.id) return;

    try {
      const ref = doc(db, 'users', uid, 'education', education.id);
      await deleteDoc(ref);
      reset();
      notificationManager.success('Profile updated', 'Success');
    } catch (error) {
      console.error(error);
      notificationManager.error(error.message, 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit(saveEducation)}>
      <Stack spacing={3} pb={5}>
        <TextField required fullWidth label="Institution/University" {...register('institution')} />
        <TextField required fullWidth label="Course" {...register('course')} />
        <TextField required fullWidth label="Field of study" {...register('field_of_study')} />
        <Stack sx={{ float: 'right' }} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            required
            fullWidth
            id="start_year"
            label="Start Year"
            type="date"
            {...register('date_from')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            id="end_year"
            label="End Year"
            type="date"
            {...register('date_to')}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <TextField fullWidth type="text" label="Description (optional)" {...register('description')} />
        {education ? (
          <>
            <LoadingButton fullWidth size="large" type="submit" loading={loading} variant="contained">
              Update
            </LoadingButton>
            <LoadingButton
              fullWidth
              size="large"
              loading={false}
              onClick={deleteItem}
              variant="contained"
              color="error"
            >
              Delete
            </LoadingButton>
          </>
        ) : (
          <LoadingButton fullWidth size="large" type="submit" loading={loading} variant="contained">
            Add
          </LoadingButton>
        )}
      </Stack>
    </form>
  );
}
