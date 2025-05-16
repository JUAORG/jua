import PropTypes from 'prop-types';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', showGoBackArrow = false, meta, ...other }, ref) => (
  <>
    <Helmet>
      <title>{`${title} | JUA`}</title>
      {meta}
    </Helmet>

    <Box ref={ref} {...other}>
      {showGoBackArrow && (
        <ArrowBackIosRoundedIcon
          onClick={() => window.history.go(-1)}
          sx={{
            top: 40,
            left: 20,
            cursor: 'pointer',
            position: 'relative',
          }}
        />
      )}
      {children}
    </Box>
  </>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Page;
