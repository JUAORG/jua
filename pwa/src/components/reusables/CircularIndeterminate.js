import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import Logo from '../Logo';

const useStyles = makeStyles({
  circularLoader: {
    zIndex: 9,
    top: '40vh',
    margin: 'auto',
    textAlign: 'center',
    position: 'relative',
  },
});

export const CircularIndeterminate = ({ withStyling = true }) => {
  const classes = useStyles();

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      className={withStyling && classes.circularLoader}
    >
      <CircularProgress sx={{ margin: 'auto' }} />
      <Logo disabledLink sx={{ margin: 'auto' }} />
    </Stack>
  );
};
