import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../lib/theme";
import { cn } from "../../utils";
import {
  TRACK_CIRCUITS, ALERTS, FBG_SENSORS
} from "../../store/dataStore";

// ---- Icons (inline SVG components) ----
function Icon({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  network:   "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  track:     "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
  assets:    "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  fbg:       "M22 12h-4l-3 9L9 3l-3 9H2",
  alerts:    "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  inspect:   "M11 20A7 7 0 0118 8 7 7 0 0111 1 M21 21l-4.35-4.35",
  maintain:  "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z",
  reports:   "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  system:    "M12 2a10 10 0 100 20A10 10 0 0012 2z M12 8v4l3 3",
  sun:       "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
  moon:      "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  search:    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  chevron:   "M9 18l6-6-6-6",
  menu:      "M3 12h18 M3 6h18 M3 18h18",
  close:     "M18 6L6 18M6 6l12 12",
};

const NAV = [
  { path: "/",              label: "Dashboard",      icon: "dashboard" },
  { path: "/network",       label: "Network",        icon: "network"   },
  { path: "/track-circuits",label: "Track",          icon: "track"     },
  { path: "/alerts",        label: "Alerts",         icon: "alerts"    },
  { path: "/assets",        label: "Assets",         icon: "assets"    },
  { path: "/fbg-monitoring",label: "FBG",            icon: "fbg"       },
  { path: "/inspections",   label: "Inspections",    icon: "inspect"   },
  { path: "/maintenance",   label: "Maintenance",    icon: "maintain"  },
  { path: "/reports",       label: "Reports",        icon: "reports"   },
  { path: "/system",        label: "System",         icon: "system"    },
] as const;

interface LayoutProps {
  children: React.ReactNode;
  liveStatus?: { faults: number; alerts: number };
}

export function Layout({ children, liveStatus }: LayoutProps) {
  const { theme, toggle, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [time, setTime] = useState(new Date());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  const faultCount  = liveStatus?.faults ?? 0;
  const alertCount  = liveStatus?.alerts ?? 0;
  const sensorCount = FBG_SENSORS.filter(s => s.sensor_status === "ONLINE").length;
  const totalSensors = FBG_SENSORS.length;
  const critCount   = ALERTS.filter(a => a.priority === "CRITICAL" && a.status !== "CLOSED").length;
  const warnCount   = ALERTS.filter(a => a.priority === "WARNING"  && a.status !== "CLOSED").length;

  const currentLabel = NAV.find(n => n.path === location.pathname)?.label ?? "Dashboard";

  // Quick search results
  const searchResults = searchVal.length > 1 ? [
    ...TRACK_CIRCUITS.filter(tc => tc.track_circuit_id.toLowerCase().includes(searchVal.toLowerCase())).slice(0,3).map(tc => ({ label: tc.track_circuit_id, sub: "Track Circuit", path: `/track-circuits?id=${tc.id}`, status: tc.status })),
    ...ALERTS.filter(a => a.title.toLowerCase().includes(searchVal.toLowerCase())).slice(0,3).map(a => ({ label: a.alert_id, sub: a.title.substring(0,40), path: `/alerts?id=${a.id}`, status: a.priority })),
  ] : [];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"var(--bg-base)" }}>

      {/* ── Slim Sidebar ── */}
      <aside style={{
        width: mobileOpen ? "200px" : "var(--sidebar-w)",
        flexShrink: 0,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width .2s ease",
        overflow: "hidden",
        zIndex: 50,
        position: "relative",
      }}>
        {/* Logo */}
        <div style={{
          height: 48, display: "flex", alignItems: "center",
          justifyContent: mobileOpen ? "flex-start" : "center",
          padding: mobileOpen ? "0 14px" : "0",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div style={{
            width: 28, height: 28, background: "var(--accent)",
            borderRadius: 6, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "#0a1628", fontWeight: 900, fontSize: 13, letterSpacing: "-0.5px" }}>R</span>
          </div>
          {mobileOpen && (
            <div style={{ marginLeft: 10 }}>
              <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: 13, letterSpacing: "0.5px" }}>REGEN</div>
              <div style={{ color: "var(--text-muted)", fontSize: 9, marginTop: 1 }}>Rail Infrastructure</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "8px 0" }}>
          {NAV.map(item => {
            const isActive = item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
            const hasBadge = item.label === "Alerts" && alertCount > 0;
            return (
              <div
                key={item.path}
                style={{ position: "relative" }}
                onMouseEnter={() => !mobileOpen && setTooltip(item.label)}
                onMouseLeave={() => setTooltip(null)}
              >
                <NavLink
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: mobileOpen ? "9px 14px" : "9px 0",
                    justifyContent: mobileOpen ? "flex-start" : "center",
                    color: isActive ? "var(--accent)" : "var(--text-muted)",
                    background: isActive ? "var(--accent-dim)" : "transparent",
                    borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                    textDecoration: "none",
                    transition: "all .15s",
                    fontSize: 12,
                    fontWeight: 500,
                    position: "relative",
                    whiteSpace: "nowrap",
                  }}
                  className="nav-item"
                >
                  <span style={{ flexShrink: 0, marginLeft: isActive ? (mobileOpen ? 0 : -2) : 0 }}>
                    <Icon d={Icons[item.icon as keyof typeof Icons]} size={17} />
                  </span>
                  {mobileOpen && <span>{item.label}</span>}
                  {hasBadge && (
                    <span style={{
                      position: "absolute", top: 6, right: mobileOpen ? 10 : 6,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "var(--status-crit)", color: "#fff",
                      fontSize: 9, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{Math.min(alertCount, 9)}</span>
                  )}
                </NavLink>

                {/* Tooltip */}
                {!mobileOpen && tooltip === item.label && (
                  <div style={{
                    position: "absolute", left: "calc(100% + 8px)", top: "50%",
                    transform: "translateY(-50%)", zIndex: 100,
                    background: "var(--bg-elevated)", border: "1px solid var(--border)",
                    color: "var(--text-primary)", fontSize: 11, fontWeight: 600,
                    padding: "4px 10px", borderRadius: 5, whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}>
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom: theme toggle */}
        <div style={{
          borderTop: "1px solid var(--border)", padding: "8px 0",
          display: "flex", flexDirection: "column", alignItems: mobileOpen ? "flex-start" : "center",
          gap: 4, paddingLeft: mobileOpen ? "14px" : 0,
        }}>
          <button
            onClick={toggle}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", display: "flex", alignItems: "center",
              gap: 8, padding: "7px 0", fontSize: 12, fontWeight: 500,
            }}
          >
            <Icon d={isDark ? Icons.sun : Icons.moon} size={16} />
            {mobileOpen && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
          </button>
        </div>
      </aside>

      {/* ── Right side ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* ── Top status bar ── */}
        <header style={{
          height: 48, flexShrink: 0,
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center",
          gap: 0, paddingRight: 16,
        }}>
          {/* Mobile menu + breadcrumb */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{ padding: "0 14px", height: "100%", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}
          >
            <Icon d={mobileOpen ? Icons.close : Icons.menu} size={17} />
          </button>

          {/* Brand + page */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 16, borderRight: "1px solid var(--border)" }}>
            <span style={{ color: "var(--accent)", fontWeight: 800, fontSize: 13, letterSpacing: "0.5px" }}>REGEN</span>
            <span style={{ color: "var(--text-muted)", fontSize: 11 }}>Rail Infrastructure Monitoring</span>
          </div>

          {/* Status pills */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 16px", borderRight: "1px solid var(--border)", height: "100%" }}>
            <StatusPill value={`${sensorCount} SENSORS ACTIVE`} />
            {critCount > 0 && <StatusPill value={`${critCount} CRITICAL`} color="crit" />}
            {warnCount > 0 && <StatusPill value={`${warnCount} WARNINGS`} color="warn" />}
            <StatusPill value={`LAST SYNC: ${time.toLocaleTimeString("en-ZA", { hour12: false, hour:"2-digit", minute:"2-digit", second:"2-digit" })}`} />
          </div>

          {/* Search */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 16px", position: "relative" }}>
            {searchOpen ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, position: "relative" }}>
                <Icon d={Icons.search} size={14} />
                <input
                  ref={searchRef}
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onBlur={() => { setSearchOpen(false); setSearchVal(""); }}
                  onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                  placeholder="Search tracks, assets, UIDs..."
                  className="input-base"
                  style={{ flex: 1, background: "var(--bg-input)" }}
                />
                {searchResults.length > 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                    background: "var(--bg-elevated)", border: "1px solid var(--border)",
                    borderRadius: 8, zIndex: 200, overflow: "hidden",
                  }}>
                    {searchResults.map((r, i) => (
                      <div
                        key={i}
                        onMouseDown={() => { navigate(r.path); setSearchOpen(false); setSearchVal(""); }}
                        style={{
                          padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid var(--border-subtle)",
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}
                        className="table-row"
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 12, color: "var(--text-primary)" }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.sub}</div>
                        </div>
                        <Icon d={Icons.chevron} size={14} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "var(--bg-input)", border: "1px solid var(--border)",
                  borderRadius: 6, padding: "5px 12px", cursor: "pointer",
                  color: "var(--text-muted)", fontSize: 12, minWidth: 220,
                }}
              >
                <Icon d={Icons.search} size={13} />
                <span>Search tracks, assets, UIDs...</span>
              </button>
            )}
          </div>

          {/* Right indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            {/* Online */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--status-ok)", display: "inline-block" }} className="live-pulse" />
              <span style={{ color: "var(--status-ok)", fontSize: 11, fontWeight: 600 }}>Online</span>
            </div>
            {/* MQTT */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--status-ok)", display: "inline-block" }} />
              <span style={{ color: "var(--text-secondary)", fontSize: 11, fontWeight: 600 }}>MQTT Connected</span>
            </div>
            {/* Fault count */}
            {faultCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--status-crit)", display: "inline-block" }} className="live-pulse" />
                <span style={{ color: "var(--status-crit)", fontSize: 11, fontWeight: 600 }}>{faultCount} Fault{faultCount !== 1 ? "s" : ""}</span>
              </div>
            )}
            {/* User */}
            <div style={{ color: "var(--text-muted)", fontSize: 11 }}>Ops · Gauteng</div>

            {/* LIVE bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 12, borderLeft: "1px solid var(--border)" }}>
              <div style={{ width: 48, height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", background: "var(--accent)",
                  animation: "liveBar 2s linear infinite",
                  width: "40%",
                }} />
              </div>
              <span style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" }}>LIVE</span>
            </div>
          </div>
        </header>

        {/* ── Page ── */}
        <main style={{ flex: 1, overflow: "auto" }}>
          <div style={{ padding: "20px 20px 24px", maxWidth: 1600, margin: "0 auto" }}>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes liveBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        .nav-item:hover {
          color: var(--text-primary) !important;
          background: var(--bg-hover) !important;
        }
      `}</style>
    </div>
  );
}

function StatusPill({ value, color }: { value: string; color?: "crit" | "warn" | "ok" }) {
  const colors = {
    crit: { c: "var(--status-crit)", bg: "var(--status-crit-bg)" },
    warn: { c: "var(--status-warn)", bg: "var(--status-warn-bg)" },
    ok:   { c: "var(--status-ok)",   bg: "var(--status-ok-bg)"   },
  };
  const style = color ? colors[color] : { c: "var(--text-muted)", bg: "transparent" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.4px",
      textTransform: "uppercase", color: style.c,
      background: style.bg, borderRadius: 4,
      padding: color ? "2px 6px" : "0",
    }}>
      {value}
    </span>
  );
}
