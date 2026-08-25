import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { SystemStatus } from './SystemStatus';
import { useDemo } from '../../context/DemoContext';
import { X, AlertTriangle } from 'lucide-react';

// Demo notification toast
function DemoNotification() {
  const { notification, dismissNotification } = useDemo();
  if (!notification) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in
        flex items-center gap-3 px-4 py-3 rounded border font-mono text-sm
        max-w-lg w-full mx-4"
      style={{
        background: 'rgba(0,255,198,0.08)',
        borderColor: 'rgba(0,255,198,0.4)',
        boxShadow: '0 0 20px rgba(0,255,198,0.15)',
        backdropFilter: 'blur(8px)',
      }}
      role="status"
      aria-live="polite"
    >
      <AlertTriangle className="w-4 h-4 text-cyan flex-shrink-0" />
      <span className="flex-1 text-text-primary text-xs">{notification}</span>
      <button
        onClick={dismissNotification}
        className="text-text-dim hover:text-text-primary transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg">
      <TopBar />
      <SystemStatus />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
      <DemoNotification />
    </div>
  );
}
