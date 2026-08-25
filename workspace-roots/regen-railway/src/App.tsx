import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./lib/theme";
import { Layout } from "./components/layout/Layout";
import { DashboardPage }    from "./pages/Dashboard";
import { NetworkPage }      from "./pages/Network";
import { TrackCircuitsPage }from "./pages/TrackCircuits";
import { AssetsPage }       from "./pages/Assets";
import { FbgMonitoringPage }from "./pages/FbgMonitoring";
import { AlertsPage }       from "./pages/Alerts";
import { InspectionsPage }  from "./pages/Inspections";
import { MaintenancePage }  from "./pages/Maintenance";
import { ReportsPage }      from "./pages/Reports";
import { SystemPage }       from "./pages/System";
import { startSimulation, stopSimulation, onSimUpdate, getSimStats } from "./store/simulation";

export default function App() {
  const [liveStatus, setLiveStatus] = useState({ faults: 0, alerts: 0 });

  useEffect(() => {
    const updateStatus = () => setLiveStatus(getSimStats());
    updateStatus();
    startSimulation(4000);
    const unsub = onSimUpdate(updateStatus);
    return () => { stopSimulation(); unsub(); };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout liveStatus={liveStatus}>
          <Routes>
            <Route path="/"               element={<DashboardPage />}    />
            <Route path="/network"        element={<NetworkPage />}       />
            <Route path="/track-circuits" element={<TrackCircuitsPage />} />
            <Route path="/assets"         element={<AssetsPage />}        />
            <Route path="/fbg-monitoring" element={<FbgMonitoringPage />} />
            <Route path="/alerts"         element={<AlertsPage />}        />
            <Route path="/inspections"    element={<InspectionsPage />}   />
            <Route path="/maintenance"    element={<MaintenancePage />}   />
            <Route path="/reports"        element={<ReportsPage />}       />
            <Route path="/system"         element={<SystemPage />}        />
            <Route path="*"               element={<DashboardPage />}     />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
