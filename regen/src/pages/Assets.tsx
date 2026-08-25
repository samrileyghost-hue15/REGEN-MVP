import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Radio, Activity, Bell, ClipboardList, Wrench } from 'lucide-react';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import {
  getAssets, getAsset, getFBGSensors, getAlerts,
  getInspections, getMaintenanceTasks, getTrackCircuit
} from '../lib/dataService';
import type { Asset, FBGSensor, Alert, Inspection, MaintenanceTask, TrackCircuit } from '../types';
import {
  conditionBadge, sensorStatusBadge, riskBadge, alertPriorityBadge,
  inspectionStatusBadge, maintenanceStatusBadge,
  assetTypeLabel, trendLabel, trendColor,
  formatDate, formatRelative, formatDateTime,
} from '../lib/utils';

function AssetDetail({ assetId }: { assetId: string }) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [tc, setTc] = useState<TrackCircuit | null>(null);
  const [sensors, setSensors] = useState<FBGSensor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAsset(assetId).then(async a => {
      if (!a) return;
      setAsset(a);
      const [sensorData, allAlerts, allInspections, allTasks, tcData] = await Promise.all([
        getFBGSensors(a.id),
        getAlerts(),
        getInspections(),
        getMaintenanceTasks(),
        a.track_circuit_id ? getTrackCircuit(a.track_circuit_id) : Promise.resolve(null),
      ]);
      setSensors(sensorData);
      setAlerts(allAlerts.filter(al => al.asset_id === a.id));
      setInspections(allInspections.filter(i => i.asset_id === a.id));
      setTasks(allTasks.filter(t => t.asset_id === a.id));
      setTc(tcData);
    }).finally(() => setLoading(false));
  }, [assetId]);

  if (loading) return <PageLoading />;
  if (!asset) return <div className="p-8 text-center text-[#64748B]">Asset not found.</div>;

  const conditionColors: Record<string, string> = {
    GOOD: 'border-l-healthy', FAIR: 'border-l-warning',
    WARNING: 'border-l-warning', CRITICAL: 'border-l-critical', UNKNOWN: 'border-l-offline',
  };

  return (
    <div className="space-y-6">
      <Link to="/assets" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Assets
      </Link>

      {/* Asset header */}
      <div className={`card border-l-4 ${conditionColors[asset.condition] ?? 'border-l-gray-300'}`}>
        <div className="card-header flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-[#172B3A]">{asset.asset_id}</h2>
              <span className={conditionBadge(asset.condition)}>{asset.condition}</span>
              <SimBadge />
            </div>
            <p className="text-sm text-[#64748B] mt-1">{asset.description}</p>
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Asset Type</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{assetTypeLabel(asset.asset_type)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Condition</p>
              <p className={`mt-1 text-sm font-bold ${asset.condition === 'GOOD' ? 'text-healthy'
                  : asset.condition === 'CRITICAL' ? 'text-critical'
                    : 'text-warning'
                }`}>{asset.condition}</p>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#64748B] mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Location</p>
                <p className="mt-1 text-sm text-[#172B3A]">{asset.location}</p>
              </div>
            </div>
            {asset.installation_date && (
              <div className="flex items-start gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#64748B] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Installed</p>
                  <p className="mt-1 text-sm text-[#172B3A]">{formatDate(asset.installation_date)}</p>
                </div>
              </div>
            )}
            {asset.last_inspection && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last Inspection</p>
                <p className="mt-1 text-sm text-[#172B3A]">{formatDate(asset.last_inspection)}</p>
              </div>
            )}
            {asset.gps_lat && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">GPS</p>
                <p className="mt-1 text-xs font-mono text-[#64748B]">{asset.gps_lat.toFixed(4)}, {asset.gps_lon?.toFixed(4)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Intelligence summary (the key REGEN view) */}
      <div className="card border border-[#145DA0]/30 bg-[#EBF3FB]/30">
        <div className="card-header bg-[#EBF3FB]/50">
          <h3 className="section-title text-[#145DA0]">Asset Intelligence Summary</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Combined view of all monitoring data for this asset — READ-ONLY, SIMULATED
          </p>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* TC Status */}
            <div className="p-3 rounded border border-[#D9E1E8] bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#145DA0]" />
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Track Circuit</span>
              </div>
              {tc ? (
                <>
                  <Link to={`/track-circuits/${tc.id}`} className="text-sm font-bold text-[#145DA0] hover:underline">{tc.track_circuit_id}</Link>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${tc.status === 'NORMAL' ? 'bg-green-100 text-green-700'
                        : tc.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700'
                          : tc.status === 'FAULT' ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>{tc.status}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 truncate">{tc.location}</p>
                </>
              ) : <p className="text-xs text-[#64748B]">No linked TC</p>}
            </div>

            {/* FBG Status */}
            <div className="p-3 rounded border border-[#D9E1E8] bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-[#00A6C7]" />
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">FBG Sensors</span>
              </div>
              {sensors.length === 0 ? (
                <p className="text-xs text-[#64748B]">No sensors</p>
              ) : sensors.map(s => (
                <div key={s.id} className="mb-2 last:mb-0">
                  <Link to={`/fbg/${s.id}`} className="text-sm font-bold text-[#00A6C7] hover:underline">{s.sensor_id}</Link>
                  <div className="mt-1 space-y-0.5">
                    <p className="text-xs text-[#64748B]">
                      {s.current_strain != null ? `${s.current_strain} µε` : 'Offline'}
                      {s.percentage_change != null && s.percentage_change !== 0 && (
                        <span className={s.percentage_change > 0 ? ' text-critical' : ' text-healthy'}>
                          {' '}({s.percentage_change > 0 ? '+' : ''}{s.percentage_change.toFixed(1)}%)
                        </span>
                      )}
                    </p>
                    <span className={riskBadge(s.risk_level) + ' text-[10px]'}>
                      {s.risk_level.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Asset Verdict */}
            <div className={`p-3 rounded border bg-white ${asset.condition === 'CRITICAL' ? 'border-red-200 bg-red-50'
                : asset.condition === 'WARNING' ? 'border-amber-200 bg-amber-50'
                  : 'border-green-200 bg-green-50'
              }`}>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Assessment</p>
              <p className={`text-sm font-bold ${asset.condition === 'CRITICAL' ? 'text-critical'
                  : asset.condition === 'WARNING' ? 'text-amber-700'
                    : 'text-healthy'
                }`}>
                {asset.condition === 'CRITICAL' ? 'REQUIRES URGENT ACTION'
                  : asset.condition === 'WARNING' ? 'REQUIRES VERIFICATION'
                    : asset.condition === 'FAIR' ? 'MONITOR'
                      : 'NORMAL'}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Based on TC status, FBG readings, and asset condition. Engineer review required.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FBG Sensors detail */}
        {sensors.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="section-title">FBG Sensors</h3>
              <p className="section-subtitle mt-0.5">Structural strain monitoring — simulated readings</p>
            </div>
            <div className="divide-y divide-[#D9E1E8]">
              {sensors.map(sensor => (
                <Link key={sensor.id} to={`/fbg/${sensor.id}`} className="block px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#172B3A]">{sensor.sensor_id}</span>
                        <span className={sensorStatusBadge(sensor.sensor_status)}>{sensor.sensor_status}</span>
                      </div>
                      <div className="mt-1 grid grid-cols-2 gap-x-4 text-xs text-[#64748B]">
                        <span>Baseline: <strong>{sensor.baseline_strain} µε</strong></span>
                        <span>Current: <strong>{sensor.current_strain ?? '—'} {sensor.current_strain ? 'µε' : ''}</strong></span>
                        {sensor.deviation != null && <span>Deviation: <strong className={sensor.deviation > 0 ? 'text-critical' : 'text-healthy'}>
                          {sensor.deviation > 0 ? '+' : ''}{sensor.deviation} µε
                        </strong></span>}
                        {sensor.percentage_change != null && <span>Change: <strong className={sensor.percentage_change > 20 ? 'text-critical' : 'text-[#172B3A]'}>
                          {sensor.percentage_change > 0 ? '+' : ''}{sensor.percentage_change.toFixed(1)}%
                        </strong></span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={riskBadge(sensor.risk_level)}>{sensor.risk_level.replace('_', ' ')}</span>
                      <p className={`text-xs mt-1 font-medium ${trendColor(sensor.trend)}`}>
                        ↗ {trendLabel(sensor.trend)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="section-title flex items-center gap-2">
              <Bell className="w-4 h-4" /> Active Alerts
            </h3>
            <Link to="/alerts" className="btn-ghost text-xs">All →</Link>
          </div>
          <div className="divide-y divide-[#D9E1E8]">
            {alerts.length === 0 ? (
              <div className="px-5 py-4 text-sm text-[#64748B]">No alerts for this asset</div>
            ) : alerts.slice(0, 5).map(alert => (
              <Link key={alert.id} to={`/alerts/${alert.id}`} className="block px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={alertPriorityBadge(alert.priority)}>{alert.priority.replace('_', ' ')}</span>
                  <span className="text-xs text-[#64748B]">{alert.alert_ref}</span>
                </div>
                <p className="text-sm font-medium text-[#172B3A] mt-1 truncate">{alert.title}</p>
                <p className="text-xs text-[#64748B]">{formatRelative(alert.created_at)}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Inspection History */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="section-title flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Inspection History
            </h3>
            <Link to="/inspections" className="btn-ghost text-xs">All →</Link>
          </div>
          <div className="divide-y divide-[#D9E1E8]">
            {inspections.length === 0 ? (
              <div className="px-5 py-4 text-sm text-[#64748B]">No inspections recorded</div>
            ) : inspections.map(insp => (
              <Link key={insp.id} to={`/inspections/${insp.id}`} className="block px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={inspectionStatusBadge(insp.status)}>{insp.status.replace('_', ' ')}</span>
                  <span className="text-xs text-[#64748B]">{insp.inspection_ref}</span>
                </div>
                <p className="text-sm font-medium text-[#172B3A] mt-1 truncate">{insp.title}</p>
                {insp.findings && <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{insp.findings}</p>}
                <p className="text-xs text-[#64748B]">{formatRelative(insp.created_at)}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Maintenance History */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="section-title flex items-center gap-2">
              <Wrench className="w-4 h-4" /> Maintenance History
            </h3>
            <Link to="/maintenance" className="btn-ghost text-xs">All →</Link>
          </div>
          <div className="divide-y divide-[#D9E1E8]">
            {tasks.length === 0 ? (
              <div className="px-5 py-4 text-sm text-[#64748B]">No maintenance tasks</div>
            ) : tasks.map(task => (
              <Link key={task.id} to={`/maintenance/${task.id}`} className="block px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={maintenanceStatusBadge(task.status)}>{task.status.replace('_', ' ')}</span>
                  <span className="text-xs text-[#64748B]">{task.maintenance_ref}</span>
                </div>
                <p className="text-sm font-medium text-[#172B3A] mt-1 truncate">{task.title}</p>
                {task.assigned_technician && <p className="text-xs text-[#64748B]">{task.assigned_technician}</p>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Assets() {
  const { id } = useParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAssets().then(setAssets).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (id) return <AssetDetail assetId={id} />;

  const filtered = assets.filter(a => {
    const matchesFilter = filter === 'ALL' || a.condition === filter;
    const matchesSearch = search === '' ||
      a.asset_id.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()) ||
      a.asset_type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-[#D9E1E8] rounded-md px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
        />
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'GOOD', 'FAIR', 'WARNING', 'CRITICAL'].map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === c ? 'bg-[#145DA0] text-white border-[#145DA0]'
                  : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
                }`}
            >
              {c} {c !== 'ALL' && `(${assets.filter(a => a.condition === c).length})`}
            </button>
          ))}
        </div>
        <div className="ml-auto"><SimBadge /></div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Type</th>
                <th>Condition</th>
                <th>Location</th>
                <th>Installed</th>
                <th>Last Inspection</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(asset => (
                <tr key={asset.id}>
                  <td className="font-mono font-semibold text-[#172B3A]">{asset.asset_id}</td>
                  <td className="text-sm text-[#64748B]">{assetTypeLabel(asset.asset_type)}</td>
                  <td><span className={conditionBadge(asset.condition)}>{asset.condition}</span></td>
                  <td className="text-sm text-[#172B3A] max-w-xs truncate">{asset.location}</td>
                  <td className="text-xs text-[#64748B]">{formatDate(asset.installation_date)}</td>
                  <td className="text-xs text-[#64748B]">{formatDate(asset.last_inspection)}</td>
                  <td>
                    <Link to={`/assets/${asset.id}`} className="btn-ghost text-xs py-1">View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
