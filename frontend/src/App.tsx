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
import { AppErrorBoundary } from './components/ui/AppErrorBoundary';

const HomePage = lazy(() => import('./marketing/pages/HomePage'));
const ModelsPage = lazy(() => import('./marketing/pages/ModelsPage'));
const WorkbenchPage = lazy(() => import('./marketing/pages/WorkbenchPage'));
const MethodPage = lazy(() => import('./marketing/pages/MethodPage'));
const LoginPage = lazy(() => import('./auth/pages/LoginPage'));
const SignupPage = lazy(() => import('./auth/pages/SignupPage'));
const AppDashboardPage = lazy(() => import('./app/pages/AppDashboardPage'));
const AppSimulationPage = lazy(() => import('./app/pages/AppSimulationPage'));
const AppAnalyticsPage = lazy(() => import('./app/pages/AppAnalyticsPage'));
const AppFeedPage = lazy(() => import('./app/pages/AppFeedPage'));
const AppProfilePage = lazy(() => import('./app/pages/AppProfilePage'));

function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-mi-canvas">
      <div className="text-xs font-mono text-mi-muted">
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

    const preserveAppScroll =
      location.pathname.startsWith('/app/analytics/') &&
      lastPath.current.startsWith('/app/analytics/');
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
      setMessage(detail?.message ?? 'Simulation error occurred');
      window.setTimeout(() => setMessage(null), 3500);
    };

    window.addEventListener('math-intellect:api-error', handler);
    return () => window.removeEventListener('math-intellect:api-error', handler);
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed right-6 top-6 z-[120] border border-mi-danger/40 bg-mi-paper text-mi-danger px-4 py-3 text-xs font-mono shadow-modal"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-mi-danger"></span>
        <span>{message}</span>
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <RouteExperienceManager />
      <Routes location={location}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/workbench" element={<WorkbenchPage />} />
        <Route path="/method" element={<MethodPage />} />

        {/* Legacy Public Redirects */}
        <Route path="/features" element={<Navigate to="/models" replace />} />
        <Route path="/product" element={<Navigate to="/workbench" replace />} />
        <Route path="/pricing" element={<Navigate to="/workbench" replace />} />

        {/* Unauthenticated Auth Routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Application Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<AppDashboardPage />} />
          <Route path="simulations/new" element={<AppSimulationPage />} />
          <Route path="analytics/:id" element={<AppAnalyticsPage />} />
          <Route path="feed" element={<AppFeedPage />} />
          <Route path="profile" element={<AppProfilePage />} />
        </Route>

        {/* Legacy Protected Redirects */}
        <Route path="/simulations/new" element={<Navigate to="/app/simulations/new" replace />} />
        <Route path="/analytics/:id" element={<LegacyAnalyticsRedirect />} />

        {/* Catch-all */}
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
