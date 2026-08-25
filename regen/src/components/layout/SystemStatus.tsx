import { useAssets } from '../../context/AssetContext';
import { format } from 'date-fns';

export function SystemStatus() {
  const { sensors, alerts } = useAssets();
  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const total = sensors.length;
  const now = format(new Date(), 'HH:mm');

  return (
    <div className="flex items-center gap-6 px-4 py-1.5 bg-surface border-b border-border text-xs font-mono">
      <StatusItem color="#39FF14" label="System Online" />
      <StatusItem color="#00D1FF" label="MQTT Connected" />
      <StatusItem color="#00FFC6" label={`${onlineCount} / ${total} Sensors Active`} />
      <StatusItem color={alerts.filter(a => a.status === 'active').length > 0 ? '#FFB020' : '#39FF14'}
        label={`${alerts.filter(a => a.status === 'active').length} Active Alerts`} />
      <span className="text-text-dim ml-auto">Last Update: {now}</span>
    </div>
  );
}

function StatusItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-text-secondary">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      {label}
    </span>
  );
}
