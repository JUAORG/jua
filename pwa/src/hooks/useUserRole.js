// import { useEffect, useState } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, db } from '../actions/firebase';

// export function useUserRole() {
//   const [role, setRole] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRole = async () => {
//       try {
//         const user = auth.currentUser;
//         if (!user) {
//           setLoading(false);
//           return;
//         }

//         const userRef = doc(db, 'users', user.uid);
//         const userSnap = await getDoc(userRef);

//         if (userSnap.exists()) {
//           const data = userSnap.data();
//           setUserData(data);
//           setRole(data.role || null);
//         }
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRole();
//   }, []);

//   return { role, userData, loading };
// }

// import { useUserRole } from '../hooks/useUserRole';
// import { Typography } from '@mui/material';

// export default function SomeProtectedPage() {
//   const { role, userData, loading } = useUserRole();

//   if (loading) return <Typography>Loading...</Typography>;

//   if (role === 'admin') return <Typography>Welcome Admin {userData?.first_name}</Typography>;

//   if (userData?.is_service_provider) return <Typography>Welcome Service Provider</Typography>;

//   if (userData?.is_customer) return <Typography>Welcome Customer</Typography>;

//   return <Typography>You do not have a recognized role.</Typography>;
// }
