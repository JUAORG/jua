// firebaseProfile.js
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  collection
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './firebase'; // update path

const getUserId = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  return user.uid;
};

export async function uploadUserProfile(file) {
  const uid = getUserId();
  const storageRef = ref(storage, `users/${uid}/profile_picture`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  await updateDoc(doc(db, 'users', uid), {
    profilePictureUrl: downloadUrl
  });

  return { profilePictureUrl: downloadUrl };
}

export async function editUserProfile(values) {
  const uid = getUserId();
  const profileRef = doc(db, 'users', uid);
  await updateDoc(profileRef, values);
  return values;
}

// --------------------- Education ---------------------

export async function createUserEducation(values) {
  const uid = getUserId();
  const ref = await addDoc(collection(db, 'users', uid, 'education'), {
    ...values,
    createdAt: new Date().toISOString()
  });
  return { id: ref.id, ...values };
}

export async function updateUserEducation(values) {
  const uid = getUserId();
  const refId = values.ref;
  const updateData = { ...values };
  delete updateData.ref;

  const docRef = doc(db, 'users', uid, 'education', refId);
  await updateDoc(docRef, updateData);
  return { id: refId, ...updateData };
}

export async function deleteUserEducation(values) {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'education', values.ref);
  await deleteDoc(docRef);
  return { id: values.ref };
}

// --------------------- Experience ---------------------

export async function createUserExperience(values) {
  const uid = getUserId();
  const ref = await addDoc(collection(db, 'users', uid, 'experience'), {
    ...values,
    createdAt: new Date().toISOString()
  });
  return { id: ref.id, ...values };
}

export async function updateUserExperience(values) {
  const uid = getUserId();
  const refId = values.ref;
  const updateData = { ...values };
  delete updateData.ref;

  const docRef = doc(db, 'users', uid, 'experience', refId);
  await updateDoc(docRef, updateData);
  return { id: refId, ...updateData };
}

export async function deleteUserExperience(values) {
  const uid = getUserId();
  const docRef = doc(db, 'users', uid, 'experience', values.ref);
  await deleteDoc(docRef);
  return { id: values.ref };
}

// --------------------- Account Payment ---------------------

export async function fetchAccountPayment() {
  const uid = getUserId();
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data().account || {} : {};
}

export async function updateAccountPayment(values) {
  const uid = getUserId();
  await updateDoc(doc(db, 'users', uid), {
    account: values
  });
  return values;
}
