import { useEffect } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'
//
import Login from './pages/Login'
import NotFound from './pages/Page404'
import Register from './pages/Register'
import DashboardApp from './pages/DashboardApp'
import Profile from './pages/Profile'
import ServiceRequests from './pages/ServiceRequests'
import SavedOpportunities from './pages/SavedOpportunities'
import Settings from './pages/Settings'
import RateCardSetup from './pages/RateCardSetup'
import About from './pages/About'
import WalletSetup from './pages/WalletSetup'
import JuaNetwork from './pages/JuaNetwork'
import JuaNetworkUser from './pages/JuaNetworkUser'
import { isSignedIn } from './actions/Auth'
import AdvisorySessionMeeting from './pages/AdvisorySessionMeeting'
import AdvisorySessionFeedback from './pages/AdvisorySessionFeedback'
import ServiceRequest from './pages/ServiceRequest'
import PasswordChange from './pages/PasswordChange'
import Wallet from './pages/Wallet'
import Faq from './pages/Faq'

// ----------------------------------------------------------------------

export default function Router() {

  useEffect(() => {
    isSignedIn()
    
  })

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'rate_card_setup', element: <RateCardSetup /> },
        { path: 'wallet', element: <Wallet /> },
        { path: 'wallet_setup', element: <WalletSetup /> },
        { path: 'profile', element: <Profile /> },
        { path: 'service_requests', element: <ServiceRequests /> },
        { path: `service_request/:serviceRequestId`, element: <ServiceRequest /> },
        { path: 'saved_opportunities', element: <SavedOpportunities /> },
        { path: 'jua_network', element: <JuaNetwork /> },
        { path: `jua_network/:juaNetworkUserId`, element: <JuaNetworkUser /> },
        { path: 'advisory_session_meeting', element: <AdvisorySessionMeeting /> },
        { path: 'advisory_session_meeting/feedback/:serviceRequestId', element: <AdvisorySessionFeedback /> },
        { path: 'settings', element: <Settings /> },
        { path: 'faq', element: <Faq /> },
        { path: 'About', element: <About /> },
        { path: 'password_change', element: <PasswordChange /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        // { path: '404', element: <NotFound /> },
        // { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ])
}
