import * as React from 'react';
import { get, head } from 'lodash';
import { List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';

export default function UserItem({ user, brief }) {
  return (
    <List sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar sx={{ color: '#2065D1' }} src={get(user, 'profile_picture')} />
        </ListItemAvatar>
        <ListItemText
          primary={get(user, 'industry')}
          secondary={
            <>
              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                {get(user, 'first_name')} {!brief && get(user, 'last_name')}
              </Typography>
              {brief && (
                <>
                  <br />— {get(user, 'bio')}
                </>
              )}
            </>
          }
        />
      </ListItem>
    </List>
  );
}
