import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const titles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'System overview and live status' },
  '/network': { title: 'Network Map', subtitle: 'Railway line and section overview' },
  '/track-circuits': { title: 'Track Circuits', subtitle: 'READ-ONLY status monitoring — simulated data' },
  '/assets': { title: 'Asset Register', subtitle: 'Infrastructure assets and condition monitoring' },
  '/fbg': { title: 'FBG Monitoring', subtitle: 'Fiber Bragg Grating structural strain monitoring — simulated data' },
  '/alerts': { title: 'Alerts', subtitle: 'System alerts and notifications' },
  '/inspections': { title: 'Field Inspections', subtitle: 'Inspection tasks and findings' },
  '/maintenance': { title: 'Maintenance', subtitle: 'Maintenance workflow and tasks' },
  '/reports': { title: 'Reports', subtitle: 'Infrastructure monitoring reports' },
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const key = Object.keys(titles).filter(k => k === '/' ? location.pathname === '/' : location.pathname.startsWith(k)).sort((a, b) => b.length - a.length)[0] ?? '/';
  const { title, subtitle } = titles[key] ?? { title: 'REGEN' };
  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-screen-2xl mx-auto"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
