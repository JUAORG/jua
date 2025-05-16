import React, { useState, useEffect } from 'react';
import { map, get } from 'lodash';

import {
  CardContent,
  Typography,
  Chip,
  CardActionArea,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import { useNavigate } from 'react-router-dom';
import { ServiceRequestDetail } from './ServiceRequestDetail';
import { makePayment } from '../actions/Wallet'
import notificationManager from '../actions/NotificationManager'
import { ServiceRequestStatusDialog } from './ServiceRequestStatusDialog'

export const CalendarListDisplay = ({ events }) => {
  const navigate = useNavigate();
  const [shouldShowStatusChangeDialog,setShouldShowStatusChangeDialog] = useState(false)
  const { data, isLoading } = useQuery(['user'])
  const user = get(data, 'data', {})
  const [message, setMessage] = useState(false)
  const [selectedServiceRequestRef, setSelectedServiceRequestRef] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [openServiceRequestDetailView, setOpenServiceRequestDetailView] = useState(true);

  const calendarEvents = map(events, (event) => ({
    id: get(event, 'ref'),
    title: `${get(event, 'subject')}`,
    description: `${get(event, 'description')}`,
    start: get(event, 'date_and_time'),
    end: get(event, 'date_and_time'),
    status: get(event, 'status'),
    backgroundColor: '#474747',
    borderColor: '#474747',
    service_request:event,
    serviceProviderRef: get(event, 'service_provider_ref'),
    serviceRequesterRef: get(event, 'service_requester_ref'),
  }));

  useEffect(() => {
    if (selectedServiceRequestRef) {
      setOpenServiceRequestDetailView(true);
    } else {
      setOpenServiceRequestDetailView(false);
    }
  }, [selectedServiceRequestRef]);

  const handleCloseStatusChangeDialog = () => {
    setShouldShowStatusChangeDialog(false)
  }

  const handleEventClick = (event) => {
    const ref = get(event, 'publicId')
    const serviceRequestStatus = get(event, ['extendedProps', 'status'])
    const isServiceProvider = get(user, 'ref') === get(event, ['extendedProps', 'service_request', 'service_provider'])
    const serviceRequestPrice = get(event, ['extendedProps', 'service_request', 'price'])

    if (serviceRequestStatus === 'PENDING' && isServiceProvider) {
      setShouldShowStatusChangeDialog(true)
      navigate(`/dashboard/service_requests?service_request=${ref}`, { replace: true })
    }else if (serviceRequestStatus === 'PENDING' && !isServiceProvider)  {
      notificationManager.warning('Waiting for service provider to accept the service request.. Please check back later.', 'Pending... ');
    }
    if (serviceRequestStatus === 'PENDING_PAYMENT' && !isServiceProvider) {
      makePayment(serviceRequestPrice, ref)
    }
    if (serviceRequestStatus === 'IN_PROGRESS' ) {
      setSelectedServiceRequestRef(ref)
    }


  };
  const closeServiceRequestDetailView = () => setSelectedServiceRequestRef(null);

  return (
    <>
      <FullCalendar
        selectable
        height="400px"
        displayEventEnd
        handleWindowResize
        initialView="listWeek"
        events={calendarEvents}
        plugins={[listPlugin]}
        eventClick={(info) => handleEventClick(get(info, ['event', '_def']))}
        headerToolbar={{ start: 'prev', center: 'title', end: 'next' }}
        eventContent={(eventInfo) => (
          <CardActionArea>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ fontSize: 14 }}
                color="text.secondary"
              >
                {get(eventInfo, ['event', '_def', 'extendedProps', 'date_time'])} Duration: 30 minutes
              </Typography>
              <Typography variant="h5" component="div">
                Subject: {eventInfo.event.title}
              </Typography>
              <Typography color="text.secondary">
                Description: {get(eventInfo, ['event', '_def', 'extendedProps', 'description'])}
              </Typography>
              {/* <Typography variant="body2" mb={2}> */}
              {/*   Sent by: */}
              {/* </Typography> */}
              <Chip
                color="primary"
                label={get(eventInfo, ['event', '_def', 'extendedProps', 'status'])}
              />
            </CardContent>
          </CardActionArea>
        )}
      />
      {openServiceRequestDetailView &&
       <ServiceRequestDetail
         selectedServiceRequestRef={selectedServiceRequestRef}
         handleClose={closeServiceRequestDetailView}
       />
      }
      {shouldShowStatusChangeDialog &&
       <ServiceRequestStatusDialog
         handleClose={handleCloseStatusChangeDialog}
         service_request={selectedEvent}
       />
      }
    </>
  );
};
