import { useEffect, useState } from 'react';
import moment  from 'moment'
import { get } from 'lodash';
import ReactGA from 'react-ga';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { Stack, TextField } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LoadingButton } from '@mui/lab';
import notificationManager from '../../../actions/NotificationManager';
import { createServiceRequest, updateServiceRequest } from '../../../actions/JuaNetwork';

export default function ServiceRequestForm({ closeDialog, serviceRequest, isServiceProvider, serviceProvider }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formProps = useForm({ defaultValues: serviceRequest });
  const { register, reset, setValue, getValues, handleSubmit } = formProps;
  const [date, setDate] = useState(get(serviceRequest, 'date_and_time'));
  const [serviceRequestSubmissionLoading, setServiceRequestSubmissionLoading] = useState(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  console.log('dd', serviceProvider)
  const { mutate, isLoading } = useMutation({
    mutationFn: (values) => (get(serviceRequest, 'ref') ? updateServiceRequest(values) : createServiceRequest(values)),
    onMutate: () => {
      setSubmitButtonDisabled(true)
      setServiceRequestSubmissionLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_requests'] });
      ReactGA.event({
        value: 1,
        category: 'Service Requests',
        action: 'Service Request created'
      })
      notificationManager.success('Service Request', 'Success');
      navigate(`/dashboard/service_requests/`, { replace: true });

    },
    onError: () => notificationManager.error('something went wrong', 'Error'),
    onSettled: () => {
      setServiceRequestSubmissionLoading(false);
    }
  });

  useEffect(() => {
    setValue('service_provider', get(serviceProvider, 'ref'));
    console.log('bb', getValues())
  }, [serviceProvider]);

  const handleDateTimeChange = (newDate) => {
    setDate(newDate);
    setValue('date_and_time', newDate);
    //        console.debug(newDate.add(2, 'hours'))
  };

  const renderServiceRequestForm = () => {
    return (
      <>
        <TextField fullWidth required label="Subject" {...register('subject')} />
        <LocalizationProvider
          dateAdapter={AdapterMoment}
          adapterLocale="en-za"
        >
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
