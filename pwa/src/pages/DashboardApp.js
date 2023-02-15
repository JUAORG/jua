import { useState, useContext } from 'react'
import {
  Grid,
  Container,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material'
import Joyride from 'react-joyride'
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { fromPairs, get, map, size } from "lodash"
import { SERVICES } from '../content/services'
import Page from '../components/Page'
// sections
import { UserContext } from '../contexts/User'
import { AppNewsUpdate, AppWidgetSummary } from '../sections/@dashboard/app'

export default function DashboardApp() {
  const navigate = useNavigate()
  const user = useContext(UserContext)

  const [customerInfoSteps, setCustomerInfoSteps] = useState(
    [
      {
        title: 'Welcome',
        placement: 'auto',
        target: '.MuiTypography-h4',
        content: 'This is my awesome feature!',
      },
      {
        target: '.simplebar-content',
        content: 'This another awesome feature!',
      },
      {
        title: 'Welcome',
        placement: 'auto',
        target: '.MuiTypography-h4',
        content: 'This is my awesome feature!',
      },
    ])

  const [userUpdates, setUserUpdates] = useState()
  const [numServiceRequests, setNumServiceRequests] = useState()



  const goToServiceRequestPage = () => {
    navigate('/dashboard/service_requests', { replace: true });
  }

  const goToServiceDetailPage = (service) => {
    const serviceSlug = get(service, 'slug')
    navigate(`/dashboard/service/${serviceSlug}`, { replace: true });
  }

  const goToServicesPage = () => {
    navigate('/dashboard/services/', { replace: true });
  }

  const renderAdvisorHomePage = () => {
    return (
      <>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary title="Service Requests" total={numServiceRequests} onClick={goToServiceRequestPage} />
        </Grid>
      </>
    )
  }

  const renderAvailiableServices = () => {
    const availableServices = SERVICES
    return (
      <ImageList
        sx={{
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(100px, 1fr)",
          gridTemplateColumns: "repeat(auto-fit, minmax(100px,1fr)) !important"
        }}
      >
        {map(availableServices, (service) => (
          <ImageListItem
            key={get(service, 'id')}
            sx={{cursor: 'pointer' }}
            onClick={ () => goToServiceDetailPage(service) }
          >
            <img
              alt={get(service, 'thumbnail_alt')}
              src='https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=994&q=20'
            />
            <ImageListItemBar title={get(service, 'name')}/>
          </ImageListItem>
        ))}
        <ImageListItem sx={{cursor: 'pointer', background: '#e9e9e9'}} onClick={ () => goToServicesPage() }>
          <ImageListItemBar title='More'/>
        </ImageListItem>
      </ImageList>
    )
  }

  const renderCustomerHomePage = () => {
    return (
      <>
        <Grid item xs={12} sm={6} md={12}>
          <Typography variant="h6" mb={2}>
            Services
          </Typography>
          {renderAvailiableServices()}
        </Grid>
      </>
    )
  }

  return (
    <Page title="Dashboard">
       {/* <Joyride 
         showProgress 
         showSkipButton 
         disableCloseOnEsc 
         steps={userIsNewToJua && shouldShowCustomerView ? customerInfoSteps : advisorInfoSteps } 
      />  */}
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {get(user, 'first_name') && `${get(user, ['profile', 'first_name'])} ${get(user, ['profile', 'last_name'])}`}
        </Typography>
        <Grid container spacing={3}>
          { get(user, ['profile', 'is_service_provider']) ? renderAdvisorHomePage() : renderCustomerHomePage() }
          <Grid item xs={12} md={6} lg={8}>
            <Typography variant="h6" mb={2}>
              Updates
            </Typography>
            <AppNewsUpdate list={ userUpdates }/>
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
