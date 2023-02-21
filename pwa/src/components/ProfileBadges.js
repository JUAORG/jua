import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Stack } from '@mui/material';

export default function ProfileBadges() {
  const navigate = useNavigate();
  // const goToFeedbackPage = () => navigate(`/dashboard/about`, { replace: true });

  return (
    <Stack direction="row" justifyContent="center" mt={2} spacing={3}>
      <Badge badgeContent={''} color="secondary" variant="dot"/>
      <Badge badgeContent={''} color="primary" variant="dot" />
      <Badge badgeContent={''} color="secondary" variant="dot" />
    </Stack>
  );
}
