import react, { useEffect, useContext } from 'react'
import { get, map } from 'lodash'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Grid, Container, Typography, Divider } from '@mui/material'
import JuaPlatformFeedbackForm from '../sections/@dashboard/app/JuaPlatformFeedbackForm'
import Page from '../components/Page'
import { getService } from '../actions/Services'
import { activeJuaNetworkUsersForThisService } from '../actions/JuaNetwork'
import UsersContext from '../contexts/Users'
import UsersList from '../components/reusables/UserList'

export default function Service() {

  const navigate = useNavigate()
  const service = getService()
  const users = useContext(UsersContext)
  const serviceProviders =  activeJuaNetworkUsersForThisService(service, users)

  const renderServiceProvidersForThisService = () => {
    return <UsersList users={serviceProviders}/>
  }

  return (
    <Page title={get(service, 'name')} showGoBackArrow>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
          { get(service, 'name') }          
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          { get(service, 'description') }
        </Typography>
        { renderServiceProvidersForThisService() }
      </Container>
    </Page>
  )
}
