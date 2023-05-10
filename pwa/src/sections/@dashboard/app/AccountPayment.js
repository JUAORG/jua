import { useState, useEffect } from 'react';
import { get, values } from 'lodash';
import { useForm } from 'react-hook-form';
import {
  Stack,
  TextField,
  Radio,
  RadioGroup,
  FormLabel,
  Skeleton,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { LoadingButton } from '@mui/lab';
import notificationManager from '../../../actions/NotificationManager';
import { fetchAccountPayment, updateAccountPayment } from '../../../actions/Profile';
import { FormFieldSkeleton } from './FormFieldSkeleton'

export default function AccountPaymentMethodForm() {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(['user_account_payment'], fetchAccountPayment, {
    enabled: true,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
  });
  const formProps = useForm({ defaultValues: get(data, 'data') });
  const { register, getValues, setValue, handleSubmit } = formProps;
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState(getValues('preferred_payment_method'))


  const { mutate } = useMutation({
    mutationFn: (values) => updateAccountPayment(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      notificationManager.success('Profile updated', 'Success');
    },
    onError: (error) => notificationManager.error(`${JSON.stringify(error.response.data)}`),
  });
  
  console.debug(getValues('preferred_payment_method'))
  
  return (
    <form onSubmit={handleSubmit((values) => mutate(values))}>
      <Stack spacing={3} pb={5}>
        {isLoading && <FormFieldSkeleton/> }
        {!isLoading &&
         <>
           <InputLabel id="demo-simple-select-label">Preferred Payment Method</InputLabel>
           <Select
             labelId="demo-simple-select-label"
             id="demo-simple-select"
             value={preferredPaymentMethod}
             label="Preferred_payment_method"
             onChange={(e) => [setValue('preferred_payment_method', e.target.value), setPreferredPaymentMethod(e.target.value)]}
           >
             <MenuItem value='EWALLET'>Ewallet</MenuItem>
             <MenuItem value='EFT'>EFT</MenuItem>
           </Select>
           {/* <FormControlp */}
           {/*   <RadioGroup> */}
           {/*     row */}
           {/*     name="preferred_payment_method" */}
           {/*     {...register('preferred_payment_method')} */}
           {/*   > */}
           {/*     <FormControlLabel value="EFT" control={<Radio />}label="EFT"/> */}
           {/*     <FormControlLabel value="EWALLET" control={<Radio />}label="EWALLET"/> */}
           {/*   </RadioGroup> */}
           {/* </FormControl> */}
           <TextField required fullWidth label="Account Holder Name" {...register('account_holder_name')}/>
           <TextField required fullWidth label="Bank" {...register('bank')}/>
           <TextField required fullWidth label="branch_code" {...register('branch_code')} />
           <TextField required fullWidth label="Account Number" {...register('account_number')}/>
           <TextField required fullWidth label="Phone Number" {...register('phone_number')}/>
           <LoadingButton fullWidth size="large" type="submit" loading={false} variant="contained">
             Update
           </LoadingButton>
         </>
        }
      </Stack>
    </form>
  );
}
