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
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
    CloseIcon,
    MessageIcon,
    FeedbackIcon,
    MoreVertIcon,
    AttachEmailIcon,
    DeleteForeverIcon,
    VideoCameraFrontIcon
} from '@mui/icons-material';
import BasicSpeedDial from './SpeedDial';
import { CustomChatBox } from './CustomChatBox';
import notificationManager from '../actions/NotificationManager';
import { fetchServiceRequest, updateServiceRequest ,serviceRequestStatusOptions } from '../actions/JuaNetwork';

export const ServiceRequestStatusButtons = ({
    status,
    handleClose,
    serviceRequest
}) => {

    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const serviceRequestRef = get(serviceRequest, 'ref')
    console.debug('frfr', serviceRequest)
    const updateServiceRequestStatus = useMutation( (values) => updateServiceRequest(values), {
        onMutate: variables => {
            // A mutation is about to happen!
            // Optionally return a context containing data to use when for example rolling back
            setIsUpdating(true)
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.error(error)
            notificationManager.error('something went wrong', 'Error');
        },
        onSuccess: (data, variables, context) => {
            notificationManager.success('Service Request status updated', 'Success');
        },
        onSettled: (data, error, variables, context) => {
            setIsUpdating(false)
            // Error or success... doesn't matter!
        },
    })

    const handleApprovedServiceRequest = () => {
        updateServiceRequestStatus.mutate({ref: serviceRequestRef, status: serviceRequestStatusOptions.approved})
    }

    const handleDeclinedServiceRequest = () => {
        updateServiceRequestStatus.mutate({ref: serviceRequestRef, status: serviceRequestStatusOptions.cancelled})
    }

    const buttons = [
        <Button
          key={serviceRequestStatusOptions.approved}
          onClick={handleApprovedServiceRequest}
        >
          Accept
        </Button>,
        // <Button
        //   key={serviceRequestStatusOptions.approved}
        //   onClick={() => handleOptionChange(serviceRequestStatusOptions.declined)}
        // >
        //   New time slot
        // </Button>,
        <Button
          key={serviceRequestStatusOptions.declined}
          onClick={handleDeclinedServiceRequest}
        >
          Reject
        </Button>,
    ];
    return (
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
          <ButtonGroup size="large" aria-label="large button group">
            {buttons}
          </ButtonGroup>
        </Box>
    );
};
