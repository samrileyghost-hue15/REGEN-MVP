import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { StatCard, SimulatedDataBanner } from "../components/ui";
import { fetchDashboardStats, fetchAlerts, fetchTrackCircuits } from "../store/dataStore";
import { ALERTS, FBG_SENSORS, TRACK_CIRCUITS } from "../store/dataStore";
import { FBG_READINGS } from "../data/seed";
import { timeAgo, formatTime } from "../utils";
import type { DashboardStats, Alert, TrackCircuit } from "../types";
import { onSimUpdate } from "../store/simulation";

const CUSTOM_TOOLTIP_STYLE = {
  background: "var(--bg-elevated)", border: "1px solid var(--border)",
  borderRadius: 6, fontSize: 11, color: "var(--text-primary)",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [tcs, setTcs] = useState<TrackCircuit[]>([]);
  const [tick, setTick] = useState(0);

  const load = useCallback(() => {
    fetchDashboardStats().then(setStats);
    fetchAlerts().then(a => setRecentAlerts(a.filter(x => x.status !== "CLOSED" && x.status !== "RESOLVED").slice(0, 6)));
    fetchTrackCircuits().then(setTcs);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => onSimUpdate(() => { setTick(t => t + 1); load(); }), [load]);

  // FBG-00021 spark data
  const fbg021 = FBG_READINGS
    .filter(r => r.sensor_id === "fbg-021")
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-24)
    .map(r => ({ t: formatTime(r.timestamp), v: r.strain_value }));

  // Sensor activity (simulated 24h average readings count)
  const activityData = Array.from({ length: 13 }, (_, i) => ({
    h: `${(i * 2).toString().padStart(2, "0")}:00`,
    v: 30 + Math.round(Math.sin(i * 0.5) * 15 + Math.random() * 8 + (i > 5 && i < 10 ? 20 : 0)),
  }));

  // TC status breakdown bar
  const tcStatusData = [
    { name: "Normal",   v: tcs.filter(t => t.status === "NORMAL").length,   fill: "var(--status-ok)"      },
    { name: "Occupied", v: tcs.filter(t => t.status === "OCCUPIED").length,  fill: "var(--status-blue)"    },
    { name: "Fault",    v: tcs.filter(t => t.status === "FAULT").length,     fill: "var(--status-crit)"    },
    { name: "Unknown",  v: tcs.filter(t => t.status === "UNKNOWN").length,   fill: "var(--status-warn)"    },
    { name: "Offline",  v: tcs.filter(t => t.status === "OFFLINE").length,   fill: "var(--status-offline)" },
  ];

  // Live event stream (most recent alerts)
  const eventStream = ALERTS
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)
    .map(a => ({
      id: a.id, time: formatTime(a.created_at),
      text: a.title.substring(0, 60) + (a.title.length > 60 ? "…" : ""),
      dot: a.priority === "CRITICAL" ? "var(--status-crit)" : a.priority === "HIGH" ? "var(--status-warn)" : "var(--status-ok)",
    }));

  const critAlerts = ALERTS.filter(a => a.priority === "CRITICAL" && a.status !== "CLOSED").length;
  const warnAlerts = ALERTS.filter(a => a.priority === "WARNING"  && a.status !== "CLOSED").length;
  const onlineSensors = FBG_SENSORS.filter(s => s.sensor_status === "ONLINE").length;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SimulatedDataBanner />

      {/* ── 4 stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <StatCard
          label="Active Sensors" value={onlineSensors} icon="◈"
          delta={`+${Math.max(0, onlineSensors - 125)} since 00:00`}
          sub="Monitoring" color="ok"
          onClick={() => navigate("/fbg-monitoring")}
        />
        <StatCard
          label="Network Uptime" value="99.98%" icon="⟳"
          delta="−0.001%" sub="30-day average" color="ok"
          onClick={() => navigate("/network")}
        />
        <StatCard
          label="Critical Alerts" value={critAlerts} icon="⚠"
          delta={critAlerts > 0 ? `+${critAlerts} from yesterday` : "None active"}
          sub="Since midnight" color={critAlerts > 0 ? "crit" : "ok"}
          onClick={() => navigate("/alerts")}
        />
        <StatCard
          label="Warnings" value={warnAlerts} icon="△"
          delta={`−${Math.max(0, 5 - warnAlerts)} from yesterday`}
          sub="Active warnings" color={warnAlerts > 3 ? "warn" : "ok"}
          onClick={() => navigate("/alerts")}
        />
      </div>

      {/* ── Row 2: Network overview + Alert summary ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 12 }}>

        {/* Network overview panel */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Gauteng network overview</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Active faults on the live rail map</div>
            </div>
            <button onClick={() => navigate("/network")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>
              Open monitoring ↗
            </button>
          </div>

          {/* SVG Map */}
          <div style={{ padding: "16px", background: "var(--bg-base)" }}>
            <NetworkMiniMap tcs={tcs} />
          </div>

          {/* Legend */}
          <div style={{ padding: "8px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 16 }}>
            {[["var(--status-crit)","CRITICAL"],["var(--status-warn)","WARNING"],["var(--status-ok)","NOMINAL"]].map(([c,l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Critical / Warning boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="card" style={{ padding: 14, cursor: "pointer" }} onClick={() => navigate("/alerts")}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Critical</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--status-crit)" }}>{critAlerts}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>open</div>
            </div>
            <div className="card" style={{ padding: 14, cursor: "pointer" }} onClick={() => navigate("/alerts")}>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Warnings</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--status-warn)" }}>{warnAlerts}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>open</div>
            </div>
          </div>

          {/* Alert list */}
          <div className="card" style={{ padding: 0, overflow: "hidden", flex: 1 }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>Alert summary</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Since midnight</span>
            </div>
            {recentAlerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="table-row" style={{ padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                onClick={() => navigate(`/alerts?id=${alert.id}`)}>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: alert.priority === "CRITICAL" || alert.priority === "HIGH" ? "var(--status-crit)" :
                    alert.priority === "WARNING" ? "var(--status-warn)" : "var(--status-ok)"
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
                    {(alert as any).asset?.asset_id?.split("-").slice(0,2).join(" ") ?? alert.source.replace(/_/g," ")}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>
                    {alert.source === "FBG_SENSOR" ? "FBG Strain" : alert.source === "TRACK_CIRCUIT" ? "TC Fault" : alert.source.replace(/_/g," ")}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0, fontFamily: "monospace" }}>
                  {formatTime(alert.created_at).substring(0,5)}
                </span>
              </div>
            ))}
            <div style={{ padding: "8px 14px", borderTop: "1px solid var(--border-subtle)" }}>
              <button onClick={() => navigate("/alerts")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>
                View all →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Sensor activity + TC status + FBG trend + Activity stream ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>

        {/* Sensor activity chart */}
        <div className="card">
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Sensor activity</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Average readings · 24h</div>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="h" tick={{ fontSize: 9, fill: "var(--text-muted)" }} interval={2} />
                <YAxis tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v: any) => [v, "Readings"]} />
                <Area type="monotone" dataKey="v" stroke="var(--chart-line)" strokeWidth={2} fill="url(#actGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TC status bar */}
        <div className="card">
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Track circuit status</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Current distribution · {tcs.length} circuits</div>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tcStatusData} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: "var(--text-muted)" }} />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                <Bar dataKey="v" name="Circuits" radius={[3,3,0,0]}>
                  {tcStatusData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FBG-00021 trend */}
        <div className="card">
          <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>FBG-00021 Strain Trend</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)" }}>Composite Sleeper 021 · 24h</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--status-crit)" }}>
              {FBG_READINGS.filter(r => r.sensor_id === "fbg-021").slice(-1)[0]?.strain_value.toFixed(0) ?? "612"} µε
            </span>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fbg021} margin={{ top: 4, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="fbgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--status-crit)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--status-crit)" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="t" tick={{ fontSize: 8, fill: "var(--text-muted)" }} interval={5} />
                <YAxis domain={[200, 700]} tick={{ fontSize: 8, fill: "var(--text-muted)" }} />
                <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v: any) => [`${v} µε`, "Strain"]} />
                <Area type="monotone" dataKey="v" stroke="var(--status-crit)" strokeWidth={2} fill="url(#fbgGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 4: System health + Maintenance + Activity stream ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>

        {/* System health */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>System health</div>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Rolling 24h</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { l: "UPTIME · 30-day", v: "99.98%", c: "var(--status-ok)" },
              { l: `SENSORS · ${onlineSensors}/${FBG_SENSORS.length}`, v: `${((onlineSensors/FBG_SENSORS.length)*100).toFixed(1)}%`, c: "var(--status-ok)" },
              { l: "NETWORK", v: "Stable", c: "var(--accent)" },
            ].map(m => (
              <div key={m.l}>
                <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>{m.l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>
          {/* Mini bars */}
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 40 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: 2,
                background: i === 21 ? "var(--status-warn)" : i === 23 ? "var(--status-crit)" : "var(--status-ok)",
                height: `${40 + Math.sin(i * 0.8) * 12 + Math.random() * 8}%`,
                opacity: 0.7,
              }} />
            ))}
          </div>
        </div>

        {/* Maintenance upcoming */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Maintenance</span>
            <button onClick={() => navigate("/maintenance")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>Schedule ↑</button>
          </div>
          {[
            { label: "Fastener inspection",        due: "Due Today",       loc: "Germiston",   c: "var(--status-crit)" },
            { label: "Vibration sensor calibration",due: "Due Tomorrow",   loc: "JHB Park",    c: "var(--status-warn)" },
            { label: "Thermal baseline review",    due: "Due Fri",         loc: "Pretoria",    c: "var(--status-warn)" },
            { label: "Strain gauge audit",         due: "Due Next week",   loc: "Centurion",   c: "var(--text-muted)"  },
          ].map((t,i) => (
            <div key={i} className="table-row" style={{ padding: "9px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
              onClick={() => navigate("/maintenance")}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>⚙</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</div>
                <div style={{ fontSize: 10, color: t.c }}>{t.due}</div>
              </div>
              <span style={{ fontSize: 10, background: "var(--bg-elevated)", color: "var(--accent)", padding: "2px 8px", borderRadius: 4, fontWeight: 600, flexShrink: 0 }}>{t.loc}</span>
            </div>
          ))}
        </div>

        {/* Activity stream */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>Activity</span>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>Live event stream</div>
          </div>
          <div style={{ padding: "4px 0" }}>
            {eventStream.map((e, i) => (
              <div key={i} style={{ padding: "6px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>{e.time.substring(0,5)}</span>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.dot }} />
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{e.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mini network map for dashboard ──
function NetworkMiniMap({ tcs }: { tcs: TrackCircuit[] }) {
  const TCX: Record<string, number[]> = {
    "tc-001":[90,80],"tc-002":[130,80],"tc-003":[165,80],"tc-004":[195,80],
    "tc-005":[240,80],"tc-006":[280,80],"tc-007":[320,80],"tc-008":[370,80],
    "tc-009":[405,80],"tc-010":[440,80],"tc-011":[480,80],"tc-021":[535,80],
    "tc-013":[580,80],"tc-014":[100,170],"tc-015":[170,170],"tc-016":[270,170],
    "tc-017":[350,170],"tc-018":[105,260],"tc-019":[250,260],"tc-020":[460,260],
  };
  const TC_C: Record<string,string> = {
    NORMAL:"var(--status-ok)",OCCUPIED:"var(--status-blue)",
    FAULT:"var(--status-crit)",UNKNOWN:"var(--status-warn)",OFFLINE:"var(--status-offline)",
  };
  const LINES = [
    { y:80,  x1:60, x2:610, c:"#2a5298" },
    { y:170, x1:60, x2:560, c:"#1a8a8a" },
    { y:260, x1:60, x2:580, c:"#2a7a3a" },
  ];
  const LABELS = [
    {x:60,y:75,t:"JHB Cen."},{x:200,y:75,t:"Germiston"},{x:335,y:75,t:"Boksburg"},
    {x:455,y:75,t:"Benoni"},{x:607,y:75,t:"Daveyton"},
    {x:60,y:165,t:"CT"},{x:215,y:165,t:"Bellville"},{x:365,y:165,t:"Kraaifontein"},
    {x:60,y:255,t:"Durban"},{x:195,y:255,t:"Rossburgh"},{x:385,y:255,t:"Amanzimtoti"},
  ];

  return (
    <svg viewBox="0 0 660 310" style={{ width: "100%", height: 220 }}>
      <rect width="660" height="310" fill="var(--bg-base)" rx="4" />
      {/* Grid */}
      {[60,120,180,240,300].map(y=>(
        <line key={y} x1="0" y1={y} x2="660" y2={y} stroke="var(--chart-grid)" strokeWidth="0.5"/>
      ))}
      {/* Lines */}
      {LINES.map((l,i) => (
        <line key={i} x1={l.x1} y1={l.y} x2={l.x2} y2={l.y} stroke={l.c} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
      ))}
      {/* Station dots */}
      {LABELS.map((l,i) => (
        <g key={i}>
          <circle cx={l.x} cy={l.y} r="4" fill="var(--bg-surface)" stroke="var(--border)" strokeWidth="1.5"/>
          <text x={l.x} y={l.y-8} textAnchor="middle" fontSize="7" fill="var(--text-muted)" fontFamily="sans-serif">{l.t}</text>
        </g>
      ))}
      {/* TC markers */}
      {Object.entries(TCX).map(([id, [cx,cy]]) => {
        const tc = tcs.find(t => t.id === id);
        if (!tc) return null;
        const c = TC_C[tc.status] ?? "var(--status-offline)";
        const isFault = tc.status === "FAULT" || tc.status === "UNKNOWN";
        return (
          <g key={id}>
            {isFault && <circle cx={cx} cy={cy} r="11" fill={c} opacity="0.15"><animate attributeName="r" values="7;13;7" dur="2s" repeatCount="indefinite"/></circle>}
            <circle cx={cx} cy={cy} r="6" fill={c} stroke="var(--bg-surface)" strokeWidth="1.5"/>
          </g>
        );
      })}
      {/* TC-021 label */}
      <rect x="513" y="93" width="56" height="12" rx="2" fill="var(--status-crit)" opacity="0.9"/>
      <text x="541" y="102" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">TC-021 FAULT</text>
      <line x1="535" y1="86" x2="535" y2="93" stroke="var(--status-crit)" strokeWidth="1.5"/>
    </svg>
  );
}

