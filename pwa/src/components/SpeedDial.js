import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';

export default function BasicSpeedDial({actions, customSpeedDialIcon}) {


  return (
    <Box sx={{ bottom: 10, right: 10, position: 'fixed', transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={customSpeedDialIcon || <SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction onClick={action.onClick} key={action.name} icon={action.icon} tooltipTitle={action.name} />
        ))}
      </SpeedDial>
    </Box>
  );
}
