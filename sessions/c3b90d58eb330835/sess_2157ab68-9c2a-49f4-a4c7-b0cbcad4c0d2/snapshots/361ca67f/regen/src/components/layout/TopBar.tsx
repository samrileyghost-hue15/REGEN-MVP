import { Menu, Bell, RefreshCw, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Props {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}

export function TopBar({ onMenuClick, title, subtitle }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="bg-white border-b border-[#D9E1E8] px-4 lg:px-6 py-3 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 text-[#64748B] hover:text-[#172B3A] rounded"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-[#172B3A] truncate">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748B] truncate">{subtitle}</p>}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Live clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#64748B]">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-mono">{format(time, 'HH:mm:ss')}</span>
        </div>

        {/* Simulated data badge */}
        <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-700 font-medium">
          SIMULATED
        </span>

        {/* Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="p-1.5 text-[#64748B] hover:text-[#145DA0] rounded hover:bg-[#F5F7FA] transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Alerts bell */}
        <button className="relative p-1.5 text-[#64748B] hover:text-[#145DA0] rounded hover:bg-[#F5F7FA] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#DC2626]" />
        </button>
      </div>
    </header>
  );
}
