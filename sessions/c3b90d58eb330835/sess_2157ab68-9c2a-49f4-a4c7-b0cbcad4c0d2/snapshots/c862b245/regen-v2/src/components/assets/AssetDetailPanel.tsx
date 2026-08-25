import { useState, useCallback } from 'react';
import { useAssets } from '../../context/AssetContext';
import { useAuth } from '../../context/AuthContext';
import { useDemo } from '../../context/DemoContext';
import { hasPermission } from '../../utils/permissions';
import { getPredictionForAsset } from '../../data/predictions';

import { MAINTENANCE_RECORDS } from '../../data/users';
import { SEVERITY_COLOR } from '../../utils/severity';
import { SeverityBadge, ExpandToggle, Divider } from '../ui';
import { SensorGraph } from './SensorGraph';
import { WorkOrderModal } from '../work-orders/WorkOrderModal';
import { X, Radio, Wrench } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Sensor } from '../../types';

function SensorRow({ sensor, isSelected, onClick }: {
  sensor: Sensor; isSelected: boolean; onClick: () => void;
}) {
  const color = SEVERITY_COLOR[sensor.severity];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-2.5 rounded border transition-all mb-1 ${isSelected ? 'border-cyan/50 bg-cyan/5' : 'border-border hover:border-border/80 hover:bg-surface2'
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono font-semibold text-text-primary">{sensor.id}</p>
          <p className="text-[10px] font-mono text-text-dim capitalize mt-0.5">{sensor.type}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-mono font-bold" style={{ color }}>
            {sensor.status === 'offline' ? '—' : `${sensor.currentValue.toFixed(2)}${sensor.unit}`}
          </p>
          {sensor.status === 'offline' && (
            <p className="text-[10px] text-text-dim font-mono">OFFLINE</p>
          )}
        </div>
      </div>
    </button>
  );
}

