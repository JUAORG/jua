// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './components/AuthProvider';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <ScrollToTop />
      <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}
