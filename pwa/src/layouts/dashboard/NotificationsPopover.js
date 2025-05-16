import { useState } from 'react';
import {
  Box,
  List,
  Badge,
  Avatar,
  Divider,
  Popover,
  Tooltip,
  Typography,
  IconButton,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { db, auth } from '../../actions/firebase';
import useNotificationData from '../../hooks/useNotificationData'; // use updated hook here
import { AnimationsSkeleton } from '../../components/Skeletons';
import { get } from 'lodash';

export default function NotificationsPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, loading } = useNotificationData();

  const unReadNotifications = notifications.filter(item => !item.read);
  const readNotifications = notifications.filter(item => item.read);

  const handleOpen = event => setOpen(event.currentTarget);
  const handleClose = () => setOpen(null);

  const handleMarkAllAsRead = async () => {
    const batch = writeBatch(db);
    unReadNotifications.forEach(notif => {
      const ref = doc(db, 'users', auth.currentUser.uid, 'notifications', notif.id);
      batch.update(ref, { read: true });
    });
    await batch.commit();
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={unreadCount} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { mt: 1.5, ml: 0.75, width: 360 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {unreadCount} unread notifications
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List disablePadding>
            {loading && <AnimationsSkeleton />}
            {!loading && notifications.length === 0 && (
              <Typography sx={{ p: 2.5, color: 'text.secondary' }}>No notifications yet.</Typography>
            )}
            {unReadNotifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} navigate={navigate} />
            ))}
            {readNotifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} navigate={navigate} />
            ))}
          </List>
        </Scrollbar>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification, navigate }) {
  const { avatar, title } = renderContent(notification);

  const handleNotificationItemClick = async () => {
    const ref = doc(db, 'users', auth.currentUser.uid, 'notifications', notification.id);
    await updateDoc(ref, { read: true });
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <ListItemButton
      onClick={handleNotificationItemClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.read === false && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {notification?.createdAt?.toDate?.().toLocaleString() || 'Unknown time'}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography key={notification.id} variant="subtitle2">
      {notification.title || 'Notification'}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.message}
      </Typography>
    </Typography>
  );

  const icon = notification.icon || getDefaultIcon(notification.type);

  return {
    avatar: <Iconify icon={icon} width={20} height={20} />,
    title,
  };
}

function getDefaultIcon(type) {
  switch (type) {
    case 'service_request':
      return 'eva:briefcase-outline';
    case 'account_suspended':
      return 'eva:alert-circle-outline';
    case 'wallet_low':
      return 'eva:credit-card-outline';
    case 'chat_message':
      return 'eva:message-square-outline';
    default:
      return 'eva:bell-outline';
  }
}
