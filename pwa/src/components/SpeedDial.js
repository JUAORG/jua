import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

const actions = [
//   { icon: <FileCopyIcon />, name: 'Copy' },
//   { icon: <SaveIcon />, name: 'Save' },
//   { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share', onclick: onShare },
];

const onShare = (event) => {
    // console.log(navigator)
        // if (navigator.share) {
        //   navigator.share({
        //     title: 'WebShare API Demo',
        //     url: 'https://codepen.io/ayoisaiah/pen/YbNazJ'
        //   }).then(() => {
        //     console.log('Thanks for sharing!');
        //   })
        //   .catch(console.error);
        // } 
}

export default function BasicSpeedDial() {
  return (
    <Box sx={{ bottom: 10, right: 10, position: 'fixed', transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}