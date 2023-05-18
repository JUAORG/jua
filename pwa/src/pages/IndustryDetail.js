import { useState } from 'react'
import { useQuery } from 'react-query';
import { get, map, last } from 'lodash'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Grid,
  Stack,
  Container,
  Typography
} from '@mui/material'
import { fetchIndustry } from '../actions/JuaNetwork'
import notificationManager from '../actions/NotificationManager'
import Page from '../components/Page'



export default function IndustryDetail() {
  const navigate = useNavigate()
  const industryRef = last(window.location.pathname.split('/'))
  
  const { isLoading, isError, data, error } = useQuery('industry', () =>
    fetchIndustry(industryRef)
  );
  const industry = get(data, 'data')


  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 5 }}>
          {get(industry, 'name')}
        </Typography>
      </Container>
    </Page>
  )
}
