import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';

export const register = async (email, password, firstName, lastName, country, town, dob) => {
  const firebaseDb = getFirestore();
  const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const user = userCredential.user;

  await addDoc(collection(firebaseDb, 'users'), {
    uid: user.uid,
    "email": user.email,
    "first_name": firstName,
    "last_name": lastName,
    "country": country,
    "town": town,
    "dob": dob,
  });
};
