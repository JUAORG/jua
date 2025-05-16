// File: src/sections/@dashboard/app/ServiceRequestForm.js
import { useEffect, useState } from 'react';
import { get } from 'lodash';
import ReactGA from 'react-ga';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  TextField,
  Snackbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LoadingButton } from '@mui/lab';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import notificationManager from '../../../actions/NotificationManager';
import { auth, db } from '../../../actions/firebase';

export default function ServiceRequestForm({
  closeDialog,
  serviceRequest,
  serviceProvider,
  isServiceProvider = false,
}) {
  const navigate = useNavigate();
  const formProps = useForm({ defaultValues: serviceRequest || {} });
  const { register, setValue, handleSubmit } = formProps;
  const [date, setDate] = useState(
    get(serviceRequest, 'date_and_time') ? new Date(get(serviceRequest, 'date_and_time')) : null
  );
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [actionDialog, setActionDialog] = useState(null);
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    if (serviceProvider) {
      setValue('serviceProvider', serviceProvider.ref || serviceProvider.id);
    }
  }, [serviceProvider, setValue]);

  const isFinalized = serviceRequest?.status === 'Accepted' || serviceRequest?.status === 'Cancelled';

  const handleDateTimeChange = newDate => {
    setDate(newDate?.toDate ? newDate.toDate() : newDate);
    setValue('date_and_time', newDate?.toDate ? newDate.toDate() : newDate);
  };

  const onSubmit = async values => {
    if (isFinalized) return;
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
        const requestRef = doc(db, 'serviceRequests', serviceRequest.id);
        await updateDoc(requestRef, {
          ...values,
          date_and_time: safeDate,
          updatedAt: serverTimestamp(),
        });
      } else {
        const requestsCollection = collection(db, 'serviceRequests');
        const requestDoc = await addDoc(requestsCollection, {
          ...values,
          date_and_time: safeDate,
          createdAt: serverTimestamp(),
          status: 'Pending',
          customer: user.uid,
        });

        const userNotifRef = collection(db, 'users', user.uid, 'notifications');
        await addDoc(userNotifRef, {
          title: 'Service Request Created',
          message: 'Your new service request has been submitted.',
          type: 'service_request',
          createdAt: serverTimestamp(),
          read: false,
        });

        const providerNotifRef = collection(db, 'users', values.serviceProvider, 'notifications');
        await addDoc(providerNotifRef, {
          title: 'New Service Request',
          message: `${user.displayName || 'A user'} has sent you a new service request.`,
          type: 'service_request',
          createdAt: serverTimestamp(),
          read: false,
        });
      }

      setOpenSuccess(true);
      closeDialog?.();
    } catch (error) {
      notificationManager.error('Something went wrong while submitting the request.', 'Error');
    } finally {
      setSubmissionLoading(false);
    }
  };

  const handleAction = async status => {
    try {
      const user = auth.currentUser;
      const requestRef = doc(db, 'serviceRequests', serviceRequest.id);
      await updateDoc(requestRef, {
        status,
        ...(actionReason && { reason: actionReason }),
        statusUpdatedAt: serverTimestamp(),
        statusUpdatedBy: user?.uid || null,
        updatedAt: serverTimestamp(),
      });
      // Log action to serviceRequests/{id}/logs
      const logRef = collection(db, 'serviceRequests', serviceRequest.id, 'logs');
      await addDoc(logRef, {
        action: status,
        message: actionReason || `Status changed to ${status}`,
        performedBy: user?.uid || null,
        performedAt: serverTimestamp(),
      });

      const recipient = status === 'Cancelled' ? serviceRequest.serviceProvider : serviceRequest.customer;
      const notifRef = collection(db, 'users', recipient, 'notifications');
      await addDoc(notifRef, {
        title: `Service Request ${status}`,
        message: actionReason || `The request was ${status.toLowerCase()}.`,
        type: 'service_request',
        createdAt: serverTimestamp(),
        read: false,
      });

      setActionDialog(null);
      setActionReason('');
      notificationManager.success(`Request ${status.toLowerCase()} successfully`, 'Success');
    } catch (error) {
      notificationManager.error('Failed to process the request.', 'Error');
    }
  };

  return (
    <>
      {isFinalized && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This request has been <strong>{serviceRequest?.status}</strong>
          {serviceRequest?.reason ? ` — ${serviceRequest.reason}` : ''}
          {serviceRequest?.statusUpdatedAt?.toDate && (
            <>
              {' '}
              on <strong>{moment(serviceRequest.statusUpdatedAt.toDate()).format('lll')}</strong>
            </>
          )}
          {serviceRequest?.statusUpdatedBy && (
            <>
              {' '}
              by <strong>{serviceRequest.statusUpdatedBy === serviceRequest.customer ? 'customer' : 'provider'}</strong>
            </>
          )}
          .
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            required
            label="Subject"
            disabled={isFinalized}
            {...register('subject', { required: 'Subject is required' })}
          />

          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-za">
            <DateTimePicker
              label="Ideal date and time for service request"
              required
              disabled={isFinalized}
              value={date}
              onChange={handleDateTimeChange}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>

          <TextField fullWidth label="Description (optional)" disabled={isFinalized} {...register('description')} />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            loading={submissionLoading}
            variant="contained"
            disabled={isFinalized}
          >
            {serviceRequest?.id ? 'Update Request' : 'Send Request'}
          </LoadingButton>

          {serviceRequest?.id &&
            !isFinalized &&
            (isServiceProvider ? (
              <Stack direction="row" spacing={2}>
                <Button color="success" variant="outlined" onClick={() => setActionDialog('Accepted')}>
                  Approve
                </Button>
                <Button color="error" variant="outlined" onClick={() => setActionDialog('Cancelled')}>
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Button color="error" variant="outlined" onClick={() => setActionDialog('Cancelled')}>
                Cancel Request
              </Button>
            ))}
        </Stack>
      </form>

      <Dialog open={!!actionDialog} onClose={() => setActionDialog(null)}>
        <DialogTitle>{actionDialog} Service Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionDialog === 'Cancelled'
              ? 'Please provide a reason for cancelling this request.'
              : 'You are about to approve this request.'}
          </DialogContentText>
          {actionDialog === 'Cancelled' && (
            <TextField
              autoFocus
              margin="dense"
              label="Reason"
              fullWidth
              variant="standard"
              value={actionReason}
              onChange={e => setActionReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(null)}>Close</Button>
          <Button onClick={() => handleAction(actionDialog)} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSuccess}
        autoHideDuration={4000}
        onClose={() => setOpenSuccess(false)}
        message="Service request submitted successfully"
      />
    </>
  );
}
