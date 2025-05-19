import { useState, useEffect } from 'react';
import { get, map } from 'lodash';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';
import { Grid, Container, Typography, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ShareIcon from '@mui/icons-material/Share';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../actions/firebase';
import Page from '../components/Page';
import BasicSpeedDial from '../components/SpeedDial';
import BriefServiceCards from '../components/BriefServiceCards';
import SearchBar from '../components/SearchBar';

export default function DashboardApp() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { currentUser } = auth;
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUser({ ...userData, id: userSnap.id });

            // 🔥 Check tour flag and start tour if not done
            if (!userData.tour_completed) {
              setRunTour(true);
            }
          }
        }
      } catch (error) {
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  const steps = [
    {
      target: '.MuiTypography-h4',
      content: 'Welcome to your JUA Dashboard!',
      placement: 'auto',
    },
    {
      target: '.simplebar-content',
      content: 'Explore services and feeds here.',
      placement: 'auto',
    },
    {
      target: '.MuiSpeedDial-root',
      content: 'Use this button for quick actions like feedback.',
      placement: 'auto',
    },
  ];

  const handleJoyrideCallback = async data => {
    const { status, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
      setRunTour(false);

      // 🔥 Mark as completed in Firestore
      try {
        const { currentUser } = auth;
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, { tour_completed: true });
        }
      } catch (err) {}
    }
  };

  return (
    <Page title="Dashboard">
      {/* Joyride Tour */}
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#2065d1',
          },
        }}
      />

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {loadingUser ? 'Loading...' : `${get(user, 'first_name') || ''} ${get(user, 'last_name') || ''}`}
        </Typography>
        <SearchBar />
        <Typography variant="h6" my={4}>
          Industries
        </Typography>
        <Typography variant="h6" my={4}>
          Feed
        </Typography>
        <Grid container spacing={3}>
          {/* Conditional rendering based on user role */}
        </Grid>
        <BasicSpeedDial
          actions={[
            {
              icon: <FeedbackIcon />,
              name: 'Feedback',
              onClick: () => navigate(`/dashboard/about`, { replace: true }),
            },
            {
              icon: <ShareIcon />,
              name: 'Share',
              onClick: () => navigator.share({ title: 'JUA', text: 'Join JUA today!', url: 'https://jua.one' }),
            },
          ]}
        />
      </Container>
    </Page>
  );
}
