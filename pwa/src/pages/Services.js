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
import { SERVICES } from '../content/services'
import { showCustomerView } from "../actions/UI"
import ReusableTab from "../components/reusables/Tabs"
import TitlebarBelowImageList from "../components/reusables/TitlebarBelowImageList"

export default function Services() {
  const navigate = useNavigate()
  const shouldShowCustomerView = showCustomerView()
  const [calendarView, setCalendarView] = useState([])
  const [sentServiceRequests, setSentServiceRequests] = useState([])
  const [recievedServiceRequests, setRecievedServiceRequests] = useState([])
  
  useEffect(() => {
  }, [])

  const goToServiceRequest = (serviceRequestId) => {    
    navigate(`/dashboard/service_request/${serviceRequestId}/`, { replace: true })
  }

  
  const onDeleteServiceRequest = (serviceRequestId) => {
    const values = {}
    values.id = serviceRequestId
    values.status = serviceRequestStatusOptions.cancelled
    updateServiceRequest(values)
  }


  
  return (
    <Page title='Services'>
      <Typography align='Center' variant='h4' sx={{ mb: 5 }}>
        Services
      </Typography>
      <TitlebarBelowImageList itemData={ SERVICES }/>
    </Page>
  )
}
