import { lazy, Suspense, useContext, useEffect } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import ReactGA from 'react-ga';
import { CircularProgress, Box } from '@mui/material';
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import DashboardLayout from './layouts/dashboard';

// Lazy-loaded routes
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NotFound = lazy(() => import('./pages/Page404'));
const DashboardApp = lazy(() => import('./pages/DashboardApp'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const Services = lazy(() => import('./pages/Services'));
const Service = lazy(() => import('./pages/Service'));
const Faq = lazy(() => import('./pages/Faq'));
const About = lazy(() => import('./pages/About'));
const JuaNetwork = lazy(() => import('./pages/JuaNetwork'));
const JuaNetworkUser = lazy(() => import('./pages/JuaNetworkUser'));
const PasswordChange = lazy(() => import('./pages/PasswordChange'));
// const IndustryDetail = lazy(() => import('./pages/IndustryDetail'));
const ServiceRequests = lazy(() => import('./pages/ServiceRequests'));
const SavedOpportunities = lazy(() => import('./pages/SavedOpportunities'));
const AdvisorySessionMeeting = lazy(() => import('./pages/AdvisorySessionMeeting'));
const AdvisorySessionFeedback = lazy(() => import('./pages/AdvisorySessionFeedback'));
const ServiceRequest = lazy(() => import('./pages/ServiceRequest'));
const AdminFeedbackPage = lazy(() => import('./pages/admin/AdminFeedbackPage'));
const AdminFaqManagePage = lazy(() => import('./pages/admin/AdminFaqManagePage'));

export default function Router() {
  const { user, initializing } = useContext(AuthContext);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  // ✅ always call useRoutes
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: 'faq', element: <Faq /> },
        { path: 'about', element: <About /> },
        { path: 'profile', element: <Profile /> },
        // { path: 'app', element: <DashboardApp /> },
        { path: 'settings', element: <Settings /> },
        { path: 'services', element: <Services /> },
        { path: 'service/:serviceName', element: <Service /> },
        { path: 'app', element: <JuaNetwork /> },
        { path: 'jua_network/:juaNetworkUserId', element: <JuaNetworkUser /> },
        { path: 'password_change', element: <PasswordChange /> },
        { path: 'service_requests', element: <ServiceRequests /> },
        { path: 'saved_opportunities', element: <SavedOpportunities /> },
        // { path: 'industry/:industryRef', element: <IndustryDetail /> },
        { path: 'service_request/:serviceRequestId', element: <ServiceRequest /> },
        { path: 'advisory_session_meeting', element: <AdvisorySessionMeeting /> },
        { path: 'advisory_session_meeting/feedback/:serviceRequestId', element: <AdvisorySessionFeedback /> },
        { path: 'admin/feedback', element: <AdminFeedbackPage /> },
        { path: 'admin/faq', element: <AdminFaqManagePage /> },
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
  ]);

  return (
    <Suspense
      fallback={
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      }
    >
      {initializing ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        routes
      )}
    </Suspense>
  );
}
