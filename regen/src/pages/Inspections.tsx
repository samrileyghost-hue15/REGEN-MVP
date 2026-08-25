import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, XCircle, AlertTriangle, Plus } from 'lucide-react';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import {
  getInspections, getInspection, updateInspection,
  getAsset, getTrackCircuit, getFBGSensor, createInspection
} from '../lib/dataService';
import type { Inspection, Asset, TrackCircuit, FBGSensor } from '../types';
import {
  inspectionStatusBadge, conditionBadge, tcStatusBadge, riskBadge,
  formatDate, formatDateTime, formatRelative,
} from '../lib/utils';

function CreateInspectionModal({ onClose, alertId }: { onClose: () => void; alertId?: string }) {
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [assetId, setAssetId] = useState('50000000-0000-0000-0000-000000000021');
  const [priority, setPriority] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');
  const [assignedTo, setAssignedTo] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await createInspection({
      inspection_ref: `INS-${Date.now()}`,
      alert_id: alertId,
      asset_id: assetId,
      title,
      reason,
      priority,
      assigned_to: assignedTo || undefined,
      inspector_name: assignedTo || undefined,
      status: 'OPEN',
      scheduled_date: new Date().toISOString().split('T')[0],
      location: location || undefined,
      false_alarm: false,
      photos_count: 0,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-5 border-b border-[#D9E1E8]">
          <h3 className="text-base font-semibold text-[#172B3A]">Create Inspection Task</h3>
          <p className="text-xs text-[#64748B] mt-0.5"><SimBadge /></p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Title *</label>
            <input
              required value={title} onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full border border-[#D9E1E8] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
              placeholder="e.g. TC-021 Physical Verification"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reason *</label>
            <textarea
              required value={reason} onChange={e => setReason(e.target.value)}
              rows={3}
              className="mt-1 w-full border border-[#D9E1E8] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
              placeholder="Describe why this inspection is needed..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Priority</label>
            <select
              value={priority} onChange={e => setPriority(e.target.value as typeof priority)}
              className="mt-1 w-full border border-[#D9E1E8] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Assign To</label>
            <input
              value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
              className="mt-1 w-full border border-[#D9E1E8] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
              placeholder="Inspector name"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Location</label>
            <input
              value={location} onChange={e => setLocation(e.target.value)}
              className="mt-1 w-full border border-[#D9E1E8] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
              placeholder="Physical location"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Creating...' : 'Create Inspection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InspectionDetail({ inspId }: { inspId: string }) {
  const [insp, setInsp] = useState<Inspection | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [tc, setTc] = useState<TrackCircuit | null>(null);
  const [sensor, setSensor] = useState<FBGSensor | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [findings, setFindings] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [faultConfirmed, setFaultConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    getInspection(inspId).then(async i => {
      if (!i) return;
      setInsp(i);
      setFindings(i.findings ?? '');
      setRecommendation(i.recommendation ?? '');
      setFaultConfirmed(i.fault_confirmed ?? null);
      const [a, t, s] = await Promise.all([
        getAsset(i.asset_id),
        i.track_circuit_id ? getTrackCircuit(i.track_circuit_id) : Promise.resolve(null),
        i.sensor_id ? getFBGSensor(i.sensor_id) : Promise.resolve(null),
      ]);
      setAsset(a);
      setTc(t);
      setSensor(s);
    }).finally(() => setLoading(false));
  }, [inspId]);

  const handleSave = async (newStatus?: Inspection['status']) => {
    if (!insp) return;
    setUpdating(true);
    const updates: Partial<Inspection> = {
      findings: findings || undefined,
      recommendation: recommendation || undefined,
      fault_confirmed: faultConfirmed ?? undefined,
    };
    if (newStatus) {
      updates.status = newStatus;
      if (newStatus === 'COMPLETED') updates.completed_date = new Date().toISOString().split('T')[0];
    }
    await updateInspection(insp.id, updates);
    const updated = await getInspection(inspId);
    setInsp(updated);
    setUpdating(false);
  };

  if (loading) return <PageLoading />;
  if (!insp) return <div className="p-8 text-center text-[#64748B]">Inspection not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/inspections" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Inspections
      </Link>

      {/* Header */}
      <div className="card">
        <div className="card-header flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={inspectionStatusBadge(insp.status)}>{insp.status.replace('_', ' ')}</span>
              <span className="text-sm font-mono text-[#64748B]">{insp.inspection_ref}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-medium border ${insp.priority === 'URGENT' ? 'bg-red-50 text-red-700 border-red-200'
                  : insp.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>{insp.priority}</span>
              <SimBadge />
            </div>
            <h2 className="text-lg font-bold text-[#172B3A] mt-2">{insp.title}</h2>
            <p className="text-sm text-[#64748B] mt-0.5">{insp.reason}</p>
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Assigned To</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{insp.assigned_to ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Scheduled</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{formatDate(insp.scheduled_date)}</p>
            </div>
            {insp.completed_date && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Completed</p>
                <p className="mt-1 text-sm font-medium text-[#172B3A]">{formatDate(insp.completed_date)}</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Photos</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A] flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" /> {insp.photos_count}
              </p>
            </div>
          </div>

          {insp.location && (
            <div className="mt-3 p-3 bg-[#F5F7FA] rounded border border-[#D9E1E8]">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Location</p>
              <p className="text-sm text-[#172B3A] mt-1">{insp.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Linked data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {asset && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Asset</p>
            <Link to={`/assets/${asset.id}`} className="text-sm font-bold text-[#145DA0] hover:underline">{asset.asset_id}</Link>
            <span className={`ml-2 ${conditionBadge(asset.condition)}`}>{asset.condition}</span>
            <p className="text-xs text-[#64748B] mt-1 truncate">{asset.location}</p>
          </div>
        )}
        {tc && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Track Circuit</p>
            <Link to={`/track-circuits/${tc.id}`} className="text-sm font-bold text-[#145DA0] hover:underline">{tc.track_circuit_id}</Link>
            <span className={`ml-2 ${tcStatusBadge(tc.status)}`}>{tc.status}</span>
            <p className="text-xs text-[#64748B] mt-1 truncate">{tc.location}</p>
          </div>
        )}
        {sensor && (
          <div className="card p-4">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">FBG Sensor</p>
            <Link to={`/fbg/${sensor.id}`} className="text-sm font-bold text-[#145DA0] hover:underline">{sensor.sensor_id}</Link>
            <span className={`ml-2 ${riskBadge(sensor.risk_level)}`}>{sensor.risk_level.replace('_', ' ')}</span>
            <p className="text-xs text-[#64748B] mt-1">
              {sensor.current_strain} µε ({sensor.percentage_change != null ? `${sensor.percentage_change > 0 ? '+' : ''}${sensor.percentage_change.toFixed(1)}%` : '—'})
            </p>
          </div>
        )}
      </div>

      {/* Field findings form */}
      {['IN_PROGRESS', 'ASSIGNED', 'OPEN'].includes(insp.status) && (
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Field Findings</h3>
            <p className="section-subtitle mt-0.5">Record observations and determine fault status</p>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Observations / Findings</label>
              <textarea
                value={findings}
                onChange={e => setFindings(e.target.value)}
                rows={4}
                className="mt-1 w-full border border-[#D9E1E8] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
                placeholder="Describe what was observed in the field..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Recommendation</label>
              <textarea
                value={recommendation}
                onChange={e => setRecommendation(e.target.value)}
                rows={2}
                className="mt-1 w-full border border-[#D9E1E8] rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#145DA0]"
                placeholder="Recommended action..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2 block">Fault Assessment</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFaultConfirmed(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-colors ${faultConfirmed === true
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-red-400'
                    }`}
                >
                  <AlertTriangle className="w-4 h-4" /> Fault Confirmed
                </button>
                <button
                  onClick={() => setFaultConfirmed(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded border text-sm font-medium transition-colors ${faultConfirmed === false
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-green-400'
                    }`}
                >
                  <XCircle className="w-4 h-4" /> False Alarm
                </button>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap pt-2">
              <button onClick={() => handleSave()} disabled={updating} className="btn-secondary">
                Save Findings
              </button>
              {insp.status === 'ASSIGNED' && (
                <button onClick={() => handleSave('IN_PROGRESS')} disabled={updating} className="btn-primary">
                  Start Inspection
                </button>
              )}
              <button onClick={() => handleSave('COMPLETED')} disabled={updating} className="btn-primary">
                <CheckCircle className="w-4 h-4" /> Complete Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed findings */}
      {insp.status === 'COMPLETED' && (
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Inspection Findings</h3>
          </div>
          <div className="card-body space-y-4">
            {insp.fault_confirmed !== undefined && (
              <div className={`flex items-center gap-2 p-3 rounded border text-sm font-medium ${insp.fault_confirmed === true
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                {insp.fault_confirmed ? (
                  <><AlertTriangle className="w-4 h-4" /> Fault confirmed during inspection</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> No fault found — possible false alarm</>
                )}
              </div>
            )}
            {insp.findings && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Findings</p>
                <p className="text-sm text-[#172B3A] leading-relaxed">{insp.findings}</p>
              </div>
            )}
            {insp.recommendation && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm text-[#172B3A] leading-relaxed">{insp.recommendation}</p>
              </div>
            )}
            {insp.fault_confirmed && (
              <div className="pt-2">
                <Link to={`/maintenance?inspection=${insp.id}`} className="btn-primary">
                  <Plus className="w-4 h-4" /> Create Maintenance Task
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Inspections() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showCreate, setShowCreate] = useState(searchParams.has('alert') || searchParams.has('tc'));

  useEffect(() => {
    getInspections().then(setInspections).finally(() => setLoading(false));
  }, [showCreate]);

  if (loading) return <PageLoading />;
  if (id) return <InspectionDetail inspId={id} />;

  const filtered = filter === 'ALL' ? inspections : inspections.filter(i => i.status === filter);

  return (
    <div className="space-y-4">
      {showCreate && (
        <CreateInspectionModal
          alertId={searchParams.get('alert') ?? undefined}
          onClose={() => setShowCreate(false)}
        />
      )}

      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === f ? 'bg-[#145DA0] text-white border-[#145DA0]'
                  : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
                }`}
            >
              {f.replace('_', ' ')} {f !== 'ALL' && `(${inspections.filter(i => i.status === f).length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <SimBadge />
          <button onClick={() => setShowCreate(true)} className="btn-primary text-xs">
            <Plus className="w-3.5 h-3.5" /> New Inspection
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(insp => (
          <Link key={insp.id} to={`/inspections/${insp.id}`} className="card block hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={inspectionStatusBadge(insp.status)}>{insp.status.replace('_', ' ')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium border ${insp.priority === 'URGENT' ? 'bg-red-50 text-red-700 border-red-200'
                        : insp.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>{insp.priority}</span>
                    <span className="text-xs font-mono text-[#64748B]">{insp.inspection_ref}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#172B3A] mt-1">{insp.title}</p>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{insp.reason}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                    {insp.inspector_name && <span>Inspector: {insp.inspector_name}</span>}
                    {insp.scheduled_date && <span>Scheduled: {formatDate(insp.scheduled_date)}</span>}
                    <span>{formatRelative(insp.created_at)}</span>
                  </div>
                </div>
                <span className="text-[#145DA0] text-sm">→</span>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-[#64748B]">No inspections for this filter.</div>
        )}
      </div>
    </div>
  );
}
