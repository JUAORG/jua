import * as React from 'react';
import { get, map } from 'lodash';
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ReusableTab({
  variant,
  tabHeadings,
  tabContents,
  isCentered = true,
  scrollButtons = 'false',
  allowScrollButtonsMobile = 'false',
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          variant={variant}
          onChange={handleChange}
          scrollButtons={scrollButtons}
          allowScrollButtonsMobile={allowScrollButtonsMobile}
        >
          {map(tabHeadings, (tabHeading, index) => (
            <Tab label={tabHeading} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {map(tabContents, (tabContent, index) => (
        <TabPanel value={value} index={index}>
          {tabContent}
        </TabPanel>
      ))}
    </Box>
  );
}
