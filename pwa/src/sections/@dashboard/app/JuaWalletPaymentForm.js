import react, { useEffect, useState } from 'react';
import { get, head } from 'lodash';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import {
  Stack,
  Badge,
  Avatar,
  Input,
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { css, Global } from '@emotion/react';
import notificationManager from '../../../actions/NotificationManager';
import { createId } from '../../../utils/uuid-generator';
import { makePayment } from '../../../actions/Wallet';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const globalStyles = css`
  #CheckoutIframe {
    margin-top: 35px;
  }
`;

export default function JuaWalletPaymentForm() {
  const [amount, setAmount] = useState(250);
  const formProps = useForm({});

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = formProps;

  const onSubmit = () => {
    if (amount >= 1) {
      makePayment(amount);
    } else {
      notificationManager.error('Amount cannot be less than R1');
    }
  };

  const handleAmountChange = e => {
    setAmount(e.target.value);
  };

  return (
    <Stack spacing={3}>
      <Global styles={globalStyles} />
      <InputLabel>Amount</InputLabel>
      <Input
        type="number"
        value={amount}
        inputProps={{
          pattern: '[0-9]*',
          inputMode: 'number',
        }}
        onChange={handleAmountChange}
        startAdornment={<InputAdornment position="start">R</InputAdornment>}
      />
      <LoadingButton fullWidth size="large" variant="contained" loading={false} onClick={onSubmit}>
        Top Up Now
      </LoadingButton>
    </Stack>
  );
}
