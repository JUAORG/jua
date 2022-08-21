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
  Tab,
  Tabs,
  Button,
} from '@mui/material'
import PropTypes from 'prop-types'
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import Page from '../components/Page'
import { Calendar } from "../sections/advisory_session/meeting/calendar/Calendar";
import { getAuthId } from '../actions/Auth'
import {
  activeJuaNetworkUsers,
  getMySentServiceRequests,
  getMyRecievedServiceRequests,
  updateServiceRequest,
  serviceRequestStatusOptions
} from "../actions/JuaNetwork"

export default function ServiceRequests() {
  const navigate = useNavigate()
  const db = getDatabase()
  const [sentServiceRequests, setSentServiceRequests] = useState([])
  const [recievedServiceRequests, setRecievedServiceRequests] = useState([])
  const [value, setValue] = useState(0)
  
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

  function TabPanel(props) {
    const { children, value, index, ...other } = props
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    )
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
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
                  primary={"Jua User"}
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
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Inbox"/>
              <Tab label="OutBox"/>
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {renderServiceRequestTab(recievedServiceRequests)}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {renderServiceRequestTab(sentServiceRequests)}
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
      </>
      )
    }
  
  return (
    <Page title="Service Requests">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Service Requests
        </Typography>        
      {renderServiceRequestTabs()}
      <Calendar
        sentServiceRequests={ sentServiceRequests }
        recievedServiceRequests={ recievedServiceRequests }
      />
    </Page>
  )
}
