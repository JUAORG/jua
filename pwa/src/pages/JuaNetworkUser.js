import React, {useState, useEffect} from "react"
import { useNavigate, useParams } from 'react-router-dom'
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
  Avatar,
  Button
} from '@mui/material';
import { getDatabase, ref, push, child, getRef, onValue } from "firebase/database"
import Page from '../components/Page';
import CreateServiceRequest from "../sections/@dashboard/app/CreateServiceRequest";

export default function JuaNetworkUser() {
  const navigate = useNavigate()
  const db = getDatabase()
  const { juaNetworkUserId } = useParams()
  const [openServiceRequestForm, setOpenServiceRequestForm] = React.useState(false);
  const [juaNetworkUser, setJuaNetworkUser] = useState([])
  

  const handleClickOpen = () => {
    setOpenServiceRequestForm(true);
  }

  const handleClose = () => {
    console.log("hhe")
    setOpenServiceRequestForm(false);
  }

  useEffect(() => {
    onValue(ref(db, `/users/${juaNetworkUserId}`), (snapshot) => {
      const result =  (snapshot.val() && snapshot.val())
      setJuaNetworkUser(result)
    }, {
      onlyOnce: true
    })
  }, [db])
  

  const goBack = (uid) => {
    navigate(`/dashboard/jua_network`, { replace: true });
  }
  
  return (
    <Page title="Jua Network">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Jua Network
        </Typography>
        <Button onClick={goBack}>Back</Button>
        <List sx={{ bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={`${get(juaNetworkUser, "name")}'s profile picture`} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={`${get(juaNetworkUser, "first_name")} ${get(juaNetworkUser, "last_name")}`}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {get(juaNetworkUser, "job", "job goes here")}
                      </Typography><br/>
                      {get(juaNetworkUser, "bio", "bio goes here")}
                    </>
                  }
                />
              </ListItem>
              {openServiceRequestForm &&
              <CreateServiceRequest handleClose={handleClose} juaNetworkUserId={juaNetworkUserId}/>
              }
              <Button variant="outlined" onClick={handleClickOpen}>
                Create Service Request
            </Button>
              <Divider variant="inset" component="li" />
        </List>
      </Container>
    </Page>
  )
}