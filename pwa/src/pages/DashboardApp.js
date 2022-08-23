import { useEffect, useState } from 'react'
import { Grid, Container, Typography } from '@mui/material'
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { get, map, size } from "lodash"
import { getAuthId } from '../actions/Auth';
import Page from '../components/Page'
// sections
import { AppNewsUpdate, AppWidgetSummary } from '../sections/@dashboard/app'
import { getNumOfMyServiceRequests } from '../actions/JuaNetwork'


export default function DashboardApp() {
  const db = getDatabase()
  const navigate = useNavigate()
  const [numServiceRequests, setNumServiceRequests] = useState()
  const [userUpdates, setUserUpdates] = useState()

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
  }, {
  })
  }, [db])

  const goToServiceRequestPage = () => {
    navigate('/dashboard/service_requests', { replace: true });
  }

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Service Requests" total={numServiceRequests} onClick={goToServiceRequestPage} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Updates"
              list={userUpdates}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
