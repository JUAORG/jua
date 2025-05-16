// auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
// ------------------- User Session Management -------------------

export const getCurrentUser = () => auth.currentUser;

export const listenToAuthChanges = callback => onAuthStateChanged(auth, callback);

export const getIdToken = async () => {
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

// ------------------- Authentication Actions -------------------

export const emailAndPasswordRegister = async values => {
  const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
  const { user } = userCredential;

  // Store additional profile data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    createdAt: new Date().toISOString(),
  });

  return userCredential;
};

export const emailAndPasswordSignIn = async values => {
  const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
  return userCredential;
};

export const logout = async () => {
  await signOut(auth);
};

// ------------------- User Info and Password -------------------

export const getUserProfile = async uid => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data();
  }
  return null;
};

export const updateUserPassword = async newPassword => {
  const user = auth.currentUser;
  if (user) {
    await updatePassword(user, newPassword);
  } else {
    throw new Error('No authenticated user');
  }
};

// ------------------- Password Reset -------------------

export const sendPasswordResetOtp = async values => {
  await sendPasswordResetEmail(auth, values.email);
};
