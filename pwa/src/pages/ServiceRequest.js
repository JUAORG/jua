import React, {useState, useEffect} from "react"
import { useNavigate, useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Button
} from '@mui/material';
import { get, head } from 'lodash'
import { getAuthId } from '../actions/Auth'
import Page from '../components/Page';
import ServiceRequestForm from "../sections/@dashboard/app/ServiceRequestForm";

export default function ServiceRequest() {
  const navigate = useNavigate()

  const { serviceRequestId } = useParams()
  const [serviceRequest, setServiceRequest] = useState([])
  

  useEffect(() => {
  }, [])
  

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
        <Button onClick={goBack}>
          Back
        </Button>
        <ServiceRequestForm
          serviceRequest={serviceRequest}
          isServiceProvider={getAuthId() === get(serviceRequest, "serviceProvider")}
        />
        {get(serviceRequest, "status") === "Accepted" && 
         <Button
           sx={{mt: 5}}
           variant="contained"
           onClick={goToServiceRequestMeeting}>
           Go To Service Request
         </Button>
        }
      </Container>
    </Page>
  )
}
