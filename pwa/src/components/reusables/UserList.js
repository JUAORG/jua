import * as React from 'react';
import { get, map, head, random } from 'lodash'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function UsersList(users) {
  const navigate = useNavigate()
  const defaultAvatarBasePath = '/static/illustrations/undraw'
  const variant = random(1, 2)
  // using m/f binary (for now)
  const defaultMaleAvatar = `${defaultAvatarBasePath}_male_avatar_${variant}.svg`
  const defaultFemaleAvatar = `${defaultAvatarBasePath}_female_avatar_${variant}.svg`

  const openUserProfile = (user) => {
    console.log(user)
    navigate(`/dashboard/jua_network/${get(user, 'uid')}`, { replace: true });
  }
  
  return (
    <List sx={{ width: '100%', maxWidth: 400, margin: 'auto'}}>
      { map(users, (user, index) => (
        <ListItem
          key={ index }
          alignItems='flex-start'
          onClick={() => openUserProfile(user)}
        >
          <ListItemAvatar>
            <Avatar
              alt={ get(user, 'first_name') }
              src={ get(user, 'gender') === 'female' ? defaultFemaleAvatar : defaultMaleAvatar }
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${get(user, 'first_name', 'first')} ${get(user, 'last_name', 'last')}`}
            secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                ---
              </Typography>
              {"…"}
            </>
          }
        />
      </ListItem>
      ))}
        <Divider variant="inset" component="li" />
    </List>
  )
}
