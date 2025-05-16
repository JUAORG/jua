import { useEffect } from 'react';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import CookieConsent from 'react-cookie-consent';
import { onAuthStateChanged } from 'firebase/auth'; // ✅ Move this above local imports
import { auth } from './actions/firebase'; // ✅ Local import follows external
import { AuthProvider } from './contexts/AuthContext';
import Router from './routes';
import ThemeProvider from './theme';
import ScrollToTop from './components/ScrollToTop';

// ----------------------------------------------------------------------

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
} else {
  ReactGA.initialize(process.env.REACT_APP_GA_UA_CODE, {
    titleCase: false,
  });
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // set user in context or redux here
      } else {
        // redirect or show login
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ScrollToTop />
        <Router />
        <NotificationContainer />
        <CookieConsent
          overlay
          location="bottom"
          buttonText="I Agree!"
          cookieName="jua_cookie_consent_notice"
          expires={150}
          buttonStyle={{ color: '#4e503b', fontSize: 17 }}
          style={{ background: '#2065d1', fontSize: 17, textAlign: 'center' }}
        >
          By using JUA, you agree to our use of cookies.
        </CookieConsent>
      </AuthProvider>
    </ThemeProvider>
  );
}
