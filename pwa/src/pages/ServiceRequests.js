import { useState } from 'react';
import { Typography, Skeleton, Card, CardContent, List, ListItem, ListItemText, Divider, Container, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Page from '../components/Page';
import { useUserServiceRequests } from '../hooks/useUserServiceRequests';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm'; // Ensure this is the updated Firebase version

export default function ServiceRequests() {
  const { serviceRequests, loading, authorized } = useUserServiceRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleOpenEdit = (req) => {
    setSelectedRequest(req);
  };

  const handleCloseEdit = () => {
    setSelectedRequest(null);
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
          {serviceRequests.map((req) => (
            <div key={req.id}>
              <ListItem alignItems="flex-start" secondaryAction={
                <IconButton edge="end" aria-label="edit" onClick={() => handleOpenEdit(req)}>
                  <EditIcon />
                </IconButton>
              }>
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
          {serviceRequests.length === 0 && (
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
          <img
            alt="Booking"
            width={150}
            style={{ margin: 'auto' }}
            src="/static/illustrations/undraw_booking.svg"
          />
          Service Requests
        </Typography>
        {loading && renderSkeletonList()}
        {!loading && !authorized && (
          <Typography align="center" variant="h6" sx={{ mt: 5, color: 'error.main' }}>
            You are not authorized to view service requests.
          </Typography>
        )}
        {!loading && authorized && renderServiceRequestList()}

        {selectedRequest && (
          <ServiceRequestForm
            serviceRequest={selectedRequest}
            closeDialog={handleCloseEdit}
            isServiceProvider={false} // Optional prop based on your flow
            serviceProvider={selectedRequest.serviceProvider ? { id: selectedRequest.serviceProvider } : null}
          />
        )}
      </Container>
    </Page>
  );
}
