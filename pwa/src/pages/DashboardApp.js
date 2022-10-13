import { useEffect, useState, useContext } from 'react'
import {
  Grid,
  Container,
  Typography,
  ImageList,
  ImageListItem,
  ImageListItemBar
} from '@mui/material'
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { get, map, size } from "lodash"
import { getAuthId } from '../actions/Auth';
import Page from '../components/Page'
// sections
import UserContext from '../contexts/User'
import { showCustomerView } from '../actions/UI'
import { getNumOfMyServiceRequests } from '../actions/JuaNetwork'
import { AppNewsUpdate, AppWidgetSummary } from '../sections/@dashboard/app'

const availableServices = [
  {
    id: 1,
    name: 'Service 1',
    body: 'Service 1 is about x y and z',
    thumbnailUri: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=994&q=80',
    thumbnailAlt: 'Service 1 image'
  },
  {
    id: 2,
    name: 'Service 2',
    body: 'Service 2 is about x y and z',
    thumbnailUri: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=994&q=80',
    thumbnailAlt: 'Service 2 image'
  },
  {
    id: 3,
    name: 'Service 3',
    body: 'Service 3 is about x y and z',
    thumbnailUri: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=994&q=80',
    thumbnailAlt: 'Service 2 image'
  }
]

export default function DashboardApp() {
  const db = getDatabase()
  const navigate = useNavigate()
  const user = useContext(UserContext)
  const shouldShowCustomerView = showCustomerView()
  const [userUpdates, setUserUpdates] = useState()
  const [numServiceRequests, setNumServiceRequests] = useState()

  useEffect(() => {
    onValue(ref(db, `/service_requests`), (snapshot) => {  
      let result = (snapshot.val() && snapshot.val())
      result = getNumOfMyServiceRequests(result)
      setNumServiceRequests(result)
  }, {
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

  const goToServiceDetailPage = () => {
    navigate('/dashboard/service/:service_1', { replace: true });
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
    return (
      <ImageList
        sx={{
          gridAutoFlow: "column",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr)) !important",
          gridAutoColumns: "minmax(160px, 1fr)"
        }}
      >
        {map(availableServices, (service) => (
          <ImageListItem
            key={get(service, 'id')}
            sx={{cursor: 'pointer'}}
            onClick={goToServiceDetailPage}
          >
            <img
              alt={get(service, 'thumbnailAlt')}
              src={get(service, 'thumbnailUri')}
            />
            <ImageListItemBar title={get(service, 'name')}/>
          </ImageListItem>
        ))}
        <ImageListItem sx={{cursor: 'pointer', background: '#e9e9e9'}}>
          <ImageListItemBar title='More'/>
        </ImageListItem>
      </ImageList>
    )
  }

  const renderCustomerHomePage = () => {
    return (
      <>
        <Grid item xs={12} sm={6} md={3}>
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
            <AppNewsUpdate
              list={userUpdates}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
