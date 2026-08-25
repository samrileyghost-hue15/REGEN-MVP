import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, useState } from "react";
import { cn } from "../../utils";
import type { TrackCircuitStatus, RiskLevel, AlertPriority, AssetCondition, FbgTrend, SensorStatus, MaintenanceStatus, InspectionStatus } from "../../types";

// ============================================================
// REGEN UI Kit — theme-aware components
// ============================================================

// ── Card ──
interface CardProps {
  children: ReactNode; className?: string; padding?: boolean;
  onClick?: () => void; hover?: boolean; style?: React.CSSProperties;
}
export function Card({ children, className, padding = true, onClick, hover, style }: CardProps) {
  return (
    <div
      className={cn("card", hover && "card-hover", className)}
      style={{ ...(padding ? { padding: 16 } : {}), ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// ── SectionHeader ──
export function SectionHeader({ title, subtitle, children }: {
  title: string; subtitle?: string; children?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{children}</div>}
    </div>
  );
}

// ── PageHeader ──
export function PageHeader({ title, subtitle, breadcrumb, children }: {
  title: string; subtitle?: string; breadcrumb?: string; children?: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      {breadcrumb && (
        <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 4 }}>
          {breadcrumb}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: 0, lineHeight: 1.2 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "6px 0 0" }}>{subtitle}</p>}
        </div>
        {children && <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>{children}</div>}
      </div>
    </div>
  );
}

// ── SimulatedDataBanner ──
export function SimulatedDataBanner() {
  return (
    <div style={{
      background: "var(--status-warn-bg)", border: "1px solid rgba(240,165,0,.2)",
      borderRadius: 6, padding: "6px 12px", marginBottom: 16,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <span style={{ fontSize: 11, color: "var(--status-warn)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.4px" }}>⚠ Simulated Data</span>
      <span style={{ fontSize: 11, color: "var(--text-muted)" }}>— This platform displays simulated monitoring data only. Does not control real railway systems.</span>
    </div>
  );
}

// ── Button ──
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}
export function Button({ variant = "secondary", size = "md", children, className, style, ...props }: ButtonProps) {
  const sizes = { sm: { padding: "4px 10px", fontSize: 11 }, md: { padding: "6px 14px", fontSize: 12 }, lg: { padding: "8px 20px", fontSize: 13 } };
  return (
    <button
      className={cn("btn", `btn-${variant}`, className)}
      style={{ ...sizes[size], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

// ── Input ──
export function Input({ className, style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input-base", className)} style={{ width: "100%", ...style }} {...props} />;
}

// ── Select ──
export function Select({ className, style, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("input-base", className)} style={{ ...style }}
      {...props}
    />
  );
}

// ── Textarea ──
export function Textarea({ className, style, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn("input-base", className)}
      style={{ width: "100%", resize: "vertical", minHeight: 72, ...style }}
      {...props}
    />
  );
}

// ── Status Badge helpers ──
function pillClass(status: string): string {
  const map: Record<string, string> = {
    NORMAL: "pill-ok", OK: "pill-ok", GOOD: "pill-ok", LOW: "pill-ok", ONLINE: "pill-ok",
    OCCUPIED: "pill-blue", MODERATE: "pill-blue", FAIR: "pill-blue",
    WARNING: "pill-warn", WARN: "pill-warn", DEGRADED: "pill-warn", CALIBRATING: "pill-warn",
    FAULT: "pill-crit", CRITICAL: "pill-crit", HIGH: "pill-crit",
    UNKNOWN: "pill-orange", REQUIRES_VERIFICATION: "pill-orange", SUDDEN_CHANGE: "pill-orange",
    OFFLINE: "pill-offline",
    OPEN: "pill-crit", ASSIGNED: "pill-blue", IN_PROGRESS: "pill-orange",
    COMPLETED: "pill-ok", VERIFICATION_REQUIRED: "pill-orange",
    VERIFIED: "pill-ok", CLOSED: "pill-offline",
    PENDING: "pill-warn", CANCELLED: "pill-offline",
    INCREASING: "pill-crit", DECREASING: "pill-blue", STABLE: "pill-ok",
    COMBINED: "pill-orange", TRACK_CIRCUIT: "pill-blue", FBG_SENSOR: "pill-warn",
    ASSET: "pill-ok", COMMUNICATION: "pill-offline", MAINTENANCE: "pill-ok",
  };
  return map[status] ?? "pill-offline";
}

interface BadgeProps { label: string; simulated?: boolean; style?: React.CSSProperties; }
function Badge({ label, simulated, style }: BadgeProps) {
  return (
    <span className={pillClass(label)} style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 7px", borderRadius: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.3px",
      textTransform: "uppercase", whiteSpace: "nowrap", ...style
    }}>
      {simulated ? `SIMULATED ${label}` : label.replace(/_/g, " ")}
    </span>
  );
}

export const TrackCircuitStatusBadge = ({ status }: { status: TrackCircuitStatus }) => <Badge label={status} />;
export const RiskBadge = ({ risk, simulated = true }: { risk: RiskLevel; simulated?: boolean }) => <Badge label={risk} simulated={simulated && risk !== "OFFLINE"} />;
export const AlertPriorityBadge = ({ priority }: { priority: AlertPriority }) => <Badge label={priority} />;
export const AssetConditionBadge = ({ condition }: { condition: AssetCondition }) => <Badge label={condition} />;
export const MaintenanceStatusBadge = ({ status }: { status: MaintenanceStatus }) => <Badge label={status} />;
export const InspectionStatusBadge = ({ status }: { status: InspectionStatus }) => <Badge label={status} />;
export const SensorStatusBadge = ({ status }: { status: SensorStatus }) => <Badge label={status} />;
export const TrendBadge = ({ trend }: { trend: FbgTrend }) => {
  const icons: Record<FbgTrend, string> = {
    STABLE: "→", INCREASING: "↑", DECREASING: "↓", SUDDEN_CHANGE: "⚡", OFFLINE: "—"
  };
  return <Badge label={`${icons[trend]} ${trend.replace(/_/g, " ")}`} />;
};

// ── DataRow ──
export function DataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "6px 0", borderBottom: "1px solid var(--border-subtle)",
    }}>
      <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600, flexShrink: 0, marginRight: 12 }}>{label}</span>
      <span style={{ fontSize: 12, color: "var(--text-primary)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

// ── Stat card (dashboard) ──
export function StatCard({ label, value, sub, delta, icon, color, onClick }: {
  label: string; value: ReactNode; sub?: string; delta?: string;
  icon?: string; color?: "ok" | "warn" | "crit" | "blue"; onClick?: () => void;
}) {
  const c = {
    ok:   "var(--status-ok)",
    warn: "var(--status-warn)",
    crit: "var(--status-crit)",
    blue: "var(--status-blue)",
  }[color ?? "ok"] ?? "var(--accent)";
  return (
    <div className="card card-hover" onClick={onClick} style={{ padding: 18, cursor: onClick ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600 }}>{label}</span>
        {icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: color ? `rgba(${color === "ok" ? "0,200,150" : color === "warn" ? "240,165,0" : color === "crit" ? "232,64,64" : "74,158,255"},.12)` : "var(--accent-dim)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {(sub || delta) && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {delta && <span style={{ fontSize: 11, color: "var(--status-ok)" }}>{delta}</span>}
          {sub && <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ── Timeline ──
interface TimelineItem {
  id: string; label: string; description: string; timestamp: string;
  status: "completed" | "active" | "pending" | "fault";
}
export function Timeline({ items }: { items: TimelineItem[] }) {
  const dotColor = { completed: "var(--status-ok)", active: "var(--status-blue)", pending: "var(--border)", fault: "var(--status-crit)" };
  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} style={{ display: "flex", gap: 12, paddingBottom: idx < items.length - 1 ? 16 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: dotColor[item.status], flexShrink: 0, marginTop: 3 }} />
            {idx < items.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--border-subtle)", marginTop: 4 }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: item.status === "fault" ? "var(--status-crit)" : "var(--text-primary)" }}>{item.label}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0 }}>{item.timestamp}</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "3px 0 0" }}>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Modal ──
interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: "sm" | "md" | "lg"; }
export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  if (!open) return null;
  const widths = { sm: 380, md: 520, lg: 720 };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }} onClick={onClose} />
      <div style={{
        position: "relative", width: "100%", maxWidth: widths[size],
        background: "var(--bg-elevated)", border: "1px solid var(--border)",
        borderRadius: 10, overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18, lineHeight: 1 }}>&times;</button>
        </div>
        <div style={{ padding: 20, maxHeight: "75vh", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

// ── Tabs ──
export function Tabs({ tabs, active, onChange }: {
  tabs: { id: string; label: string; count?: number }[];
  active: string; onChange: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 2, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
          background: "none", border: "none", borderBottom: `2px solid ${active === tab.id ? "var(--accent)" : "transparent"}`,
          color: active === tab.id ? "var(--accent)" : "var(--text-muted)",
          transition: "all .15s", marginBottom: -1, display: "flex", alignItems: "center", gap: 6,
        }}>
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              padding: "1px 6px", borderRadius: 10, fontSize: 10, fontWeight: 700,
              background: active === tab.id ? "var(--accent-dim)" : "var(--bg-elevated)",
              color: active === tab.id ? "var(--accent)" : "var(--text-muted)",
            }}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ── Empty state ──
export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 20px", textAlign: "center" }}>
      {icon && <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>{icon}</div>}
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{title}</div>
      {description && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, maxWidth: 280 }}>{description}</div>}
    </div>
  );
}

