import { useAuth } from '../../context/AuthContext';
import { useAssets } from '../../context/AssetContext';
import { useDemo } from '../../context/DemoContext';
import { ROLE_LABELS } from '../../utils/permissions';
import { SeverityDot, RegenLogo } from '../ui';
import { Play, RotateCcw } from 'lucide-react';

export function TopBar() {
  const { user, logout } = useAuth();
  const { alerts } = useAssets();
  const { isRunning, startDemo, resetDemo, stage } = useDemo();

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

  return (
    <header
      className="flex items-center px-4 border-b border-border bg-surface flex-shrink-0"
      style={{ height: 56 }}
    >
      {/* Left — branding */}
      <div className="flex items-center gap-3 w-sidebar flex-shrink-0">
        <RegenLogo variant="mark" width={110} light />
      </div>

      {/* Centre */}
      <div className="flex-1 text-center">
        <p className="text-xs font-mono font-semibold text-text-secondary tracking-widest uppercase">
          Gautrain Network
        </p>
        <p
          className="text-[10px] font-mono tracking-widest"
          style={{ color: '#00FFC6' }}
        >
          ● Live Monitoring
        </p>
      </div>

      {/* Right — demo button + alerts + user */}
      <div className="flex items-center gap-3">
        {/* Demo button */}
        {!isRunning ? (
          <button
            onClick={startDemo}
            className="btn-primary py-1.5 px-3 text-xs gap-1.5"
            aria-label="Start REGEN demo sequence"
          >
            <Play className="w-3.5 h-3.5" />
            START REGEN DEMO
          </button>
        ) : (
          <button
            onClick={resetDemo}
            className="btn-secondary py-1.5 px-3 text-xs gap-1.5"
            aria-label="Reset demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET DEMO
          </button>
        )}

        {/* Demo stage indicator */}
        {stage !== 'idle' && (
          <span className="text-xs font-mono text-cyan/80 hidden xl:block">
            [{stage.toUpperCase()}]
          </span>
        )}

        {/* Alert count */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded border font-mono text-xs cursor-pointer"
          style={{
            borderColor: criticalAlerts > 0 ? 'rgba(255,59,59,0.5)' : 'rgba(255,176,32,0.4)',
            color: criticalAlerts > 0 ? '#FF3B3B' : '#FFB020',
            background: criticalAlerts > 0 ? 'rgba(255,59,59,0.08)' : 'rgba(255,176,32,0.06)',
          }}
        >
          <SeverityDot level={criticalAlerts > 0 ? 'critical' : 'warning'} pulse />
          {activeAlerts} Alert{activeAlerts !== 1 ? 's' : ''}
        </div>

        {/* System online */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-green" style={{ boxShadow: '0 0 6px #39FF14' }} />
          System Online
        </div>

        {/* User */}
        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface2 transition-colors"
            title="Click to sign out"
          >
            <div className="w-6 h-6 rounded bg-cyan/20 border border-cyan/30 flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-cyan">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-mono text-text-primary leading-none">{user.name}</p>
              <p className="text-[10px] font-mono text-text-dim leading-none mt-0.5">
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
