import React, { useEffect, useState } from 'react';
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
  Typography,
  DialogContent,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../actions/firebase';
import notificationManager from '../actions/NotificationManager';
import { get, map } from 'lodash';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle({ children, onClose, ...other }) {
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: theme => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}

export const CustomChatBox = ({ serviceRequestRef, customerId, handleClose }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId || !serviceRequestRef) return;

    const messagesRef = collection(db, 'users', customerId, 'serviceRequests', serviceRequestRef, 'conversations');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChat(entries);
        setLoading(false);
      },
      error => {
        notificationManager.error('Failed to load chat', 'Error');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [customerId, serviceRequestRef]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setSubmitButtonDisabled(true);

    try {
      const messagesRef = collection(db, 'users', customerId, 'serviceRequests', serviceRequestRef, 'conversations');

      await addDoc(messagesRef, {
        message: message.trim(),
        sender: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      notificationManager.success('Message Sent', 'Success');
      setMessage('');
    } catch (error) {
      notificationManager.error('Failed to send message', 'Error');
    } finally {
      setSubmitButtonDisabled(false);
    }
  };

  const renderMessage = item => {
    const isSender = item.sender === auth.currentUser.uid;
    return (
      <ListItem
        key={item.id}
        alignItems="flex-start"
        sx={{
          flexDirection: isSender ? 'row-reverse' : 'row',
          textAlign: isSender ? 'right' : 'left',
          alignItems: 'center',
        }}
      >
        <ListItemAvatar sx={{ margin: isSender ? '0 0 0 5px' : '0 5px 0 0' }}>
          <Avatar src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          secondary={
            <Typography component="span" variant="body2" color="text.primary">
              {item.message}
            </Typography>
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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ width: '100%', maxWidth: 500, height: 300, bgcolor: 'background.paper', overflow: 'auto' }}>
              {chat.length > 0 ? (
                map(chat, item => renderMessage(item))
              ) : (
                <Typography sx={{ p: 2, textAlign: 'center' }}>No messages yet</Typography>
              )}
            </List>
          )}
          <Divider component="div" />
        </DialogContent>
        <Paper
          component="form"
          sx={{ display: 'flex', alignItems: 'center', p: 1 }}
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <InputBase
            multiline
            sx={{ ml: 1, flex: 1 }}
            maxRows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Send a message"
          />
          {submitButtonDisabled && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          )}
          <IconButton disabled={submitButtonDisabled} color="primary" sx={{ p: '10px' }} onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        </Paper>
      </BootstrapDialog>
    </Box>
  );
};
