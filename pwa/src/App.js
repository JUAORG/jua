import 'react-notifications/lib/notifications.css'
import { NotificationContainer } from 'react-notifications'
import * as Sentry from "@sentry/browser"
import { BrowserTracing } from "@sentry/tracing"

import Router from './routes'
import ThemeProvider from './theme'
import ScrollToTop from './components/ScrollToTop'

// ----------------------------------------------------------------------

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log('dev mode')
} else {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],

    //  Set tracesSampleRate to 1.0 to capture 100%
    //  of transactions for performance monitoring.
    //  We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
}


export default function App() {
  return (
    <ThemeProvider>
        <ScrollToTop />
        <Router />
        <NotificationContainer/>
    </ThemeProvider>
  )
}
