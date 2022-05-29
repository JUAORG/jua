import { Grid, Container, Typography, Divider } from '@mui/material';
import EducationHistoryForm from '../sections/@dashboard/app/EducationHistoryForm';
import Page from '../components/Page';
import ServiceHistroyForm from '../sections/@dashboard/app/ServiceHistoryForm';
import UserProfileForm from '../sections/@dashboard/app/UserProfileForm';

export default function Profile() {
  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Profile
          <Divider />
        </Typography>
        <Grid>
          <Grid my={5} />
          <UserProfileForm />
          <Grid />
          <Grid my={5}>
            <EducationHistoryForm />
          </Grid>
          <Grid my={5}>
            <ServiceHistroyForm />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
