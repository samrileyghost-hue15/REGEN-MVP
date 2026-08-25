import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../utils/permissions';
import { Tooltip, RegenLogo } from '../ui';
import {
  LayoutDashboard, Map, Bell, Package,
  ClipboardList, Radio, Users, Settings, BarChart3,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' as const },
  { to: '/map', label: 'Network Map', icon: Map, permission: 'map' as const },
  { to: '/alerts', label: 'Alerts', icon: Bell, permission: 'alerts' as const },
  { to: '/assets', label: 'Assets', icon: Package, permission: 'assets' as const },
  { to: '/work-orders', label: 'Work Orders', icon: ClipboardList, permission: 'workOrders' as const },
  { to: '/sensors', label: 'Sensors', icon: Radio, permission: 'sensors' as const },
  { to: '/reports', label: 'Reports', icon: BarChart3, permission: 'reports' as const },
  { to: '/users', label: 'Users', icon: Users, permission: 'users' as const },
  { to: '/settings', label: 'Settings', icon: Settings, permission: 'settings' as const },
];

export function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside
      className="flex flex-col items-center py-4 gap-1 bg-surface border-r border-border flex-shrink-0"
      style={{ width: 88 }}
      aria-label="Main navigation"
    >
      {/* Logo mark */}
      <div className="mb-4 flex flex-col items-center">
        <RegenLogo variant="icon" width={48} light />
      </div>

      {NAV_ITEMS.map(item => {
        if (!hasPermission(user.role, item.permission)) return null;
        const Icon = item.icon;
        return (
          <Tooltip key={item.to} tip={item.label}>
            <NavLink
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-14 h-14 rounded transition-all duration-150 group
                ${isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-text-dim hover:text-text-secondary hover:bg-surface2'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-r"
                      style={{ background: '#00FFC6', boxShadow: '0 0 8px rgba(0,255,198,0.8)' }}
                    />
                  )}
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[9px] font-mono mt-1 leading-none text-center">
                    {item.label.split(' ')[0]}
                  </span>
                </>
              )}
            </NavLink>
          </Tooltip>
        );
      })}
    </aside>
  );
}