// ── Loading spinner ──
export function LoadingSpinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        border: "3px solid var(--border)",
        borderTopColor: "var(--accent)",
        animation: "spin .6s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Two-panel layout ──
export function TwoPanel({ list, detail, listWidth = 300 }: {
  list: ReactNode; detail: ReactNode; listWidth?: number;
}) {
  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 120px)", minHeight: 0 }}>
      <div style={{ width: listWidth, flexShrink: 0, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {list}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, overflow: "auto", minHeight: 0 }}>
        {detail}
      </div>
    </div>
  );
}

// ── List panel ──
export function ListPanel({ title, count, children, toolbar }: {
  title: string; count?: number; children: ReactNode; toolbar?: ReactNode;
}) {
  return (
    <div className="card" style={{ padding: 0, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
          {title}{count !== undefined && <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>({count})</span>}
        </span>
        {toolbar}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  );
}

// ── List row ──
export function ListRow({ onClick, active, children }: {
  onClick?: () => void; active?: boolean; children: ReactNode;
}) {
  return (
    <div
      onClick={onClick}
      className="table-row"
      style={{
        padding: "10px 14px", cursor: onClick ? "pointer" : "default",
        borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
        background: active ? "var(--accent-dim)" : "transparent",
        transition: "all .12s",
      }}
    >
      {children}
    </div>
  );
}

// ── Inline info grid ──
export function InfoGrid({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
      {items.map(item => (
        <div key={String(item.label)} style={{ background: "var(--bg-elevated)", borderRadius: 6, padding: "8px 10px" }}>
          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
