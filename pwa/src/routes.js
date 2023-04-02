import { useEffect } from 'react';
import { get } from 'lodash'
import ReactGA from 'react-ga';
import { useQuery } from 'react-query';
import { Navigate, useNavigate, useRoutes } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard'
import LogoOnlyLayout from './layouts/LogoOnlyLayout'
import Login from './pages/Login'
import NotFound from './pages/Page404'
import Register from './pages/Register'
import DashboardApp from './pages/DashboardApp'
import Profile from './pages/Profile'
import ServiceRequests from './pages/ServiceRequests'
import SavedOpportunities from './pages/SavedOpportunities'
import Settings from './pages/Settings'
import About from './pages/About'
import Services from './pages/Services'
import Service from './pages/Service'
import JuaNetwork from './pages/JuaNetwork'
import JuaNetworkUser from './pages/JuaNetworkUser'
import AdvisorySessionMeeting from './pages/AdvisorySessionMeeting'
import AdvisorySessionFeedback from './pages/AdvisorySessionFeedback'
import ServiceRequest from './pages/ServiceRequest'
import PasswordChange from './pages/PasswordChange'
import Wallet from './pages/Wallet'
import Faq from './pages/Faq'
import { getUser } from './actions/Auth'

// ----------------------------------------------------------------------
const LOGIN_PATH = '/login'
const REGISTER_PATH = '/register'

export default function Router() {
  const navigate = useNavigate()
  const currentPath = window.location.pathname
  const isOnAuthPage = Boolean(currentPath === LOGIN_PATH || currentPath === REGISTER_PATH)
  const { data, error, isLoading } = useQuery(['user'], getUser, {
    retry: 2,
    enabled: false,
    retryDelay: 5000,
    staleTime: 120000,
    refetchInterval: 120000,
    refetchIntervalInBackground: false
  })

  useEffect(() => {
    if (get(error, ['response', 'status']) === 401 && !isOnAuthPage) {
      navigate('/login', {replace: true})
    }
  },[isLoading, error])

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  })

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'faq', element: <Faq /> },
        { path: 'About', element: <About /> },
        { path: 'wallet', element: <Wallet /> },
        { path: 'profile', element: <Profile /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'settings', element: <Settings /> },
        { path: 'password_change', element: <PasswordChange /> },
        { path: 'service_requests', element: <ServiceRequests /> },
        { path: 'saved_opportunities', element: <SavedOpportunities /> },
        { path: 'services', element: <Services /> },
        { path: 'service/:serviceName', element: <Service /> },
        { path: 'jua_network/:juaNetworkUserId', element: <JuaNetworkUser /> },
        { path: 'service_request/:serviceRequestId', element: <ServiceRequest /> },
        { path: 'advisory_session_meeting', element: <AdvisorySessionMeeting /> },
        { path: 'advisory_session_meeting/feedback/:serviceRequestId', element: <AdvisorySessionFeedback /> },
        { path: 'jua_network', element: <JuaNetwork /> },
        // { path: 'rate_card_setup', element: isUserServiceProvider ? <Navigate to="/404" replace /> : <RateCardSetup /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ])
}
