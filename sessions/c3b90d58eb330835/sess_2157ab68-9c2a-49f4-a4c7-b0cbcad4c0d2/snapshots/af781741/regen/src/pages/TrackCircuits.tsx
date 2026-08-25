import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getTrackCircuits, getTrackCircuitEvents, getAssets, getFBGSensors } from '../lib/dataService';
import type { TrackCircuit, TrackCircuitEvent, Asset, FBGSensor } from '../types';
import { tcStatusBadge, formatDateTime, formatRelative, formatTime } from '../lib/utils';

// -------------------------------------------------------
// Track Circuit event timeline component
// -------------------------------------------------------
function TCTimeline({ events }: { events: TrackCircuitEvent[] }) {
  const stepMap: Record<string, number> = {
    NORMAL: 0, OCCUPIED: 1, FAULT: 2, UNKNOWN: 3, OFFLINE: 4, RECOVERY: 2,
  };

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        const isFault = event.new_status === 'FAULT' || event.event_type === 'FAULT';
        const isRecovery = event.event_type === 'RECOVERY';

        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold
                ${isFault ? 'bg-red-100 border-red-400 text-red-700'
                  : isRecovery ? 'bg-green-100 border-green-400 text-green-700'
                    : event.new_status === 'NORMAL' ? 'bg-green-100 border-green-300 text-green-700'
                      : event.new_status === 'OCCUPIED' ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-100 border-gray-300 text-gray-500'}
              `}>
                {i + 1}
              </div>
              {!isLast && <div className="w-px flex-1 bg-[#D9E1E8] mt-1" style={{ minHeight: 20 }} />}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isFault ? 'bg-red-100 text-red-700'
                  : event.new_status === 'NORMAL' ? 'bg-green-100 text-green-700'
                    : event.new_status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                  {event.new_status}
                </span>
                {event.previous_status && (
                  <span className="text-xs text-[#64748B]">
                    (was {event.previous_status})
                  </span>
                )}
                <span className="text-xs text-[#64748B] font-mono">{formatTime(event.timestamp)}</span>
              </div>
              <p className="text-sm text-[#172B3A] mt-1">{event.description}</p>
              <p className="text-xs text-[#64748B] mt-0.5">{formatRelative(event.timestamp)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------
// Single TC detail view
// -------------------------------------------------------
function TCDetail({ tc }: { tc: TrackCircuit }) {
  const [events, setEvents] = useState<TrackCircuitEvent[]>([]);
  const [relatedAssets, setRelatedAssets] = useState<Asset[]>([]);
  const [fbgSensors, setFbgSensors] = useState<FBGSensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTrackCircuitEvents(tc.id),
      getAssets(),
      getFBGSensors(),
    ]).then(([evts, allAssets, allSensors]) => {
      setEvents(evts);
      const tcAssets = allAssets.filter(a => a.track_circuit_id === tc.id);
      setRelatedAssets(tcAssets);
      const assetIds = tcAssets.map(a => a.id);
      setFbgSensors(allSensors.filter(s => assetIds.includes(s.asset_id)));
    }).finally(() => setLoading(false));
  }, [tc.id]);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/track-circuits" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Track Circuits
      </Link>

      {/* Status card */}
      <div className={`card border-l-4 ${tc.status === 'FAULT' ? 'border-l-critical' :
        tc.status === 'OFFLINE' ? 'border-l-offline' :
          tc.status === 'OCCUPIED' ? 'border-l-blue-500' : 'border-l-healthy'
        }`}>
        <div className="card-header flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#172B3A]">{tc.track_circuit_id}</h2>
              <span className={tcStatusBadge(tc.status)}>{tc.status}</span>
              <SimBadge />
            </div>
            <p className="text-sm text-[#64748B] mt-1">{tc.location}</p>
          </div>
          {(tc.status === 'FAULT' || tc.status === 'OFFLINE') && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Physical verification required
            </div>
          )}
        </div>

        <div className="card-body">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</p>
              <p className={`mt-1 text-sm font-bold ${tc.status === 'NORMAL' ? 'text-healthy' :
                tc.status === 'OCCUPIED' ? 'text-blue-700' :
                  tc.status === 'FAULT' ? 'text-critical' : 'text-offline'
                }`}>{tc.status}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Occupancy</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{tc.occupancy}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Railway Line</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{tc.railway_line}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Related Signal</p>
              <p className="mt-1 text-sm font-medium text-[#00A6C7]">{tc.signal_relationship ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last Update</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{formatDateTime(tc.last_update)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Fault Status</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{tc.fault_status ?? 'None'}</p>
            </div>
          </div>

          {tc.fault_description && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">Fault Description</p>
              <p className="text-sm text-red-800 mt-1">{tc.fault_description}</p>
            </div>
          )}

          {/* Read-only notice */}
          <div className="mt-4 p-3 bg-[#EBF3FB] border border-[#C8E0F5] rounded">
            <p className="text-xs text-[#145DA0]">
              <strong>READ-ONLY:</strong> REGEN receives simulated status information. It does not control track circuits
              or issue commands to the signalling system. Actions are limited to creating inspection and maintenance tasks.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Timeline */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Event Timeline</h3>
            <p className="section-subtitle mt-0.5">State change history for {tc.track_circuit_id}</p>
          </div>
          <div className="card-body">
            {loading ? <div className="h-20 flex items-center justify-center"><span className="text-sm text-[#64748B]">Loading...</span></div>
              : events.length === 0 ? <p className="text-sm text-[#64748B]">No events recorded</p>
                : <TCTimeline events={events} />
            }
          </div>
        </div>

        {/* Related Assets & FBG */}
        <div className="space-y-4">
          <div className="card">
            <div className="card-header">
              <h3 className="section-title">Related Infrastructure Assets</h3>
            </div>
            <div className="divide-y divide-[#D9E1E8]">
              {relatedAssets.length === 0 ? (
                <div className="px-5 py-4 text-sm text-[#64748B]">No linked assets</div>
              ) : relatedAssets.map(asset => (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F7FA] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#172B3A]">{asset.asset_id}</p>
                    <p className="text-xs text-[#64748B]">{asset.asset_type.replace('_', ' ')} · {asset.location}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium border ${asset.condition === 'GOOD' ? 'bg-green-50 text-green-700 border-green-200'
                    : asset.condition === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : asset.condition === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>{asset.condition}</span>
                </Link>
              ))}
            </div>
          </div>

          {fbgSensors.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">FBG Sensors (same zone)</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  These sensors monitor assets in this TC zone. TC fault and FBG data are independent evidence sources.
                </p>
              </div>
              <div className="divide-y divide-[#D9E1E8]">
                {fbgSensors.map(sensor => (
                  <Link
                    key={sensor.id}
                    to={`/fbg/${sensor.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F7FA] transition-colors"
                  >
                    <Radio className="w-4 h-4 text-[#00A6C7] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#172B3A]">{sensor.sensor_id}</p>
                      <p className="text-xs text-[#64748B]">
                        Baseline: {sensor.baseline_strain} µε ·
                        Current: {sensor.current_strain ?? 'Offline'} µε ·
                        Trend: {sensor.trend ?? '—'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium border ${sensor.risk_level === 'NORMAL' ? 'bg-green-50 text-green-700 border-green-200'
                      : sensor.risk_level === 'SIMULATED_WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : sensor.risk_level === 'SIMULATED_CRITICAL' ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>{sensor.risk_level.replace('_', ' ')}</span>
                  </Link>
                ))}
              </div>
              <div className="px-5 py-3 bg-[#F5F7FA] border-t border-[#D9E1E8]">
                <p className="text-xs text-[#64748B]">
                  <strong>Important:</strong> FBG readings indicate structural strain, not necessarily the cause of the TC fault.
                  Both data sources should be considered during investigation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action panel */}
      {(tc.status === 'FAULT' || tc.status === 'OFFLINE') && (
        <div className="card border border-amber-200 bg-amber-50">
          <div className="card-header bg-amber-50 border-b border-amber-200">
            <h3 className="text-sm font-semibold text-amber-800">Recommended Actions</h3>
          </div>
          <div className="card-body space-y-2">
            <p className="text-sm text-amber-700">
              TC-{tc.track_circuit_id} is in {tc.status} state. The following actions are available:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to={`/inspections?tc=${tc.id}`} className="btn-primary">
                <CheckCircle className="w-4 h-4" />
                Create Inspection Task
              </Link>
              <Link to="/alerts" className="btn-secondary">
                <AlertTriangle className="w-4 h-4" />
                View Related Alerts
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------
// Track Circuits list
// -------------------------------------------------------
export function TrackCircuits() {
  const { id } = useParams();
  const [tcs, setTcs] = useState<TrackCircuit[]>([]);
  const [selected, setSelected] = useState<TrackCircuit | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    getTrackCircuits().then(data => {
      setTcs(data);
      if (id) {
        const found = data.find(tc => tc.id === id || tc.track_circuit_id === id);
        setSelected(found ?? null);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoading />;
  if (selected || id) {
    if (!selected) return <div className="p-8 text-center text-[#64748B]">Track circuit not found.</div>;
    return <TCDetail tc={selected} />;
  }

  const filtered = filter === 'ALL' ? tcs : tcs.filter(tc => tc.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-[#172B3A]">Filter:</span>
        {['ALL', 'NORMAL', 'OCCUPIED', 'FAULT', 'UNKNOWN', 'OFFLINE'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === s
              ? 'bg-[#145DA0] text-white border-[#145DA0]'
              : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
              }`}
          >
            {s}
            {s !== 'ALL' && (
              <span className="ml-1">({tcs.filter(tc => tc.status === s).length})</span>
            )}
          </button>
        ))}
        <div className="ml-auto">
          <SimBadge />
        </div>
      </div>

      {/* TC table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Circuit ID</th>
                <th>Status</th>
                <th>Occupancy</th>
                <th>Location</th>
                <th>Railway Line</th>
                <th>Signal</th>
                <th>Last Update</th>
                <th>Fault</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tc => (
                <tr key={tc.id}>
                  <td className="font-mono font-semibold text-[#172B3A]">{tc.track_circuit_id}</td>
                  <td>
                    <span className={tcStatusBadge(tc.status)}>{tc.status}</span>
                  </td>
                  <td className="text-[#64748B]">{tc.occupancy}</td>
                  <td className="text-[#172B3A] max-w-xs truncate">{tc.location}</td>
                  <td className="text-[#64748B] text-xs">{tc.railway_line}</td>
                  <td className="font-mono text-[#00A6C7] text-xs">{tc.signal_relationship ?? '—'}</td>
                  <td className="text-[#64748B] text-xs whitespace-nowrap">{formatRelative(tc.last_update)}</td>
                  <td>
                    {tc.fault_status ? (
                      <span className="text-xs text-critical font-medium">{tc.fault_status}</span>
                    ) : (
                      <span className="text-xs text-healthy">None</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/track-circuits/${tc.id}`} className="btn-ghost text-xs py-1">View →</Link>
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
