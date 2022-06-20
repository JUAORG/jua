import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Profile from './pages/Profile';
import ServiceRequests from './pages/ServiceRequests';
import SavedOpportunities from './pages/SavedOpportunities';
import Settings from './pages/Settings';
import RateCardSetup from './pages/RateCardSetup';
import WalletSetup from './pages/WalletSetup';
import AdvisorySessionMeeting from './pages/AdvisorySessionMeeting';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'rate_card_setup', element: <RateCardSetup /> },
        { path: 'wallet_setup', element: <WalletSetup /> },
        { path: 'profile', element: <Profile /> },
        { path: 'service_requests', element: <ServiceRequests /> },
        { path: 'saved_opportunities', element: <SavedOpportunities /> },
        { path: 'advisory_session_meeting', element: <AdvisorySessionMeeting /> },
        { path: 'settings', element: <Settings /> },
      ],
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
  ]);
}
