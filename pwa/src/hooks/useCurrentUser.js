import { useState, useEffect } from 'react';
import { auth, db } from '../actions/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { currentUser } = auth;
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUser({ ...userSnap.data(), id: userSnap.id });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loadingUser };
}
