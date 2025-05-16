import { useState, useEffect } from 'react';
import { get, head } from 'lodash';

import {
  Box,
  AppBar,
  Toolbar,
  Avatar,
  AvatarGroup,
  Stack,
  Button,
  ButtonGroup,
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
import notificationManager from '../actions/NotificationManager';
import { ServiceRequestStatusButtons } from './serviceRequestStatusButtons';
import { fetchServiceRequest, serviceRequestStatusOptions } from '../actions/JuaNetwork';

export const ServiceRequestDetail = ({ selectedServiceRequestRef, handleClose }) => {
  const navigate = useNavigate();
  const user = get(userP, 'data', {});
  const [open, setOpen] = useState(true);
  const [scroll, setScroll] = useState('paper');
  const [openChatBox, setOpenChatBox] = useState(false);
  const [expanded, setExpanded] = useState('panel1');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [shouldShowServiceRequestStatusButton, setShouldShowServiceRequestStatusButton] = useState(false);

  const { isLoading, isError, data, error } = useQuery('service_request', () =>
    fetchServiceRequest(selectedServiceRequestRef)
  );

  const selectedServiceRequest = get(data, 'data');
  const selectedServiceRequestStatus = get(selectedServiceRequest, 'status');

  useEffect(() => {
    if (
      get(user, 'ref') === get(selectedServiceRequest, 'service_provider_ref') &&
      selectedServiceRequestStatus === serviceRequestStatusOptions.pending
    ) {
      setShouldShowServiceRequestStatusButton(true);
    }
  }, [user, selectedServiceRequest]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    notificationManager.error(`${error.message}`, 'Error');
    return <span>Error: {error.message}</span>;
  }

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleOpenChatBox = () => setOpenChatBox(true);
  const handleCloseChatBox = () => setOpenChatBox(false);
  const handleGoToServiceRequestMeeting = () => {
    window.open(`/dashboard/advisory_session_meeting/?room=${selectedServiceRequestRef}`, '_blank', 'noreferrer');
  };

  const handleServiceRequestError = message => {
    notificationManager.error(`${message}`, 'Error');
  };

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
      onClick:
        selectedServiceRequestStatus === serviceRequestStatusOptions.approved
          ? handleOpenChatBox
          : () =>
              handleServiceRequestError('In App messages may only be sent once the service request has been approved.'),
    },
    // {
    //   icon: <AttachEmailIcon sx={{ color: '#2065D1' }} />,
    //   name: 'Upload Attachment',
    //   onClick: () => han,
    // },
    {
      icon: <VideoCameraFrontIcon sx={{ color: '#2065D1' }} />,
      name: 'Start Service Request',
      onClick:
        selectedServiceRequestStatus === serviceRequestStatusOptions.approved ||
        selectedServiceRequestStatus === serviceRequestStatusOptions.inProgress
          ? handleGoToServiceRequestMeeting
          : () =>
              handleServiceRequestError(
                'This service request meeting room is not ready yet. Please wait for once it has been approved.'
              ),
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
            {shouldShowServiceRequestStatusButton && (
              <ServiceRequestStatusButtons serviceRequest={selectedServiceRequest} />
            )}
          </Stack>
          {openChatBox && (
            <CustomChatBox serviceRequestRef={selectedServiceRequestRef} handleClose={handleCloseChatBox} />
          )}
          <Stack justifyContent="space-between" alignItems="center" spacing={8} direction={{ xs: 'column', md: 'row' }}>
            <BasicSpeedDial actions={actions} customSpeedDialIcon={<MoreVertIcon />} />
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
