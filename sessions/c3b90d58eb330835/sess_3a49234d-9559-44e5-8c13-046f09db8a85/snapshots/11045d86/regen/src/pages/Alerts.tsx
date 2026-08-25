import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, Search } from 'lucide-react';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getAlerts, getAlert, updateAlertStatus } from '../lib/dataService';
import type { Alert } from '../types';
import {
  alertPriorityBadge, alertStatusBadge,
  formatDateTime, formatRelative,
} from '../lib/utils';

// -------------------------------------------------------
// Alert Detail
// -------------------------------------------------------
function AlertDetail({ alertId }: { alertId: string }) {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ackBy, setAckBy] = useState('');

  useEffect(() => {
    getAlert(alertId).then(setAlert).finally(() => setLoading(false));
  }, [alertId]);

  const advance = async (status: Alert['status']) => {
    if (!alert) return;
    setUpdating(true);
    await updateAlertStatus(alert.id, status, status === 'ACKNOWLEDGED' ? (ackBy || 'Engineer') : undefined);
    const updated = await getAlert(alertId);
    setAlert(updated);
    setUpdating(false);
  };

  if (loading) return <PageLoading />;
  if (!alert) return <div className="p-8 text-center text-[#64748B]">Alert not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/alerts" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Alerts
      </Link>

      {/* Header card */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={alertPriorityBadge(alert.priority)}>{alert.priority.replace('_', ' ')}</span>
            <span className={alertStatusBadge(alert.status)}>{alert.status.replace('_', ' ')}</span>
            <span className="text-sm font-mono text-[#64748B]">{alert.alert_ref}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#F5F7FA] border border-[#D9E1E8] text-[#64748B]">
              {alert.source_type.replace('_', ' ')}
            </span>
            <SimBadge />
          </div>
          <h2 className="text-lg font-bold text-[#172B3A] mt-2">{alert.title}</h2>
        </div>

        <div className="card-body space-y-4">
          <div className="p-3 bg-[#F5F7FA] rounded border border-[#D9E1E8]">
            <p className="text-sm text-[#172B3A] leading-relaxed">{alert.description}</p>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Created</p>
              <p className="mt-1 text-sm text-[#172B3A]">{formatDateTime(alert.created_at)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Updated</p>
              <p className="mt-1 text-sm text-[#172B3A]">{formatRelative(alert.updated_at)}</p>
            </div>
            {alert.acknowledged_by && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Acknowledged By</p>
                <p className="mt-1 text-sm text-[#172B3A]">{alert.acknowledged_by}</p>
              </div>
            )}
            {alert.acknowledged_at && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Acknowledged At</p>
                <p className="mt-1 text-sm text-[#172B3A]">{formatDateTime(alert.acknowledged_at)}</p>
              </div>
            )}
            {alert.resolved_at && (
              <div>
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Resolved At</p>
                <p className="mt-1 text-sm text-[#172B3A]">{formatDateTime(alert.resolved_at)}</p>
              </div>
            )}
          </div>

          {/* Linked entities */}
          <div className="flex gap-3 flex-wrap">
            {alert.track_circuit_id && (
              <Link to={`/track-circuits/${alert.track_circuit_id}`} className="text-xs btn-secondary py-1">
                View Track Circuit
              </Link>
            )}
            {alert.asset_id && (
              <Link to={`/assets/${alert.asset_id}`} className="text-xs btn-secondary py-1">
                View Asset
              </Link>
            )}
            {alert.sensor_id && (
              <Link to={`/fbg/${alert.sensor_id}`} className="text-xs btn-secondary py-1">
                View FBG Sensor
              </Link>
            )}
          </div>

          {/* Status actions */}
          <div className="flex gap-3 flex-wrap items-end pt-2 border-t border-[#D9E1E8]">
            {alert.status === 'OPEN' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#64748B] font-medium">Acknowledged by</label>
                  <input
                    className="border border-[#D9E1E8] rounded px-2 py-1 text-sm focus:outline-none focus:border-[#145DA0]"
                    placeholder="Engineer name"
                    value={ackBy}
                    onChange={e => setAckBy(e.target.value)}
                  />
                </div>
                <button onClick={() => advance('ACKNOWLEDGED')} disabled={updating} className="btn-primary">
                  <CheckCircle className="w-4 h-4" /> Acknowledge
                </button>
              </>
            )}
            {alert.status === 'ACKNOWLEDGED' && (
              <button onClick={() => advance('INVESTIGATING')} disabled={updating} className="btn-primary">
                <Search className="w-4 h-4" /> Start Investigation
              </button>
            )}
            {alert.status === 'INVESTIGATING' && (
              <>
                <button onClick={() => advance('RESOLVED')} disabled={updating} className="btn-primary">
                  <CheckCircle className="w-4 h-4" /> Mark Resolved
                </button>
                <button onClick={() => advance('FALSE_ALARM')} disabled={updating} className="btn-ghost">
                  False Alarm
                </button>
              </>
            )}
            {(alert.status === 'RESOLVED') && (
              <button onClick={() => advance('CLOSED')} disabled={updating} className="btn-ghost">
                Close Alert
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------
// Alerts List
// -------------------------------------------------------
export function Alerts() {
  const { id } = useParams();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ACTIVE');

  useEffect(() => {
    getAlerts().then(setAlerts).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (id) return <AlertDetail alertId={id} />;

  const activeStatuses = ['OPEN', 'ACKNOWLEDGED', 'INVESTIGATING'];
  const filtered = filter === 'ALL' ? alerts
    : filter === 'ACTIVE' ? alerts.filter(a => activeStatuses.includes(a.status))
      : alerts.filter(a => a.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {['ACTIVE', 'ALL', 'OPEN', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED', 'CLOSED', 'FALSE_ALARM'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                filter === f
                  ? 'bg-[#145DA0] text-white border-[#145DA0]'
                  : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
              }`}
            >
              {f.replace('_', ' ')}
              {!['ALL', 'ACTIVE'].includes(f) && ` (${alerts.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>
        <SimBadge />
      </div>

      {/* Workflow reminder */}
      <div className="card p-4 bg-[#F5F7FA]">
        <p className="text-xs text-[#64748B] font-medium">
          Alert Workflow: <strong>Alert</strong> → Investigation → Inspection → Maintenance → Verification → Resolution
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map(alert => (
          <Link key={alert.id} to={`/alerts/${alert.id}`} className="card block hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 text-[#64748B] flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={alertPriorityBadge(alert.priority)}>
                      {alert.priority.replace('_', ' ')}
                    </span>
                    <span className={alertStatusBadge(alert.status)}>
                      {alert.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#F5F7FA] border border-[#D9E1E8] text-[#64748B]">
                      {alert.source_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">{alert.alert_ref}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#172B3A] mt-1">{alert.title}</p>
                  <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#64748B]">
                    {alert.acknowledged_by && <span>Ack: {alert.acknowledged_by}</span>}
                    <span>{formatRelative(alert.created_at)}</span>
                  </div>
                </div>
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
