import React, {useState, useEffect} from "react"
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
import {
  query,
  doc,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { getAllUsers } from "../actions/Users";
import { db } from "../utils/firebase"
import Page from '../components/Page';

export default function JuaNetwork() {
  
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    getUsers()    
  }, [])

  const getUsers = async () => {
    const data = await getAllUsers();
    setUsers(data)
  }

  const goToUserProfile = (userId) => {
    console.log(userId)
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
              <ListItem id={get(user, "id")} alignItems="flex-start" onClick={() => goToUserProfile(get(user, "id"))}>
                <ListItemAvatar>
                  <Avatar alt={`${get(user, "name")}'s profile picture`} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={get(user, "name")}
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