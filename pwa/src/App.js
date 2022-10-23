import 'react-notifications/lib/notifications.css'
import { NotificationContainer } from 'react-notifications'
import * as Sentry from "@sentry/browser"
import { BrowserTracing } from "@sentry/tracing"
import { ContentfulClient, ContentfulProvider } from 'react-contentful'

import Router from './routes'
import ThemeProvider from './theme'
import ScrollToTop from './components/ScrollToTop'

// ----------------------------------------------------------------------

const contentfulClient = new ContentfulClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN
})

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});




export default function App() {
  return (
    <ThemeProvider>
      <ContentfulProvider client={ contentfulClient }>
        <ScrollToTop />
        <Router />
        <NotificationContainer/>
      </ContentfulProvider>
    </ThemeProvider>
  )
}
