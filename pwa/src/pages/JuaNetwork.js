import React, {useState, useEffect} from "react"
import { useNavigate } from 'react-router-dom'
import { get, map } from "lodash"
import {
  Grid,
  Container,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import { activeJuaNetworkUsers } from "../actions/JuaNetwork"
import Page from '../components/Page';

export default function JuaNetwork() {
  const navigate = useNavigate();
  const db = getDatabase()
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    onValue(ref(db, `/users`), (snapshot) => {
      let result = (snapshot.val() && snapshot.val())
      result = activeJuaNetworkUsers(result)
      setUsers(result)
  }, {
    onlyOnce: true
  })
}, [db])
console.log(users)
  

  const goToUserProfile = (juaNetworkUserId) => {
    navigate(`/dashboard/jua_network/${juaNetworkUserId}`, { replace: true });
    
  }
  
  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Jua Network
        </Typography>        
        <List sx={{ bgcolor: 'background.paper' }}>
          {map(users, (user) => (
            <>
              <ListItem id={get(user, "id")} alignItems="flex-start" onClick={() => goToUserProfile(get(user, "uid"))}>
                <ListItemAvatar>
                  <Avatar alt={`${get(user, "name")}'s profile picture`} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={`${get(user, "first_name")} ${get(user, "last_name")}`}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {get(user, "job", "job goes here")}
                      </Typography><br/>
                      {get(user, "bio", "bio goes here")}
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          ))}
        </List>
      </Container>
    </Page>
  )
}