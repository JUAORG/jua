import * as React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stack
} from '@mui/material'
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

export default function IconTextDateList() {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <Stack
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          spacing={2}
        >
          <ListItemText primary="TBA" secondary="Jan 9, 2014 - Aug 25, 2017 "/>
          some short disc
        </Stack>        
      </ListItem>
    </List>
  );
}
