import { get } from 'lodash';
import { Container, Typography } from '@mui/material';
import Page from '../components/Page';
import { getService } from '../actions/Services';
import { activeJuaNetworkUsersForThisService } from '../actions/JuaNetwork';

export default function Service() {
  const service = getService();

  return (
    <Page title={get(service, 'name')} showGoBackArrow>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          {get(service, 'name')}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          {get(service, 'description')}
        </Typography>
      </Container>
    </Page>
  );
}
