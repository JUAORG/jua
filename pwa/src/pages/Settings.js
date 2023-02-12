import React, { useState, useEffect } from 'react'
import { get, map } from 'lodash'
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Container,
  Switch,
  Typography
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import Page from '../components/Page'
import { getAuthId } from '../actions/Auth'


export default function Settings() {
  const [user, setUser] = useState(null)

  useEffect(() => {
  }, [])
  
  const handleProfileVisibility = () => {
    const isProfileVisible = get(user, 'profile_visible')
    const values = {}
    if (isProfileVisible) {
      values.profile_visible = false
    }else{
      values.profile_visible = true
    }
  }

  const renderProfileVisibilitySetting = () => {
    return (
      <ListItem>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary='Hide Profile'/>
        <Switch
          edge='end'
          onChange={ handleProfileVisibility }
          checked={ get(user, 'profile_visible') }
        />
      </ListItem>
    )
  }

  return (
    <Page title='Profile'>
      <Container maxWidth='xl'>
        <Typography align='Center' variant="h4">
          <img
            alt='FAQs'
            width={ 150 }
            style={{margin: 'auto'}}
            src='/static/illustrations/undraw_settings.svg'
          />
          Settings
        </Typography>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper'
          }}
          subheader={
            <ListSubheader>
              Settings
            </ListSubheader>
          }
        >
          {user &&
           renderProfileVisibilitySetting()
          }
        </List>
      </Container>
    </Page>
  )
}
