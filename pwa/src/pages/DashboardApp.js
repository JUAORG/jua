import { useEffect, useState, useContext } from 'react'
import {
  Grid,
  Container,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material'
import Joyride from 'react-joyride'
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { fromPairs, get, map, size } from "lodash"
import { SERVICES } from '../content/services'
import { getAuthId } from '../actions/Auth';
import Page from '../components/Page'
// sections
import UserContext from '../contexts/User'
import { showCustomerView } from '../actions/UI'
import { getNumOfMyServiceRequests } from '../actions/JuaNetwork'
import { AppNewsUpdate, AppWidgetSummary } from '../sections/@dashboard/app'
import CircularIndeterminate from '../components/reusables/CircularIndeterminate'

export default function DashboardApp() {
  const db = getDatabase()
  const navigate = useNavigate()
  const user = useContext(UserContext)
  const userIsNewToJua = true
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
  const [advisorInfoSteps, setAdvisorInfoSteps] = useState()
  const shouldShowCustomerView = showCustomerView()
  const [dataLoading, setDataLoading] = useState()
  const [userUpdates, setUserUpdates] = useState()
  const [numServiceRequests, setNumServiceRequests] = useState()

  useEffect(() => {
    onValue(ref(db, `/service_requests`), (snapshot) => {  
      let result = (snapshot.val() && snapshot.val())
      result = getNumOfMyServiceRequests(result)
      setNumServiceRequests(result)
  })
  }, [db])

  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/updates`), (snapshot) => {  
      const result = (snapshot.val() && snapshot.val())
      setUserUpdates(result)
    })
  }, [db])

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
       <Joyride 
         showProgress 
         showSkipButton 
         disableCloseOnEsc 
         steps={userIsNewToJua && shouldShowCustomerView ? customerInfoSteps : advisorInfoSteps } 
      /> 
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, User Name
        </Typography>
        <Grid container spacing={3}>
          { !shouldShowCustomerView && renderAdvisorHomePage() }
          { shouldShowCustomerView && renderCustomerHomePage() }
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
