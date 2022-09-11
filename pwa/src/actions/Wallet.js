import {
  ref,
  push,
  child,
  update,
  onValue,
  increment,
  getDatabase,
  serverTimestamp
} from 'firebase/database'
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

const db = getDatabase()
const uid = getAuthId()

export const yoco = new window.YocoSDK({
  publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY,
})

export async function creditAccount(amount) {
  const transactionId = createId()
  const values = {}
  values.id = transactionId
  values.action = 'credit'
  values.amount = parseFloat(amount)
  values.created_at = serverTimestamp()
 
  update(ref(db, `users/${ uid }/updates/${ values.id }/`), {
    action: values.action,
    title: 'Jua Wallet Credited',
    body: `+ R${ values.amount }`,
    timestamp: values.created_at
  })
  update(ref(db, `users/${ uid }/ledger/${ values.id }/`), values)
  values.creditTo = uid
  update(ref(db, `ledger/${ values.id }/`), values)
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
        creditAccount(amount).then(() => {
          notificationManager.success(`R${amount} credited to your JUA wallet', 'Success`)
        })
      }
      // In a real integration - you would now pass this chargeToken back to your
      // server along with the order/basket that the customer has purchased.
    }
  })
}
