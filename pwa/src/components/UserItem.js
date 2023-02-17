import * as React from 'react';
import { get, head } from 'lodash'
import {
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from '@mui/material';

export default function UserItem({ user }) {
   return (
    <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={get(user, 'profile_picture')} />
        </ListItemAvatar>
        <ListItemText
          primary={get(user, 'industry')}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {get(user, 'first_name')} {get(user, 'last_name')}
              </Typography><br/>
              —  {get(user, 'bio',)}
            </>
          }
        />
      </ListItem>
    </List>
  );
}
