import { useEffect, useState } from 'react';
import { get, map, unset } from 'lodash';
import { Grid, Container, Typography, Divider } from '@mui/material';
import Page from '../components/Page';
import { getAuthId, getUser } from '../actions/Auth';
import PasswordChangeForm from '../sections/@dashboard/app/PasswordChangeForm';

export default function PasswordChange() {

    
      return (
        <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Change Password
        </Typography>
        <Grid>
          <Grid my={5} />
          <PasswordChangeForm/>
          <Grid />
        </Grid>
      </Container>
    </Page>
  );
}
