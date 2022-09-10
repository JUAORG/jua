import { Grid, Container, Typography } from '@mui/material'
import Page from '../components/Page'
import { makePayment } from '../actions/Wallet'
import JuaWalletPaymentForm from '../sections/@dashboard/app/JuaWalletPaymentForm'


export default function Wallet() {

  return (
    <Page title="Profile">
      <Container maxWidth="xl">
        <Typography variant="h4">
            Jua Wallet
        </Typography>
        <Typography variant="p" component='h6' sx={{ mb: 5 }}>
          Available: R250
        </Typography>
        <JuaWalletPaymentForm/>
      </Container>
    </Page>
  )
}
