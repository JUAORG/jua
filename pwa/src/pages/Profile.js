import { useState } from 'react'
import ReactGA from 'react-ga';
import { get, map } from 'lodash';
import { useQuery, useMutation } from 'react-query';
import { Grid, Box, Button, Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import EducationHistoryForm from '../sections/@dashboard/app/EducationHistoryForm';
import WorkHistroyForm from '../sections/@dashboard/app/WorkHistoryForm';
import AccountPaymentMethodForm from '../sections/@dashboard/app/AccountPayment';
import Page from '../components/Page';
import UserProfileForm from '../sections/@dashboard/app/UserProfileForm';
import ServiceListForm from '../sections/@dashboard/app/ServiceListForm';
import ReusableTab from '../components/reusables/Tabs';
import notificationManager from '../actions/NotificationManager';
import { becomeAffiliateExpertApplication } from '../actions/JuaNetwork'


export default function Profile() {
  const { data } = useQuery(['user']);
  const user = get(data, 'data', {});
  const [affiliateExpertApplicationButtonDisabled, setAffiliateExpertApplicationButtonDisabled] = useState(false)

  const renderEducationHistory = () => {
    const educationList = get(user, ['profile', 'educations_related_to_user_profile']);
    return (
      <>
        {map(educationList, (doc) => (
          <>
            <EducationHistoryForm key={get(doc, 'ref')} educationDoc={doc} />
          </>
        ))}
        <EducationHistoryForm />
      </>
    );
  };

  const renderWorkHistory = () => {
    const experienceList = get(user, ['profile', 'experiences_related_to_user_profile']);
    return (
      <>
        {map(experienceList, (doc) => (
          <>
            <WorkHistroyForm key={get(doc, 'ref')} workDoc={doc} />
          </>
        ))}
        <WorkHistroyForm />
      </>
    );
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const handleAffiliateExpertApplication = useMutation( (values) => becomeAffiliateExpertApplication(values), {
    onMutate: variables => {
      ReactGA.event({
        value: 1,
        category: 'User Profile',
        action: 'Apply to become affiliate expert'
      })
    },
    onError: (error, variables, context) => {
      console.error(error)
      notificationManager.error('Something went wrong. Please try again later.', 'Error');
    },
    onSuccess: (data, variables, context) => {
      setAffiliateExpertApplicationButtonDisabled(true)
      notificationManager.success('We will update you soon', 'Success');
    },
    onSettled: (data, error, variables, context) => {
    },
  })



  const renderServices = () => {
    return (
      <>


        {/* {map(servicesList, (doc) =>
           <>
           <ServiceListForm key={get(doc, "id")} serviceDoc={doc} />
           </>
           )} */}
        <ServiceListForm />
      </>
    );
  };

  const renderAccountPayment = () => <AccountPaymentMethodForm/>

  const renderAdvisorProfileTabs = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <ReusableTab
            scrollButtons
            variant="scrollable"
            allowScrollButtonsMobile
            tabHeadings={['Personal Details', 'Services', 'Education', 'Experience', 'Payment']}
            tabContents={[
              <UserProfileForm userProfile={get(user, 'profile')} />,
              renderServices(),
              renderEducationHistory(),
              renderWorkHistory(),
              renderAccountPayment()
            ]}
          />
        </Box>
      </>
    );
  };

  const renderCustomerProfileTabs = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 5, textAlign: 'center' }}>
            <Button
              disabled={ handleAffiliateExpertApplication.isLoading || affiliateExpertApplicationButtonDisabled }
              onClick={() => handleAffiliateExpertApplication.mutate()}>
              Apply to become an Affiliate Expert
            </Button>
          </Typography>
          {/* <ReusableTab
             scrollButtons
             variant="scrollable"
             allowScrollButtonsMobile
             tabHeadings={['Personal Details', 'Old Service Requests']}
             tabContents={[
             <UserProfileForm userProfileDoc={ userProfile }/>,
             renderOldServiceRequests()
             ]}
             /> */}
        </Box>
      </>
    );
  };

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>
          <img alt="FAQs" width={200} style={{ margin: 'auto' }} src="/static/illustrations/undraw_profile.svg" />
          Profile
        </Typography>
        <Grid>
          {get(user, ['profile', 'is_service_provider']) ? renderAdvisorProfileTabs() : renderCustomerProfileTabs()}
        </Grid>
      </Container>
    </Page>
  );
}
