import React, {useState, useEffect} from "react"
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Button
} from '@mui/material';
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { getAuthId } from '../actions/Auth'
import Page from '../components/Page';
import ServiceRequestForm from "../sections/@dashboard/app/ServiceRequestForm";

export default function ServiceRequest() {
  const navigate = useNavigate()
  const db = getDatabase()
  const { serviceRequestId } = useParams()
  const [serviceRequest, setServiceRequest] = useState([])
  

  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/service_requests/${serviceRequestId}`), (snapshot) => {  
      const result = (snapshot.val() && snapshot.val())
      setServiceRequest(result)
  }, {
    onlyOnce: true
  })
  }, [db])
  

  const goBack = () => {
    navigate(`/dashboard/service_requests`, { replace: true })
  }

  const goToServiceRequestMeeting = () => {
    navigate(`/dashboard/advisory_session_meeting/?room=${serviceRequestId}`, { replace: true })
  }
  
  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Service Request
        </Typography>
        <Button onClick={goBack}>Back</Button>
        <ServiceRequestForm serviceRequest={serviceRequest}/>
        <Button onClick={goToServiceRequestMeeting}>Go To Service Request</Button>
      </Container>
    </Page>
  )
}
