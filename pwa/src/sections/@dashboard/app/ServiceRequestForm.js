import { useEffect, useState } from 'react';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Stack, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LoadingButton } from '@mui/lab';
import notificationManager from '../../../actions/NotificationManager';
import { createServiceRequest, updateServiceRequest } from '../../../actions/JuaNetwork';

export default function ServiceRequestForm({ closeDialog, serviceRequest, isServiceProvider, serviceProvider }) {
  const queryClient = useQueryClient();
  const formProps = useForm({ defaultValues: serviceRequest });
  const { register, reset, setValue, handleSubmit } = formProps;
  const [date, setDate] = useState(get(serviceRequest, 'date_and_time'));
  const [serviceRequestSubmissionLoading, setServiceRequestSubmissionLoading] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: (values) => (get(serviceRequest, 'ref') ? updateServiceRequest(values) : createServiceRequest(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_requests'] });
      setServiceRequestSubmissionLoading(true);
      setTimeout(() => {
        notificationManager.success('Service Request', 'Success');
        setSubmitButtonDisabled(true);
        setServiceRequestSubmissionLoading(false);
      }, 5000);
    },
    onError: () => notificationManager.error('something went wrong', 'Error'),
  });

  useEffect(() => {
    setValue('service_provider', get(serviceProvider, 'ref'));
  }, []);

  const handleDateTimeChange = (newDate) => {
    setDate(newDate);
    setValue('date_and_time', newDate);
  };

  const renderServiceRequestForm = () => {
    return (
      <>
        <TextField fullWidth required label="Subject" {...register('subject')} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Ideal date time for service request"
            required
            value={date}
            onChange={handleDateTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField required fullWidth type="text" label="Description (optional)" {...register('description')} />
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
      <Stack spacing={3}>
        {renderServiceRequestForm()}
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          loading={serviceRequestSubmissionLoading}
          disabled={submitButtonDisabled}
          variant="contained"
        >
          {get(serviceRequest, 'id') ? 'Update' : 'Send Request'}
        </LoadingButton>
      </Stack>
    </form>
  );
}
