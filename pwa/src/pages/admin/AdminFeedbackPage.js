import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../actions/firebase'; // Adjust the path to your firebase.js config
import Page from '../../components/Page';
// import { saveAs } from 'file-saver'; // npm install file-saver
// import { Parser } from 'json2csv';   // npm install json2csv

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notAdmin, setNotAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const [daysFilter, setDaysFilter] = useState(0); // e.g. 7 = past week

  useEffect(() => {
    const checkAndSubscribe = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || userSnap.data().role !== 'admin') {
        setNotAdmin(true);
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'platformFeedback'), orderBy('submittedAt', 'desc'));
      const unsubscribe = onSnapshot(q, snapshot => {
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbackList(entries);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkAndSubscribe();
  }, []);

  const filteredList = useMemo(
    () =>
      feedbackList.filter(entry => {
        const searchMatch =
          (entry.subject || '').toLowerCase().includes(search.toLowerCase()) ||
          (entry.message || '').toLowerCase().includes(search.toLowerCase()) ||
          (entry.userEmail || '').toLowerCase().includes(search.toLowerCase());

        const timeMatch =
          !daysFilter ||
          (entry.submittedAt?.toDate && new Date() - entry.submittedAt.toDate() <= daysFilter * 24 * 60 * 60 * 1000);

        return searchMatch && timeMatch;
      }),
    [feedbackList, search, daysFilter]
  );

  const exportToCSV = () => {
    const parser = null; // new Parser();
    const csv = parser.parse(
      filteredList.map(entry => ({
        id: entry.id,
        subject: entry.subject,
        message: entry.message,
        userEmail: entry.userEmail,
        submittedAt: entry.submittedAt?.toDate().toISOString(),
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    // saveAs(blob, 'jua_feedback_export.csv');
  };

  return (
    <Page title="Platform Feedback">
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 2 }}>
          Platform Feedback
        </Typography>

        {loading && <CircularProgress />}
        {notAdmin && <Alert severity="error">You do not have permission to view this page.</Alert>}

        {!loading && !notAdmin && (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="Search"
                variant="outlined"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Subject, message, email..."
                fullWidth
              />
              <TextField
                label="Filter days"
                type="number"
                variant="outlined"
                value={daysFilter}
                onChange={e => setDaysFilter(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0 } }}
                sx={{ width: 120 }}
              />
              <Button variant="outlined" onClick={exportToCSV}>
                Export CSV
              </Button>
            </Stack>

            {filteredList.length === 0 ? (
              <Alert severity="info">No feedback matches your criteria.</Alert>
            ) : (
              <List>
                {filteredList.map(entry => (
                  <Box key={entry.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={entry.subject || '(No subject)'}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary">
                              {entry.message}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                              From: {entry.userEmail || 'Anonymous'} •{' '}
                              {entry.submittedAt?.toDate().toLocaleString() || 'unknown time'}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
