import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  CircularProgress
} from '@mui/material';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../actions/firebase'; // Adjust the path to your firebase.js config
import Page from '../components/Page';
import ReusableTab from '../components/reusables/Tabs';
import UserProfileForm from '../sections/@dashboard/app/UserProfileForm';
import ServiceListForm from '../sections/@dashboard/app/ServiceListForm';
import EducationHistoryForm from '../sections/@dashboard/app/EducationHistoryForm';
import WorkHistoryForm from '../sections/@dashboard/app/WorkHistoryForm';
import AccountPaymentMethodForm from '../sections/@dashboard/app/AccountPayment';
import notificationManager from '../actions/NotificationManager';
// import { httpsCallable } from 'firebase/functions';
// import { functions } from '.'; // if using cloud function

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [affiliateExpertApplicationButtonDisabled, setAffiliateExpertApplicationButtonDisabled] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  console.debug()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('No user logged in');

        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }

        const eduSnap = await getDocs(collection(db, 'users', uid, 'education'));
        setEducationList(eduSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        const expSnap = await getDocs(collection(db, 'users', uid, 'experience'));
        setExperienceList(expSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      } catch (error) {
        console.error(error);
        notificationManager.error('Failed to load profile data', 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleAffiliateExpertApplication = async () => {
    // setIsApplying(true);
    // try {
    //   const applyExpert = httpsCallable(functions, 'applyAffiliateExpert');
    //   const result = await applyExpert(); // no payload needed in this example
    //   if (result.data?.success) {
    //     setAffiliateExpertApplicationButtonDisabled(true);
    //     notificationManager.success('Application submitted successfully', 'Success');
    //   }
    // } catch (err) {
    //   console.error(err);
    //   notificationManager.error('Submission failed', 'Error');
    // } finally {
    //   setIsApplying(false);
    // }
  };

  const educationForms = useMemo(() => (
    <>
      {educationList.map((doc) => (
        <EducationHistoryForm key={doc.id} educationDoc={doc} />
      ))}
      <EducationHistoryForm />
    </>
  ), [educationList]);

  const workForms = useMemo(() => (
    <>
      {experienceList.map((doc) => (
        <WorkHistoryForm key={doc.id} workDoc={doc} />
      ))}
      <WorkHistoryForm />
    </>
  ), [experienceList]);

  const advisorTabs = (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <ReusableTab
        scrollButtons
        variant="scrollable"
        allowScrollButtonsMobile
        tabHeadings={['Personal Details', 'Services', 'Education', 'Experience', 'Payment']}
        tabContents={[
          <UserProfileForm userProfile={userProfile} />,
          <ServiceListForm />,
          educationForms,
          workForms,
          <AccountPaymentMethodForm />
        ]}
      />
    </Box>
  );

  const customerSection = (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', textAlign: 'center', mt: 4 }}>
      <Button
        disabled={isApplying || affiliateExpertApplicationButtonDisabled}
        onClick={handleAffiliateExpertApplication}
        variant="contained"
      >
        Apply to become an Affiliate Expert
      </Button>
    </Box>
  );

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>
          <img
            alt="Profile Illustration"
            width={200}
            style={{ margin: 'auto' }}
            src="/static/illustrations/undraw_profile.svg"
          />
          Profile
        </Typography>

        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : (
          <Grid>
            {userProfile?.is_service_provider ? advisorTabs : customerSection}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
