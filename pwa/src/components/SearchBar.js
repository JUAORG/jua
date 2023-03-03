import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import notificationManager from '../actions/NotificationManager';

export default function SearchBar() {
  const displayFunctionalityNotReadyMessage = () => {
    notificationManager.warning('This functionality is not ready yet', 'Work in progress');
  };

  return (
    <Paper component="form" sx={{ p: '2px 4px', m: '10px 0px 20px', display: 'flex', alignItems: 'center' }}>
      <InputBase
        disabled
        onClick={displayFunctionalityNotReadyMessage}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Jua"
        inputProps={{ 'aria-label': 'search Jua' }}
      />
      <IconButton onClick={displayFunctionalityNotReadyMessage} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
