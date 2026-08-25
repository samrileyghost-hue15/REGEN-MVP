import { useState } from 'react';
import { useAssets } from '../../context/AssetContext';
import { useAuth } from '../../context/AuthContext';
import type { Asset, Sensor, Prediction, WorkOrderPriority } from '../../types';
import { X, CheckCircle } from 'lucide-react';

interface Props {
  asset: Asset;
  sensor?: Sensor;
  prediction?: Prediction;
  onClose: () => void;
}

export function WorkOrderModal({ asset, sensor, prediction, onClose }: Props) {
  const { addWorkOrder } = useAssets();
  const { user } = useAuth();

  const [priority, setPriority] = useState<WorkOrderPriority>(
    asset.severity === 'critical' ? 'critical'
    : asset.severity === 'warning' ? 'high' : 'medium'
  );
  const [team, setTeam] = useState('Maintenance Team Alpha');
  const [notes, setNotes] = useState('');
  const [created, setCreated] = useState(false);
  const [woId, setWoId] = useState('');

  const handleCreate = () => {
    const id = `WO-${1050 + Math.floor(Math.random() * 900)}`;
    setWoId(id);
    addWorkOrder({
      id,
      assetId: asset.id,
      predictionId: prediction?.id,
      title: `${asset.name} — ${sensor ? sensor.type + ' issue' : 'maintenance required'}`,
      description: prediction
        ? prediction.recommendedAction
        : `Maintenance required on ${asset.name}. Asset status: ${asset.severity}.`,
      priority,
      status: 'open',
      assignedTeam: team,
      assignedTo: user?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes || undefined,
    });
    setCreated(true);
  };

  const TEAMS = [
    'Maintenance Team Alpha',
    'Maintenance Team Beta',
    'Maintenance Team Gamma',
    'Bridge Inspection Unit',
    'Signal & Switch Team',
  ];

  const PRIORITY_OPTS: { value: WorkOrderPriority; label: string; color: string }[] = [
    { value: 'critical', label: 'Critical', color: '#FF3B3B' },
    { value: 'high',     label: 'High',     color: '#FFB020' },
    { value: 'medium',   label: 'Medium',   color: '#00D1FF' },
    { value: 'low',      label: 'Low',      color: '#39FF14' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wo-modal-title"
    >
      <div
        className="w-full max-w-md rounded border font-mono"
        style={{
          background: '#111111',
          borderColor: 'rgba(0,255,198,0.25)',
          boxShadow: '0 0 40px rgba(0,255,198,0.1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 id="wo-modal-title" className="section-title text-sm">
            {created ? 'WORK ORDER CREATED' : 'CREATE WORK ORDER'}
          </h2>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-text-primary transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!created ? (
          /* Creation form */
          <div className="p-5 space-y-4">
            <div className="p-3 rounded border border-border bg-surface2">
              <div className="flex items-center justify-between mb-2">
                <span className="data-label">Asset</span>
                <span className="text-sm font-semibold text-text-primary">{asset.name}</span>
              </div>
              {sensor && (
                <div className="flex items-center justify-between mb-2">
                  <span className="data-label">Issue</span>
                  <span className="text-sm text-warning capitalize">
                    {sensor.severity} {sensor.type}
                  </span>
                </div>
              )}
              {prediction && (
                <div className="flex items-center justify-between">
                  <span className="data-label">Prediction</span>
                  <span className="text-xs text-info">RUL: {prediction.rulDays}d</span>
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="data-label block mb-2">Priority</label>
              <div className="grid grid-cols-4 gap-2">
                {PRIORITY_OPTS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setPriority(opt.value)}
                    className={`py-2 rounded border text-xs transition-all ${
                      priority === opt.value ? 'border-current' : 'border-border opacity-50'
                    }`}
                    style={{ color: opt.color, background: priority === opt.value ? `${opt.color}15` : 'transparent' }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Team */}
            <div>
              <label className="data-label block mb-2" htmlFor="wo-team">Assigned Team</label>
              <select
                id="wo-team"
                value={team}
                onChange={e => setTeam(e.target.value)}
                className="regen-select"
              >
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="data-label block mb-2" htmlFor="wo-notes">Notes (optional)</label>
              <textarea
                id="wo-notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="regen-input resize-none"
                rows={2}
                placeholder="Additional context or instructions…"
              />
            </div>

            <button onClick={handleCreate} className="btn-primary w-full justify-center py-2.5">
              CREATE WORK ORDER
            </button>
          </div>
        ) : (
          /* Success state */
          <div className="p-5 text-center space-y-4">
            <CheckCircle className="w-10 h-10 mx-auto" style={{ color: '#00FFC6' }} />
            <div>
              <p className="text-sm font-bold text-cyan tracking-widest">✓ WORK ORDER CREATED</p>
              <p className="text-2xl font-bold text-text-primary mt-2">{woId}</p>
            </div>
            <div className="p-3 rounded border border-border bg-surface2 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="data-label">Asset</span>
                <span className="data-value">{asset.name}</span>
              </div>
              {sensor && (
                <div className="flex justify-between text-xs">
                  <span className="data-label">Issue</span>
                  <span className="text-warning capitalize">{sensor.severity} {sensor.type}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="data-label">Priority</span>
                <span style={{ color: PRIORITY_OPTS.find(p => p.value === priority)?.color }}>
                  {priority.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="data-label">Team</span>
                <span className="data-value text-right">{team}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="data-label">Status</span>
                <span className="text-critical">OPEN</span>
              </div>
            </div>
            <button onClick={onClose} className="btn-secondary w-full justify-center">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
