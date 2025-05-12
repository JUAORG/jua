import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import {
  get,
  map,
} from 'lodash';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Stack,
} from '@mui/material';
import { db } from '../actions/firebase';
import notificationManager from '../actions/NotificationManager';
import Page from '../components/Page';
import CreateServiceRequest from '../sections/@dashboard/app/CreateServiceRequest';

export default function JuaNetworkUser() {
  const navigate = useNavigate();
  const { juaNetworkUserId } = useParams();
  const [openServiceRequestForm, setOpenServiceRequestForm] = useState(false);
  const [juaNetworkUser, setJuaNetworkUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClickOpen = () => setOpenServiceRequestForm(true);
  const handleClose = () => setOpenServiceRequestForm(false);

  const goBack = () => navigate('/dashboard/jua_network', { replace: true });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', juaNetworkUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();

          // Fetch education
          const educationSnap = await getDocs(collection(db, 'users', juaNetworkUserId, 'education'));
          const education = educationSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          // Fetch work (experience)
          const workSnap = await getDocs(collection(db, 'users', juaNetworkUserId, 'experience'));
          const work = workSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          setJuaNetworkUser({
            ...userData,
            education,
            work,
          });
        } else {
          notificationManager.error('User not found', 'Error');
        }
      } catch (error) {
        console.error(error);
        notificationManager.error('Failed to load user profile', 'Error');
      } finally {
        setLoading(false);
      }
    };

    if (juaNetworkUserId) {
      fetchUserProfile();
    }
  }, [juaNetworkUserId]);

  if (loading) {
    return (
      <Page title="Jua Network">
        <Container maxWidth="xl">
          <CircularProgress sx={{ display: 'block', mx: 'auto', my: 5 }} />
        </Container>
      </Page>
    );
  }

  if (!juaNetworkUser) {
    return (
      <Page title="Jua Network">
        <Container maxWidth="xl">
          <Typography variant="h6">User not found or invalid ID.</Typography>
          <Button onClick={goBack}>Back</Button>
        </Container>
      </Page>
    );
  }

  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Jua Network User Profile
        </Typography>
        <Button onClick={goBack}>Back</Button>

        <List>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={`${juaNetworkUser.first_name}'s profile picture`} src={juaNetworkUser.profile_picture} />
            </ListItemAvatar>
            <ListItemText
              primary={`${juaNetworkUser.first_name} ${juaNetworkUser.last_name}`}
              secondary={
                <Stack spacing={1}>
                  {juaNetworkUser.about && (
                    <Typography variant="body2" color="text.primary">
                      About: {juaNetworkUser.about}
                    </Typography>
                  )}
                  {juaNetworkUser.industry && (
                    <Typography variant="body2">Industry: {juaNetworkUser.industry}</Typography>
                  )}
                  <Typography variant="body2">
                    Jua member since: {new Date(juaNetworkUser.join_date).toDateString().slice(4)}
                  </Typography>
                  <Typography variant="h6">Education</Typography>
                  {map(juaNetworkUser.education, (x) => (
                    <div key={x.id}>
                      <Typography variant="body2">Degree: {x.degree}</Typography>
                      <Typography variant="body2">Institution: {x.institution}</Typography>
                      <Typography variant="body2">Description: {x.description}</Typography>
                      <Typography variant="body2">From: {x.start_date}</Typography>
                      <Typography variant="body2">To: {x.end_date}</Typography>
                      <Divider />
                    </div>
                  ))}
                  <Typography variant="h6">Work</Typography>
                  {map(juaNetworkUser.work, (x) => (
                    <div key={x.id}>
                      <Typography variant="body2">Company: {x.company}</Typography>
                      <Typography variant="body2">Title: {x.title}</Typography>
                      <Typography variant="body2">Description: {x.description}</Typography>
                      <Typography variant="body2">From: {x.start_date}</Typography>
                      <Typography variant="body2">To: {x.end_date}</Typography>
                      <Divider />
                    </div>
                  ))}
                </Stack>
              }
            />
          </ListItem>
        </List>

        {openServiceRequestForm && <CreateServiceRequest isOpen={openServiceRequestForm} />}
        <Button variant="outlined" onClick={handleClickOpen} sx={{ float: 'right' }}>
          Create Service Request
        </Button>
      </Container>
    </Page>
  );
}
