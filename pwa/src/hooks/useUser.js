import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../actions/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(ref);

        const baseUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL, // ✅ Add this
        };

        if (snap.exists()) {
          setUser({ ...baseUser, ...snap.data() });
        } else {
          setUser(baseUser);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL, // ✅ Still include on error
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
