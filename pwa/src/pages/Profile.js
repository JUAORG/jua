import { useEffect, useState } from 'react'
import { get, map, unset } from 'lodash'
import {
  ref,
  push,
  child,
  getRef,
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
import { getMyOldRecievedServiceRequests } from "../actions/JuaNetwork"
import { getAuthId } from '../actions/Auth'

export default function Profile() {
  const db = getDatabase()
  const [value, setValue] = useState(0)
  const [profileList, setProfileList] = useState(null)
  const [educationList, setEducationList] = useState(null)
  const [workList, setWorkList] = useState(null)
  const [oldRecievedServiceRequests, setOldRecievedServiceRequests] = useState(null)
  const [refreshProfileList, setRefreshProfileList] = useState(false)
  
  
  
  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/`), (snapshot) => {
      const result =  (snapshot.val() && snapshot.val())
      setEducationList(get(result, "education"))
      setWorkList(get(result, "work"))
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

  const renderUserProfileTabs = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            scrollButtons
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleTabChange}
          >
            <Tab label="Personal Details"/>
            <Tab label="Education"/>
            <Tab label="Work"/>
            <Tab label="Old Service Requests"/>
          </Tabs>
        </Box>
        <TabPanel value={ value } index={ 0 }>
          <UserProfileForm userProfileDoc={ profileList }/>
        </TabPanel>
        <TabPanel value={ value } index={ 1 }>
          <Typography variant="h4" mb={ 3 }>
            Education History
            <Divider />
          </Typography>
          { renderEducationHistory() }
        </TabPanel>
        <TabPanel value={ value } index={ 2 }>
          <Typography variant="h4" mb={3}>
            Service History
            <Divider />
          </Typography>
          { renderWorkHistory() }
        </TabPanel>
        <TabPanel value={ value } index={ 3 }>
          <Typography variant="h4" mb={3}>
            My old recieved Service Requests
          </Typography>
          { renderOldServiceRequests() }
        </TabPanel>
      </>
    )
  }
  
  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Profile
        </Typography>
        <Grid>
          { renderUserProfileTabs() }
        </Grid>
      </Container>
    </Page>
  )
}