export function AssetDetailPanel() {
  const { selectedAsset, selectedSensor, sensors, selectAsset, selectSensor } = useAssets();
  const { user } = useAuth();

  const [sensorOpen, setSensorOpen] = useState(true);
  const [predOpen, setPredOpen] = useState(true);
  const [maintOpen, setMaintOpen] = useState(false);
  const [showWOModal, setShowWOModal] = useState(false);

  const canCreateWO = user ? hasPermission(user.role, 'canCreateWorkOrder') : false;

  const assetSensors = selectedAsset
    ? sensors.filter(s => s.assetId === selectedAsset.id)
    : [];

  const prediction = selectedAsset ? getPredictionForAsset(selectedAsset.id) : null;
  const maintenanceRecords = selectedAsset
    ? MAINTENANCE_RECORDS.filter(m => m.assetId === selectedAsset.id).slice(0, 3)
    : [];

  const handleSensorClick = useCallback((sensor: Sensor) => {
    selectSensor(selectedSensor?.id === sensor.id ? null : sensor.id);
  }, [selectedSensor, selectSensor]);

  // Show panel if we have a selected asset
  if (!selectedAsset) return null;

  const primarySensor = assetSensors.find(s => s.severity === 'critical')
    ?? assetSensors.find(s => s.severity === 'warning')
    ?? assetSensors[0];

  const activeSensor = selectedSensor ?? primarySensor;

  // Role-specific view content
  const roleView = () => {
    if (!user) return null;
    if (user.role === 'administrator') {
      return (
        <div className="p-3 rounded border border-border bg-surface2 text-xs font-mono space-y-1.5">
          <div className="data-row">
            <span className="data-label">Connection</span>
            <span className="text-green font-semibold">Online</span>
          </div>
          <div className="data-row">
            <span className="data-label">MQTT</span>
            <span className="text-cyan">Connected</span>
          </div>
          <div className="data-row">
            <span className="data-label">Last Data</span>
            <span className="data-value">
              {primarySensor ? format(new Date(primarySensor.lastUpdate), 'HH:mm') : '—'}
            </span>
          </div>
          <div className="data-row">
            <span className="data-label">Sensors</span>
            <span className="data-value">{assetSensors.length}</span>
          </div>
        </div>
      );
    }
    if (user.role === 'operations_manager') {
      return (
        <div className="p-3 rounded border border-border bg-surface2 text-xs font-mono space-y-1.5">
          <div className="data-row">
            <span className="data-label">Maintenance Status</span>
            <span className="text-warning">Required</span>
          </div>
          <div className="data-row">
            <span className="data-label">Operational Risk</span>
            <span style={{ color: prediction?.riskLevel === 'high' ? '#FF3B3B' : '#FFB020' }}>
              {prediction?.riskLevel?.toUpperCase() ?? 'MEDIUM'}
            </span>
          </div>
          <p className="text-text-dim mt-2">Work Order Required to dispatch maintenance team.</p>
        </div>
      );
    }
    // Maintenance engineer — full data
    return (
      <div className="p-3 rounded border border-border bg-surface2 text-xs font-mono space-y-1.5">
        {primarySensor && (
          <>
            <div className="data-row">
              <span className="data-label">{primarySensor.type}</span>
              <span className="font-bold" style={{ color: SEVERITY_COLOR[primarySensor.severity] }}>
                {primarySensor.currentValue.toFixed(2)}{primarySensor.unit}
              </span>
            </div>
          </>
        )}
        {prediction && (
          <div className="data-row">
            <span className="data-label">RUL</span>
            <span className="text-info">{prediction.rulDays} days</span>
          </div>
        )}
        <p className="text-text-dim mt-1">Inspect asset on-site to verify condition.</p>
      </div>
    );
  };

  return (
    <>
      <aside
        className="absolute right-0 top-0 bottom-0 flex flex-col bg-surface border-l border-border
          overflow-hidden z-20 animate-slide-in-right"
        style={{ width: 380 }}
        aria-label="Asset detail panel"
      >
        {/* ── Header ── */}
        <div className="panel-header flex-shrink-0" style={{ padding: '12px 16px' }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mb-0.5">
                {selectedAsset.type.toUpperCase()}
              </p>
              <h2 className="text-base font-mono font-bold text-text-primary leading-tight truncate">
                {selectedAsset.name}
              </h2>
              <p className="text-xs text-text-dim mt-0.5 truncate">{selectedAsset.location}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <SeverityBadge level={selectedAsset.severity} />
              <button
                onClick={() => selectAsset(null)}
                className="text-text-dim hover:text-text-primary transition-colors p-1 rounded hover:bg-surface2"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Always visible: primary sensor summary */}
          {primarySensor && (
            <div className="px-4 pt-3 pb-2">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2.5 rounded border border-border bg-surface2">
                  <p className="data-label mb-1">Sensor</p>
                  <p className="data-value text-[11px]">{primarySensor.id}</p>
                </div>
                <div className="p-2.5 rounded border border-border bg-surface2">
                  <p className="data-label mb-1">Last Update</p>
                  <p className="data-value text-[11px]">
                    {format(new Date(primarySensor.lastUpdate), 'HH:mm:ss')}
                  </p>
                </div>
              </div>

              {/* Role-specific primary info */}
              {roleView()}
            </div>
          )}

          <Divider className="mx-4" />

          {/* ── Sensor Data (expandable) ── */}
          <div className="px-4 py-2">
            <ExpandToggle open={sensorOpen} onClick={() => setSensorOpen(v => !v)} label="Sensor Data" />
            {sensorOpen && (
              <div className="mt-2 space-y-1">
                {assetSensors.map(sensor => (
                  <SensorRow
                    key={sensor.id}
                    sensor={sensor}
                    isSelected={selectedSensor?.id === sensor.id}
                    onClick={() => handleSensorClick(sensor)}
                  />
                ))}
                {assetSensors.length === 0 && (
                  <p className="text-xs text-text-dim font-mono py-2">No sensors attached to this asset.</p>
                )}

                {/* Graph for selected sensor */}
                {activeSensor && activeSensor.status !== 'offline' && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Radio className="w-3 h-3 text-cyan" />
                      <span className="text-[10px] font-mono text-text-dim uppercase tracking-wider">
                        {activeSensor.id} — {activeSensor.type}
                      </span>
                    </div>
                    <SensorGraph sensor={activeSensor} />
                  </div>
                )}
                {activeSensor?.status === 'offline' && (
                  <div className="mt-2 p-2 rounded border border-border text-xs font-mono text-text-dim">
                    <p className="font-semibold text-warning">Sensor Offline</p>
                    <p className="mt-1">Last Reading: {format(new Date(activeSensor.lastUpdate), 'HH:mm')}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Divider className="mx-4" />

          {/* ── Prediction (expandable) ── */}
          <div className="px-4 py-2">
            <ExpandToggle open={predOpen} onClick={() => setPredOpen(v => !v)} label="Prediction" />
            {predOpen && (
              <div className="mt-2">
                {prediction ? (
                  <div
                    className="p-3 rounded border text-xs font-mono space-y-2.5"
                    style={{
                      borderColor: prediction.riskLevel === 'high' ? 'rgba(255,59,59,0.3)' : 'rgba(255,176,32,0.3)',
                      background: prediction.riskLevel === 'high' ? 'rgba(255,59,59,0.04)' : 'rgba(255,176,32,0.04)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="data-label">Risk</span>
                      <span
                        className="font-bold"
                        style={{
                          color: prediction.riskLevel === 'high' ? '#FF3B3B'
                            : prediction.riskLevel === 'medium' ? '#FFB020' : '#39FF14',
                        }}
                      >
                        {prediction.riskLevel.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="data-label block mb-0.5">Potential Issue</span>
                      <span className="text-text-primary leading-snug">{prediction.issue}</span>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="data-label block">Est. RUL</span>
                        <span className="text-info font-bold text-sm">{prediction.rulDays} DAYS</span>
                      </div>
                      <div>
                        <span className="data-label block">Failure Prob.</span>
                        <span
                          className="font-bold text-sm"
                          style={{ color: prediction.failureProbability > 60 ? '#FF3B3B' : '#FFB020' }}
                        >
                          {prediction.failureProbability}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="data-label block mb-0.5">Recommended Action</span>
                      <span className="text-text-secondary leading-snug">{prediction.recommendedAction}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-text-dim font-mono py-2">No prediction data available.</p>
                )}
              </div>
            )}
          </div>

          <Divider className="mx-4" />

          {/* ── Maintenance History (expandable) ── */}
          <div className="px-4 py-2">
            <ExpandToggle open={maintOpen} onClick={() => setMaintOpen(v => !v)} label="Maintenance" />
            {maintOpen && (
              <div className="mt-2 space-y-2">
                {maintenanceRecords.length === 0 ? (
                  <p className="text-xs text-text-dim font-mono py-2">No maintenance history.</p>
                ) : maintenanceRecords.map(record => (
                  <div key={record.id} className="p-2.5 rounded border border-border bg-surface2 text-xs font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-text-primary">{record.type}</span>
                      <span className="text-text-dim">
                        {formatDistanceToNow(new Date(record.performedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-text-dim line-clamp-2">{record.description}</p>
                    <p className="text-text-dim mt-1">By: {record.performedBy}</p>
                    <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] ${record.outcome === 'completed' ? 'bg-green/10 text-green' : 'bg-warning/10 text-warning'
                      }`}>
                      {record.outcome}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer actions ── */}
        {canCreateWO && (
          <div className="px-4 py-3 border-t border-border flex-shrink-0">
            <button
              onClick={() => setShowWOModal(true)}
              className="btn-primary w-full justify-center"
            >
              <Wrench className="w-4 h-4" />
              CREATE WORK ORDER
            </button>
          </div>
        )}
      </aside>

      {/* Work order modal */}
      {showWOModal && selectedAsset && (
        <WorkOrderModal
          asset={selectedAsset}
          sensor={activeSensor}
          prediction={prediction ?? undefined}
          onClose={() => setShowWOModal(false)}
        />
      )}
    </>
  );
}
