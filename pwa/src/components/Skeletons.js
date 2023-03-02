import * as React from 'react';
import { Box, Skeleton } from '@mui/material';

export const AnimationsSkeleton = () => {
  return (
    <Box>
      <Skeleton />
      <Skeleton animation="wave" />
    </Box>
  );
};
