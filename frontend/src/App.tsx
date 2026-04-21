import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigationType,
  useParams,
} from 'react-router-dom';
import { ProtectedRoute } from './shared/ui/ProtectedRoute';
import { useAuth } from './shared/hooks/useAuth';
import { useMicroInteractions } from './hooks/useMicroInteractions';
import { AppErrorBoundary } from './components/ui/AppErrorBoundary';

const HomePage = lazy(() => import('./marketing/pages/HomePage'));
const FeaturesPage = lazy(() => import('./marketing/pages/FeaturesPage'));
const ProductPage = lazy(() => import('./marketing/pages/ProductPage'));
const PricingPage = lazy(() => import('./marketing/pages/PricingPage'));
const LoginPage = lazy(() => import('./auth/pages/LoginPage'));
const SignupPage = lazy(() => import('./auth/pages/SignupPage'));
const AppDashboardPage = lazy(() => import('./app/pages/AppDashboardPage'));
const AppSimulationPage = lazy(() => import('./app/pages/AppSimulationPage'));
const AppAnalyticsPage = lazy(() => import('./app/pages/AppAnalyticsPage'));
const AppFeedPage = lazy(() => import('./app/pages/AppFeedPage'));
const AppProfilePage = lazy(() => import('./app/pages/AppProfilePage'));

function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center" style={{ background: 'var(--bg-base)' }}>
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Loading workspace...
      </div>
    </div>
  );
}

function PublicOnlyRoute() {
  const { isAuthenticated, initialized } = useAuth();

  if (!initialized) {
    return <PageLoader />;
  }

  return isAuthenticated ? <Navigate to="/app" replace /> : <Outlet />;
}

function LegacyAnalyticsRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/app/analytics/${id}` : '/app'} replace />;
}

function RouteExperienceManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  useMicroInteractions(location.pathname);
  const positions = useRef<Record<string, number>>({});
  const lastKey = useRef(location.key);
  const lastPath = useRef(location.pathname);

  useEffect(() => {
    positions.current[lastKey.current] = window.scrollY;
    lastKey.current = location.key;
    const isHashNav = location.hash.length > 1;

    if (isHashNav) {
      requestAnimationFrame(() => {
        const target = document.getElementById(location.hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      lastPath.current = location.pathname;
      return;
    }

    if (navigationType === 'POP') {
      const y = positions.current[location.key];
      window.scrollTo({ top: y ?? 0, behavior: 'auto' });
      lastPath.current = location.pathname;
      return;
    }

    const preserveAppScroll = location.pathname.startsWith('/app/analytics/')
      && lastPath.current.startsWith('/app/analytics/');
    window.scrollTo({ top: preserveAppScroll ? window.scrollY : 0, behavior: 'auto' });
    lastPath.current = location.pathname;
  }, [location, navigationType]);

  return null;
}

function ApiErrorToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setMessage(detail?.message ?? 'Internal server error');
      window.setTimeout(() => setMessage(null), 3200);
    };

    window.addEventListener('math-intellect:api-error', handler);
    return () => window.removeEventListener('math-intellect:api-error', handler);
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed right-4 top-4 z-[120] rounded-xl px-4 py-3 text-sm"
      style={{
        border: '1px solid rgba(248,113,113,0.46)',
        background: 'rgba(127,29,29,0.9)',
        color: '#fee2e2',
      }}
    >
      {message}
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <RouteExperienceManager />
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route
          path="/app"
          element={(
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          )}
        >
          <Route index element={<AppDashboardPage />} />
          <Route path="simulations/new" element={<AppSimulationPage />} />
          <Route path="analytics/:id" element={<AppAnalyticsPage />} />
          <Route path="feed" element={<AppFeedPage />} />
          <Route path="profile" element={<AppProfilePage />} />
        </Route>

        <Route path="/simulations/new" element={<Navigate to="/app/simulations/new" replace />} />
        <Route path="/analytics/:id" element={<LegacyAnalyticsRedirect />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <ApiErrorToast />
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
