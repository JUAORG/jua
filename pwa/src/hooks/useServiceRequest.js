// File: src/hooks/useServiceRequest.js
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../actions/firebase';

export const useServiceRequest = (id) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'serviceRequests', id), (snapshot) => {
      if (snapshot.exists()) {
        setRequest({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  return { request, loading };
};
