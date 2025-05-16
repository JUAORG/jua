import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Switch,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Page from '../components/Page';
import { auth, db } from '../actions/firebase'; // Adjust path to your firebase.js
import notificationManager from '../actions/NotificationManager';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');

        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUser(data);
          setIsProfileVisible(data.profile_visible ?? false);
        } else {
          notificationManager.error('User profile not found', 'Error');
        }
      } catch (err) {
        console.error(err);
        notificationManager.error('Failed to load user profile', 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileVisibilityToggle = async () => {
    const updatedVisibility = !isProfileVisible;
    setIsProfileVisible(updatedVisibility);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('User not authenticated');

      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { profile_visible: updatedVisibility });

      notificationManager.success(`Profile visibility ${updatedVisibility ? 'enabled' : 'disabled'}`, 'Success');
    } catch (error) {
      console.error(error);
      notificationManager.error('Failed to update profile visibility', 'Error');
    }
  };

  const renderProfileVisibilitySetting = () => (
    <ListItem>
      <ListItemIcon>
        <PersonIcon />
      </ListItemIcon>
      <ListItemText primary="Hide Profile" />
      <Switch
        edge="end"
        onChange={handleProfileVisibilityToggle}
        checked={isProfileVisible}
        inputProps={{ 'aria-label': 'Profile visibility toggle' }}
      />
    </ListItem>
  );

  return (
    <Page title="Settings">
      <Container maxWidth="xl">
        <Typography align="center" variant="h4" gutterBottom>
          <img
            alt="Settings illustration"
            width={150}
            style={{ margin: 'auto' }}
            src="/static/illustrations/undraw_settings.svg"
          />
          Settings
        </Typography>

        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', mx: 'auto' }}
          subheader={<ListSubheader>Profile Preferences</ListSubheader>}
        >
          {loading ? (
            <ListItem>
              <CircularProgress size={24} sx={{ mx: 'auto' }} />
            </ListItem>
          ) : (
            renderProfileVisibilitySetting()
          )}
        </List>
      </Container>
    </Page>
  );
}
