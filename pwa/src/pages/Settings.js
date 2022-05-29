import { Grid, Container, Typography } from '@mui/material'
import Page from '../components/Page'

export default function Settings() {

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
            Settings
        </Typography>
      </Container>
    </Page>
  )
}