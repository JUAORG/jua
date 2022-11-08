import { Grid, Container, Typography } from '@mui/material'
import FrequentlyAskedQuestions from '../sections/@dashboard/app/FrequentlyAskedQuestions'
import Page from '../components/Page'

export default function Faq() {

  return (
    <Page title="FAQ">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center', margin: 'auto' }}>
          <img
            alt='FAQs'
            width={ 150 }
            style={{margin: 'auto'}}
            src='/static/illustrations/undraw_questions.svg'
          />
          Frequently Asked Questions
        </Typography>
        <FrequentlyAskedQuestions/>
      </Container>
    </Page>
  )
}
