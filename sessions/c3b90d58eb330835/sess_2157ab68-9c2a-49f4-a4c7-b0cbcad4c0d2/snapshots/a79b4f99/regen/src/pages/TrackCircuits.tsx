import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Radio } from 'lucide-react';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getTrackCircuits, getTrackCircuitEvents, getAssets, getFBGSensors } from '../lib/dataService';
import type { TrackCircuit, TrackCircuitEvent, Asset, FBGSensor } from '../types';
import { tcStatusBadge, formatRelative, formatTime } from '../lib/utils';

function TCTimeline({ events }: { events: TrackCircuitEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const isLast = i === events.length - 1;
        const isFault = event.new_status === 'FAULT' || event.event_type === 'FAULT';
        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold ${isFault ? 'bg-red-100 border-red-400 text-red-700' : event.new_status === 'NORMAL' ? 'bg-green-100 border-green-300 text-green-700' : event.new_status === 'OCCUPIED' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>{i + 1}</div>
              {!isLast && <div className="w-px flex-1 bg-[#D9E1E8] mt-1" style={{ minHeight: 20 }} />}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isFault ? 'bg-red-100 text-red-700' : event.new_status === 'NORMAL' ? 'bg-green-100 text-green-700' : event.new_status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{event.new_status}</span>
                {event.previous_status && <span className="text-xs text-[#64748B]">(was {event.previous_status})</span>}
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

function TCDetail({ tc }: { tc: TrackCircuit }) {
  const [events, setEvents] = useState<TrackCircuitEvent[]>([]);
  const [relAssets, setRelAssets] = useState<Asset[]>([]);
  const [fbg, setFbg] = useState<FBGSensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrackCircuitEvents(tc.id), getAssets(), getFBGSensors()])
      .then(([evts, allAssets, allSensors]) => {
        setEvents(evts);
        const tcAssets = allAssets.filter(a => a.track_circuit_id === tc.id);
        setRelAssets(tcAssets);
        setFbg(allSensors.filter(s => tcAssets.some(a => a.id === s.asset_id)));
      }).finally(() => setLoading(false));
  }, [tc.id]);

  return (
    <div className="space-y-6">
      <Link to="/track-circuits" className="btn-ghost inline-flex"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <div className={`card border-l-4 ${tc.status === 'FAULT' ? 'border-l-red-500' : tc.status === 'OFFLINE' ? 'border-l-gray-400' : tc.status === 'OCCUPIED' ? 'border-l-blue-500' : 'border-l-green-500'}`}>
        <div className="card-header flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap"><h2 className="text-xl font-bold text-[#172B3A]">{tc.track_circuit_id}</h2><span className={tcStatusBadge(tc.status)}>{tc.status}</span><SimBadge /></div>
            <p className="text-sm text-[#64748B] mt-1">{tc.location}</p>
          </div>
          {(tc.status === 'FAULT' || tc.status === 'OFFLINE') && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm"><AlertTriangle className="w-4 h-4 flex-shrink-0" />Physical verification required</div>
          )}
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[{ l: 'Status', v: tc.status }, { l: 'Occupancy', v: tc.occupancy }, { l: 'Railway Line', v: tc.railway_line }, { l: 'Signal', v: tc.signal_relationship ?? '—' }, { l: 'Fault Status', v: tc.fault_status ?? 'None' }].map(item => (
              <div key={item.l}><p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{item.l}</p><p className="mt-1 text-sm font-medium text-[#172B3A]">{item.v}</p></div>
            ))}
          </div>
          {tc.fault_description && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded"><p className="text-xs font-semibold text-red-700 uppercase tracking-wider">Fault Description</p><p className="text-sm text-red-800 mt-1">{tc.fault_description}</p></div>}
          <div className="mt-4 p-3 bg-[#EBF3FB] border border-[#C8E0F5] rounded"><p className="text-xs text-[#145DA0]"><strong>READ-ONLY:</strong> REGEN receives simulated status information. It does not control track circuits or issue commands to the signalling system.</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="section-title">Event Timeline</h3><p className="section-subtitle mt-0.5">State change history</p></div>
          <div className="card-body">{loading ? <p className="text-sm text-[#64748B]">Loading...</p> : events.length === 0 ? <p className="text-sm text-[#64748B]">No events</p> : <TCTimeline events={events} />}</div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <div className="card-header"><h3 className="section-title">Related Assets</h3></div>
            <div className="divide-y divide-[#D9E1E8]">
              {relAssets.length === 0 ? <div className="px-5 py-4 text-sm text-[#64748B]">No linked assets</div>
                : relAssets.map(a => (
                  <Link key={a.id} to={`/assets/${a.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                    <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-[#172B3A]">{a.asset_id}</p><p className="text-xs text-[#64748B] truncate">{a.asset_type.replace('_', ' ')}</p></div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${a.condition === 'GOOD' ? 'bg-green-50 text-green-700' : a.condition === 'CRITICAL' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{a.condition}</span>
                  </Link>
                ))
              }
            </div>
          </div>
          {fbg.length > 0 && (
            <div className="card">
              <div className="card-header"><h3 className="section-title flex items-center gap-2"><Radio className="w-4 h-4 text-[#00A6C7]" />FBG Sensors (same zone)</h3><p className="text-xs text-[#64748B] mt-0.5">Independent evidence source — not the cause of TC fault</p></div>
              <div className="divide-y divide-[#D9E1E8]">
                {fbg.map(s => (
                  <Link key={s.id} to={`/fbg/${s.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F5F7FA] transition-colors">
                    <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-[#172B3A]">{s.sensor_id}</p><p className="text-xs text-[#64748B]">Current: {s.current_strain ?? 'Offline'} µε · Trend: {s.trend ?? '—'}</p></div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.risk_level === 'NORMAL' ? 'bg-green-50 text-green-700' : s.risk_level === 'SIMULATED_CRITICAL' ? 'bg-red-50 text-red-700' : s.risk_level === 'OFFLINE' ? 'bg-gray-50 text-gray-600' : 'bg-amber-50 text-amber-700'}`}>{s.risk_level.replace('_', ' ')}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {(tc.status === 'FAULT' || tc.status === 'OFFLINE') && (
        <div className="card border border-amber-200 bg-amber-50">
          <div className="card-body">
            <p className="text-sm font-semibold text-amber-800 mb-3">Recommended actions for {tc.track_circuit_id} {tc.status}:</p>
            <div className="flex flex-wrap gap-3">
              <Link to={`/inspections?tc=${tc.id}`} className="btn-primary"><CheckCircle className="w-4 h-4" />Create Inspection Task</Link>
              <Link to="/alerts" className="btn-secondary"><AlertTriangle className="w-4 h-4" />View Related Alerts</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrackCircuits() {
  const { id } = useParams();
  const [tcs, setTcs] = useState<TrackCircuit[]>([]);
  const [selected, setSelected] = useState<TrackCircuit | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getTrackCircuits().then(data => {
      setTcs(data);
      if (id) setSelected(data.find(tc => tc.id === id || tc.track_circuit_id === id) ?? null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoading />;
  if (id) return selected ? <TCDetail tc={selected} /> : <div className="p-8 text-center text-[#64748B]">Track circuit not found.</div>;

  const filtered = filter === 'ALL' ? tcs : tcs.filter(tc => tc.status === filter);
  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center gap-2 flex-wrap">
        {['ALL', 'NORMAL', 'OCCUPIED', 'FAULT', 'UNKNOWN', 'OFFLINE'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === s ? 'bg-[#145DA0] text-white border-[#145DA0]' : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'}`}>
            {s}{s !== 'ALL' && ` (${tcs.filter(tc => tc.status === s).length})`}
          </button>
        ))}
        <div className="ml-auto"><SimBadge /></div>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Circuit ID</th><th>Status</th><th>Occupancy</th><th>Location</th><th>Railway Line</th><th>Signal</th><th>Last Update</th><th>Fault</th><th></th></tr></thead>
            <tbody>
              {filtered.map(tc => (
                <tr key={tc.id}>
                  <td className="font-mono font-semibold text-[#172B3A]">{tc.track_circuit_id}</td>
                  <td><span className={tcStatusBadge(tc.status)}>{tc.status}</span></td>
                  <td className="text-[#64748B]">{tc.occupancy}</td>
                  <td className="text-[#172B3A] max-w-xs truncate">{tc.location}</td>
                  <td className="text-[#64748B] text-xs">{tc.railway_line}</td>
                  <td className="font-mono text-[#00A6C7] text-xs">{tc.signal_relationship ?? '—'}</td>
                  <td className="text-[#64748B] text-xs whitespace-nowrap">{formatRelative(tc.last_update)}</td>
                  <td>{tc.fault_status ? <span className="text-xs text-red-600 font-medium">{tc.fault_status}</span> : <span className="text-xs text-green-600">None</span>}</td>
                  <td><Link to={`/track-circuits/${tc.id}`} className="btn-ghost text-xs py-1">View →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
