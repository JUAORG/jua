import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../actions/firebase'; // Adjust this path as needed
import notificationManager from '../../actions/NotificationManager';
import MenuPopover from '../../components/MenuPopover';
import FormDialog from '../../components/FormDialog';
import PasswordChangeForm from '../../sections/@dashboard/app/PasswordChangeForm';

export default function AccountPopover() {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(null);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  const { currentUser } = auth;
  const displayName = currentUser?.firstName || 'Anonymous User';
  const email = currentUser?.email || 'Unknown Email';
  const photoURL = currentUser?.photoURL || '';
  const handleOpen = event => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => setOpen(null);

  const openPasswordChangeForm = () => {
    setShowChangePasswordForm(true);
    handleClose();
  };

  const handleCloseChangePasswordForm = () => {
    setShowChangePasswordForm(false);
  };

  const clearSession = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      notificationManager.success('Logged out', 'Success');
    } catch (err) {
      notificationManager.error('Something went wrong', 'Error');
    } finally {
      clearSession();
    }
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: theme => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={photoURL} alt="profile picture" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          {/* <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography> */}
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={openPasswordChangeForm} sx={{ m: 1 }}>
          Change Password
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>

      {showChangePasswordForm && (
        <FormDialog
          handleClose={handleCloseChangePasswordForm}
          title="Change Password"
          form={<PasswordChangeForm handleClose={handleCloseChangePasswordForm} />}
        />
      )}
    </>
  );
}
