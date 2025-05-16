import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import notificationManager from '../actions/NotificationManager';

export default function SearchBar() {
  const displayFunctionalityNotReadyMessage = () => {
    notificationManager.warning('This functionality is not ready yet', 'Work in progress');
  };

  return (
    <Paper component="form" sx={{ p: '2px 4px', m: '10px 0px 20px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        disabled
        onClick={displayFunctionalityNotReadyMessage}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Jua"
        inputProps={{ 'aria-label': 'search Jua' }}
      />
      <IconButton onClick={displayFunctionalityNotReadyMessage} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

// import { useState, useEffect } from 'react';
// import { Paper, InputBase, IconButton, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import { useNavigate } from 'react-router-dom';
// import { collection, collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
// import { db } from '../actions/firebase';

// export default function SearchBar() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setResults([]);
//       return;
//     }

//     setLoading(true);

//     // Listen for Users
//     const usersRef = collection(db, 'users');
//     const usersQuery = query(usersRef, where('profile_visible', '==', true));
//     const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
//       const usersResults = snapshot.docs
//         .filter((doc) => {
//           const data = doc.data();
//           return (
//             data.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             data.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             data.email?.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         })
//         .map((doc) => ({ type: 'user', id: doc.id, ...doc.data() }));

//       setResults((prev) => [...usersResults]);
//     });

//     // Listen for Service Requests
//     const serviceRequestsQuery = collectionGroup(db, 'serviceRequests');
//     const unsubscribeRequests = onSnapshot(serviceRequestsQuery, (snapshot) => {
//       const serviceRequestsResults = snapshot.docs
//         .filter((doc) => doc.data().subject?.toLowerCase().includes(searchTerm.toLowerCase()))
//         .map((doc) => ({ type: 'serviceRequest', id: doc.id, ...doc.data() }));

//       setResults((prev) => [...prev, ...serviceRequestsResults]);
//       setLoading(false);
//     });

//     return () => {
//       unsubscribeUsers();
//       unsubscribeRequests();
//     };
//   }, [searchTerm]);

//   const handleResultClick = (result) => {
//     if (result.type === 'user') {
//       navigate(`/dashboard/jua_network/${result.id}`);
//     } else if (result.type === 'serviceRequest') {
//       navigate(`/dashboard/service_request/${result.id}`);
//     }
//   };

//   return (
//     <>
//       <Paper component="form" sx={{ p: '2px 4px', m: '10px 0px 20px', display: 'flex', alignItems: 'center' }} onSubmit={(e) => e.preventDefault()}>
//         <InputBase
//           sx={{ ml: 1, flex: 1 }}
//           placeholder="Search users, service requests..."
//           inputProps={{ 'aria-label': 'search JUA' }}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <IconButton sx={{ p: '10px' }}>
//           {loading ? <CircularProgress size={20} /> : <SearchIcon />}
//         </IconButton>
//       </Paper>

//       {results.length > 0 && (
//         <List sx={{ border: '1px solid #ddd', borderRadius: 1, bgcolor: 'background.paper' }}>
//           {results.map((result) => (
//             <div key={result.id}>
//               <ListItem button onClick={() => handleResultClick(result)}>
//                 <ListItemText
//                   primary={result.type === 'user' ? `${result.first_name} ${result.last_name}` : result.subject}
//                   secondary={result.type === 'user' ? result.email : result.description}
//                 />
//               </ListItem>
//               <Divider />
//             </div>
//           ))}
//         </List>
//       )}
//     </>
//   );
// }
