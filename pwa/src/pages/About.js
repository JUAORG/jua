import { Grid, Container, Typography, Divider } from '@mui/material'
import JuaPlatformFeedbackForm from '../sections/@dashboard/app/JuaPlatformFeedbackForm'
import Page from '../components/Page'

export default function About() {

  return (
    <Page title="About">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          <img
            alt='FAQs'
            width={ 150 }
            style={{margin: 'auto'}}
            src='/static/illustrations/undraw_team.svg'
          />
            About Jua
        </Typography>
        <Typography variant="p" component='p' sx={{ mb: 2, textAlign: 'center' }}>
        With JUA, anyone with any skills or knowledge has value to share and will be paid for their advice and/or services.
        </Typography>
        <Divider sx={{ my: 2 }}/>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Feedback
        </Typography>
        <JuaPlatformFeedbackForm/>
        <Divider sx={{ my: 2 }}/>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Changelog
        </Typography>
        <Typography variant="p">
        The changelog is a list of changes and sometimes backwards-incompatible updates in the API.
        </Typography>
      </Container>
    </Page>
  )
}
