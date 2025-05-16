import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Stack, TextField, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import notificationManager from '../../../actions/NotificationManager';
// import {
//   createUserService,
//   deleteUserService,
//   updateUserService
// } from '../../../actions/Profile'; // or wherever your Firebase service functions live

export default function ServiceListForm({ serviceDoc }) {
  const [service, setService] = useState(serviceDoc || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: service || {
      name: '',
      price: '',
      description: '',
    },
  });

  useEffect(() => {
    if (service) reset(service);
  }, [service, reset]);

  const onSubmit = async values => {
    setIsSubmitting(true);
    try {
      if (service) {
        // await updateUserService({ ...values, ref: service.id });
        notificationManager.success('Service updated', 'Success');
      } else {
        const created = true; // await createUserService(values);
        setService(created); // switch to update mode
        notificationManager.success('Service added', 'Success');
      }
    } catch (err) {
      notificationManager.error('Failed to save service', 'Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!service?.id) return;
    setIsDeleting(true);
    try {
      // await deleteUserService({ ref: service.id });
      notificationManager.success('Service deleted', 'Success');
      setService(null);
      reset();
    } catch (err) {
      notificationManager.error('Failed to delete service', 'Error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            fullWidth
            label="Service"
            {...register('name', { required: 'Service name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            fullWidth
            type="number"
            label="Price"
            placeholder="1500"
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
            })}
            error={!!errors.price}
            helperText={errors.price?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start">R</InputAdornment>,
            }}
          />
        </Stack>

        <TextField fullWidth type="text" label="Short Description (optional)" {...register('description')} />

        {service ? (
          <>
            <LoadingButton fullWidth size="large" type="submit" loading={isSubmitting} variant="contained">
              Update
            </LoadingButton>
            <LoadingButton
              fullWidth
              size="large"
              loading={isDeleting}
              onClick={handleDelete}
              variant="outlined"
              color="error"
            >
              Delete
            </LoadingButton>
          </>
        ) : (
          <LoadingButton fullWidth size="large" type="submit" loading={isSubmitting} variant="contained">
            Add
          </LoadingButton>
        )}
      </Stack>
    </form>
  );
}
