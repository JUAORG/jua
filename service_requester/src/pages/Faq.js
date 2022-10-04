import { Grid, Container, Typography } from '@mui/material'
import FrequentlyAskedQuestions from '../sections/@dashboard/app/FrequentlyAskedQuestions'
import Page from '../components/Page'

export default function Faq() {

  return (
    <Page title="FAQ">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
            Frequently Asked Questions
        </Typography>
        <FrequentlyAskedQuestions/>
      </Container>
    </Page>
  )
}