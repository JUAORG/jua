import React, { useState, useEffect } from 'react';
import { get } from 'lodash'
import { useQuery } from 'react-query';
import { Typography, Skeleton } from '@mui/material';
import { fetchServiceRequests } from '../actions/JuaNetwork';
import Page from '../components/Page';
import { CalendarListDisplay } from '../components/CalendarListDisplay';

export default function ServiceRequests() {
    // const [serviceRequests, setServiceRequests] = useState([]);

    const {
        data: serviceRequests,
        error,
        isLoading
    } = useQuery(['service_requests'], fetchServiceRequests, {

        enabled: true,

      refetchInterval: 60000,
        // Continue to refetch while the tab/window is in the background
        refetchIntervalInBackground: true,
    });


    const renderCalendarSkeleton = () => (
        <>
          <Skeleton
            variant="rectangular"
            height={'5vh'}
            sx={{
                margin: 'auto',
                width: {
                    xs: '90vw',
                    md: '50vw'
                }
            }}
          />
         <br/>
        <Skeleton
          variant="rectangular"
          height={'45vh'}
          sx={{
              margin: 'auto',
              width:{
                  xs: '90vw',
                  md: '50vw'
              }
          }}
        />
        </>
    )

    return (
        <Page title="Service Requests">
          <Typography align="Center" variant="h4" sx={{ mb: 5 }}>
            <img alt="Booking" width={150} style={{ margin: 'auto' }} src="/static/illustrations/undraw_booking.svg" />
            Service Requests
          </Typography>
          {isLoading && renderCalendarSkeleton()}
          {!isLoading && <CalendarListDisplay events={get(serviceRequests, 'data')} />}
        </Page>
    );
}
