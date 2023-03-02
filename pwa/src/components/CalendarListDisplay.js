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
import { ServiceRequestDetail } from './ServiceRequestDetail';

export const CalendarListDisplay = ({ events }) => {
  const [selectedServiceRequestRef, setSelectedServiceRequestRef] = useState(null);
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
  }));

  useEffect(() => {
    if (selectedServiceRequestRef) {
      setOpenServiceRequestDetailView(true);
    } else {
      setOpenServiceRequestDetailView(false);
    }
  }, [selectedServiceRequestRef]);

  const handleEventClick = (ref) => {
    setSelectedServiceRequestRef(ref);
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
        eventClick={(info) => handleEventClick(get(info, ['event', '_def', 'publicId']))}
        headerToolbar={{ start: 'prev', center: 'title', end: 'next' }}
        eventContent={(eventInfo) => (
          <CardActionArea>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {get(eventInfo, ['event', '_def', 'extendedProps', 'date_time'])} Duration: 30 minutes
              </Typography>
              <Typography variant="h5" component="div">
                Subject: {eventInfo.event.title}
              </Typography>
              <Typography color="text.secondary">
                Description: {get(eventInfo, ['event', '_def', 'extendedProps', 'description'])}
              </Typography>
              <Typography variant="body2" mb={2}>
                Sent by:
              </Typography>
              <Chip label={get(eventInfo, ['event', '_def', 'extendedProps', 'status'])} color="primary" />
            </CardContent>
          </CardActionArea>
        )}
      />
      {openServiceRequestDetailView && (
        <ServiceRequestDetail
          selectedServiceRequestRef={selectedServiceRequestRef}
          handleClose={closeServiceRequestDetailView}
        />
      )}
    </>
  );
};
