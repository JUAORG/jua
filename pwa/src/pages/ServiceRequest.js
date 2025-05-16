// File: src/pages/ServiceRequest.js
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { httpsCallable, getFunctions } from 'firebase/functions';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import { fetchServiceRequest } from '../utils/serviceRequest';
import notificationManager from '../actions/NotificationManager';
import Page from '../components/Page';
import { auth } from '../actions/firebase';

const functions = getFunctions();

const yoco = new window.YocoSDK({
  publicKey: 'pk_test_ed3c54a6gOol69qa7f45', // process.env.REACT_APP_YOCO_PUBLIC_KEY
});

export default function ServiceRequest() {
  const navigate = useNavigate();
  const { serviceRequestId } = useParams();

  const [serviceRequest, setServiceRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);

  const goBack = () => {
    navigate('/dashboard/service_requests', { replace: true });
  };

  const goToServiceRequestMeeting = () => {
    navigate(`/dashboard/advisory_session_meeting/?room=${serviceRequestId}`, { replace: true });
  };

  const handlePopupPayment = async () => {
    const amount = 20000; // serviceRequest?.fee;
    if (!amount) {
      notificationManager.error('Invalid amount for payment', 'Error');
      return;
    }

    const amountInCents = Math.round(amount * 100);
    setPaying(true);

    yoco.showPopup({
      amountInCents,
      currency: 'ZAR',
      name: 'Jua Payment',
      description: 'Pay for advisory session on JUA',
      callback: async result => {
        if (result.error) {
          notificationManager.error(`${result.error.message}`, 'Error');
          setPaying(false);
          return;
        }

        try {
          const processPayment = httpsCallable(functions, 'processPayment');
          await processPayment({
            tokenId: result.id,
            amount,
            serviceRequestId,
          });

          notificationManager.success(`R${amount} paid for session`, 'Success');

          const { data } = await fetchServiceRequest(serviceRequestId);
          setServiceRequest(data);
        } catch (err) {
          notificationManager.error('Something went wrong while processing payment', 'Error');
        } finally {
          setPaying(false);
        }
      },
    });
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
  const isCustomer = currentUid && currentUid === serviceRequest?.customer;

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
            <ServiceRequestForm serviceRequest={serviceRequest} isServiceProvider={isServiceProvider} />

            {isCustomer && serviceRequest.status === 'Accepted' && serviceRequest.paymentStatus !== 'paid' && (
              <Button variant="contained" sx={{ mt: 5, mr: 2 }} disabled={paying} onClick={handlePopupPayment}>
                {paying ? 'Processing...' : `Pay R${serviceRequest.fee}`}
              </Button>
            )}

            {serviceRequest.status === 'Accepted' && serviceRequest.paymentStatus === 'paid' && (
              <Button sx={{ mt: 5 }} variant="contained" onClick={goToServiceRequestMeeting}>
                Go To Service Request
              </Button>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
