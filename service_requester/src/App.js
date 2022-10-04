import 'react-notifications/lib/notifications.css'
import { NotificationContainer } from 'react-notifications'
import Router from './routes'
import ThemeProvider from './theme'
import ScrollToTop from './components/ScrollToTop'

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Router />
      <NotificationContainer/>
    </ThemeProvider>
  );
}
