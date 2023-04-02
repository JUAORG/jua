import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from 'react-query';
import Router from './routes';
import ThemeProvider from './theme';
import ScrollToTop from './components/ScrollToTop';

// ----------------------------------------------------------------------

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.debug('DEV MOVE');
} else {
  ReactGA.initialize(process.env.REACT_APP_GA_UA_CODE, {
    titleCase: false,
  });
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],

    //  Set tracesSampleRate to 1.0 to capture 100%
    //  of transactions for performance monitoring.
    //  We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const queryClient = new QueryClient({});

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <Router />
        <NotificationContainer />
        { !process.env.NODE_ENV || process.env.NODE_ENV === 'development' && <ReactQueryDevtools /> }
      </QueryClientProvider>
    </ThemeProvider>
  );
}
