import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Network, Activity, Package,
  Radio, Bell, ClipboardList, Wrench, FileText, X
} from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/',             label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/network',      label: 'Network',         icon: Network },
  { to: '/track-circuits', label: 'Track Circuits', icon: Activity },
  { to: '/assets',       label: 'Assets',          icon: Package },
  { to: '/fbg',          label: 'FBG Monitoring',  icon: Radio },
  { to: '/alerts',       label: 'Alerts',          icon: Bell },
  { to: '/inspections',  label: 'Inspections',     icon: ClipboardList },
  { to: '/maintenance',  label: 'Maintenance',     icon: Wrench },
  { to: '/reports',      label: 'Reports',         icon: FileText },
];

export function Sidebar({ open, onClose }: Props) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0B1F33] z-30
        flex flex-col
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <div className="text-white font-bold text-xl tracking-wide">REGEN</div>
            <div className="text-[#00A6C7] text-xs font-medium">Railway Infrastructure Intelligence</div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sim notice */}
        <div className="mx-3 mt-3 px-3 py-2 rounded bg-amber-900/30 border border-amber-700/40">
          <p className="text-amber-300 text-[10px] font-medium leading-tight">
            ⚠ SIMULATED DATA — MVP PROTOTYPE
          </p>
          <p className="text-amber-400/70 text-[9px] mt-0.5">
            Read-only decision support. Not for operational use.
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-[#145DA0] text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/30 text-[10px]">
            REGEN MVP v0.1 — Not safety-certified
          </p>
          <p className="text-white/20 text-[9px] mt-0.5">
            © 2024 REGEN Demo Organisation
          </p>
        </div>
      </aside>
    </>
  );
}
