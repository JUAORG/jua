import React, { useState, useEffect } from 'react';
import { get, map } from 'lodash';
import { useQuery } from 'react-query';
import { Typography, List, ListItem, Divider, ListItemText } from '@mui/material';
import Page from '../components/Page';
// import { Calendar } from '../sections/advisory_session/meeting/calendar/Calendar';
import {
  updateServiceRequest,
  serviceRequestStatusOptions,
  fetchServiceRequests,
  fetchServiceRequestsForServiceProvider,
} from '../actions/JuaNetwork';
import ReusableTab from '../components/reusables/Tabs';
import { ServiceRequestDetail } from '../components/ServiceRequestDetail';

export default function ServiceRequests() {
  const { data } = useQuery(['user']);
  const user = get(data, 'data', {});
  const isUserServiceProvider = get(user, ['profile', 'is_service_provider']);
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
            <ListItem
              id={get(serviceRequest, 'ref')}
              alignItems="flex-start"
              sx={{cursor: 'pointer'}}
              onClick={() => openServiceRequestDetailView(serviceRequest)}
            >
              <ListItemText
                primary={get(serviceRequest, 'date', 'No Date Set')}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Subject: {get(serviceRequest, 'subject', 'description empty')}
                    </Typography><br/>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Status: {get(serviceRequest, 'status', 'description empty')}
                    </Typography><br/>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Description: {get(serviceRequest, 'description', 'description empty')}
                      </Typography><br/>
                      <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Participants: {' '}
                      {get(serviceRequest, ['service_provider', 'profile', 'first_name'])} {' '}
                      {get(serviceRequest, ['service_provider', 'profile', 'last_name'])}, 
                      </Typography>
                      <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {get(serviceRequest, ['service_requester', 'profile', 'first_name'])} {' '}
                      {get(serviceRequest, ['service_requester', 'profile', 'last_name'])}
                      </Typography>
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
          tabHeadings={['Sent', 'Recieved', 'Past']}
          tabContents={[
            renderServiceRequestTab(serviceRequests),
            isUserServiceProvider
              ? renderServiceRequestTab(serviceRequestsForServiceProvider)
              : 'Apply to be service provider',
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
