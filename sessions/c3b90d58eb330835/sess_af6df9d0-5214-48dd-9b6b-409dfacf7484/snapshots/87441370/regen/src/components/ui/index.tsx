// ─── Shared UI primitives ───────────────────────────────
import type { SeverityLevel } from '../../types';
import { SEVERITY_COLOR, SEVERITY_LABEL } from '../../utils/severity';

// Severity dot
export function SeverityDot({ level, pulse }: { level: SeverityLevel; pulse?: boolean }) {
  const color = SEVERITY_COLOR[level];
  const size =
    level === 'critical' ? 10 : level === 'warning' ? 8 : 6;
  const anim =
    level === 'critical'
      ? 'animate-pulse-fast'
      : level === 'warning'
        ? 'animate-pulse-slow'
        : '';
  return (
    <span
      className={`inline-block rounded-full flex-shrink-0 ${pulse ? anim : ''}`}
      style={{ width: size, height: size, background: color, boxShadow: `0 0 6px ${color}` }}
      aria-hidden="true"
    />
  );
}

// Severity badge
export function SeverityBadge({ level }: { level: SeverityLevel }) {
  const cls: Record<SeverityLevel, string> = {
    critical: 'badge-critical',
    warning: 'badge-warning',
    info: 'badge-info',
    healthy: 'badge-healthy',
    offline: 'badge-offline',
  };
  return (
    <span className={cls[level]} role="status">
      <SeverityDot level={level} pulse />
      {SEVERITY_LABEL[level]}
    </span>
  );
}

// Divider
export function Divider({ className = '' }: { className?: string }) {
  return <div className={`border-t border-border ${className}`} />;
}

// Expand toggle
export function ExpandToggle({ open, onClick, label }: {
  open: boolean; onClick: () => void; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-2 text-xs font-mono text-text-secondary hover:text-cyan transition-colors group"
      aria-expanded={open}
    >
      <span className="section-title">{label}</span>
      <svg
        className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// Loading skeleton
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-surface2 rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

// Tooltip wrapper
export function Tooltip({ children, tip }: { children: React.ReactNode; tip: string }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
        bg-surface2 border border-border rounded text-xs text-text-primary font-mono
        whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100
        transition-opacity duration-150 z-50">
        {tip}
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ icon, title, subtitle }: {
  icon?: string; title: string; subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <span className="text-3xl mb-3" aria-hidden="true">{icon}</span>}
      <p className="text-sm font-mono font-medium text-text-secondary">{title}</p>
      {subtitle && <p className="text-xs text-text-dim mt-1">{subtitle}</p>}
    </div>
  );
}

// Stat card
export function StatCard({
  label, value, unit, sub, color, onClick,
}: {
  label: string; value: string | number; unit?: string;
  sub?: string; color?: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`panel p-4 text-left w-full transition-colors ${onClick ? 'hover:border-cyan/40 cursor-pointer' : 'cursor-default'}`}
    >
      <p className="section-title mb-2">{label}</p>
      <p className="font-mono font-bold leading-none" style={{ fontSize: 28, color: color ?? '#F0F0F0' }}>
        {value}
        {unit && <span className="text-sm text-text-secondary ml-1">{unit}</span>}
      </p>
      {sub && <p className="text-xs text-text-dim mt-1.5 font-mono">{sub}</p>}
    </button>
  );
}

// Re-export logo
export { RegenLogo } from './RegenLogo';
