import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../actions/firebase';

export async function fetchServiceRequest(requestId) {
  try {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) throw new Error('User not authenticated');

    const ref = doc(db, 'serviceRequests', requestId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error('Service request not found.');
    }

    const data = snap.data();
    const isParticipant = currentUid === data.customer || currentUid === data.serviceProvider;

    if (!isParticipant) {
      throw new Error('Access denied');
    }

    return { data: { id: snap.id, ...data }, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}
