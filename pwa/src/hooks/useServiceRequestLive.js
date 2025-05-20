import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../actions/firebase';

export function useServiceRequestLive(serviceRequestId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceRequestId) return;

    const ref = doc(db, 'serviceRequests', serviceRequestId);
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setError('Service request not found.');
        }
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('Failed to load service request.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [serviceRequestId]);

  return { data, error, loading };
}
