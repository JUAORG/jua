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
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  CloseIcon,
  MessageIcon,
  FeedbackIcon,
  MoreVertIcon,
  AttachEmailIcon,
  DeleteForeverIcon,
  VideoCameraFrontIcon,
} from '@mui/icons-material';
import BasicSpeedDial from './SpeedDial';
import { CustomChatBox } from './CustomChatBox';
import { CircularIndeterminate } from './reusables/CircularIndeterminate';
import notificationManager from '../actions/NotificationManager';
import { fetchServiceRequest, updateServiceRequest, serviceRequestStatusOptions } from '../actions/JuaNetwork';

export const ServiceRequestStatusDialog = ({ status, handleClose, serviceRequest }) => {
  const urlString = window.location.href;
  const url = new URL(urlString);
  const [scroll, setScroll] = useState('paper');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const serviceRequestRef = url.searchParams.get('service_request');

  const {
    isLoading: isFetching,
    isError,
    data,
    error,
  } = useQuery('service_request', () => fetchServiceRequest(serviceRequestRef));

  const updateServiceRequestStatus = useMutation(values => updateServiceRequest(values), {
    onMutate: variables => {
      setIsLoading(true);
    },
    onError: (error, variables, context) => {
      console.error(error);
      notificationManager.error('something went wrong', 'Error');
    },
    onSuccess: (data, variables, context) => {
      notificationManager.success('Service Request status updated', 'Success');
    },
    onSettled: (data, error, variables, context) => {
      setIsLoading(false);
      handleClose();
    },
  });

  const handleApprovedServiceRequest = () => {
    updateServiceRequestStatus.mutate({
      ref: serviceRequestRef,
      status: serviceRequestStatusOptions.approved,
    });
  };

  const handleDeclinedServiceRequest = () => {
    updateServiceRequestStatus.mutate({
      ref: serviceRequestRef,
      status: serviceRequestStatusOptions.cancelled,
    });
  };

  const buttons = [
    <Button key={serviceRequestStatusOptions.approved} onClick={handleApprovedServiceRequest}>
      Accept
    </Button>,
    // <Button
    //   key={serviceRequestStatusOptions.approved}
    //   onClick={() => handleOptionChange(serviceRequestStatusOptions.declined)}
    // >
    //   New time slot
    // </Button>,
    <Button key={serviceRequestStatusOptions.declined} onClick={handleDeclinedServiceRequest}>
      Reject
    </Button>,
  ];
  return (
    <Dialog id="service-request-modal" open onClose={handleClose} scroll={scroll}>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          {!isLoading && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& > *': {
                  m: 1,
                },
              }}
            >
              <Typography sx={{ ml: 2, flex: 1, textAlign: 'center' }} center variant="h6" component="div">
                Would you like to accept this service request?
              </Typography>
              <ButtonGroup size="large" aria-label="large button group">
                {buttons}
              </ButtonGroup>
            </Box>
          )}
          {isLoading && <CircularIndeterminate withStyling={false} />}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
