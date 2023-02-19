import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ShareIcon from '@mui/icons-material/Share';

export default function BasicSpeedDial() {
  const navigate = useNavigate();

  const goToFeedbackPage = () => navigate(`/dashboard/about`, { replace: true });

  const shareJUA = () => {
    const shareData = {
      title: 'JUA',
      text: 'Join JUA today!',
      url: 'https://jua.one',
    };
    try {
      navigator.share(shareData);
    } catch (err) {
      console.error(err);
    }
  };

  const actions = [
    {
      icon: <FeedbackIcon />,
      name: 'Feedback',
      onClick: goToFeedbackPage,
    },
    {
      icon: <ShareIcon />,
      name: 'Share',
      onClick: shareJUA,
    },
  ];

  return (
    <Box sx={{ bottom: 10, right: 10, position: 'fixed', transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction onClick={action.onClick} key={action.name} icon={action.icon} tooltipTitle={action.name} />
        ))}
      </SpeedDial>
    </Box>
  );
}
