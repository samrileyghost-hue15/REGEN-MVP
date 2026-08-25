export function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto p-4">
      <h1 className="text-sm font-mono font-semibold text-text-primary mb-4">System Settings</h1>
      <div className="panel p-5 max-w-lg space-y-4 text-xs font-mono">
        <div>
          <p className="section-title mb-3">System Configuration</p>
          <div className="space-y-3">
            {[
              ['System Name', 'REGEN Railway Monitor'],
              ['Version', 'MVP v0.2.0'],
              ['Data Mode', 'Simulated (Local Mock)'],
              ['MQTT Broker', 'Simulated'],
              ['Sensor Poll Interval', '30 seconds'],
              ['Alert Threshold', 'Per-sensor configuration'],
            ].map(([k, v]) => (
              <div key={k} className="data-row border-b border-border pb-2">
                <span className="data-label">{k}</span>
                <span className="data-value">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 rounded border border-border bg-surface2 text-text-dim">
          <p className="font-semibold text-text-secondary mb-1">MVP Notice</p>
          <p className="leading-relaxed">
            This system uses simulated data. For production deployment, configure Supabase connection,
            MQTT broker, and replace mock data with live sensor feeds.
          </p>
        </div>
      </div>
    </div>
  );
}
