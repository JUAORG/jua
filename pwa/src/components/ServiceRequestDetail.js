import * as React from 'react';
import { get } from 'lodash'
import {
    AppBar,
    Toolbar,
    Avatar,
    Stack,
    Button,
    Dialog,
    Divider,
    IconButton,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useParams } from 'react-router-dom'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import UserItem from './UserItem';
import ServiceRequestForm from '../sections/@dashboard/app/ServiceRequestForm';
import IconTextDateList from './reusables/IconTextDateList';

export const ServiceRequestDetail = ({ selectedServiceRequest, handleClose }) => {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(true)
    const [scroll, setScroll] = React.useState('paper')
    const [expanded, setExpanded] = React.useState('panel1')


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }


    const goToServiceRequestMeeting = () => {

        navigate(`/dashboard/advisory_session_meeting/?room=${get(selectedServiceRequest, 'ref')}`, { replace: true },)
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
        <Dialog id='service-request-modal' fullScreen open onClose={handleClose} scroll={scroll}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Service Request
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                save
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
              <DialogTitle id="scroll-dialog-title">
                Subject:  {get(selectedServiceRequest, 'subject')}
              </DialogTitle>
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={0.5}
              >
                <div>
                  <Typography variant="body2" gutterBottom>
                    Description: {get(selectedServiceRequest, 'description')}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Status: {get(selectedServiceRequest, 'status')}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Participants:
                    <UserItem brief user={get(selectedServiceRequest, ['service_provider', 'profile'])}/>
                    <UserItem brief user={get(selectedServiceRequest, ['service_requester', 'profile'])}/>
                  </Typography>
                  <div>
                    {get(selectedServiceRequest, 'read_by_service_provider')}
                  </div>
                  <div>
                    {get(selectedServiceRequest, 'read_by_service_requester')}
                  </div>
                  <div>
                    {get(selectedServiceRequest, 'duration_in_minutes')}
                  </div>
                  <div>
                    {get(selectedServiceRequest, 'created_at')}
                  </div>
                  <div>
                    <Button expanded variant='' onClick={goToServiceRequestMeeting}>Start Service Request</Button>
                  </div>
                  <Divider/>
                </div>
                <Divider/>
                Comming Soon:
                <Typography>- Comments</Typography>
                <Typography>- Uploads</Typography>
              </Stack>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button disabled>Update</Button>
          </DialogActions>
        </Dialog>
    );
}
