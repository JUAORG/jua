import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { get, map } from 'lodash';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  Box,
  Avatar,
  Dialog,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  InputBase,
  Divider,
  IconButton,
  DialogTitle,
  LinearProgress,
  Typography,
  DialogContent,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import notificationManager from '../actions/NotificationManager';
import { fetchServiceRequestChat, sendServiceRequestChatMessage } from '../actions/JuaNetwork';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export const CustomChatBox = ({ serviceRequestRef, handleClose }) => {
  const queryClient = useQueryClient();
  const { data: User } = useQuery(['user']);
  const user = get(User, 'data', {});
  const userProfileRef = get(user, ['profile', 'ref']);
  const [message, setMessage] = useState();
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const { mutate, isLoading: isSubmitLoading } = useMutation({
    mutationFn: () =>
      sendServiceRequestChatMessage(serviceRequestRef, { service_request: serviceRequestRef, message }).then(
        setSubmitButtonDisabled(true)
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_request_chat'] });
      notificationManager.success('Message Sent', 'Success');
    },
    onError: () => notificationManager.error('something went wrong', 'Error'),
    onSettled: () => setSubmitButtonDisabled(false),
  });

  const { isLoading, isError, data, error } = useQuery('service_request_chat', () =>
    fetchServiceRequestChat(serviceRequestRef)
  );
  const chat = get(data, 'data');

  if (isLoading) {
    return <span>Loading...</span>;
  }
  console.log(isLoading, 'frfrfrkf');

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const renderMessage = (item) => {
    const isSender = get(item, 'profile') === userProfileRef;
    return (
      <ListItem
        alignItems="flex-start"
        sx={{
          flexDirection: isSender ? 'row-reverse' : 'row',
          textAlign: isSender ? 'right' : 'left',
          alignItems: 'center',
        }}
      >
        <ListItemAvatar
          sx={{
            margin: isSender ? '0px 0px 0px 5px' : '0px 5px 0px 5px',
          }}
        >
          <Avatar src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <>
              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                {get(item, 'message', 'empty')}
              </Typography>
            </>
          }
        />
      </ListItem>
    );
  };

  return (
    <Box>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Service Request Chat
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <List sx={{ width: '100%', maxWidth: 400, height: 200, bgcolor: 'background.paper' }}>
            {map(chat, (item) => renderMessage(item))}
          </List>
          <Divider component="div" />
        </DialogContent>
        <Paper
          component="form"
          sx={{ position: 'relative', display: 'flex', alignItems: 'center', border: '1px solid #2065D1' }}
        >
          <InputBase
            multiline
            sx={{ ml: 1, flex: 1 }}
            maxRows={4}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message"
            inputProps={{ 'aria-label': 'Send a message' }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          {submitButtonDisabled && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
          <IconButton
            disabled={submitButtonDisabled}
            color="primary"
            sx={{ p: '10px' }}
            aria-label="directions"
            onClick={() => mutate()}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </BootstrapDialog>
    </Box>
  );
};
