import { firebaseAuth } from "src/utils/firebase";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth'

export const signUp = async (email, password, firstName, lastName) => {

    const firebaseDb = getFirestore();
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;
    
    await addDoc(collection(firebaseDb, 'users'), {
      uid: user.uid,
      email: user.email,
      first_name: firstName,
      last_name: lastName,
    });
};
