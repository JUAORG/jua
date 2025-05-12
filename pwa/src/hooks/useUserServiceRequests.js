import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../actions/firebase'; // Adjust the path to your firebase.js config

export function useUserServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;

    let unsubscribe = null;

    const checkUserRoleAndFetchRequests = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const userData = userSnap.data();
        const isServiceProvider = userData?.is_service_provider;
        const isCustomer = userData?.is_customer || true;

        if (isServiceProvider || isCustomer) {
          setAuthorized(true);

          const q = query(
            collection(db, 'users', auth.currentUser.uid, 'serviceRequests'),
            orderBy('createdAt', 'desc')
          );

          unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setServiceRequests(entries);
            setLoading(false);
          });
        } else {
          setAuthorized(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching service requests:', error);
        setAuthorized(false);
        setLoading(false);
      }
    };

    checkUserRoleAndFetchRequests();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { serviceRequests, loading, authorized };
}
