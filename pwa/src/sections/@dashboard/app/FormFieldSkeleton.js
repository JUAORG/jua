import { get, map } from 'lodash';
import { useForm } from 'react-hook-form';
import { Stack, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import notificationManager from '../../../actions/NotificationManager';
import { fetchAccountPayment, updateAccountPayment } from '../../../actions/Profile';

export const FormFieldSkeleton = () => {
  return (
    <>
      <Skeleton height={50} animation="wave" />
      <Skeleton height={50} animation="wave" />
      <Skeleton height={50} animation="wave" />
      <Skeleton height={50} animation="wave" />
    </>
  );
}
