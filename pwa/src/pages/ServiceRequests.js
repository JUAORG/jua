import React, { useState, useEffect } from "react"
import { get, map } from "lodash"
import {
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  Button,
} from '@mui/material'
import Page from '../components/Page'
import { Calendar } from "../sections/advisory_session/meeting/calendar/Calendar";
import {
  updateServiceRequest,
  serviceRequestStatusOptions,
  fetchServiceRequests,
} from "../actions/JuaNetwork"
import ReusableTab from "../components/reusables/Tabs"

export default function ServiceRequests() {
  const [calendarView, setCalendarView] = useState([])
  const [sentServiceRequests, setSentServiceRequests] = useState([])
  const [recievedServiceRequests, setRecievedServiceRequests] = useState([])

  useEffect(() => {
    fetchServiceRequests()
      .then((response) => {
        setSentServiceRequests(response.data)
      }).catch((error) => {
        console.error(error)
      })
  }, [])

  // const goToServiceRequest = (serviceRequestId) => navigate(`/dashboard/service_request/${serviceRequestId}/`, { replace: true })


  const onDeleteServiceRequest = (serviceRequestId) => {
    const values = {}
    values.id = serviceRequestId
    values.status = serviceRequestStatusOptions.cancelled
    updateServiceRequest(values)
  }

  const renderServiceRequestTab = (serviceRequests) => {
    return (
      <List sx={{ bgcolor: 'background.paper' }}>
        {map(serviceRequests, (serviceRequest) => (
          <>
            <ListItem
              id={get(serviceRequest, "id")}
              alignItems="flex-start"
            >
              <ListItemText
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline', cursor: 'pointer' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      // onClick={() => goToServiceRequest(get(serviceRequest, "id"))}
                    >
                      Subject: {get(serviceRequest, "subject", "description empty")}
                    </Typography><br />
                    Description: {get(serviceRequest, "description", "description empty")}
                    <Button
                      sx={{ float: "right" }}
                      onClick={() => onDeleteServiceRequest(get(serviceRequest, "id"))}
                    >
                      Cancel Request
                    </Button>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>

    )
  }

  const renderServiceRequestTabs = () => {
    return (
      <>
        <ReusableTab
          scrollButtons
          variant='scrollable'
          allowScrollButtonsMobile
          tabHeadings={['Upcoming', 'Inbox', 'Pending', 'History']}
          tabContents={[
            'Upcoming',
            renderServiceRequestTab(recievedServiceRequests),
            renderServiceRequestTab(sentServiceRequests),
            'Pending',
            'History'
          ]}
        />
      </>
    )
  }

  return (
    <Page title='Service Requests'>
      <Typography align='Center' variant='h4' sx={{ mb: 5 }}>
        <img
          alt='Booking'
          width={150}
          style={{ margin: 'auto' }}
          src='/static/illustrations/undraw_booking.svg'
        />
        Service Requests
      </Typography>
      {renderServiceRequestTabs()}
      <>
        <Calendar
          sentServiceRequests={sentServiceRequests}
          recievedServiceRequests={recievedServiceRequests}
        />
      </>
    </Page>
  )
}
