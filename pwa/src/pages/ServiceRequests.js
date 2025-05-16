// File: src/pages/ServiceRequests.js
import { useEffect, useState } from 'react';
import {
  Typography,
  Skeleton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Page from '../components/Page';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import { auth, db } from '../actions/firebase';

export default function ServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const currentUid = auth.currentUser?.uid;
        if (!currentUid) throw new Error('User not logged in');

        const q = query(collection(db, 'serviceRequests'), where('customer', '==', currentUid));

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setServiceRequests(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load service requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleOpenEdit = req => {
    setSelectedRequest(req);
  };

  const handleCloseEdit = () => {
    setSelectedRequest(null);
  };

  const handleItemClick = id => {
    navigate(`/dashboard/service_request/${id}`);
  };

  const renderSkeletonList = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={80}
          sx={{ margin: '16px auto', width: { xs: '90vw', md: '60vw' } }}
        />
      ))}
    </>
  );

  const renderServiceRequestList = () => (
    <Card sx={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Your Service Requests
        </Typography>
        <List disablePadding>
          {serviceRequests.map(req => (
            <div key={req.id}>
              <ListItem
                button
                onClick={() => handleItemClick(req.id)}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={e => {
                      e.stopPropagation();
                      handleOpenEdit(req);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={req.subject || 'Untitled Request'}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {req.description || 'No description provided.'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {req?.createdAt?.toDate?.().toLocaleString() || 'Unknown time'}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </div>
          ))}
          {serviceRequests.length === 0 && !loading && (
            <Typography variant="body2" sx={{ textAlign: 'center', p: 2 }}>
              No service requests yet.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Page title="Service Requests">
      <Container maxWidth="md">
        <Typography align="center" variant="h4" sx={{ mb: 5 }}>
          <img alt="Booking" width={150} style={{ margin: 'auto' }} src="/static/illustrations/undraw_booking.svg" />
          Service Requests
        </Typography>

        {loading && renderSkeletonList()}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && renderServiceRequestList()}

        {selectedRequest && (
          <ServiceRequestForm
            serviceRequest={selectedRequest}
            closeDialog={handleCloseEdit}
            isServiceProvider={false}
            serviceProvider={selectedRequest.serviceProvider ? { id: selectedRequest.serviceProvider } : null}
          />
        )}
      </Container>
    </Page>
  );
}
