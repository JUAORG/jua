import React, { useState, useEffect } from 'react'
import { Grid, Container, Typography } from '@mui/material'
import Page from '../components/Page'
import {
  makePayment,
  getAvailableFunds
} from '../actions/Wallet'
import JuaWalletPaymentForm from '../sections/@dashboard/app/JuaWalletPaymentForm'
import ReusableTabs from '../components/reusables/Tabs'
import { getAuthId } from '../actions/Auth'
import { FEATURE_NOT_READY_YET } from '../utils/messages'


export default function Wallet() {
  const [availableFunds, setAvailableFunds] = useState(0)
  
  useEffect(() => {

  },[availableFunds])
    
  return (
    <Page title='Profile'>
      <Container maxWidth='xl'>
        <Typography align='Center' variant="h4">
          <img
            alt='FAQs'
            width={ 150 }
            style={{margin: 'auto'}}
            src='/static/illustrations/undraw_pay_online.svg'
          />
          Jua Wallet
        </Typography>
        <Typography
          variant='p'
          component='h6'
          align='center'
          sx={{ mb:5 }}
        >
          Available: R{ availableFunds }
        </Typography>
        <ReusableTabs
          tabHeadings={['Add Funds', 'History']}
          tabContents={[
            <JuaWalletPaymentForm/>,
            FEATURE_NOT_READY_YET
          ]}
        />
        
      </Container>
    </Page>
  )
}
