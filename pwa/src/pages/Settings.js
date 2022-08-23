import React, { useState, useEffect } from 'react'
import { get, map } from 'lodash'
import {
  ref,
  set,
  child,
  update,
  onValue,
  getDatabase,
  serverTimestamp
} from 'firebase/database'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Switch from '@mui/material/Switch'
import PersonIcon from '@mui/icons-material/Person'
import BluetoothIcon from '@mui/icons-material/Bluetooth'
import { editUserProfile } from '../actions/Profile'
import { getAuthId } from '../actions/Auth'

const db = getDatabase()

export default function Settings() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/`), (snapshot) => {  
      const result = (snapshot.val() && snapshot.val())
      setUser(result)
    })
  }, [db])
  
  const handleProfileVisibility = () => {
    const isProfileVisible = get(user, 'profile_visible')
    const values = {}
    if (isProfileVisible) {
      values.profile_visible = false
      editUserProfile(values)
    }else{
      values.profile_visible = true
      editUserProfile(values)
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
  )
}
