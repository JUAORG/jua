import { useEffect, useState } from 'react'
import { get, map, unset } from 'lodash'
import {
  ref,
  onValue,
  getDatabase
} from "firebase/database"
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

export default function Profile() {
  const db = getDatabase()
  const [value, setValue] = useState(0)
  const [workList, setWorkList] = useState(null)
  const [profileList, setProfileList] = useState(null)
  const [servicesList, setServicesList] = useState(null)
  const [educationList, setEducationList] = useState(null)
  const [oldRecievedServiceRequests, setOldRecievedServiceRequests] = useState(null)
  
  
  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/`), (snapshot) => {
      const result =  (snapshot.val() && snapshot.val())
      setWorkList(get(result, "work"))
      setWorkList(get(result, "services"))
      setServicesList(get(result, "services"))
      setEducationList(get(result, "education"))
      unset(result, "work")
      unset(result, "education")
      setProfileList(result)
    }, {
    })

    onValue(ref(db, `/service_requests`), (snapshot) => {  
      const allServiceRequests = (snapshot.val() && snapshot.val())
      setOldRecievedServiceRequests(getMyOldRecievedServiceRequests(allServiceRequests))
    })
  }, [db])

  useEffect(() => {
    onValue(ref(db, `/service_requests`), (snapshot) => {  
      const allServiceRequests = (snapshot.val() && snapshot.val())
      setOldRecievedServiceRequests(getMyOldRecievedServiceRequests(allServiceRequests))
    })
  }, [db])

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
        {map(workList, (doc) => 
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
            tabHeadings={['Personal Details', 'Education', 'Work', 'Services']}
            tabContents={[
              <UserProfileForm userProfileDoc={ profileList }/>,
              renderEducationHistory(),
              renderWorkHistory(),
              renderServices()
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
              <UserProfileForm userProfileDoc={ profileList }/>,
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
