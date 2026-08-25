import { useAssets } from '../context/AssetContext';
import { useNavigate } from 'react-router-dom';
import { SeverityBadge } from '../components/ui';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';

export function AssetsPage() {
  const { assets, sensors, predictions, selectAsset } = useAssets();
  const navigate = useNavigate();

  const getPredictionForAsset = (id: string) => predictions.find(p => p.assetId === id);
  const getSensorsForAsset = (id: string) => sensors.filter(s => s.assetId === id);

  const handleSelect = (assetId: string) => {
    selectAsset(assetId);
    navigate('/map');
  };

  // Sort: critical first
  const sorted = [...assets].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2, healthy: 3, offline: 4 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="text-sm font-mono font-semibold text-text-primary mb-4">
        Asset Register — {assets.length} assets
      </h1>

      {/* Table */}
      <div className="panel overflow-hidden">
        <table className="w-full text-xs font-mono" aria-label="Asset register">
          <thead>
            <tr className="border-b border-border">
              {['Asset', 'Type', 'Status', 'Location', 'Sensors', 'Prediction', 'Last Inspection', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-text-dim uppercase tracking-wider font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map(asset => {
              const assetSensors = getSensorsForAsset(asset.id);
              const prediction = getPredictionForAsset(asset.id);
              const criticalSensors = assetSensors.filter(s => s.severity === 'critical').length;
              const warnSensors = assetSensors.filter(s => s.severity === 'warning').length;

              return (
                <tr
                  key={asset.id}
                  className="hover:bg-surface2 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-text-primary">{asset.name}</p>
                    <p className="text-text-dim text-[10px] mt-0.5">{asset.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded border border-border capitalize"
                      style={{ color: '#A0A0A0' }}
                    >
                      {asset.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge level={asset.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-text-secondary truncate max-w-xs">{asset.location}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-text-dim" />
                      <span className="text-text-secondary">{assetSensors.length}</span>
                      {criticalSensors > 0 && (
                        <span style={{ color: '#FF3B3B' }}>({criticalSensors} crit)</span>
                      )}
                      {warnSensors > 0 && criticalSensors === 0 && (
                        <span style={{ color: '#FFB020' }}>({warnSensors} warn)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {prediction ? (
                      <div>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            color: prediction.riskLevel === 'high' ? '#FF3B3B' : prediction.riskLevel === 'medium' ? '#FFB020' : '#39FF14',
                            background: prediction.riskLevel === 'high' ? 'rgba(255,59,59,0.1)' : 'rgba(255,176,32,0.1)',
                          }}
                        >
                          {prediction.riskLevel.toUpperCase()} · {prediction.rulDays}d
                        </span>
                      </div>
                    ) : (
                      <span className="text-text-dim">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-dim whitespace-nowrap">
                    {format(new Date(asset.lastInspection), 'dd MMM yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleSelect(asset.id)}
                      className="btn-ghost text-xs"
                    >
                      View →
                    </button>
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
