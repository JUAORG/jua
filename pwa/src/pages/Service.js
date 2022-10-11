import { Grid, Container, Typography, Divider } from '@mui/material'
import JuaPlatformFeedbackForm from '../sections/@dashboard/app/JuaPlatformFeedbackForm'
import Page from '../components/Page'

export default function Service() {

  return (
    <Page title="Service Name">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2 }}>
            Service title
        </Typography>
      </Container>
    </Page>
  )
}