import { useState } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
// @mui
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
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import {
  getUserNotifications,
  markUserNotificationAsRead,
  markAllUserNotificationsAsRead
} from '../../actions/Notifications';
import { AnimationsSkeleton } from '../../components/Skeletons';

export default function NotificationsPopover() {
  const [open, setOpen] = useState(null);
  const { data, error, isLoading } = useQuery(['notifications'], getUserNotifications, {
    enabled: true,
    staleTime: 10000,
    refetchInterval: 10000,
    refetchIntervalInBackground: true
  });
  const notifications = get(data, 'data', []);
  const totalUnRead = notifications.filter((item) => item.read === false).length;
  const readNotifications = notifications.filter((item) => item.read === true);
  const unReadNotifications = notifications.filter((item) => item.read === false);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    console.log('frfr')
    markAllUserNotificationsAsRead()
      .then(() => {
        console.log('bumble')
        notifications.map((notification) => ({
          ...notification,
          isUnRead: false,
        }))
      })
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
      <Badge badgeContent={totalUnRead} color="error">
      <Iconify icon="eva:bell-fill" />
      </Badge>
      </IconButton>

      <Popover
    open={Boolean(open)}
    anchorEl={open}
    onClose={handleClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        {!isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1">Notifications</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You have {totalUnRead} unread messages
              </Typography>
            </Box>
            {totalUnRead > 0 && (
                <Tooltip title=" Mark all as read">
                <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
                </IconButton>
                </Tooltip>
            )}
             </Box>
            )}

         <Divider sx={{ borderStyle: 'dashed' }} />

         <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
         <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {isLoading && <AnimationsSkeleton />}
            {!isLoading &&
              unReadNotifications.map((notification) => (
                <NotificationItem key={get(notification, 'ref')} notification={notification} />
              ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {isLoading && <AnimationsSkeleton />}
            {!isLoading &&
              readNotifications.map((notification) => (
                <NotificationItem key={get(notification, 'ref')} notification={notification} />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    // createdAt: PropTypes.instanceOf(Date),
    id: PropTypes.string,
    isUnRead: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    avatar: PropTypes.any,
  }),
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  const handleNotificationItemClick = () => {
    markUserNotificationAsRead(get(notification, 'ref'))
      .then(() => {
        console.debug('succesfully marked as read');
      })
      .catch(() => {
        console.error('unsuccesfully marked as read');
      });
  };

  return (
    <ListItemButton
      onClick={handleNotificationItemClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
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
            {/* {fToNow(get(notification, 'createdAt'))} */}
            mark as read
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography key={get(notification, 'ref')} variant="subtitle2">
      {get(notification, 'title')}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {get(notification, 'message')}
      </Typography>
    </Typography>
  );

  if (get(notification, 'type') === 'order_placed') {
    return {
      avatar: <img alt={get(notification, 'title')} src="/assets/icons/ic_notification_package.svg" />,
      title,
    };
  }
  if (get(notification, 'type') === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_shipping.svg" />,
      title,
    };
  }
  if (get(notification, 'type') === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title,
    };
  }
  if (get(notification, 'type') === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title,
    };
  }
  return {
    avatar: get(notification, 'avatar') ? (
      <img alt={get(notification, 'title')} src={get(notification, 'avatar')} />
    ) : null,
    title,
  };
}
