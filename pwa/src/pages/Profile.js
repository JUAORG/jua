import { Grid, Container, Typography, Divider } from '@mui/material';
import EducationHistoryForm from '../sections/@dashboard/app/EducationHistoryForm';
import Page from '../components/Page';
import ServiceHistroyForm from '../sections/@dashboard/app/ServiceHistoryForm';
import UserProfileForm from '../sections/@dashboard/app/UserProfileForm';

export default function Profile() {
  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Profile
        </Typography>
        <Grid>
          <Grid my={5} />
          <UserProfileForm />
          <Grid />
          <Grid my={5}>
          <Typography variant="h4" mb={3}>
          Education History
          <Divider />
        </Typography>
            <EducationHistoryForm />
          </Grid>
          <Grid my={5}>
          <Typography variant="h4" mb={3}>
          Service History
          <Divider />
        </Typography>
            <ServiceHistroyForm />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
