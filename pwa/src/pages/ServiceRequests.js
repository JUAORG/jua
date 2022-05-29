import { Grid, Container, Typography } from '@mui/material'
import Page from '../components/Page'

export default function ServiceRequests() {

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
            Service Requests
        </Typography>
      </Container>
    </Page>
  )
}