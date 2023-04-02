import axios from 'axios';
import { map, get } from 'lodash';
import notificationManager from './NotificationManager';
import { createId } from '../utils/uuid-generator';
import { defaultHeaders } from './Auth';

export const yoco = new window.YocoSDK({
  publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY,
});

export async function creditJuaWallet(amount) {
  const transactionId = createId();
  const values = {};
  values.id = transactionId;
  values.action = 'credit';
  values.amount = parseFloat(amount);
}

export async function getAvailableFunds(ledgerRecords) {
  let total = 0;
  const bb = map(ledgerRecords, (x) => {
    total += get(x, 'amount');
  });
  return total;
}

export async function fetchUserLedger() {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_ledger/`,
    withCredentials: false,
    headers: defaultHeaders,
  });
}

export async function makePayment(amount, serviceRequest) {
  const amountInCents = amount * 100;
  yoco.showPopup({
    amountInCents,
    currency: 'ZAR',
    name: 'Jua Wallet',
    description: 'Funds in your JUA wallet allows to make service requests',
    callback: (result) => {
      // This function returns a token that your server can use to capture a payment
      if (result.error) {
        const errorMessage = result.error.message;
        notificationManager.error(`${result.error.message}', 'Error`);
        alert(`error occured: ${errorMessage}`);
      } else {
        axios({
          method: 'POST',
          url: process.env.REACT_APP_PAYMENT_ENDPOINT,
          withCredentials: false,
          headers: defaultHeaders,
          data: {
            amountInCents,
            serviceRequest,
            token: get(result, 'id')
          },
        })
          .then((res) => {
            const statusCode = res.status;
            if (statusCode === 200 || statusCode === 201) {
              creditJuaWallet(amount).then(() => {
                notificationManager.success(`R${amount} credited to your JUA wallet', 'Success`);
              });
            }
          })
          .catch(() => {
            notificationManager.error('Something went wrong', 'Error');
          });
      }
    },
  });
}
