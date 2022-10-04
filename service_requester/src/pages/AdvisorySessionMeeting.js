import { Grid, Container, Typography, Divider } from '@mui/material';
import JitsiComponent from '../sections/advisory_session/meeting/JitsiMeeting';
import Page from '../components/Page';

export default function AdvisorySessionMeeting() {
  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Advisory Session
        </Typography>
        <Grid>
            <JitsiComponent/>
        </Grid>
      </Container>
    </Page>
  );
}
