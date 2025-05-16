import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { Stack, TextField, MenuItem, InputLabel, Select } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import notificationManager from '../../../actions/NotificationManager';
import { FormFieldSkeleton } from './FormFieldSkeleton';
import { auth, db } from '../../../actions/firebase'; // Adjust the path to your firebase.js config

export default function AccountPaymentMethodForm() {
  const formProps = useForm();
  const { register, reset, setValue, handleSubmit } = formProps;
  const [loading, setLoading] = useState(true);
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const loadPaymentData = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data().accountPayment || {};
          reset(data);
          setPreferredPaymentMethod(data.preferred_payment_method || '');
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    loadPaymentData();
  }, [reset]);

  const onSubmit = async values => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, { accountPayment: values });
      notificationManager.success('Account payment updated', 'Success');
    } catch (error) {
      notificationManager.error('Something went wrong', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} pb={5}>
        {loading && <FormFieldSkeleton />}
        {!loading && (
          <>
            <InputLabel>Preferred Payment Method</InputLabel>
            <Select
              value={preferredPaymentMethod}
              onChange={e => {
                setValue('preferred_payment_method', e.target.value);
                setPreferredPaymentMethod(e.target.value);
              }}
              required
            >
              <MenuItem value="EWALLET">Ewallet</MenuItem>
              <MenuItem value="EFT">EFT</MenuItem>
            </Select>

            <TextField required fullWidth label="Account Holder Name" {...register('account_holder_name')} />
            <TextField required fullWidth label="Bank" {...register('bank')} />
            <TextField required fullWidth label="Branch Code" {...register('branch_code')} />
            <TextField required fullWidth label="Account Number" {...register('account_number')} />
            <TextField required fullWidth label="Phone Number" {...register('phone_number')} />

            <LoadingButton fullWidth size="large" type="submit" loading={loading} variant="contained">
              Update
            </LoadingButton>
          </>
        )}
      </Stack>
    </form>
  );
}
