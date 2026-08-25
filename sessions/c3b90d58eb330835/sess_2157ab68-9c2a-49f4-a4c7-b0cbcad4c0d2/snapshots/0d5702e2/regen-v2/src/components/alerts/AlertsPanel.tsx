import { useAssets } from '../../context/AssetContext';
import { useAuth } from '../../context/AuthContext';
import { hasPermission } from '../../utils/permissions';
import { sortBySeverity, SEVERITY_COLOR } from '../../utils/severity';
import { SeverityBadge, EmptyState } from '../ui';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle } from 'lucide-react';

interface Props {
  onAlertClick?: (assetId: string, sensorId?: string) => void;
}

export function AlertsPanel({ onAlertClick }: Props) {
  const { alerts, acknowledgeAlert, selectAsset, selectSensor } = useAssets();
  const { user } = useAuth();
  const canAck = user ? hasPermission(user.role, 'canAcknowledgeAlert') : false;

  const sorted = sortBySeverity(
    [...alerts].filter(a => a.status !== 'resolved')
  );

  const handleClick = (assetId: string, sensorId?: string) => {
    selectAsset(assetId);
    if (sensorId) selectSensor(sensorId);
    onAlertClick?.(assetId, sensorId);
  };

  return (
    <aside
      className="flex flex-col bg-surface border-l border-border flex-shrink-0 overflow-hidden"
      style={{ width: 300 }}
      aria-label="Alerts panel"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2 flex-shrink-0">
        <Bell className="w-3.5 h-3.5 text-warning" />
        <span className="section-title">Alerts</span>
        <span
          className="ml-auto text-xs font-mono px-1.5 py-0.5 rounded"
          style={{
            color: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length > 0
              ? '#FF3B3B' : '#A0A0A0',
            background: 'rgba(255,59,59,0.1)',
          }}
        >
          {alerts.filter(a => a.status === 'active').length} active
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {sorted.length === 0 ? (
          <EmptyState icon="✓" title="No active alerts" subtitle="Network operating normally" />
        ) : (
          sorted.map(alert => (
            <button
              key={alert.id}
              onClick={() => handleClick(alert.assetId, alert.sensorId)}
              className="w-full text-left px-3 py-3 hover:bg-surface2 transition-colors group"
            >
              <div className="flex items-start gap-2">
                {/* Severity stripe */}
                <div
                  className="w-0.5 self-stretch rounded-full mt-0.5 flex-shrink-0"
                  style={{ background: SEVERITY_COLOR[alert.severity] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge level={alert.severity} />
                    {alert.status === 'acknowledged' && (
                      <span className="text-[10px] font-mono text-text-dim px-1 border border-border rounded">
                        ACK
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono font-semibold text-text-primary leading-snug">
                    {alert.title}
                  </p>
                  <p className="text-[10px] text-text-dim mt-1 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                  <p className="text-[10px] text-text-dim mt-1.5 font-mono">
                    {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                  </p>

                  {/* Acknowledge button */}
                  {canAck && alert.status === 'active' && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        acknowledgeAlert(alert.id, user?.name ?? 'Unknown');
                      }}
                      className="mt-2 flex items-center gap-1 text-[10px] font-mono text-text-dim
                        hover:text-cyan transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
