import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { fetchServiceRequests } from '../actions/JuaNetwork';
import Page from '../components/Page';
import { CalendarListDisplay } from '../components/CalendarListDisplay';

export default function ServiceRequests() {
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    fetchServiceRequests()
      .then((response) => {
        setServiceRequests(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Page title="Service Requests">
      <Typography align="Center" variant="h4" sx={{ mb: 5 }}>
        <img alt="Booking" width={150} style={{ margin: 'auto' }} src="/static/illustrations/undraw_booking.svg" />
        Service Requests
      </Typography>
      <CalendarListDisplay events={serviceRequests} />
    </Page>
  );
}
