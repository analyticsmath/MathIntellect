import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import { ProtectedRoute } from "./shared/ui/ProtectedRoute";
import { useAuth } from "./shared/hooks/useAuth";
import { AppErrorBoundary } from "./components/ui/AppErrorBoundary";
import { RouteExperienceManager } from "./marketing/possibility/runtime/RouteExperienceManager";
import MarketingShell from "./marketing/MarketingShell";
import HomePage from "./marketing/pages/HomePage";
import ModelsPage from "./marketing/pages/ModelsPage";
import WorkbenchPage from "./marketing/pages/WorkbenchPage";
import MethodPage from "./marketing/pages/MethodPage";

import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import { PublicTransitionProvider } from "./marketing/possibility/transitions/PublicTransitionProvider";

const AppDashboardPage = lazy(() => import("./app/pages/AppDashboardPage"));
const AppSimulationPage = lazy(() => import("./app/pages/AppSimulationPage"));
const AppAnalyticsPage = lazy(() => import("./app/pages/AppAnalyticsPage"));
const AppFeedPage = lazy(() => import("./app/pages/AppFeedPage"));
const AppProfilePage = lazy(() => import("./app/pages/AppProfilePage"));

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
        <span
          aria-hidden="true"
          className="mx-auto mt-5 block h-px w-16 bg-[#bf2d32]"
        />
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
  return <Navigate to={id ? `/app/analytics/${id}` : "/app"} replace />;
}

function ApiErrorToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      setMessage(detail?.message ?? "Simulation error occurred");
      window.setTimeout(() => setMessage(null), 3500);
    };

    window.addEventListener("math-intellect:api-error", handler);
    return () =>
      window.removeEventListener("math-intellect:api-error", handler);
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
      <PublicTransitionProvider>
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
          <Route
            path="/product"
            element={<Navigate to="/workbench" replace />}
          />
          <Route
            path="/pricing"
            element={<Navigate to="/workbench" replace />}
          />

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
          <Route
            path="/simulations/new"
            element={<Navigate to="/app/simulations/new" replace />}
          />
          <Route path="/analytics/:id" element={<LegacyAnalyticsRedirect />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PublicTransitionProvider>
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
