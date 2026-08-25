import { useAssets } from '../context/AssetContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { hasPermission } from '../utils/permissions';
import { sortBySeverity, SEVERITY_COLOR } from '../utils/severity';
import { SeverityBadge, EmptyState } from '../components/ui';
import { format, formatDistanceToNow } from 'date-fns';
import { CheckCircle, MapPin } from 'lucide-react';

export function AlertsPage() {
  const { alerts, acknowledgeAlert, resolveAlert, selectAsset, selectSensor } = useAssets();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canAck = user ? hasPermission(user.role, 'canAcknowledgeAlert') : false;

  const sorted = sortBySeverity([...alerts]);

  const statusFilter = (status: 'active' | 'acknowledged' | 'resolved') =>
    sorted.filter(a => a.status === status);

  const Section = ({ title, items, color }: {
    title: string;
    items: typeof sorted;
    color?: string;
  }) => (
    <div>
      <h2 className="section-title mb-3" style={color ? { color } : undefined}>
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="text-xs text-text-dim font-mono mb-6">None</p>
      ) : (
        <div className="space-y-2 mb-6">
          {items.map(alert => (
            <div
              key={alert.id}
              className="panel p-4 transition-colors"
              style={{ borderLeftWidth: 3, borderLeftColor: SEVERITY_COLOR[alert.severity] }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <SeverityBadge level={alert.severity} />
                    <span className="text-[10px] font-mono text-text-dim">
                      {alert.id}
                    </span>
                    {alert.sensorId && (
                      <span className="text-[10px] font-mono text-cyan/70">
                        {alert.sensorId}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-mono font-semibold text-text-primary mb-1">
                    {alert.title}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-text-dim">
                    <span>{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</span>
                    {alert.acknowledgedBy && (
                      <span>Acked by: {alert.acknowledgedBy}</span>
                    )}
                    {alert.resolvedAt && (
                      <span>Resolved: {format(new Date(alert.resolvedAt), 'HH:mm dd/MM')}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      selectAsset(alert.assetId);
                      if (alert.sensorId) selectSensor(alert.sensorId);
                      navigate('/map');
                    }}
                    className="btn-ghost text-xs gap-1"
                    title="View on map"
                  >
                    <MapPin className="w-3 h-3" />
                    Map
                  </button>
                  {canAck && alert.status === 'active' && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id, user?.name ?? 'Unknown')}
                      className="btn-ghost text-xs gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Ack
                    </button>
                  )}
                  {canAck && alert.status === 'acknowledged' && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="btn-ghost text-xs gap-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="max-w-3xl">
        <h1 className="text-sm font-mono font-semibold text-text-primary mb-4">
          Alerts — {alerts.length} total
        </h1>

        {alerts.length === 0 ? (
          <EmptyState icon="✓" title="No active alerts" subtitle="Network operating normally" />
        ) : (
          <>
            <Section
              title="Active"
              items={statusFilter('active')}
              color="#FF3B3B"
            />
            <Section
              title="Acknowledged"
              items={statusFilter('acknowledged')}
              color="#FFB020"
            />
            <Section
              title="Resolved"
              items={statusFilter('resolved')}
            />
          </>
        )}
      </div>
    </div>
  );
}
