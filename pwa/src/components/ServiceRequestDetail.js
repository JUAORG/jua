import * as React from 'react';
import { get } from 'lodash';
import {
  AppBar,
  Toolbar,
  Avatar,
  Stack,
  Button,
  Dialog,
  TextField,
  Divider,
  IconButton,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FeedbackIcon from '@mui/icons-material/Feedback';
import UserItem from './UserItem';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import IconTextDateList from './reusables/IconTextDateList';
import { ServiceRequestChat } from './ServiceRequestChat';
import BasicSpeedDial from './SpeedDial';

export const ServiceRequestDetail = ({ selectedServiceRequest, handleClose }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const goToServiceRequestMeeting = () => {
    navigate(`/dashboard/advisory_session_meeting/?room=${get(selectedServiceRequest, 'ref')}`, { replace: true });
  };

  const actions = [
    {
      icon: <FeedbackIcon />,
      name: 'Feedback',
      onClick: () => console.log('success'),
    },
    {
      icon: <FeedbackIcon />,
      name: 'Start Service Request',
      onClick: goToServiceRequestMeeting,
    },
  ];

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Dialog id="service-request-modal" fullScreen open onClose={handleClose} scroll={scroll}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Service Request
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            Close
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
          <Stack direction="column" justifyContent="space-between" alignItems="flex-start" spacing={0.5}>
            <div>
              <Typography variant="body2" gutterBottom>
                Subject: {get(selectedServiceRequest, 'subject')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Description: {get(selectedServiceRequest, 'description')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Status: {get(selectedServiceRequest, 'status')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Participants:
                <Stack justifyContent="space-between" alignItems="center" spacing={8} direction={{ xs: 'column', md: 'row' }}>
                  <UserItem brief user={get(selectedServiceRequest, ['service_provider', 'profile'])} />
                  <UserItem brief user={get(selectedServiceRequest, ['service_requester', 'profile'])} />
                </Stack>
              </Typography>
              <div>{get(selectedServiceRequest, 'read_by_service_provider')}</div>
              <div>{get(selectedServiceRequest, 'read_by_service_requester')}</div>
              <div>{get(selectedServiceRequest, 'duration_in_minutes')}</div>
              <div>{get(selectedServiceRequest, 'created_at')}</div>
              <Divider />
            </div>
            <Divider />
            <ServiceRequestChat />
          </Stack>
          <Stack justifyContent="space-between" alignItems="center" spacing={8} direction={{ xs: 'column', md: 'row' }}>
          <BasicSpeedDial actions={actions}/>
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
