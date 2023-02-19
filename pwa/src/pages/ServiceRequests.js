import React, { useState, useEffect } from 'react';
import { get, map } from 'lodash';
import { Typography, List, ListItem, Divider, ListItemText, Button, Grow } from '@mui/material';
import Page from '../components/Page';
import { Calendar } from '../sections/advisory_session/meeting/calendar/Calendar';
import {
  updateServiceRequest,
  serviceRequestStatusOptions,
  fetchServiceRequests,
  fetchServiceRequest,
  fetchServiceRequestsForServiceProvider,
} from '../actions/JuaNetwork';
import ReusableTab from '../components/reusables/Tabs';
import { ServiceRequestDetail } from '../components/ServiceRequestDetail';

export default function ServiceRequests() {
  const [calendarView, setCalendarView] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [serviceRequestsForServiceProvider, setServiceRequestsForServiceProvider] = useState([]);
  const [selectedServiceRequest, setSelectedServiceRequest] = useState({});
  const [openServiceRequest, setOpenServiceRequest] = useState(false);

  useEffect(() => {
    fetchServiceRequests()
      .then((response) => {
        setServiceRequests(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    fetchServiceRequestsForServiceProvider()
      .then((response) => {
        setServiceRequestsForServiceProvider(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const openServiceRequestDetailView = (serviceRequest) => {
    setSelectedServiceRequest(serviceRequest);
    console.log(selectedServiceRequest, 'fire');
    setOpenServiceRequest(true);
  };

  const onDeleteServiceRequest = (serviceRequestId) => {
    const values = {};
    values.id = serviceRequestId;
    values.status = serviceRequestStatusOptions.cancelled;
    updateServiceRequest(values);
  };
  const closeServiceRequestDetailView = () => setOpenServiceRequest(false);
  const renderServiceRequestTab = (serviceRequests) => {
    return (
      <List sx={{ bgcolor: 'background.paper' }}>
        {map(serviceRequests, (serviceRequest) => (
          <>
            <ListItem id={get(serviceRequest, 'ref')} alignItems="flex-start">
            <ListItemText
          secondary={
              <>
              <Typography
            sx={{ display: 'inline', cursor: 'pointer' }}
            component="span"
            variant="body2"
            color="text.primary"
            onClick={() => openServiceRequestDetailView(serviceRequest)}
              >
              Subject: {get(serviceRequest, 'subject', 'description empty')}
            </Typography>
              <br />
              Description: {get(serviceRequest, 'description', 'description empty')}
            </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    );
  };

  const renderServiceRequestTabs = () => {
    return (
      <>
        <ReusableTab
          scrollButtons
          variant="scrollable"
          allowScrollButtonsMobile
      tabHeadings={['Service Requests', 'Requests', 'Past']}
      tabContents={[
        renderServiceRequestTab(serviceRequests),
        renderServiceRequestTab(serviceRequestsForServiceProvider),
        'Past service requests',
      ]}
        />
      </>
    );
  };

  return (
    <Page title="Service Requests">
      <Typography align="Center" variant="h4" sx={{ mb: 5 }}>
        <img alt="Booking" width={150} style={{ margin: 'auto' }} src="/static/illustrations/undraw_booking.svg" />
      Service Requests
    </Typography>
      {renderServiceRequestTabs()}
      <>
        {/* Calendar sentServiceRequests={sentServiceRequests} recievedServiceRequests={recievedServiceRequests} /> */}
    </>
      {openServiceRequest && (
          <ServiceRequestDetail
        selectedServiceRequest={selectedServiceRequest}
        handleClose={closeServiceRequestDetailView}
          />
      )}
    </Page>
  );
}
