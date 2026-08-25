import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getTrackCircuits, getAssets, getFBGSensors, getAlerts, getMaintenanceTasks } from '../lib/dataService';
import type { TrackCircuit, Asset, FBGSensor, Alert, MaintenanceTask } from '../types';

const COLORS = {
  healthy: '#16A34A',
  warning: '#F59E0B',
  critical: '#DC2626',
  offline: '#6B7280',
  blue: '#145DA0',
  cyan: '#00A6C7',
};

export function Reports() {
  const [tcs, setTcs] = useState<TrackCircuit[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [sensors, setSensors] = useState<FBGSensor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTrackCircuits(), getAssets(), getFBGSensors(),
      getAlerts(), getInspections(), getMaintenanceTasks(),
    ]).then(([t, a, s, al, i, m]) => {
      setTcs(t); setAssets(a); setSensors(s);
      setAlerts(al); setInspections(i); setTasks(m);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  // TC Status distribution
  const tcStatusData = [
    { name: 'Normal', value: tcs.filter(t => t.status === 'NORMAL').length, color: COLORS.healthy },
    { name: 'Occupied', value: tcs.filter(t => t.status === 'OCCUPIED').length, color: COLORS.blue },
    { name: 'Fault', value: tcs.filter(t => t.status === 'FAULT').length, color: COLORS.critical },
    { name: 'Unknown', value: tcs.filter(t => t.status === 'UNKNOWN').length, color: COLORS.warning },
    { name: 'Offline', value: tcs.filter(t => t.status === 'OFFLINE').length, color: COLORS.offline },
  ];

  // Asset condition distribution
  const assetConditionData = [
    { name: 'Good', value: assets.filter(a => a.condition === 'GOOD').length, color: COLORS.healthy },
    { name: 'Fair', value: assets.filter(a => a.condition === 'FAIR').length, color: COLORS.cyan },
    { name: 'Warning', value: assets.filter(a => a.condition === 'WARNING').length, color: COLORS.warning },
    { name: 'Critical', value: assets.filter(a => a.condition === 'CRITICAL').length, color: COLORS.critical },
  ];

  // FBG sensor status
  const fbgStatusData = [
    { name: 'Active', value: sensors.filter(s => s.sensor_status === 'ACTIVE').length, color: COLORS.healthy },
    { name: 'Warning', value: sensors.filter(s => s.sensor_status === 'WARNING').length, color: COLORS.warning },
    { name: 'Fault', value: sensors.filter(s => s.sensor_status === 'FAULT').length, color: COLORS.critical },
    { name: 'Offline', value: sensors.filter(s => s.sensor_status === 'OFFLINE').length, color: COLORS.offline },
    { name: 'Calibrating', value: sensors.filter(s => s.sensor_status === 'CALIBRATING').length, color: COLORS.cyan },
  ];

  // Alert priority breakdown
  const alertPriorityData = [
    { name: 'Normal', value: alerts.filter(a => a.priority === 'NORMAL').length },
    { name: 'Warning', value: alerts.filter(a => a.priority === 'WARNING').length },
    { name: 'High', value: alerts.filter(a => a.priority === 'HIGH').length },
    { name: 'Critical', value: alerts.filter(a => a.priority === 'CRITICAL').length },
    { name: 'Req. Verify', value: alerts.filter(a => a.priority === 'REQUIRES_VERIFICATION').length },
  ];

  // Maintenance status
  const maintenanceStatusData = [
    { name: 'Open', value: tasks.filter(t => t.status === 'OPEN').length },
    { name: 'Assigned', value: tasks.filter(t => t.status === 'ASSIGNED').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'COMPLETED' || t.status === 'VERIFICATION_REQUIRED').length },
    { name: 'Verified', value: tasks.filter(t => t.status === 'VERIFIED').length },
    { name: 'Closed', value: tasks.filter(t => t.status === 'CLOSED').length },
  ];

  // Asset types breakdown
  const assetTypeData = assets.reduce<Record<string, number>>((acc, a) => {
    const label = a.asset_type.replace('_', ' ');
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
  const assetTypeChartData = Object.entries(assetTypeData).map(([name, value]) => ({ name, value }));

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-[#172B3A] mb-4">{children}</h3>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#172B3A]">Infrastructure Monitoring Reports</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Summary analytics across all monitoring data</p>
        </div>
        <SimBadge />
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Track Circuits', value: tcs.length, color: 'text-[#145DA0]' },
          { label: 'TC Faults', value: tcs.filter(t => ['FAULT', 'OFFLINE'].includes(t.status)).length, color: 'text-critical' },
          { label: 'Assets', value: assets.length, color: 'text-[#172B3A]' },
          { label: 'Critical Assets', value: assets.filter(a => a.condition === 'CRITICAL').length, color: 'text-critical' },
          { label: 'FBG Sensors', value: sensors.length, color: 'text-[#00A6C7]' },
          { label: 'Active Alerts', value: alerts.filter(a => ['OPEN', 'INVESTIGATING'].includes(a.status)).length, color: 'text-warning' },
        ].map(item => (
          <div key={item.label} className="card p-4 text-center">
            <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-[#64748B] mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TC Status Pie */}
        <div className="card">
          <div className="card-header">
            <SectionTitle>Track Circuit Status Distribution</SectionTitle>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={tcStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                  {tcStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Condition Pie */}
        <div className="card">
          <div className="card-header">
            <SectionTitle>Asset Condition Distribution</SectionTitle>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={assetConditionData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                  {assetConditionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FBG Status Bar */}
        <div className="card">
          <div className="card-header">
            <SectionTitle>FBG Sensor Status</SectionTitle>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fbgStatusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9E1E8" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Sensors" radius={[3, 3, 0, 0]}>
                  {fbgStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Priority Bar */}
        <div className="card">
          <div className="card-header">
            <SectionTitle>Alert Priority Breakdown</SectionTitle>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={alertPriorityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9E1E8" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Alerts" fill={COLORS.warning} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Maintenance Status Bar */}
        <div className="card">
          <div className="card-header">
            <SectionTitle>Maintenance Task Status</SectionTitle>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={maintenanceStatusData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9E1E8" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" name="Tasks" fill={COLORS.blue} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Type Distribution */}
        <div className="card">
          <div className="card-header">
            <SectionTitle>Asset Type Distribution</SectionTitle>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={assetTypeChartData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#D9E1E8" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#64748B' }} width={110} />
                <Tooltip />
                <Bar dataKey="value" name="Assets" fill={COLORS.cyan} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data notice */}
      <div className="card p-4 bg-amber-50 border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>SIMULATED DATA — MVP PROTOTYPE.</strong> All figures shown are based on simulated data
          for demonstration purposes only. This report does not represent real railway infrastructure status.
          REGEN is a READ-ONLY decision-support platform.
        </p>
      </div>
    </div>
  );
}
