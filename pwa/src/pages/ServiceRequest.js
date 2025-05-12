// File: src/pages/ServiceRequest.js
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import Page from '../components/Page';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import { fetchServiceRequest } from '../utils/serviceRequest';
import { auth } from '../actions/firebase';

export default function ServiceRequest() {
  const navigate = useNavigate();
  const { serviceRequestId } = useParams();

  const [serviceRequest, setServiceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goBack = () => {
    navigate('/dashboard/service_requests', { replace: true });
  };

  const goToServiceRequestMeeting = () => {
    navigate(`/dashboard/advisory_session_meeting/?room=${serviceRequestId}`, { replace: true });
  };

  useEffect(() => {
    const loadRequest = async () => {
      const { data, error } = await fetchServiceRequest(serviceRequestId);
      if (error) setError(error);
      if (data) setServiceRequest(data);
      setLoading(false);
    };
    loadRequest();
  }, [serviceRequestId]);

  const currentUid = auth.currentUser?.uid;
  const isServiceProvider = currentUid && currentUid === serviceRequest?.serviceProvider;

  return (
    <Page title="Service Request">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Service Request
        </Typography>

        <Button variant="outlined" onClick={goBack} sx={{ mb: 3 }}>
          Back
        </Button>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && serviceRequest && (
          <>
            <ServiceRequestForm
              serviceRequest={serviceRequest}
              isServiceProvider={isServiceProvider}
            />

            {serviceRequest.status === 'Accepted' && (
              <Button 
                sx={{ mt: 5 }}
                variant="contained"
                onClick={goToServiceRequestMeeting}
              >
                Go To Service Request
              </Button>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
