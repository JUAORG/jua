// File: src/pages/ServiceRequests.js
import { useState } from 'react';
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
  TextField,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import { auth } from '../actions/firebase';
import useUserServiceRequests from '../hooks/useUserServiceRequests';

export default function ServiceRequests() {
  const navigate = useNavigate();
  const currentUid = auth.currentUser?.uid;

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const { serviceRequests, loading, error } = useUserServiceRequests({
    status: filterStatus || null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleOpenEdit = req => setSelectedRequest(req);
  const handleCloseEdit = () => setSelectedRequest(null);
  const handleItemClick = id => navigate(`/dashboard/service_request/${id}`);

  const filteredRequests = serviceRequests.filter(req =>
    req.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          label="Search by subject or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <TextField
          select
          fullWidth
          margin="normal"
          variant="outlined"
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Accepted">Accepted</MenuItem>
          <MenuItem value="Declined">Declined</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <List disablePadding>
          {filteredRequests.map(req => (
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
          {filteredRequests.length === 0 && !loading && (
            <Typography variant="body2" sx={{ textAlign: 'center', p: 2 }}>
              No service requests found.
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
