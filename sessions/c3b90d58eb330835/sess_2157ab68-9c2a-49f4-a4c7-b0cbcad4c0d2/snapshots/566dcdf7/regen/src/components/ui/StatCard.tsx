import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  valueColor?: string;
  trend?: ReactNode;
}

export function StatCard({ title, value, subtitle, icon, valueColor, trend }: Props) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider truncate">{title}</p>
          <p className={`mt-1 text-3xl font-bold ${valueColor ?? 'text-[#172B3A]'}`}>
            {value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-[#64748B]">{subtitle}</p>}
          {trend && <div className="mt-2">{trend}</div>}
        </div>
        {icon && (
          <div className="ml-3 flex-shrink-0 w-10 h-10 rounded-lg bg-[#F5F7FA] border border-[#D9E1E8] flex items-center justify-center text-[#145DA0]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
