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
          <Avatar alt={get(user, ['profile', 'first_name'])} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={get(user, ['profile', 'industry'])}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {get(user, ['profile', 'first_name'])} {get(user, ['profile', 'last_name'])}
              </Typography>
              —  {get(user, ['profile', 'bio'], 'empty bio')}
            </>
          }
        />
      </ListItem>
    </List>
  );
}
