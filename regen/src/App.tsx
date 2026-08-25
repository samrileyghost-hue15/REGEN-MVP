import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssetProvider } from './context/AssetContext';
import { DemoProvider } from './context/DemoContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NetworkMap } from './pages/NetworkMap';
import { AlertsPage } from './pages/Alerts';
import { AssetsPage } from './pages/Assets';
import { WorkOrdersPage } from './pages/WorkOrders';
import { SensorsPage } from './pages/Sensors';
import { UsersPage } from './pages/Users';
import { SettingsPage } from './pages/Settings';
import { ReportsPage } from './pages/Reports';
import { hasPermission } from './utils/permissions';
import type { RolePermissions } from './types';

// ── Route guard ────────────────────────────────────────────
function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function RequirePermission({
  permission, children,
}: {
  permission: keyof RolePermissions;
  children: ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !hasPermission(user.role, permission)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// ── Inner router (needs Auth context) ─────────────────────
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/map"
          element={
            <RequirePermission permission="map">
              <NetworkMap />
            </RequirePermission>
          }
        />
        <Route
          path="/alerts"
          element={
            <RequirePermission permission="alerts">
              <AlertsPage />
            </RequirePermission>
          }
        />
        <Route
          path="/assets"
          element={
            <RequirePermission permission="assets">
              <AssetsPage />
            </RequirePermission>
          }
        />
        <Route
          path="/work-orders"
          element={
            <RequirePermission permission="workOrders">
              <WorkOrdersPage />
            </RequirePermission>
          }
        />
        <Route
          path="/sensors"
          element={
            <RequirePermission permission="sensors">
              <SensorsPage />
            </RequirePermission>
          }
        />
        <Route
          path="/reports"
          element={
            <RequirePermission permission="reports">
              <ReportsPage />
            </RequirePermission>
          }
        />
        <Route
          path="/users"
          element={
            <RequirePermission permission="users">
              <UsersPage />
            </RequirePermission>
          }
        />
        <Route
          path="/settings"
          element={
            <RequirePermission permission="settings">
              <SettingsPage />
            </RequirePermission>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssetProvider>
          <DemoProvider>
            <AppRoutes />
          </DemoProvider>
        </AssetProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
