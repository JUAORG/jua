// src/hooks/useNotificationCount.js
import { useEffect, useState } from 'react';
import { auth, db } from '../actions/firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function useNotificationData() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'users', auth.currentUser.uid, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(entries);
      setUnreadCount(entries.filter((item) => !item.read).length);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
  };
}
