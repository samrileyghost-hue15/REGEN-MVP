import { useAssets } from '../context/AssetContext';
import { SeverityBadge } from '../components/ui';
import { SEVERITY_COLOR } from '../utils/severity';
import { format } from 'date-fns';

export function SensorsPage() {
  const { sensors, assets } = useAssets();
  const sorted = [...sensors].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2, healthy: 3, offline: 4 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="text-sm font-mono font-semibold text-text-primary mb-4">
        Sensor Network — {sensors.length} sensors
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Online',     count: sensors.filter(s => s.status === 'online').length,   color: '#39FF14' },
          { label: 'Degraded',   count: sensors.filter(s => s.status === 'degraded').length, color: '#FFB020' },
          { label: 'Offline',    count: sensors.filter(s => s.status === 'offline').length,  color: '#FF3B3B' },
          { label: 'Critical',   count: sensors.filter(s => s.severity === 'critical').length, color: '#FF3B3B' },
        ].map(item => (
          <div key={item.label} className="panel p-4">
            <p className="section-title mb-2">{item.label}</p>
            <p className="text-2xl font-mono font-bold" style={{ color: item.color }}>{item.count}</p>
          </div>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <table className="w-full text-xs font-mono" aria-label="Sensor list">
          <thead>
            <tr className="border-b border-border">
              {['Sensor ID', 'Asset', 'Type', 'Status', 'Current Reading', 'Thresholds', 'Last Update'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-text-dim uppercase tracking-wider font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map(sensor => {
              const asset = assets.find(a => a.id === sensor.assetId);
              return (
                <tr key={sensor.id} className="hover:bg-surface2 transition-colors">
                  <td className="px-4 py-3 font-semibold text-text-primary">{sensor.id}</td>
                  <td className="px-4 py-3 text-text-secondary">{asset?.name ?? sensor.assetId}</td>
                  <td className="px-4 py-3 capitalize text-text-secondary">{sensor.type}</td>
                  <td className="px-4 py-3"><SeverityBadge level={sensor.severity} /></td>
                  <td className="px-4 py-3">
                    {sensor.status === 'offline' ? (
                      <span className="text-text-dim">OFFLINE</span>
                    ) : (
                      <span className="font-bold" style={{ color: SEVERITY_COLOR[sensor.severity] }}>
                        {sensor.currentValue.toFixed(3)}{sensor.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-dim">
                    W:{sensor.warningMax} / C:{sensor.criticalMax} {sensor.unit}
                  </td>
                  <td className="px-4 py-3 text-text-dim whitespace-nowrap">
                    {format(new Date(sensor.lastUpdate), 'HH:mm:ss')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
