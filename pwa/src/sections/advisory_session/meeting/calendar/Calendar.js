import React, { useState, useEffect, forwardRef } from 'react';
import { get, map, unset } from 'lodash';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import { processCalendarEvents } from '../../../../actions/JuaNetwork';

export const Calendar = ({ sentServiceRequests, recievedServiceRequests, calendarView = 'listWeek' }) => {
  const navigate = useNavigate();
  const [calendarEventModal, setCalendarEventModal] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    processCalendarEvents(sentServiceRequests, recievedServiceRequests).then(res => {
      setEvents(res);
    });
  }, [recievedServiceRequests]);

  const openCalendarEvent = eventInfo => {
    const calendarEvent = get(eventInfo, ['event', '_def']);
    setCalendarEventModal(calendarEvent);
  };

  const handleClose = () => {
    setCalendarEventModal(null);
  };

  const goToServiceRequest = serviceRequestId => {
    navigate(`/dashboard/service_request/${serviceRequestId}/`, { replace: true });
  };

  const renderCalendarEventModal = () => {
    const calendarEventDetails = get(calendarEventModal, 'extendedProps');

    return (
      <div>
        <Dialog keepMounted onClose={handleClose} open={calendarEventModal}>
          {console.log(calendarEventModal)}
          <DialogTitle>Title: {get(calendarEventModal, 'title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>Description: {get(calendarEventDetails, 'description')}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={() => goToServiceRequest(get(calendarEventModal, 'publicId'))}>
              Go to service request
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  return (
    <>
      {/* <FullCalendar */}
      {/*   plugins={[ */}
      {/*     listPlugin, */}
      {/*     dayGridPlugin, */}
      {/*     interactionPlugin */}
      {/*   ]} */}
      {/*   headerToolbar={{ */}
      {/*     left: "prev", */}
      {/*     center: "title", */}
      {/*     right: "next", */}
      {/*   }} */}
      {/*   eventClick={ */}
      {/*     (eventClickInfo) => openCalendarEvent(eventClickInfo) */}
      {/*   } */}
      {/*   events={events} */}
      {/*   progressiveEventRendering */}
      {/*   displayEventEnd={false} */}
      {/*   /\* initialView={calendarView} *\/ */}
      {/* /> */}
      {renderCalendarEventModal()}
    </>
  );
};
