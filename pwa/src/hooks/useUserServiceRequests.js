// File: src/hooks/useUserServiceRequests.js
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../actions/firebase';

export default function useUserServiceRequests(options = {}) {
  const {
    status = null,          // e.g. 'Accepted', 'Pending'
    sortBy = 'createdAt',   // field to sort by
    sortOrder = 'desc',     // 'asc' or 'desc'
  } = options;

  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUid) {
      setServiceRequests([]);
      setLoading(false);
      return;
    }

    const baseCollection = collection(db, 'serviceRequests');

    // Build query conditions for both customer and provider
    const buildQuery = (roleField) => {
      let q = query(baseCollection, where(roleField, '==', currentUid));
      if (status) q = query(q, where('status', '==', status));
      if (sortBy) q = query(q, orderBy(sortBy, sortOrder));
      return q;
    };

    const customerQuery = buildQuery('customer');
    const providerQuery = buildQuery('serviceProvider');

    const unsubCustomer = onSnapshot(
      customerQuery,
      (snapshot) => {
        const customerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServiceRequests(prev => {
          const providerOnly = prev.filter(req => req.serviceProvider === currentUid && req.customer !== currentUid);
          return dedupeById([...customerData, ...providerOnly]);
        });
        setLoading(false);
      },
      (err) => {
        console.error('Customer query error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    const unsubProvider = onSnapshot(
      providerQuery,
      (snapshot) => {
        const providerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServiceRequests(prev => {
          const customerOnly = prev.filter(req => req.customer === currentUid && req.serviceProvider !== currentUid);
          return dedupeById([...customerOnly, ...providerData]);
        });
        setLoading(false);
      },
      (err) => {
        console.error('Provider query error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubCustomer();
      unsubProvider();
    };
  }, [currentUid, status, sortBy, sortOrder]);

  return { serviceRequests, loading, error };
}

// Helper: Remove duplicates by `id`
function dedupeById(requests) {
  const map = new Map();
  requests.forEach(req => map.set(req.id, req));
  return Array.from(map.values());
}
