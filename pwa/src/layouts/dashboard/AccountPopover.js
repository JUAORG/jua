import { get } from 'lodash';
import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useMutation, useQueryClient } from 'react-query';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
import MenuPopover from '../../components/MenuPopover';
import notificationManager from '../../actions/NotificationManager';
import { clearAuthTokenCookie, logout } from '../../actions/Auth';
import PasswordChangeForm from '../../sections/@dashboard/app/PasswordChangeForm';
import FormDialog from '../../components/FormDialog';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [];

export default function AccountPopover({ user }) {
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(null);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => setOpen(null);
  const openPasswordChangeForm = () => setShowChangePasswordForm(true);
  const handleCloseChangePasswordForm = () => setShowChangePasswordForm(false);

  const clearStorage = () => {
    localStorage.clear();
    clearAuthTokenCookie();
    setOpen(null);
    navigate('/login', { replace: true });
  };

  const { mutate: handleLogout, isLoading: isSubmitLoading } = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      notificationManager.success('Logged out', 'Success');
      clearStorage()
    },
    onError: () => notificationManager.error('something went wrong', 'Error'),
    onSettled: () => clearStorage(),
  });

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
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={get(user, ['profile', 'profile_picture'])} alt="profile picture" />
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
          <Typography variant="subtitle2" noWrap>
            {get(user, ['profile', 'first_name'])} {get(user, ['profile', 'last_name'])}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {get(user, ['profile', 'number_of_notification'], 0)} notifications
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

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
