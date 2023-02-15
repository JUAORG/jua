import { useContext, useEffect, useState } from 'react'
import { get, map, unset } from 'lodash'
import {
  Grid,
  List,
  Box,
  Tab,
  Tabs,
  Avatar,
  Divider,
  ListItem,
  Container,
  ImageIcon,
  Typography,
  ListItemText,
  ListItemAvatar,
} from '@mui/material'
import PropTypes from 'prop-types'
import EducationHistoryForm from '../sections/@dashboard/app/EducationHistoryForm'
import WorkHistroyForm from '../sections/@dashboard/app/WorkHistoryForm'
import Page from '../components/Page'
import UserProfileForm from '../sections/@dashboard/app/UserProfileForm'
import ServiceListForm from '../sections/@dashboard/app/ServiceListForm'
import { getMyOldRecievedServiceRequests } from "../actions/JuaNetwork"
import { getAuthId } from '../actions/Auth'
import { showCustomerView } from '../actions/UI'
import ReusableTab from '../components/reusables/Tabs'
import { UserContext } from '../contexts/User'

export default function Profile() {
  const user = useContext(UserContext)
  const [value, setValue] = useState(0)
  const [experienceList, setExperienceList] = useState(get(user, ['profile','experiences_related_to_user_profile']))
  const [userProfile, setUserProfile] = useState(get(user, 'profile'))
  const [servicesList, setServicesList] = useState(null)
  const [educationList, setEducationList] = useState(get(user, ['profile','educations_related_to_user_profile']))
  const [oldRecievedServiceRequests, setOldRecievedServiceRequests] = useState(null)
  console.log(user)

  const renderEducationHistory = () => {
    return (
      <>
        {map(educationList, (doc) => 
          <>
            <EducationHistoryForm key={get(doc, "id")} educationDoc={doc}/>
          </>
        )}
        <EducationHistoryForm/>
      </>
    )
  }

  const renderWorkHistory = () => {
    return (
      <>
        {map(experienceList, (doc) => 
          <>
            <WorkHistroyForm key={get(doc, "id")} workDoc={doc}/>
          </>
        )}
        <WorkHistroyForm/>
      </>
    )
  }
  
  const renderOldServiceRequests = () => {
    return (
      <>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {map(oldRecievedServiceRequests, (doc) => 
            <ListItem>
              <ListItemText primary={get(doc, "subject")} secondary="Aug 25, 1997" />
            </ListItem>
          )}
        </List>
      </>
    )
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props
    
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
    )
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
  }

  const renderServices = () => {
    return (
      <>
        {map(servicesList, (doc) => 
          <>
            <ServiceListForm key={get(doc, "id")} serviceDoc={ doc }/>
          </>
        )}
        <ServiceListForm/>
      </>
    )
}

  const renderAdvisorProfileTabs = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <ReusableTab
            scrollButtons
            variant="scrollable"
            allowScrollButtonsMobile
            tabHeadings={['Personal Details', 'Services', 'Education', 'Experience']}
            tabContents={[
              <UserProfileForm userProfile={ userProfile }/>,
              renderServices(),
              renderEducationHistory(),
              renderWorkHistory()
            ]}
        />
        </Box>
      </>
    )
  }

  const renderCustomerProfileTabs = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <ReusableTab
            scrollButtons
            variant="scrollable"
            allowScrollButtonsMobile
            tabHeadings={['Personal Details', 'Old Service Requests']}
            tabContents={[
              <UserProfileForm userProfileDoc={ userProfile }/>,
              renderOldServiceRequests() 
            ]}
          />
        </Box>
      </>
    )
  }
  
  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5, textAlign: 'center' }}>
          <img
            alt='FAQs'
            width={ 200 }
            style={{margin: 'auto'}}
            src='/static/illustrations/undraw_profile.svg'
          />
          Profile
        </Typography>
        <Grid>
          {!showCustomerView() && renderAdvisorProfileTabs() }
          {showCustomerView() && renderCustomerProfileTabs() }
        </Grid>
      </Container>
    </Page>
  )
}
