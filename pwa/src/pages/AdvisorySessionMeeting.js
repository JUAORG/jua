// File: src/pages/AdvisorySessionMeeting.js
import { useState, useEffect } from 'react';
import {
  Grid,
  Container,
  Typography,
  Divider,
  Box,
  Button,
  InputLabel,
  Input,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Link,
  TextField,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import moment from 'moment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  increment,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import JitsiComponent from '../sections/advisory_session/meeting/JitsiMeeting';
import Page from '../components/Page';
import { auth, db, storage } from '../actions/firebase';

export default function AdvisorySessionMeeting() {
  const [file, setFile] = useState(null);
  const [fileTag, setFileTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');

  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  const currentUserId = auth.currentUser?.uid;

  const fetchResources = async () => {
    if (!roomId) return;
    const snap = await getDocs(collection(db, 'serviceRequests', roomId, 'resources'));
    const withNames = await Promise.all(
      snap.docs.map(async docSnap => {
        const data = docSnap.data();
        let uploaderName = data.uploadedBy;
        try {
          const userSnap = await getDoc(doc(db, 'users', data.uploadedBy));
          if (userSnap.exists()) {
            const { firstName, lastName } = userSnap.data();
            uploaderName = `${firstName || ''} ${lastName || ''}`.trim() || data.uploadedBy;
          }
        } catch (err) {
          console.error('Failed to fetch uploader name:', err);
        }
        return { id: docSnap.id, ...data, uploaderName };
      })
    );
    setResources(withNames.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
  };

  useEffect(() => {
    fetchResources();
  }, [roomId, snackOpen]);

  const fetchUserMap = async uids => {
    const map = {};
    await Promise.all(
      uids.map(async uid => {
        if (!map[uid]) {
          const snap = await getDoc(doc(db, 'users', uid));
          if (snap.exists()) {
            const data = snap.data();
            map[uid] = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          } else {
            map[uid] = uid;
          }
        }
      })
    );
    setUserMap(map);
  };

  useEffect(() => {
    const unsubscribe =
      roomId &&
      onSnapshot(
        query(collection(db, 'serviceRequests', roomId, 'chat'), orderBy('createdAt', 'asc')),
        async snapshot => {
          const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const uniqueUids = [...new Set(msgs.map(msg => msg.senderId))];
          await fetchUserMap(uniqueUids);
          setChatMessages(msgs);
        }
      );
    return () => unsubscribe && unsubscribe();
  }, [roomId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const user = auth.currentUser;
    const messageObj = {
      message: newMessage.trim(),
      senderId: user.uid,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'serviceRequests', roomId, 'chat'), messageObj);
    setNewMessage('');

    await addDoc(collection(db, 'serviceRequests', roomId, 'logs'), {
      type: 'chat',
      message: `${user.displayName || 'A user'} sent a message`,
      createdAt: serverTimestamp(),
      userId: user.uid,
    });

    await addDoc(collection(db, 'users', user.uid, 'notifications'), {
      title: 'New Message',
      message: 'You sent a message in a session.',
      type: 'chat',
      createdAt: serverTimestamp(),
      read: false,
    });
  };

  const handleUpload = async () => {
    if (!file || !roomId) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Max file size is ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('File type not supported. Please upload PDF, PNG, JPG, or Excel.');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    try {
      setUploading(true);
      const fileRef = ref(storage, `serviceRequests/${roomId}/resources/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed', null, console.error, async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, 'serviceRequests', roomId, 'resources'), {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          url: downloadURL,
          uploadedBy: user.uid,
          tag: fileTag || '',
          views: 0,
          createdAt: serverTimestamp(),
        });
        setFile(null);
        setFileTag('');
        setSnackOpen(true);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async res => {
    if (!roomId || !res.id) return;
    if (res.uploadedBy !== currentUserId) {
      alert('You can only delete files you uploaded.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'serviceRequests', roomId, 'resources', res.id));
      const fileRef = ref(storage, `serviceRequests/${roomId}/resources/${res.fileName}`);
      await deleteObject(fileRef);
      fetchResources();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleView = async res => {
    const resRef = doc(db, 'serviceRequests', roomId, 'resources', res.id);
    try {
      await updateDoc(resRef, { views: increment(1) });
      setResources(prev => prev.map(item => (item.id === res.id ? { ...item, views: (item.views || 0) + 1 } : item)));
      window.open(res.url, '_blank', 'noopener');
    } catch (err) {
      console.error('Failed to increment view count:', err);
    }
  };

  return (
    <Page title="Advisory Session">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Advisory Session
        </Typography>

        <Box sx={{ mb: 3 }}>
          <InputLabel htmlFor="file">Upload Session Material</InputLabel>
          <Input type="file" onChange={e => setFile(e.target.files[0])} disabled={uploading} />
          <TextField
            fullWidth
            placeholder="Optional: Tag this file (e.g. slides, assignment)"
            value={fileTag}
            onChange={e => setFileTag(e.target.value)}
            sx={{ mt: 1 }}
          />
          <Button variant="contained" sx={{ mt: 1 }} onClick={handleUpload} disabled={!file || uploading}>
            Upload
          </Button>
        </Box>

        {resources.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Uploaded Materials</Typography>
            <List>
              {resources.map(res => (
                <ListItem key={res.id} divider>
                  <ListItemText
                    primary={res.fileName}
                    secondary={`Uploaded by ${res.uploaderName}, ${(res.fileSize / 1024 / 1024).toFixed(2)} MB • ${res.createdAt?.toDate ? moment(res.createdAt.toDate()).format('lll') : ''} • Views: ${res.views || 0}`}
                  />
                  {res.tag && <Chip label={res.tag} sx={{ mr: 2 }} />}
                  <IconButton onClick={() => handleView(res)}>
                    <VisibilityIcon />
                  </IconButton>
                  {res.uploadedBy === currentUserId && (
                    <Button color="error" onClick={() => handleDelete(res)}>
                      Delete
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        <Grid>{/* <JitsiComponent /> */}</Grid>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Chat
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto', p: 2, mb: 2 }}>
            {chatMessages.map(msg => (
              <Box key={msg.id} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  <strong>{msg.senderId === currentUserId ? 'You' : userMap[msg.senderId] || msg.senderId}</strong>:{' '}
                  {msg.message}
                  <br />
                  <small>{msg.createdAt?.toDate ? moment(msg.createdAt.toDate()).format('LT') : ''}</small>
                </Typography>
              </Box>
            ))}
          </Paper>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            sx={{ mb: 1 }}
          />
          <Button variant="contained" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </Box>

        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
          message="File uploaded successfully"
        />
      </Container>
    </Page>
  );
}
