import { Grid, Container, Typography } from '@mui/material'
import JuaPlatformFeedbackForm from '../sections/@dashboard/app/JuaPlatformFeedbackForm'
import Page from '../components/Page'

export default function About() {

  return (
    <Page title="About">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
            About Jua
        </Typography>
        {/* <Typography variant="h5" sx={{ mb: 5 }}>
            Created by Doro...
        </Typography> 
        <Typography variant="p" sx={{ mb: 5 }}>
            blah blah
        </Typography>
        <Typography variant="h6" sx={{ mb: 5 }}>
        privacy policy
        terms and conditions
        </Typography> */}
        <JuaPlatformFeedbackForm/>
      </Container>
    </Page>
  )
}