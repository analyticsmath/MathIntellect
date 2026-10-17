import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
  useParams,
} from 'react-router-dom';
import { ProtectedRoute } from './shared/ui/ProtectedRoute';
import { useAuth } from './shared/hooks/useAuth';
import { AppErrorBoundary } from './components/ui/AppErrorBoundary';
import MarketingShell from './marketing/MarketingShell';
import HomePage from './marketing/pages/HomePage';
import ModelsPage from './marketing/pages/ModelsPage';
import WorkbenchPage from './marketing/pages/WorkbenchPage';
import MethodPage from './marketing/pages/MethodPage';

const LoginPage = lazy(() => import('./auth/LoginPage'));
const SignupPage = lazy(() => import('./auth/SignupPage'));

const AppDashboardPage = lazy(() => import('./app/pages/AppDashboardPage'));
const AppSimulationPage = lazy(() => import('./app/pages/AppSimulationPage'));
const AppAnalyticsPage = lazy(() => import('./app/pages/AppAnalyticsPage'));
const AppFeedPage = lazy(() => import('./app/pages/AppFeedPage'));
const AppProfilePage = lazy(() => import('./app/pages/AppProfilePage'));

function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen grid place-items-center bg-[#121212] text-[#ffffff]"
    >
      <div className="text-center">
        <span className="block font-medium tracking-tight text-lg">
          math intellect
        </span>
        <span aria-hidden="true" className="mx-auto mt-5 block h-px w-16 bg-[#bf2d32]" />
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
    const titles:Record<string,string>={'/':'Math Intellect | A model in motion','/models':'Models | Math Intellect','/workbench':'Workbench | Math Intellect','/method':'Method | Math Intellect','/login':'Sign in | Math Intellect','/signup':'Create account | Math Intellect'};
    if (titles[location.pathname]) document.title=titles[location.pathname];
    const isHashNav = location.hash.length > 1;

    if (isHashNav) {
      requestAnimationFrame(() => {
        const target = document.getElementById(location.hash.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
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
      className="fixed right-6 top-6 z-[120] border border-mi-data-red bg-mi-paper text-mi-data-red px-4 py-3 text-xs font-mono shadow-modal"
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-mi-data-red"></span>
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
        {/* Public Marketing Experience */}
        <Route element={<MarketingShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/workbench" element={<WorkbenchPage />} />
          <Route path="/method" element={<MethodPage />} />
        </Route>

        {/* Legacy Public Redirects */}
        <Route path="/features" element={<Navigate to="/models" replace />} />
        <Route path="/product" element={<Navigate to="/workbench" replace />} />
        <Route path="/pricing" element={<Navigate to="/workbench" replace />} />

        {/* Unauthenticated Auth Routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Protected Application Routes (Untouched) */}
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

function AppTransitionLayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<"cover" | "reveal" | null>(null);
  const transitioning = useRef(false);
  const coverTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (coverTimer.current !== null) window.clearTimeout(coverTimer.current);
    if (revealTimer.current !== null) window.clearTimeout(revealTimer.current);
  }, []);

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return;

    const target = event.target;
    const anchor = target instanceof Element
      ? target.closest<HTMLAnchorElement>("a[href]")
      : null;
    if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;

    const destination = new URL(anchor.href, window.location.href);
    const publicRoutes = new Set(["/", "/models", "/workbench", "/method", "/login", "/signup"]);
    if (
      destination.origin !== window.location.origin ||
      !publicRoutes.has(location.pathname) ||
      !publicRoutes.has(destination.pathname) ||
      (destination.pathname === location.pathname && destination.search === location.search)
    ) return;

    const nextLocation = destination.pathname + destination.search + destination.hash;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      event.preventDefault();
      navigate(nextLocation);
      return;
    }

    event.preventDefault();
    if (transitioning.current) return;
    transitioning.current = true;
    setPhase("cover");
    coverTimer.current = window.setTimeout(() => {
      navigate(nextLocation);
      window.requestAnimationFrame(() => setPhase("reveal"));
      revealTimer.current = window.setTimeout(() => {
        setPhase(null);
        transitioning.current = false;
      }, 620);
    }, 300);
  };

  return (
    <div className="mi-app-surface" onClickCapture={handleClickCapture}>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
      {phase && <div className={"mi-route-curtain mi-route-curtain--" + phase} aria-hidden="true" />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppErrorBoundary>
        <ApiErrorToast />
        <AppTransitionLayer />
      </AppErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

