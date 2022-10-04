import React, { useState } from 'react';
import {
  Grid,
  Stack,
  Container,
  Dialog,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import BankingDetailsForm from '../sections/@dashboard/app/BankingDetailsForm';

export default function WalletSetup() {
  const navigate = useNavigate();
  const [openFullScreenDialog, setOpenFullScreenDialog] = useState(false);

  const onOpenBankingDetailsForm = () => {
    setOpenFullScreenDialog(true);
  };

  const handleClose = () => {
    setOpenFullScreenDialog(false);
  };

  const goToDashboard = () => {
    navigate('/dashboard/app', { replace: false });
  };

  const renderFullScreenDialog = () => {
    return (
      <div>
        <Dialog fullScreen open onClose={handleClose}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Banking Details
              </Typography>
            </Toolbar>
          </AppBar>
          <Grid m={2}>
            <BankingDetailsForm />
          </Grid>
        </Dialog>
      </div>
    );
  };

  return (
    <Page title="Rate Card">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Almost done! Fill in some final details and start getting paid for your time.
        </Typography>
        <Typography variant="p" sx={{ mb: 5 }}>
          Complete each of the below sections to give your JUA system the inputs required to determine the lower bound
          of your rate per second.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} mt={5} spacing={2}>
          <Button onClick={onOpenBankingDetailsForm} variant="outlined">
            Fill in banking details
          </Button>
          <Button onClick={() => alert('Comming soon')} variant="outlined">
            Availability
          </Button>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} mt={5} spacing={2}>
          <Divider />
          <Button onClick={goToDashboard} variant="contained">
            Go to Dashboard
          </Button>
        </Stack>
      </Container>
      {openFullScreenDialog && renderFullScreenDialog()}
    </Page>
  );
}
