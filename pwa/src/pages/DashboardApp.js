import { useEffect, useState } from 'react'
import { Grid, Container, Typography } from '@mui/material'
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { get, map, size } from "lodash"
import { getAuthId } from '../actions/Auth';
import Page from '../components/Page'
// sections
import { AppNewsUpdate, AppWidgetSummary } from '../sections/@dashboard/app'
import { getNumOfMyServiceRequests } from '../actions/JuaNetwork'


export default function DashboardApp() {
  const db = getDatabase()
  const [numServiceRequests, setNumServiceRequests] = useState()

  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/service_requests`), (snapshot) => {  
      let result = (snapshot.val() && snapshot.val())
      result = getNumOfMyServiceRequests(result)
      setNumServiceRequests(result)
  }, {
    onlyOnce: true
  })
}, [db])

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Service Requests" total={numServiceRequests} />
          </Grid>
          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  )
}