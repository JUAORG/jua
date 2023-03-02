import * as React from 'react';
import { get, head } from 'lodash';
import { useQuery } from 'react-query';
import {
  AppBar,
  Toolbar,
  Avatar,
  AvatarGroup,
  Stack,
  Button,
  Dialog,
  Divider,
  IconButton,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import MessageIcon from '@mui/icons-material/Message';
import FeedbackIcon from '@mui/icons-material/Feedback';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import BasicSpeedDial from './SpeedDial';
import { CustomChatBox } from './CustomChatBox';
import { fetchServiceRequest } from '../actions/JuaNetwork';

export const ServiceRequestDetail = ({ selectedServiceRequestRef, handleClose }) => {
  const navigate = useNavigate();
  const { data: userP } = useQuery(['user']);
  const user = get(userP, 'data', {});
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');
  const [openChatBox, setOpenChatBox] = React.useState(false);
  const [expanded, setExpanded] = React.useState('panel1');

  const { isLoading, isError, data, error } = useQuery('service_request', () =>
    fetchServiceRequest(selectedServiceRequestRef)
  );

  const selectedServiceRequest = head(get(data, 'data'));

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenChatBox = () => setOpenChatBox(true)
  const handleCloseChatBox = () => setOpenChatBox(false)
  const handleGoToServiceRequestMeeting = () => {
    navigate(`/dashboard/advisory_session_meeting/?room=${selectedServiceRequestRef}`, { replace: true });
  }

  const actions = [
    {
      icon: <FeedbackIcon sx={{ color: '#2065D1' }} />,
      name: 'Feedback',
      onClick: () => console.log('You Can only provide feedback after the service request'),
    },
    {
      icon: <DeleteForeverIcon sx={{ color: '#2065D1' }} />,
      name: 'Cancel Service Request',
      onClick: () => alert('work in progress'),
    },
    {
      icon: <MessageIcon sx={{ color: '#2065D1' }} />,
      name: 'Send a message',
      onClick: handleOpenChatBox,
    },
    {
      icon: <AttachEmailIcon sx={{ color: '#2065D1' }} />,
      name: 'Upload Attachment',
      onClick: () => alert('work in progress'),
    },
    {
      icon: <VideoCameraFrontIcon sx={{ color: '#2065D1' }} />,
      name: 'Start Service Request',
      onClick: handleGoToServiceRequestMeeting,
    },
  ];

  //    const descriptionElementRef = React.useRef(null);

  // React.useEffect(() => {
  //     if (open) {
  //         const { current: descriptionElement } = descriptionElementRef;
  //         if (descriptionElement !== null) {
  //             descriptionElement.focus();
  //         }
  //     }
  // }, [open]);

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
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
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
              <Stack
                justifyContent="space-between"
                alignItems="center"
                spacing={8}
                direction={{ xs: 'row', md: 'row' }}
              >
                <Typography variant="body2">Participants:</Typography>
                <AvatarGroup max={4}>
                  <Avatar src="" />
                  <Avatar src="" />
                </AvatarGroup>
              </Stack>
              <div>{get(selectedServiceRequest, 'read_by_service_provider')}</div>
              <div>{get(selectedServiceRequest, 'read_by_service_requester')}</div>
              <div>{get(selectedServiceRequest, 'duration_in_minutes')}</div>
              <div>{get(selectedServiceRequest, 'created_at')}</div>
              <Divider />
            </div>
            <Divider />
          </Stack>
          {openChatBox && <CustomChatBox serviceRequestRef={selectedServiceRequestRef} handleClose={handleCloseChatBox}/>}
          <Stack justifyContent="space-between" alignItems="center" spacing={8} direction={{ xs: 'column', md: 'row' }}>
            <BasicSpeedDial actions={actions} customSpeedDialIcon={<MoreVertIcon />} />
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
