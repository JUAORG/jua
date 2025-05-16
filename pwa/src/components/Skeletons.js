import * as React from 'react';
import { Box, Skeleton } from '@mui/material';

export const AnimationsSkeleton = () => (
  <Box>
    <Skeleton />
    <Skeleton animation="wave" />
  </Box>
);
