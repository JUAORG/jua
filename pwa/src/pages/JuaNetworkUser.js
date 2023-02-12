import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  get,
  map,
  size,
  head
} from 'lodash'
import {
  Grid,
  List,
  Button,
  Avatar,
  Divider,
  ListItem,
  Container,
  Typography,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import Page from '../components/Page';
import CreateServiceRequest from '../sections/@dashboard/app/CreateServiceRequest';

export default function JuaNetworkUser() {
  const navigate = useNavigate()
  const { juaNetworkUserId } = useParams()
  const [openServiceRequestForm, setOpenServiceRequestForm] = React.useState(false);
  const [juaNetworkUser, setJuaNetworkUser] = useState(null)

  const handleClickOpen = () => {
    setOpenServiceRequestForm(true);
  }

  const handleClose = () => {
    setOpenServiceRequestForm(false);
  }

  useEffect(() => {

  }, [])
  

  const goBack = (uid) => {
    navigate(`/dashboard/jua_network`, { replace: true });
  }
  
  return (
    <Page title='Jua Network'>
      <Container maxWidth='xl'>
        <Typography variant='h4' sx={{ mb: 5 }}>
          Jua Network
        </Typography>
        <Button onClick={ goBack }>Back</Button>
        <List>
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar alt={`${get(juaNetworkUser, 'first_name')}'s profile picture`} src='/static/images/avatar/1.jpg' />
            </ListItemAvatar>
            <ListItemText
              primary={`${get(juaNetworkUser, 'first_name')} ${get(juaNetworkUser, 'last_name')}`}
              secondary={
                <>
                  { get(juaNetworkUser, 'about') &&
                    <Typography
                      sx={{ display: 'inline' }}
                      component='span'
                      variant='body2'
                      color='text.primary'
                    >
                      About: { get(juaNetworkUser, 'about', ) }
                    </Typography>
                  }
                  { get(juaNetworkUser, 'industry') &&
                    <Typography variant='p' component='p'>
                      Industry: { get(juaNetworkUser, 'industry', '') }
                    </Typography>
                  }
                  <Typography variant='p' component='p'>
                    Jua member since: { juaNetworkUser && `${new Date(get(juaNetworkUser, 'join_date', )).toDateString().slice(4)}` }
                  </Typography>
                  <h5>Education</h5>
                  { map(get(juaNetworkUser, 'education'), (x) => {
                    return (
                      <>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          Degree: {get(x, 'degree')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          Institution: {get(x, 'institution')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          Description: {get(x, 'description')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          From: {get(x, 'start_date')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          To: {get(x, 'end_date')}
                        </Typography>
                        <Divider/>
                      </>
                    )
                  })}
                  <h5>Work</h5>
                  {console.log(get(juaNetworkUser, 'work'))}
                  { map(get(juaNetworkUser, 'work'), (x) => {
                    return (
                      <>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          Company: {get(x, 'company')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          Title: {get(x, 'title')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          Description: {get(x, 'description')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          From: {get(x, 'start_date')}
                        </Typography>
                        <Typography
                          variant='p'
                          component='p'
                        >
                          To: {get(x, 'end_date')}
                        </Typography>
                        <Divider/>
                      </>
                    )
                  })}
                </>
              }
            />
          </ListItem>
          {openServiceRequestForm &&
           <CreateServiceRequest isOpen={openServiceRequestForm}/>
          }
        </List>
        <Button
          variant='outlined'
          onClick={ handleClickOpen }
          sx={{ float: 'right '}}
        >
          Create Service Request
        </Button>
      </Container>
    </Page>
  )
}
