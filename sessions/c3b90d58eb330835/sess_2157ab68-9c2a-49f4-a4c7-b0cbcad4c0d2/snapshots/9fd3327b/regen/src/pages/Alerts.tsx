import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getAlerts, getAlert, updateAlertStatus } from '../lib/dataService';
import type { Alert } from '../types';
import {
  alertPriorityBadge, alertStatusBadge,
  formatDateTime, formatRelative
} from '../lib/utils';

const SOURCE_LABELS: Record<string, string> = {
  TRACK_CIRCUIT: 'Track Circuit',
  FBG_SENSOR: 'FBG Sensor',
  ASSET: 'Asset',
  COMMUNICATION: 'Communication',
  MAINTENANCE: 'Maintenance',
  COMBINED: 'Combined',
};

function AlertDetail({ alertId }: { alertId: string }) {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getAlert(alertId).then(setAlert).finally(() => setLoading(false));
  }, [alertId]);

  const handleAcknowledge = async () => {
    if (!alert) return;
    setUpdating(true);
    await updateAlertStatus(alert.id, 'ACKNOWLEDGED', 'Current User');
    const updated = await getAlert(alertId);
    setAlert(updated);
    setUpdating(false);
  };

  const handleResolve = async () => {
    if (!alert) return;
    setUpdating(true);
    await updateAlertStatus(alert.id, 'RESOLVED');
    const updated = await getAlert(alertId);
    setAlert(updated);
    setUpdating(false);
  };

  if (loading) return <PageLoading />;
  if (!alert) return <div className="p-8 text-center text-[#64748B]">Alert not found.</div>;

  const borderColor = {
    REQUIRES_VERIFICATION: 'border-l-purple-500',
    CRITICAL: 'border-l-critical',
    HIGH: 'border-l-warning',
    WARNING: 'border-l-warning',
    NORMAL: 'border-l-healthy',
    OFFLINE: 'border-l-offline',
  }[alert.priority] ?? 'border-l-gray-300';

  return (
    <div className="space-y-6">
      <Link to="/alerts" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Alerts
      </Link>

      <div className={`card border-l-4 ${borderColor}`}>
        <div className="card-header flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={alertPriorityBadge(alert.priority)}>{alert.priority.replace('_', ' ')}</span>
              <span className={alertStatusBadge(alert.status)}>{alert.status}</span>
              <span className="text-sm font-mono text-[#64748B]">{alert.alert_ref}</span>
              <SimBadge />
            </div>
            <h2 className="text-lg font-bold text-[#172B3A] mt-2">{alert.title}</h2>
            <p className="text-xs text-[#64748B] mt-1">
              Source: <strong>{SOURCE_LABELS[alert.source_type] ?? alert.source_type}</strong>
              · Created: {formatDateTime(alert.created_at)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {alert.status === 'OPEN' && (
              <button onClick={handleAcknowledge} disabled={updating} className="btn-secondary">
                <CheckCircle className="w-4 h-4" /> Acknowledge
              </button>
            )}
            {['OPEN', 'ACKNOWLEDGED', 'INVESTIGATING'].includes(alert.status) && (
              <button onClick={handleResolve} disabled={updating} className="btn-primary">
                <CheckCircle className="w-4 h-4" /> Mark Resolved
              </button>
            )}
          </div>
        </div>

        <div className="card-body space-y-4">
          <div className="p-4 bg-[#F5F7FA] rounded border border-[#D9E1E8]">
            <p className="text-sm text-[#172B3A] leading-relaxed">{alert.description}</p>
          </div>

          {alert.acknowledged_by && (
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <CheckCircle className="w-4 h-4 text-healthy" />
              Acknowledged by <strong>{alert.acknowledged_by}</strong>
              {alert.acknowledged_at && <span>· {formatRelative(alert.acknowledged_at)}</span>}
            </div>
          )}

          {/* Linked entities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {alert.track_circuit_id && (
              <div className="p-3 rounded border border-[#D9E1E8] bg-white">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Track Circuit</p>
                <Link to={`/track-circuits/${alert.track_circuit_id}`} className="text-sm font-semibold text-[#145DA0] hover:underline">
                  View Track Circuit →
                </Link>
                <p className="text-xs text-[#64748B] mt-1">
                  READ-ONLY status data. REGEN does not control track circuits.
                </p>
              </div>
            )}
            {alert.asset_id && (
              <div className="p-3 rounded border border-[#D9E1E8] bg-white">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Infrastructure Asset</p>
                <Link to={`/assets/${alert.asset_id}`} className="text-sm font-semibold text-[#145DA0] hover:underline">
                  View Asset →
                </Link>
              </div>
            )}
            {alert.sensor_id && (
              <div className="p-3 rounded border border-[#D9E1E8] bg-white">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">FBG Sensor</p>
                <Link to={`/fbg/${alert.sensor_id}`} className="text-sm font-semibold text-[#145DA0] hover:underline">
                  View Sensor & Chart →
                </Link>
                <p className="text-xs text-[#64748B] mt-1">Structural strain data — separate evidence source.</p>
              </div>
            )}
          </div>

          {/* Create inspection CTA */}
          {['OPEN', 'INVESTIGATING'].includes(alert.status) && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Physical verification may be required</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Create a field inspection task to send a technician to physically verify the reported issue.
                  </p>
                  <div className="mt-3 flex gap-3 flex-wrap">
                    <Link to={`/inspections?alert=${alert.id}`} className="btn-primary text-xs">
                      Create Inspection Task
                    </Link>
                    <Link to="/maintenance" className="btn-secondary text-xs">
                      Create Maintenance Task
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Alerts() {
  const { id } = useParams();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getAlerts().then(data => {
      setAlerts(data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (id) return <AlertDetail alertId={id} />;

  const filtered = filter === 'ALL'
    ? alerts
    : alerts.filter(a => a.status === filter || a.priority === filter);

  const openCount = alerts.filter(a => ['OPEN', 'INVESTIGATING'].includes(a.status)).length;

  return (
    <div className="space-y-4">
      {openCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <p className="text-sm text-amber-800">
            <strong>{openCount} alert{openCount !== 1 ? 's' : ''}</strong> require attention.
            All data is SIMULATED — MVP prototype only.
          </p>
        </div>
      )}

      <div className="card p-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-[#172B3A]">Filter:</span>
        {['ALL', 'OPEN', 'INVESTIGATING', 'ACKNOWLEDGED', 'RESOLVED', 'CLOSED'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              filter === f ? 'bg-[#145DA0] text-white border-[#145DA0]'
              : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
            }`}
          >
            {f} {f !== 'ALL' && `(${alerts.filter(a => a.status === f).length})`}
          </button>
        ))}
        <div className="ml-auto"><SimBadge /></div>
      </div>

      <div className="space-y-3">
        {filtered.map(alert => (
          <Link
            key={alert.id}
            to={`/alerts/${alert.id}`}
            className="card block hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                  alert.priority === 'CRITICAL' || alert.priority === 'REQUIRES_VERIFICATION' ? 'bg-critical'
                  : alert.priority === 'HIGH' || alert.priority === 'WARNING' ? 'bg-warning'
                  : alert.status === 'CLOSED' ? 'bg-[#D9E1E8]'
                  : 'bg-healthy'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={alertPriorityBadge(alert.priority)}>{alert.priority.replace('_', ' ')}</span>
                    <span className={alertStatusBadge(alert.status)}>{alert.status}</span>
                    <span className="text-xs font-mono text-[#64748B]">{alert.alert_ref}</span>
                    <span className="text-xs text-[#64748B]">· {SOURCE_LABELS[alert.source_type]}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#172B3A] mt-1">{alert.title}</p>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{alert.description}</p>
                  <p className="text-xs text-[#64748B] mt-1">{formatRelative(alert.created_at)}</p>
                </div>
                <span className="text-[#145DA0] text-sm flex-shrink-0">→</span>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="card p-8 text-center text-[#64748B]">No alerts for this filter.</div>
        )}
      </div>
    </div>
  );
}
