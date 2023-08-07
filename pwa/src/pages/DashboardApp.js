import { useState } from 'react';
import { get, map } from 'lodash';
import { useQuery } from 'react-query';
import { Grid, Container, Typography, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import Joyride from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ShareIcon from '@mui/icons-material/Share';
import { SERVICES } from '../content/services';
import Page from '../components/Page';
import { AppNewsUpdate, AppWidgetSummary } from '../sections/@dashboard/app';
import BasicSpeedDial from '../components/SpeedDial';
import BriefFeedCards from  '../components/BriefFeedCards';
import BriefServiceCards from '../components/BriefServiceCards';
import SearchBar from '../components/SearchBar';


export default function DashboardApp() {
  const navigate = useNavigate();
  const { data } = useQuery(['user']);
  const user = get(data, 'data', {});

  const [customerInfoSteps, setCustomerInfoSteps] = useState([
    {
      title: 'Welcome',
      placement: 'auto',
      target: '.MuiTypography-h4',
      content: 'This is my awesome feature!',
    },
    {
      target: '.simplebar-content',
      content: 'This another awesome feature!',
    },
    {
      title: 'Welcome',
      placement: 'auto',
      target: '.MuiTypography-h4',
      content: 'This is my awesome feature!',
    },
  ]);

  const goToFeedbackPage = () => navigate(`/dashboard/about`, { replace: true });
  const shareJUA = () => {
    const shareData = {
      title: 'JUA',
      text: 'Join JUA today!',
      url: 'https://jua.one',
    };
    try {
      navigator.share(shareData);
    } catch (err) {
      console.error(err);
    }
  };

  const actions = [
    {
      icon: <FeedbackIcon />,
      name: 'Feedback',
      onClick: goToFeedbackPage,
    },
    {
      icon: <ShareIcon />,
      name: 'Share',
      onClick: shareJUA,
    },
  ];

  const goToServiceRequestPage = () => {
      navigate('/dashboard/service_requests', { replace: true });
  };

  const goToServiceDetailPage = (service) => {
    const serviceSlug = get(service, 'slug');
    navigate(`/dashboard/service/${serviceSlug}`, { replace: true });
  };

  const goToServicesPage = () => {
    navigate('/dashboard/services/', { replace: true });
  };

  const renderAdvisorHomePage = () => {
    return (
      <>
        <Grid item xs={12} sm={6} md={3}>

          {/* <AppWidgetSummary title="Service Requests" total={numServiceRequests} onClick={goToServiceRequestPage} /> */}
        </Grid>
      </>
    );
  };

  const renderAvailiableServices = () => {
    const availableServices = SERVICES;

    return (
      <ImageList
        sx={{
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(100px, 1fr)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr)) !important',
        }}
      >
        {map(availableServices, (service) => (
          <ImageListItem
            key={get(service, 'id')}
            sx={{ cursor: 'pointer' }}
            onClick={() => goToServiceDetailPage(service)}
          >
            <img
              alt={get(service, 'thumbnail_alt')}
              src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=994&q=20"
            />
            <ImageListItemBar title={get(service, 'name')} />
          </ImageListItem>
        ))}
        <ImageListItem sx={{ cursor: 'pointer', background: '#e9e9e9' }} onClick={() => goToServicesPage()}>
          <ImageListItemBar title="More" />
        </ImageListItem>
      </ImageList>
    );
  };

  const renderCustomerHomePage = () => {
    return (
      <>
        <Grid item xs={12} sm={6} md={12}>
          {' '}
          {/* <Typography variant="h6" mb={2}>
            Services
          </Typography>
          {renderAvailiableServices()} */}
        </Grid>
      </>
    );
  };

  return (
    <Page title="Dashboard">
      {/* <Joyride
         showProgress
         showSkipButton
         disableCloseOnEsc
         steps={userIsNewToJua && shouldShowCustomerView ? customerInfoSteps : advisorInfoSteps }
      />  */}
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {get(user, 'first_name') && `${get(user, ['profile', 'first_name'])} ${get(user, ['profile', 'last_name'])}`}
        </Typography>
        <SearchBar/>
          <Typography variant="h6" my={4}>
            Industries
          </Typography>
        <BriefServiceCards/>
        <Typography variant="h6" my={4}>
          Feed
        </Typography>
        <BriefFeedCards/>
        <Grid container spacing={3}>
          {get(user, ['profile', 'is_service_provider']) ? renderAdvisorHomePage() : renderCustomerHomePage()}
          {/* <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate list={ userUpdates }/>
          </Grid> */}
        </Grid>
        <BasicSpeedDial actions={actions} />
      </Container>
    </Page>
  );
}
