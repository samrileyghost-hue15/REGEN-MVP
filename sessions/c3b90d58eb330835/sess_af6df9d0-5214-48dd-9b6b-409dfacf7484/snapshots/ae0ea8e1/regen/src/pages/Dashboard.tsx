import { useAssets } from '../context/AssetContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { StatCard, SeverityBadge, EmptyState } from '../components/ui';
import { sortBySeverity, SEVERITY_COLOR } from '../utils/severity';
import { getPredictionForAsset } from '../data/predictions';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Wrench, Activity, Radio, TrendingDown } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { assets, sensors, alerts, workOrders, selectAsset } = useAssets();
  const navigate = useNavigate();

  // KPI calculations
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical');
  const onlineSensors = sensors.filter(s => s.status === 'online').length;
  const totalSensors = sensors.length;
  const openWorkOrders = workOrders.filter(w => w.status === 'open' || w.status === 'in_progress');
  const criticalAssets = assets.filter(a => a.severity === 'critical' || a.severity === 'warning');
  const predictedIssues = ['B12','A3','S04','F5','P1'].filter(id => getPredictionForAsset(id));

  // Network health: 100 - (critical*10 + warning*3 + info*1)
  const health = Math.max(0, 100
    - assets.filter(a => a.severity === 'critical').length * 10
    - assets.filter(a => a.severity === 'warning').length * 3
    - assets.filter(a => a.severity === 'info').length * 1
  );
  const healthColor = health >= 80 ? '#39FF14' : health >= 60 ? '#FFB020' : '#FF3B3B';

  const sortedAlerts = sortBySeverity(activeAlerts).slice(0, 6);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-mono font-semibold text-text-primary">
            Welcome back, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-text-dim font-mono mt-0.5">
            {new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="btn-secondary text-xs gap-1.5"
        >
          <Activity className="w-3.5 h-3.5" />
          Open Network Map
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          label="Network Health"
          value={health}
          unit="/ 100"
          sub={health >= 80 ? 'Operating normally' : 'Degraded performance'}
          color={healthColor}
        />
        <StatCard
          label="Active Alerts"
          value={activeAlerts.length}
          sub={`${criticalAlerts.length} critical`}
          color={criticalAlerts.length > 0 ? '#FF3B3B' : '#FFB020'}
          onClick={() => navigate('/alerts')}
        />
        <StatCard
          label="Critical"
          value={criticalAlerts.length}
          sub="Require immediate action"
          color="#FF3B3B"
          onClick={() => navigate('/alerts')}
        />
        <StatCard
          label="Sensors Online"
          value={`${onlineSensors} / ${totalSensors}`}
          sub={`${totalSensors - onlineSensors} offline`}
          color={onlineSensors === totalSensors ? '#39FF14' : '#FFB020'}
        />
        <StatCard
          label="Predicted Issues"
          value={predictedIssues.length}
          sub="Requiring attention"
          color="#00D1FF"
          onClick={() => navigate('/assets')}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Active alerts */}
        <div className="panel lg:col-span-2">
          <div className="panel-header">
            <span className="section-title flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
              Active Alerts
            </span>
            <button onClick={() => navigate('/alerts')} className="btn-ghost">
              View all →
            </button>
          </div>
          <div className="divide-y divide-border">
            {sortedAlerts.length === 0 ? (
              <EmptyState icon="✓" title="No active alerts" subtitle="Network operating normally" />
            ) : sortedAlerts.map(alert => (
              <button
                key={alert.id}
                onClick={() => {
                  selectAsset(alert.assetId);
                  navigate('/map');
                }}
                className="w-full text-left px-4 py-3 hover:bg-surface2 transition-colors flex items-start gap-3"
              >
                <div
                  className="w-1 self-stretch rounded-full mt-0.5 flex-shrink-0"
                  style={{ background: SEVERITY_COLOR[alert.severity] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SeverityBadge level={alert.severity} />
                    <span className="text-xs font-mono text-text-dim">
                      {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm font-mono text-text-primary truncate">{alert.title}</p>
                  <p className="text-xs text-text-dim mt-0.5 line-clamp-1">{alert.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Predicted issues */}
          <div className="panel">
            <div className="panel-header">
              <span className="section-title flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-info" />
                Predicted Issues
              </span>
            </div>
            <div className="p-3 space-y-2">
              {predictedIssues.map(id => {
                const pred = getPredictionForAsset(id);
                if (!pred) return null;
                const asset = assets.find(a => a.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => { selectAsset(id); navigate('/map'); }}
                    className="w-full text-left p-2.5 rounded border border-border hover:border-cyan/30 hover:bg-surface2 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-semibold text-text-primary">{asset?.name ?? id}</span>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                        style={{
                          color: pred.riskLevel === 'high' ? '#FF3B3B' : pred.riskLevel === 'medium' ? '#FFB020' : '#39FF14',
                          background: pred.riskLevel === 'high' ? 'rgba(255,59,59,0.1)' : pred.riskLevel === 'medium' ? 'rgba(255,176,32,0.1)' : 'rgba(57,255,20,0.1)',
                        }}
                      >
                        {pred.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-text-dim truncate">{pred.issue}</p>
                    <p className="text-[10px] font-mono text-info mt-1">RUL: {pred.rulDays} days</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent work orders */}
          <div className="panel">
            <div className="panel-header">
              <span className="section-title flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-cyan" />
                Work Orders
              </span>
              <button onClick={() => navigate('/work-orders')} className="btn-ghost">All →</button>
            </div>
            <div className="divide-y divide-border">
              {openWorkOrders.length === 0 ? (
                <EmptyState title="No active work orders" />
              ) : openWorkOrders.slice(0, 4).map(wo => (
                <div key={wo.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-cyan">{wo.id}</span>
                    <StatusPill status={wo.status} />
                  </div>
                  <p className="text-xs text-text-primary truncate">{wo.title}</p>
                  <p className="text-[10px] text-text-dim mt-0.5 font-mono">{wo.assignedTeam}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critical assets strip */}
      {criticalAssets.length > 0 && (
        <div className="panel">
          <div className="panel-header">
            <span className="section-title flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-critical" />
              Assets Requiring Attention
            </span>
          </div>
          <div className="flex gap-3 p-3 overflow-x-auto">
            {criticalAssets.map(asset => (
              <button
                key={asset.id}
                onClick={() => { selectAsset(asset.id); navigate('/map'); }}
                className="flex-shrink-0 p-3 rounded border border-border hover:border-cyan/30 hover:bg-surface2 transition-all text-left"
                style={{ minWidth: 150 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge level={asset.severity} />
                </div>
                <p className="text-xs font-mono font-semibold text-text-primary mt-1">{asset.name}</p>
                <p className="text-[10px] text-text-dim">{asset.location.split(',')[0]}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, { color: string; bg: string }> = {
    open:        { color: '#FF3B3B', bg: 'rgba(255,59,59,0.12)' },
    in_progress: { color: '#00D1FF', bg: 'rgba(0,209,255,0.12)' },
    resolved:    { color: '#39FF14', bg: 'rgba(57,255,20,0.10)' },
    closed:      { color: '#666666', bg: 'rgba(102,102,102,0.12)' },
  };
  const s = styles[status] ?? styles.open;
  return (
    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ color: s.color, background: s.bg }}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}
