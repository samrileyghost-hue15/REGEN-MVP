import { useAssets } from '../context/AssetContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function ReportsPage() {
  const { assets, alerts, workOrders, sensors } = useAssets();

  const assetsBySeverity = [
    { name: 'Critical', value: assets.filter(a => a.severity === 'critical').length, color: '#FF3B3B' },
    { name: 'Warning',  value: assets.filter(a => a.severity === 'warning').length,  color: '#FFB020' },
    { name: 'Info',     value: assets.filter(a => a.severity === 'info').length,     color: '#00D1FF' },
    { name: 'Healthy',  value: assets.filter(a => a.severity === 'healthy').length,  color: '#39FF14' },
  ];

  const woByStatus = [
    { name: 'Open',        value: workOrders.filter(w => w.status === 'open').length },
    { name: 'In Progress', value: workOrders.filter(w => w.status === 'in_progress').length },
    { name: 'Resolved',    value: workOrders.filter(w => w.status === 'resolved').length },
    { name: 'Closed',      value: workOrders.filter(w => w.status === 'closed').length },
  ];

  const sensorsByType = ['vibration', 'temperature', 'strain', 'seismic'].map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: sensors.filter(s => s.type === type).length,
  }));

  const tt = {
    contentStyle: { background: '#111', border: '1px solid #2A2A2A', fontFamily: 'JetBrains Mono' },
    labelStyle: { color: '#A0A0A0', fontSize: 10 },
    itemStyle: { color: '#F0F0F0', fontSize: 11 },
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <h1 className="text-sm font-mono font-semibold text-text-primary">Network Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4">
          <p className="section-title mb-4">Asset Health Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={assetsBySeverity} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({name, value}) => `${name}: ${value}`} labelLine={false} fontSize={9} fontFamily="JetBrains Mono">
                {assetsBySeverity.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...tt} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-4">
          <p className="section-title mb-4">Work Order Status</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={woByStatus} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1A1A1A" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#666', fontFamily: 'JetBrains Mono' }} />
              <YAxis tick={{ fontSize: 9, fill: '#666', fontFamily: 'JetBrains Mono' }} allowDecimals={false} />
              <Tooltip {...tt} />
              <Bar dataKey="value" fill="#00FFC6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-4">
          <p className="section-title mb-4">Sensors by Type</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sensorsByType} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#1A1A1A" />
              <XAxis type="number" tick={{ fontSize: 9, fill: '#666', fontFamily: 'JetBrains Mono' }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: '#A0A0A0', fontFamily: 'JetBrains Mono' }} />
              <Tooltip {...tt} />
              <Bar dataKey="value" fill="#00D1FF" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-4">
          <p className="section-title mb-4">Alert Summary</p>
          <div className="space-y-3 text-xs font-mono">
            {[
              { label: 'Total Alerts', value: alerts.length, color: '#F0F0F0' },
              { label: 'Active', value: alerts.filter(a => a.status === 'active').length, color: '#FF3B3B' },
              { label: 'Acknowledged', value: alerts.filter(a => a.status === 'acknowledged').length, color: '#FFB020' },
              { label: 'Resolved', value: alerts.filter(a => a.status === 'resolved').length, color: '#39FF14' },
              { label: 'Critical Severity', value: alerts.filter(a => a.severity === 'critical').length, color: '#FF3B3B' },
              { label: 'Warning Severity', value: alerts.filter(a => a.severity === 'warning').length, color: '#FFB020' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-text-dim">{item.label}</span>
                <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
