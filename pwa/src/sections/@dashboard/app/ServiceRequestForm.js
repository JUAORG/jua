import { useEffect, useState } from 'react';
import { get } from 'lodash';
import ReactGA from 'react-ga';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LoadingButton } from '@mui/lab';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import notificationManager from '../../../actions/NotificationManager';
import { auth, db } from '../../../actions/firebase'; // Adjust the path as needed

export default function ServiceRequestForm({ closeDialog, serviceRequest, serviceProvider }) {
  const navigate = useNavigate();
  const formProps = useForm({ defaultValues: serviceRequest || {} });
  const { register, setValue, handleSubmit } = formProps;
  const [date, setDate] = useState(get(serviceRequest, 'date_and_time') ? new Date(get(serviceRequest, 'date_and_time')) : null);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    if (serviceProvider) {
      setValue('serviceProvider', serviceProvider.ref || serviceProvider.id);
    }
  }, [serviceProvider, setValue]);

  const handleDateTimeChange = (newDate) => {
    setDate(newDate?.toDate ? newDate.toDate() : newDate);
    setValue('date_and_time', newDate?.toDate ? newDate.toDate() : newDate);
  };

  const onSubmit = async (values) => {
    try {
      setSubmissionLoading(true);

      ReactGA.event({
        value: 1,
        category: 'Service Requests',
        action: serviceRequest ? 'Service Request updated' : 'Service Request created',
      });

      const user = auth.currentUser;
      if (!user) {
        notificationManager.error('User is not authenticated.', 'Error');
        return;
      }

      if (!values.serviceProvider) {
        notificationManager.error('Service Provider is required.', 'Error');
        return;
      }

      if (!date) {
        notificationManager.error('Please select a valid date and time.', 'Error');
        return;
      }

      const safeDate = date.toDate ? date.toDate() : date;

      if (serviceRequest?.id) {
        const requestRef = doc(db, 'users', user.uid, 'serviceRequests', serviceRequest.id);
        await updateDoc(requestRef, {
          ...values,
          date_and_time: safeDate,
          updatedAt: serverTimestamp(),
        });
      } else {
        const requestsCollection = collection(db, 'users', user.uid, 'serviceRequests');
        await addDoc(requestsCollection, {
          ...values,
          date_and_time: safeDate,
          createdAt: serverTimestamp(),
          status: 'Pending',
          customer: user.uid,
        });
      }

      notificationManager.success('Service Request submitted successfully.', 'Success');
      navigate('/dashboard/service_requests', { replace: true });
    } catch (error) {
      console.error(error);
      notificationManager.error('Something went wrong while submitting the request.', 'Error');
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          required
          label="Subject"
          {...register('subject', { required: 'Subject is required' })}
        />

        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-za">
          <DateTimePicker
            label="Ideal date and time for service request"
            required
            value={date}
            onChange={handleDateTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <TextField fullWidth label="Description (optional)" {...register('description')} />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          loading={submissionLoading}
          variant="contained"
        >
          {serviceRequest?.id ? 'Update Request' : 'Send Request'}
        </LoadingButton>
      </Stack>
    </form>
  );
}
