import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { getDoc, doc } from 'firebase/firestore';
import { get } from 'lodash';
import Page from '../components/Page';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import { auth, db } from '../actions/firebase'; // ✅ Ensure both are imported correctly

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
    const fetchServiceRequest = async () => {
      try {
        const ref = doc(db, 'serviceRequests', serviceRequestId); // 👈 update path if needed
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          throw new Error('Service request not found.');
        }

        const data = snap.data();
        setServiceRequest({ id: snap.id, ...data });
      } catch (err) {
        console.error(err);
        setError('Failed to load the service request.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequest();
  }, [serviceRequestId]);

  const currentUid = auth.currentUser?.uid;
  const isServiceProvider = currentUid && currentUid === get(serviceRequest, 'serviceProvider');
  const isCustomer = currentUid && currentUid === get(serviceRequest, 'customer');

  // Permission check
  const hasAccess = isServiceProvider || isCustomer;

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

        {!loading && serviceRequest && hasAccess && (
          <>
            <ServiceRequestForm
              serviceRequest={serviceRequest}
              isServiceProvider={isServiceProvider}
            />

            {get(serviceRequest, 'status') === 'Accepted' && (
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

        {!loading && serviceRequest && !hasAccess && (
          <Alert severity="warning" sx={{ mt: 4 }}>
            You do not have permission to view this service request.
          </Alert>
        )}
      </Container>
    </Page>
  );
}
