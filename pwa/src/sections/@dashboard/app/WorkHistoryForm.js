import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import notificationManager from '../../../actions/NotificationManager';
import { auth, db } from '../../../actions/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useState } from 'react';

export default function WorkHistoryForm(workDoc) {
  const experience = get(workDoc, 'workDoc');
  const formProps = useForm({ defaultValues: experience });
  const { register, reset, handleSubmit } = formProps;
  const [loading, setLoading] = useState(false);

  const saveExperience = async (values) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');

    setLoading(true);
    try {
      if (experience?.id) {
        const ref = doc(db, 'users', uid, 'experience', experience.id);
        await updateDoc(ref, values);
      } else {
        const collectionRef = collection(db, 'users', uid, 'experience');
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
    if (!uid || !experience?.id) return;

    try {
      const ref = doc(db, 'users', uid, 'experience', experience.id);
      await deleteDoc(ref);
      reset();
      notificationManager.success('Profile updated', 'Success');
    } catch (error) {
      console.error(error);
      notificationManager.error(error.message, 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit(saveExperience)}>
      <Stack spacing={3} pb={5}>
        <TextField required fullWidth label="Company" {...register('company')} />
        <TextField required fullWidth label="Title" {...register('title')} />
        <Stack spacing={2} sx={{ float: 'right' }} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            required
            fullWidth
            id="start_year"
            label="From"
            type="date"
            {...register('date_from')}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            id="end_year"
            label="To"
            type="date"
            {...register('date_to')}
            helperText="If present, leave empty"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
        <TextField
          fullWidth
          type="text"
          label="Description (optional)"
          {...register('description')}
        />
        {experience ? (
          <>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              loading={loading}
              variant="contained"
            >
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
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={loading}
            variant="contained"
          >
            Add
          </LoadingButton>
        )}
      </Stack>
    </form>
  );
}
