import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, Package, Radio, Bell, Wrench, Layers, Zap } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { SimBadge } from '../components/ui/SimBadge';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { getDashboardStats, getAlerts, getTrackCircuits, getMaintenanceTasks } from '../lib/dataService';
import type { DashboardStats, Alert, TrackCircuit, MaintenanceTask } from '../types';
import { tcStatusBadge, alertPriorityBadge, alertStatusBadge, maintenanceStatusBadge, formatRelative } from '../lib/utils';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [tcs, setTcs] = useState<TrackCircuit[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getAlerts(['OPEN', 'INVESTIGATING', 'ACKNOWLEDGED']),
      getTrackCircuits(),
      getMaintenanceTasks(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'VERIFICATION_REQUIRED']),
    ]).then(([s, a, t, m]) => { setStats(s); setAlerts(a.slice(0, 8)); setTcs(t); setTasks(m.slice(0, 6)); })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <PageLoading />;
  const faultTCs = tcs.filter(tc => tc.status === 'FAULT' || tc.status === 'OFFLINE');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          <strong>SIMULATED DATA — MVP PROTOTYPE.</strong> All data is fictional. REGEN is READ-ONLY and does not control real railway signals, track circuits or trains.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Track Sections" value={stats.totalSections} subtitle="Across 3 railway lines" icon={<Layers className="w-5 h-5" />} />
        <StatCard title="Occupied Circuits" value={stats.occupiedCircuits} subtitle="Active occupations" icon={<Activity className="w-5 h-5" />} valueColor="text-blue-700" />
        <StatCard title="TC Faults / Offline" value={stats.tcFaults} subtitle="Require attention" icon={<Zap className="w-5 h-5" />} valueColor={stats.tcFaults > 0 ? 'text-red-600' : 'text-green-600'} />
        <StatCard title="Infrastructure Warnings" value={stats.infraWarnings} subtitle={`${stats.criticalAssets} critical assets`} icon={<Package className="w-5 h-5" />} valueColor={stats.infraWarnings > 0 ? 'text-amber-600' : 'text-green-600'} />
        <StatCard title="Critical Assets" value={stats.criticalAssets} subtitle="Engineering review needed" icon={<Package className="w-5 h-5" />} valueColor={stats.criticalAssets > 0 ? 'text-red-600' : 'text-green-600'} />
        <StatCard title="FBG Active" value={stats.fbgSensorStatus.active} subtitle={`${stats.fbgSensorStatus.warning} warning · ${stats.fbgSensorStatus.fault} fault · ${stats.fbgSensorStatus.offline} offline`} icon={<Radio className="w-5 h-5" />} />
        <StatCard title="Active Alerts" value={stats.activeAlerts} subtitle="Open + investigating" icon={<Bell className="w-5 h-5" />} valueColor={stats.activeAlerts > 0 ? 'text-amber-600' : 'text-green-600'} />
        <StatCard title="Open Maintenance" value={stats.openMaintenance} subtitle="Tasks in progress" icon={<Wrench className="w-5 h-5" />} valueColor={stats.openMaintenance > 0 ? 'text-amber-600' : 'text-green-600'} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <div><h2 className="section-title">Active Alerts</h2><p className="section-subtitle mt-0.5">Requires attention</p></div>
            <div className="flex items-center gap-2"><SimBadge /><Link to="/alerts" className="btn-ghost text-xs">View all →</Link></div>
          </div>
          <div className="divide-y divide-[#D9E1E8]">
            {alerts.length === 0 && <div className="px-5 py-8 text-center text-[#64748B] text-sm">No active alerts</div>}
            {alerts.map(alert => (
              <Link key={alert.id} to={`/alerts/${alert.id}`} className="block px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={alertPriorityBadge(alert.priority)}>{alert.priority.replace('_', ' ')}</span>
                  <span className={alertStatusBadge(alert.status)}>{alert.status}</span>
                  <span className="text-xs text-[#64748B]">{alert.alert_ref}</span>
                </div>
                <p className="text-sm font-medium text-[#172B3A] mt-1 truncate">{alert.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{formatRelative(alert.created_at)}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div><h2 className="section-title">Track Circuits</h2><p className="section-subtitle mt-0.5">READ-ONLY snapshot</p></div>
            <Link to="/track-circuits" className="btn-ghost text-xs">All →</Link>
          </div>
          <div className="px-5 py-3 grid grid-cols-4 gap-2 border-b border-[#D9E1E8]">
            {[{ l: 'Normal', c: tcs.filter(t => t.status === 'NORMAL').length, col: 'text-green-600' }, { l: 'Occupied', c: tcs.filter(t => t.status === 'OCCUPIED').length, col: 'text-blue-700' }, { l: 'Fault', c: tcs.filter(t => t.status === 'FAULT').length, col: 'text-red-600' }, { l: 'Offline', c: tcs.filter(t => t.status === 'OFFLINE').length, col: 'text-gray-500' }].map(item => (
              <div key={item.l} className="text-center"><div className={`text-xl font-bold ${item.col}`}>{item.c}</div><div className="text-[10px] text-[#64748B]">{item.l}</div></div>
            ))}
          </div>
          <div className="divide-y divide-[#D9E1E8]">
            {faultTCs.length === 0 ? <div className="px-5 py-4 text-sm text-[#64748B] text-center">All circuits nominal</div>
              : faultTCs.slice(0, 6).map(tc => (
                <Link key={tc.id} to={`/track-circuits/${tc.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="text-sm font-semibold text-[#172B3A]">{tc.track_circuit_id}</span><span className={tcStatusBadge(tc.status)}>{tc.status}</span></div>
                    <p className="text-xs text-[#64748B] truncate">{tc.location}</p>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <div><h2 className="section-title">Open Maintenance Tasks</h2><p className="section-subtitle mt-0.5">{tasks.length} tasks requiring action</p></div>
            <Link to="/maintenance" className="btn-ghost text-xs">All →</Link>
          </div>
          <div className="divide-y divide-[#D9E1E8]">
            {tasks.length === 0 && <div className="px-5 py-8 text-center text-sm text-[#64748B]">No open tasks</div>}
            {tasks.map(task => (
              <Link key={task.id} to={`/maintenance/${task.id}`} className="flex items-start gap-3 px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><span className={maintenanceStatusBadge(task.status)}>{task.status.replace('_', ' ')}</span><span className="text-xs text-[#64748B]">{task.maintenance_ref}</span></div>
                  <p className="text-sm font-medium text-[#172B3A] mt-1 truncate">{task.title}</p>
                  {task.assigned_technician && <p className="text-xs text-[#64748B]">{task.assigned_technician}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="card border-l-4 border-l-[#145DA0]">
          <div className="card-header"><h2 className="section-title">Demo Scenario: TC-021 + FBG-00021</h2><p className="section-subtitle mt-0.5">Follow the complete REGEN workflow</p></div>
          <div className="card-body space-y-2">
            {[
              { n: '1', l: 'TC-021 Communication Fault', to: '/track-circuits/30000000-0000-0000-0000-000000000021' },
              { n: '2', l: 'FBG-00021 Increasing Strain (+144.8%)', to: '/fbg/60000000-0000-0000-0000-000000000021' },
              { n: '3', l: 'Combined Alert ALT-2024-001', to: '/alerts/80000000-0000-0000-0000-000000000001' },
              { n: '4', l: 'Asset COMPOSITE-SLEEPER-021', to: '/assets/50000000-0000-0000-0000-000000000021' },
              { n: '5', l: 'Inspection INS-2024-001 In Progress', to: '/inspections/90000000-0000-0000-0000-000000000001' },
              { n: '6', l: 'Maintenance MNT-2024-001 In Progress', to: '/maintenance/A0000000-0000-0000-0000-000000000001' },
            ].map(item => (
              <Link key={item.n} to={item.to} className="flex items-center gap-3 p-2.5 rounded-md bg-[#F5F7FA] hover:bg-[#EBF3FB] border border-[#D9E1E8] transition-colors">
                <span className="w-6 h-6 rounded-full bg-[#145DA0] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.n}</span>
                <span className="text-sm text-[#172B3A] font-medium">{item.l}</span>
                <span className="ml-auto text-[#145DA0] text-xs">→</span>
              </Link>
            ))}
            <p className="text-xs text-[#145DA0] bg-[#EBF3FB] p-3 rounded-md mt-2">TC-021 fault and FBG-00021 strain are separate, spatially-related evidence sources. REGEN does not auto-conclude causation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
