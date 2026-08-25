import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { NetworkMap } from './pages/NetworkMap';
import { TrackCircuits } from './pages/TrackCircuits';
import { Assets } from './pages/Assets';
import { FBGMonitoring } from './pages/FBGMonitoring';
import { Alerts } from './pages/Alerts';
import { Inspections } from './pages/Inspections';
import { Maintenance } from './pages/Maintenance';
import { Reports } from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="network" element={<NetworkMap />} />
          <Route path="track-circuits" element={<TrackCircuits />} />
          <Route path="track-circuits/:id" element={<TrackCircuits />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/:id" element={<Assets />} />
          <Route path="fbg" element={<FBGMonitoring />} />
          <Route path="fbg/:id" element={<FBGMonitoring />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="alerts/:id" element={<Alerts />} />
          <Route path="inspections" element={<Inspections />} />
          <Route path="inspections/:id" element={<Inspections />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="maintenance/:id" element={<Maintenance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
