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
import EducationHistoryForm from '../sections/@dashboard/app/EducationHistoryForm';
import WorkHistoryForm from '../sections/@dashboard/app/WorkHistoryForm';

export default function RateCardSetup() {
  const navigate = useNavigate();
  const [openFullScreenDialog, setOpenFullScreenDialog] = useState(false);
  const [activeFormTitle, setActiveFormTitle] = useState(null);

  const onOpenEducationHistoryForm = () => {
    setOpenFullScreenDialog(true);
    setActiveFormTitle('Education History');
  };

  const onOpenServiceHistoryForm = () => {
    setOpenFullScreenDialog(true);
    setActiveFormTitle('Service History');
  };

  const handleClose = () => {
    setOpenFullScreenDialog(false);
  };

  const goToWalletSetup = () => {
    navigate('/dashboard/wallet_setup', { replace: true });
  };

  const renderFullScreenDialog = () => (
    <div>
      <Dialog fullScreen open onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {activeFormTitle}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <Grid m={2}>
          {activeFormTitle === 'Education History' && (
            <>
              <EducationHistoryForm />
            </>
          )}
          {activeFormTitle !== 'Education History' && (
            <>
              <WorkHistoryForm />
            </>
          )}
        </Grid>
      </Dialog>
    </div>
  );

  return (
    <Page title="Rate Card">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {'Name'}, time to set up your JUA rate card.
        </Typography>
        <Typography variant="p" sx={{ mb: 5 }}>
          Complete each of the below sections to give your JUA system the inputs required to determine the lower bound
          of your rate per second.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} mt={5} spacing={2}>
          <Button onClick={onOpenEducationHistoryForm} variant="outlined">
            Education History
          </Button>
          <Button onClick={onOpenServiceHistoryForm} variant="outlined">
            Service History
          </Button>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} mt={5} spacing={2}>
          <Divider />
          <Typography variant="p" sx={{ mb: 5 }}>
            Or, use your LinkedIn profile to populate the above sections
          </Typography>
          <Button onClick={() => alert('Comming soon')} variant="outlined">
            LinkedIn
          </Button>
          <Divider />
          <Button onClick={goToWalletSetup} variant="contained">
            Next
          </Button>
        </Stack>
      </Container>
      {openFullScreenDialog && renderFullScreenDialog()}
    </Page>
  );
}
