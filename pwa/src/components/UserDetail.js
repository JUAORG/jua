import * as React from 'react';
import { get } from 'lodash'
import {
  Avatar,
  Stack,
  Button,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import UserItem from './UserItem';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import IconTextDateList from './reusables/IconTextDateList';

export const UserDetail = ({ user, handleClose }) => {
  
  const [open, setOpen] = React.useState(true)
  const [scroll, setScroll] = React.useState('paper')
  const [expanded, setExpanded] = React.useState('panel1')

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }
  
  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        id='user-detail-modal'
        open
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <DialogTitle id="scroll-dialog-title">
              Create Service Request
            </DialogTitle>
            <UserItem user={user}/>
            <Stack
              direction="column"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
            >
              <div>
                <Divider/>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      Request 
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Advisory Session</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography mb={3}>
                      Show rate per hour, general avail times and explain that service provider (sp) has x amount of time to confirm
                      update service request status frequently for example show if the sp has read the request etc
                    </Typography>
                    <ServiceRequestForm userId={get(user, 'id')}/>
                  </AccordionDetails>
                </Accordion>
                <Divider/>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      Experience
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {<IconTextDateList/>}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Education</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {<IconTextDateList/>}
                  </AccordionDetails>
                </Accordion>
                <Accordion disabled expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2bh-content"
                    id="panel2bh-header"
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Reviews</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {<IconTextDateList/>}
                  </AccordionDetails>
                </Accordion>
              </div>
            </Stack>
            <Divider/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button> | 
          <Button disabled>Report</Button> |
          <Button disabled>Request Service Request</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
