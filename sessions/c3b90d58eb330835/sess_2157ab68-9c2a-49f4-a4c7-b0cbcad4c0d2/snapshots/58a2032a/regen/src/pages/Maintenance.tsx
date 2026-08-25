import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Wrench, Clock } from 'lucide-react';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import {
  getMaintenanceTasks, getMaintenanceTask, updateMaintenanceTask,
  getVerifications, getAsset, getInspection
} from '../lib/dataService';
import type { MaintenanceTask, MaintenanceVerification, Asset, Inspection } from '../types';
import {
  maintenanceStatusBadge,
  formatDateTime, formatRelative,
} from '../lib/utils';

const _STATUS_FLOW: MaintenanceTask['status'][] = [
  'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED',
  'VERIFICATION_REQUIRED', 'VERIFIED', 'CLOSED',
];

function StatusStepBar({ current }: { current: MaintenanceTask['status'] }) {
  const steps = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'CLOSED'];
  const currentIdx = steps.indexOf(current === 'VERIFICATION_REQUIRED' ? 'COMPLETED' : current);

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center flex-shrink-0">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold ${idx < currentIdx ? 'bg-green-100 text-green-700'
            : idx === currentIdx ? 'bg-[#145DA0] text-white'
              : 'bg-[#F5F7FA] text-[#64748B]'
            }`}>
            {idx < currentIdx && <CheckCircle className="w-3 h-3" />}
            {step.replace('_', ' ')}
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-6 h-0.5 ${idx < currentIdx ? 'bg-green-300' : 'bg-[#D9E1E8]'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function MaintenanceDetail({ taskId }: { taskId: string }) {
  const [task, setTask] = useState<MaintenanceTask | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [verifications, setVerifications] = useState<MaintenanceVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [_verifyNotes, setVerifyNotes] = useState('');
  const [_verifyResult, setVerifyResult] = useState<'PASSED' | 'FAILED' | 'PARTIAL'>('PASSED');

  useEffect(() => {
    getMaintenanceTask(taskId).then(async t => {
      if (!t) return;
      setTask(t);
      const [a, i, v] = await Promise.all([
        getAsset(t.asset_id),
        t.inspection_id ? getInspection(t.inspection_id) : Promise.resolve(null),
        getVerifications(t.id),
      ]);
      setAsset(a);
      setInspection(i);
      setVerifications(v);
    }).finally(() => setLoading(false));
  }, [taskId]);

  const advanceStatus = async (newStatus: MaintenanceTask['status']) => {
    if (!task) return;
    setUpdating(true);
    const updates: Partial<MaintenanceTask> = { status: newStatus };
    if (newStatus === 'IN_PROGRESS' && !task.start_time) updates.start_time = new Date().toISOString();
    if (newStatus === 'COMPLETED' && !task.completion_time) updates.completion_time = new Date().toISOString();
    await updateMaintenanceTask(task.id, updates);
    const updated = await getMaintenanceTask(taskId);
    setTask(updated);
    setUpdating(false);
  };

  if (loading) return <PageLoading />;
  if (!task) return <div className="p-8 text-center text-[#64748B]">Maintenance task not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/maintenance" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Maintenance
      </Link>

      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={maintenanceStatusBadge(task.status)}>{task.status.replace('_', ' ')}</span>
            <span className="text-sm font-mono text-[#64748B]">{task.maintenance_ref}</span>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${task.priority === 'URGENT' ? 'bg-red-50 text-red-700 border-red-200'
              : task.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>{task.priority}</span>
            <SimBadge />
          </div>
          <h2 className="text-lg font-bold text-[#172B3A] mt-2">{task.title}</h2>
        </div>

        <div className="card-body space-y-4">
          <StatusStepBar current={task.status} />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Assigned To</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{task.assigned_technician ?? '—'}</p>
            </div>
            {task.start_time && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Started</p>
                <p className="mt-1 text-sm text-[#172B3A]">{formatDateTime(task.start_time)}</p>
              </div>
            )}
            {task.completion_time && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Completed</p>
                <p className="mt-1 text-sm text-[#172B3A]">{formatDateTime(task.completion_time)}</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-[#F5F7FA] rounded border border-[#D9E1E8]">
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Fault Description</p>
            <p className="text-sm text-[#172B3A] mt-1">{task.fault_description}</p>
          </div>

          {task.cause && (
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Cause</p>
              <p className="text-sm text-[#172B3A] mt-1">{task.cause}</p>
            </div>
          )}

          {task.work_description && (
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Work Description</p>
              <p className="text-sm text-[#172B3A] mt-1 whitespace-pre-line">{task.work_description}</p>
            </div>
          )}

          {/* Linked entities */}
          <div className="flex gap-3 flex-wrap">
            {asset && (
              <Link to={`/assets/${asset.id}`} className="text-xs btn-secondary py-1">
                View Asset: {asset.asset_id}
              </Link>
            )}
            {inspection && (
              <Link to={`/inspections/${inspection.id}`} className="text-xs btn-secondary py-1">
                View Inspection: {inspection.inspection_ref}
              </Link>
            )}
          </div>

          {/* Status actions */}
          <div className="flex gap-3 flex-wrap pt-2 border-t border-[#D9E1E8]">
            {task.status === 'OPEN' && (
              <button onClick={() => advanceStatus('ASSIGNED')} disabled={updating} className="btn-primary">
                Assign Task
              </button>
            )}
            {task.status === 'ASSIGNED' && (
              <button onClick={() => advanceStatus('IN_PROGRESS')} disabled={updating} className="btn-primary">
                <Clock className="w-4 h-4" /> Start Work
              </button>
            )}
            {task.status === 'IN_PROGRESS' && (
              <button onClick={() => advanceStatus('VERIFICATION_REQUIRED')} disabled={updating} className="btn-primary">
                <CheckCircle className="w-4 h-4" /> Complete — Requires Verification
              </button>
            )}
            {task.status === 'VERIFICATION_REQUIRED' && (
              <button onClick={() => advanceStatus('VERIFIED')} disabled={updating} className="btn-primary">
                <CheckCircle className="w-4 h-4" /> Verify & Close
              </button>
            )}
            {task.status === 'VERIFIED' && (
              <button onClick={() => advanceStatus('CLOSED')} disabled={updating} className="btn-ghost">
                Close Task
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Verifications */}
      <div className="card">
        <div className="card-header">
          <h3 className="section-title">Verification Records</h3>
        </div>
        <div className="card-body">
          {verifications.length === 0 ? (
            <p className="text-sm text-[#64748B]">No verifications recorded yet.</p>
          ) : verifications.map(v => (
            <div key={v.id} className={`p-3 rounded border mb-3 ${v.result === 'PASSED' ? 'bg-green-50 border-green-200'
              : v.result === 'FAILED' ? 'bg-red-50 border-red-200'
                : 'bg-amber-50 border-amber-200'
              }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${v.result === 'PASSED' ? 'text-green-700'
                  : v.result === 'FAILED' ? 'text-red-700'
                    : 'text-amber-700'
                  }`}>{v.result}</span>
                <span className="text-xs text-[#64748B]">{formatDateTime(v.verification_date)}</span>
              </div>
              <p className="text-sm text-[#172B3A] mt-1">Verified by: {v.verified_by}</p>
              {v.notes && <p className="text-xs text-[#64748B] mt-1">{v.notes}</p>}
              {v.tc_status_confirmed && (
                <p className="text-xs text-[#64748B] mt-1">TC Status confirmed: <strong>{v.tc_status_confirmed}</strong></p>
              )}
              {v.post_strain_reading && (
                <p className="text-xs text-[#64748B] mt-1">Post-maintenance strain: <strong>{v.post_strain_reading} µε</strong></p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Maintenance() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ACTIVE');

  useEffect(() => {
    getMaintenanceTasks().then(setTasks).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (id) return <MaintenanceDetail taskId={id} />;

  const activeStatuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'VERIFICATION_REQUIRED'];
  const filtered = filter === 'ALL' ? tasks
    : filter === 'ACTIVE' ? tasks.filter(t => activeStatuses.includes(t.status))
      : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-4">
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {['ACTIVE', 'ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'VERIFICATION_REQUIRED', 'VERIFIED', 'CLOSED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === f ? 'bg-[#145DA0] text-white border-[#145DA0]'
                : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
                }`}
            >
              {f.replace('_', ' ')}
              {!['ALL', 'ACTIVE'].includes(f) && ` (${tasks.filter(t => t.status === f).length})`}
            </button>
          ))}
        </div>
        <SimBadge />
      </div>

      {/* Workflow reminder */}
      <div className="card p-4 bg-[#F5F7FA]">
        <p className="text-xs text-[#64748B] font-medium">
          Maintenance Workflow: Alert → Investigation → Inspection → <strong>Maintenance</strong> → Verification → Resolution
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map(task => (
          <Link key={task.id} to={`/maintenance/${task.id}`} className="card block hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={maintenanceStatusBadge(task.status)}>{task.status.replace('_', ' ')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium border ${task.priority === 'URGENT' ? 'bg-red-50 text-red-700 border-red-200'
                      : task.priority === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>{task.priority}</span>
                    <span className="text-xs font-mono text-[#64748B]">{task.maintenance_ref}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#172B3A] mt-1">{task.title}</p>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{task.fault_description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                    {task.assigned_technician && <span>Tech: {task.assigned_technician}</span>}
                    <span>{formatRelative(task.created_at)}</span>
                  </div>
                </div>
                <Wrench className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-1" />
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-[#64748B]">No maintenance tasks for this filter.</div>
        )}
      </div>
    </div>
  );
}
