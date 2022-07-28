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
  Avatar
} from '@mui/material'
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import Page from '../components/Page'
import { getAuthId } from '../actions/Auth'
import { activeJuaNetworkUsers } from "../actions/JuaNetwork"

export default function ServiceRequests() {
  const navigate = useNavigate()
  const db = getDatabase()
  const [serviceRequests, setServiceRequests] = useState([])
  
  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/service_requests`), (snapshot) => {  
      const result = (snapshot.val() && snapshot.val())
      setServiceRequests(result)
  }, {
    onlyOnce: true
  })
}, [db])
  
  return (
    <Page title="Service Requests">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Service Requests
        </Typography>        
        <List sx={{ bgcolor: 'background.paper' }}>
          {map(serviceRequests, (serviceRequest) => (
            <>
              <ListItem id={get(serviceRequest, "id")} alignItems="flex-start">
                <ListItemText
                  primary={get(serviceRequest, "serviceRequester")}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                      {get(serviceRequest, "subject", "description empty")}
                      </Typography><br/>
                      {get(serviceRequest, "description", "description empty")}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))}
        </List>
      </Container>
    </Page>
  )
}