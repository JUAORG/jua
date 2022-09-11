import React, { useState, useEffect } from 'react'
import { Grid, Container, Typography } from '@mui/material'
import {
  ref,
  push,
  child,
  update,
  onValue,
  increment,
  getDatabase,
  serverTimestamp
} from 'firebase/database'
import Page from '../components/Page'
import {
  makePayment,
  getAvailableFunds
} from '../actions/Wallet'
import JuaWalletPaymentForm from '../sections/@dashboard/app/JuaWalletPaymentForm'
import { getAuthId } from '../actions/Auth'

const db = getDatabase()

export default function Wallet() {
  const [availableFunds, setAvailableFunds] = useState(0)
  
  useEffect(() => {
    onValue(ref(db, `/users/${getAuthId()}/ledger`), (snapshot) => {
     const ledgerRecords = (snapshot.val() && snapshot.val())
      getAvailableFunds(ledgerRecords).then((total) => {
        setAvailableFunds(total)
      })
   })
  },[availableFunds])
    
  return (
    <Page title='Profile'>
      <Container maxWidth='xl'>
        <Typography variant='h4'>
            Jua Wallet
        </Typography>
        <Typography
          variant='p'
          component='h6'
          sx={{ mb: 5 }}
        >
          Available: R{ availableFunds }
        </Typography>
        <JuaWalletPaymentForm/>
      </Container>
    </Page>
  )
}
