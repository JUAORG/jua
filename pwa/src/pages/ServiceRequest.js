// File: src/pages/ServiceRequest.js
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import notificationManager from '../actions/NotificationManager';
import Page from '../components/Page';
import { db, auth } from '../actions/firebase';
import { useServiceRequestLive } from '../hooks/useServiceRequestLive'; // <-- Update path if needed
import { useState } from 'react';

const yoco = new window.YocoSDK({
  publicKey: process.env.REACT_APP_YOCO_PUBLIC_KEY
});

export default function ServiceRequest() {
  const navigate = useNavigate();
  const { serviceRequestId } = useParams();

  const { data: serviceRequest, error, loading } = useServiceRequestLive(serviceRequestId);
  const [paying, setPaying] = useState(false);

  const goBack = () => {
    navigate('/dashboard/service_requests', { replace: true });
  };

  const goToServiceRequestMeeting = () => {
    navigate(`/dashboard/advisory_session_meeting/?room=${serviceRequestId}`, { replace: true });
  };

  const handlePopupPayment = async () => {
    const amount = 2000; // serviceRequest?.fee;
    if (!amount) {
      notificationManager.error('Invalid amount for payment', 'Error');
      return;
    }

    const amountInCents = Math.round(amount); // Already in cents
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
          const functionUrl =
            process.env.NODE_ENV === 'development'
              ? process.env.REACT_APP_FUNCTIONS_URL_DEV
              : process.env.REACT_APP_FUNCTIONS_URL_PROD;

          const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: result.id,
              amountInCents,
              serviceRequestId,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Payment failed');
          }

          notificationManager.success(`R${amount / 100} paid for session`, 'Success');

          const requestRef = doc(db, 'serviceRequests', serviceRequestId);
          await updateDoc(requestRef, {
            paymentStatus: 'paid',
            updatedAt: serverTimestamp(),
          });

          notificationManager.success('Payment successful. You can now access the session.', 'Success');
        } catch (err) {
          console.error(err);
          notificationManager.error('Something went wrong while processing payment', 'Error');
        } finally {
          setPaying(false);
        }
      },
      onClose: () => {
        setPaying(false);
      },
    });
  };

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
            <ServiceRequestForm
              serviceRequest={serviceRequest}
              isServiceProvider={isServiceProvider}
            />

            {/* Show Pay button to customer if status is Accepted and not yet paid */}
            {isCustomer && serviceRequest.status === 'Accepted' && serviceRequest.paymentStatus !== 'paid' && (
              <Button variant="contained" sx={{ mt: 5, mr: 2 }} disabled={paying} onClick={handlePopupPayment}>
                {paying ? 'Processing...' : `Pay R20`}
              </Button>
            )}

            {/* Show info to provider if payment not yet made */}
            {isServiceProvider && serviceRequest.status === 'Accepted' && serviceRequest.paymentStatus !== 'paid' && (
              <Alert severity="info" sx={{ mt: 5 }}>
                Waiting for customer to complete payment.
              </Alert>
            )}

            {/* Show access if paid */}
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
