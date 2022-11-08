import React, {useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import { get, map } from "lodash"
import {
  Grid,
  Container,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Button,
  ButtonGroup
} from '@mui/material'
import PropTypes from 'prop-types'
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import Page from '../components/Page'
import { Calendar } from "../sections/advisory_session/meeting/calendar/Calendar";
import { getAuthId } from '../actions/Auth'
import {
  updateServiceRequest,
  activeJuaNetworkUsers,
  getMySentServiceRequests,
  serviceRequestStatusOptions,
  getMyRecievedServiceRequests,
} from "../actions/JuaNetwork"
import { showCustomerView } from "../actions/UI"
import ReusableTab from "../components/reusables/Tabs"

export default function ServiceRequests() {
  const navigate = useNavigate()
  const db = getDatabase()
  const shouldShowCustomerView = showCustomerView()
  const [calendarView, setCalendarView] = useState([])
  const [sentServiceRequests, setSentServiceRequests] = useState([])
  const [recievedServiceRequests, setRecievedServiceRequests] = useState([])
  
  useEffect(() => {
    onValue(ref(db, `/service_requests`), (snapshot) => {  
      const allServiceRequests = (snapshot.val() && snapshot.val())
      setSentServiceRequests(getMySentServiceRequests(allServiceRequests))
      setRecievedServiceRequests(getMyRecievedServiceRequests(allServiceRequests))
    })
  }, [db])

  const goToServiceRequest = (serviceRequestId) => {    
    navigate(`/dashboard/service_request/${serviceRequestId}/`, { replace: true })
  }

  
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
                        onClick={() => goToServiceRequest(get(serviceRequest, "id"))}
                      >
                      Subject: {get(serviceRequest, "subject", "description empty")}
                      </Typography><br/>
                      Description: {get(serviceRequest, "description", "description empty")}
                      <Button
                        sx={{float: "right"}}
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

  const renderCustomerBookings = () => {
    return (
      <ReusableTab
        tabHeadings={['Upcoming', 'Pending', 'History']}
        tabContents={['Upcoming', 'Pending', 'History']}
      />
    )
  }
  
  return (
    <Page title={ shouldShowCustomerView ? 'Bookings' :  'Service Requests' }>
      <Typography align='Center' variant='h4' sx={{ mb: 5 }}>
        <img
          alt='Booking'
          width={ 150 }
          style={{margin: 'auto'}}
          src='/static/illustrations/undraw_booking.svg'
        />
        { shouldShowCustomerView ? 'Bookings' : 'Service Requests' }
      </Typography>
      { shouldShowCustomerView ? renderCustomerBookings() : renderServiceRequestTabs() }
      { !shouldShowCustomerView &&
        <>
          <Calendar
            sentServiceRequests={ sentServiceRequests }
            recievedServiceRequests={ recievedServiceRequests }
          />
        </>
      }
    </Page>
  )
}
