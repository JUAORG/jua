import { useEffect, useState } from 'react';
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { get, map, unset } from 'lodash';
import { Grid, Container, Typography, Divider } from '@mui/material';
import EducationHistoryForm from '../sections/@dashboard/app/EducationHistoryForm';
import WorkHistroyForm from '../sections/@dashboard/app/WorkHistoryForm';
import Page from '../components/Page';
import UserProfileForm from '../sections/@dashboard/app/UserProfileForm';
import { getAuthId } from '../actions/Auth';

export default function Profile() {
  const db = getDatabase()
  const [profileList, setProfileList] = useState(null)
  const [educationList, setEducationList] = useState(null)
  const [workList, setWorkList] = useState(null)
  const [refreshProfileList, setRefreshProfileList] = useState(false)

  const onUpdated = () => {
    setRefreshProfileList(true)
  }
  
  
  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/`), (snapshot) => {
      const result =  (snapshot.val() && snapshot.val())
      setEducationList(get(result, "education"))
      setWorkList(get(result, "work"))
      unset(result, "work")
      unset(result, "education")
      setProfileList(result)
  }, {
    onlyOnce: true
  })
  setRefreshProfileList(false)
}, [db, refreshProfileList])


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
    
      return (
        <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          Profile
        </Typography>
        <Grid>
          <Grid my={5} />
          <UserProfileForm userProfileDoc={profileList}/>
          <Grid />
          <Grid my={5}>
          <Typography variant="h4" mb={3}>
          Education History
          <Divider />
        </Typography>
        {renderEducationHistory()}
          </Grid>
          <Grid my={5}>
          <Typography variant="h4" mb={3}>
          Service History
          <Divider />
        </Typography>
          {renderWorkHistory()}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
