import {
  ref,
  push,
  child,
  update,
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
import { createId } from '../utils/uuid-generator'
import { getAuthId } from './Auth'

const db = getDatabase()
const uid = getAuthId()

export const yoco = new window.YocoSDK({
  publicKey: 'pk_test_ed3c54a6gOol69qa7f45',
})

export async function makePayment(amount) {
  console.log(amount)
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
        alert(`error occured: ${errorMessage}`);
      } else {
        // update db
        alert(`card successfully tokenised: ${result.id}`);
      }
      // In a real integration - you would now pass this chargeToken back to your
      // server along with the order/basket that the customer has purchased.
    }
    }) 
}
