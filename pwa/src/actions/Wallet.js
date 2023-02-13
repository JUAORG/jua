import {
  map,
  get,
  size,
  merge,
  filter,
} from 'lodash'
import notificationManager from './NotificationManager'
import { createId } from '../utils/uuid-generator'
import { getAuthId } from './Auth'


export const yoco = new window.YocoSDK({
  publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY,
})

export async function creditJuaWallet(amount) {
  const transactionId = createId()
  const values = {}
  values.id = transactionId
  values.action = 'credit'
  values.amount = parseFloat(amount)

 
}

export async function getAvailableFunds(ledgerRecords) {
  let total = 0
  const bb = map(ledgerRecords, (x) => {
    total += get(x, 'amount')
  })
  return total
}

export async function makePayment(amount) {
  const amountInCents = amount * 100
  yoco.showPopup({
    amountInCents,
    currency: 'ZAR',
    name: 'Jua Wallet',
    description: 'Funds in your JUA wallet allows to make service requests',
    callback: (result) => {
      // This function returns a token that your server can use to capture a payment
      if (result.error) {
        const errorMessage = result.error.message;
        notificationManager.error(`${result.error.message}', 'Error`)
        alert(`error occured: ${errorMessage}`);
      } else {
        fetch(process.env.REACT_APP_PAYMENT_ENDPOINT, {
          body: `${get(result, 'id')},${amountInCents}`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: "POST"
        }).then((res) => {
          const statusCode = res.status
          if (statusCode === 200 || statusCode === 201) {
           creditJuaWallet(amount).then(() => {
             notificationManager.success(`R${amount} credited to your JUA wallet', 'Success`)
            })
          }
        }).catch(() => {
        notificationManager.error('Something went wrong', 'Error')
      })
    }
  }
})}
