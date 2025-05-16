// File: src/actions/payment.js
import { get } from 'lodash';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import notificationManager from './NotificationManager';
import { createId } from '../utils/uuid-generator';
import { auth, db } from './firebase';

export const yoco = new window.YocoSDK({
  publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY,
});

export async function creditJuaWallet(amount, serviceRequestId) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const ledgerRef = collection(db, 'users', uid, 'ledger');

  await addDoc(ledgerRef, {
    type: 'credit',
    amount: parseFloat(amount),
    serviceRequestId,
    createdAt: serverTimestamp(),
  });
}

export async function getAvailableFunds() {
  const uid = auth.currentUser?.uid;
  if (!uid) return 0;
  const q = query(collection(db, 'users', uid, 'ledger'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.reduce((total, doc) => total + (doc.data().amount || 0), 0);
}

export async function makePayment(amount, serviceRequestId) {
  const amountInCents = amount * 100;

  yoco.showPopup({
    amountInCents,
    currency: 'ZAR',
    name: 'Jua Payment',
    description: 'Pay for advisory session on JUA',
    callback: async (result) => {
      if (result.error) {
        const errorMessage = result.error.message;
        notificationManager.error(`${errorMessage}`, 'Error');
        return;
      }

      try {
        await creditJuaWallet(amount, serviceRequestId);
        notificationManager.success(`R${amount} paid for session`, 'Success');

        await addDoc(collection(db, 'serviceRequests', serviceRequestId, 'logs'), {
          type: 'payment',
          message: `Customer paid R${amount} for the session`,
          createdAt: serverTimestamp(),
          userId: auth.currentUser.uid,
        });

        await addDoc(collection(db, 'users', auth.currentUser.uid, 'notifications'), {
          title: 'Payment Received',
          message: `Payment of R${amount} successfully processed`,
          type: 'payment',
          createdAt: serverTimestamp(),
          read: false,
        });
      } catch (err) {
        console.error(err);
        notificationManager.error('Something went wrong while processing payment', 'Error');
      }
    },
  });
}
