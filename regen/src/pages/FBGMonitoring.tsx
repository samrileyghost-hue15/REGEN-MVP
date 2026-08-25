import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, WifiOff } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getFBGSensors, getFBGSensor, getFBGReadings, getAsset } from '../lib/dataService';
import type { FBGSensor, FBGReading, Asset } from '../types';
import {
  sensorStatusBadge, riskBadge, trendLabel, trendColor,
  assetTypeLabel, formatRelative
} from '../lib/utils';

function TrendIcon({ trend }: { trend: string | undefined }) {
  if (trend === 'INCREASING') return <TrendingUp className="w-4 h-4 text-critical" />;
  if (trend === 'DECREASING') return <TrendingDown className="w-4 h-4 text-railway-500" />;
  if (trend === 'OFFLINE') return <WifiOff className="w-4 h-4 text-offline" />;
  return <Minus className="w-4 h-4 text-healthy" />;
}

function FBGChart({ sensor, readings }: { sensor: FBGSensor; readings: FBGReading[] }) {
  const baseline = sensor.baseline_strain;
  const warnThreshold = baseline * 1.3;   // +30%
  const critThreshold = baseline * 1.8;   // +80%

  const data = readings.map(r => ({
    time: format(new Date(r.timestamp), 'MMM dd HH:mm'),
    value: r.strain_value,
    baseline,
  }));

  // Subsample for performance: max 200 points
  const step = Math.max(1, Math.floor(data.length / 200));
  const sampled = data.filter((_, i) => i % step === 0);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    const val = payload[0]?.value;
    return (
      <div className="bg-white border border-[#D9E1E8] rounded shadow-md px-3 py-2 text-xs">
        <p className="text-[#64748B]">{label}</p>
        <p className="font-bold text-[#172B3A]">{val} µε</p>
        {val != null && (
          <p className={val > critThreshold ? 'text-critical' : val > warnThreshold ? 'text-warning' : 'text-healthy'}>
            {val > critThreshold ? '⚠ SIM. CRITICAL'
              : val > warnThreshold ? '⚠ SIM. WARNING'
                : '✓ Normal range'}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Threshold note */}
      <div className="mb-3 flex items-center gap-4 flex-wrap text-xs text-[#64748B]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 bg-[#16A34A]" /> Baseline ({baseline} µε)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 bg-[#F59E0B] border-dashed" /> Sim. Warning ({warnThreshold.toFixed(0)} µε)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 bg-[#DC2626] border-dashed" /> Sim. Critical ({critThreshold.toFixed(0)} µε)
        </span>
        <span className="sim-notice ml-auto">Thresholds are SIMULATED engineering limits</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={sampled} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#D9E1E8" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#64748B' }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#64748B' }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'µε', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748B' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={baseline} stroke="#16A34A" strokeWidth={1.5} strokeDasharray="4 4" label={{ value: 'Baseline', position: 'right', fontSize: 9, fill: '#16A34A' }} />
          <ReferenceLine y={warnThreshold} stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" label={{ value: 'Sim. Warning', position: 'right', fontSize: 9, fill: '#F59E0B' }} />
          <ReferenceLine y={critThreshold} stroke="#DC2626" strokeWidth={1.5} strokeDasharray="4 4" label={{ value: 'Sim. Critical', position: 'right', fontSize: 9, fill: '#DC2626' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={
              (sensor.current_strain ?? 0) > critThreshold ? '#DC2626'
                : (sensor.current_strain ?? 0) > warnThreshold ? '#F59E0B'
                  : '#145DA0'
            }
            strokeWidth={2}
            dot={false}
            name="Strain (µε)"
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function FBGDetail({ sensorId }: { sensorId: string }) {
  const [sensor, setSensor] = useState<FBGSensor | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [readings, setReadings] = useState<FBGReading[]>([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const s = await getFBGSensor(sensorId);
    if (!s) { setLoading(false); return; }
    setSensor(s);
    const [r, a] = await Promise.all([
      getFBGReadings(s.id, days),
      getAsset(s.asset_id),
    ]);
    setReadings(r);
    setAsset(a);
    setLoading(false);
  }, [sensorId, days]);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <PageLoading />;
  if (!sensor) return <div className="p-8 text-center text-[#64748B]">Sensor not found.</div>;

  const deviation = sensor.current_strain != null
    ? sensor.current_strain - sensor.baseline_strain : undefined;
  const pctChange = deviation != null
    ? (deviation / sensor.baseline_strain) * 100 : undefined;

  return (
    <div className="space-y-6">
      <Link to="/fbg" className="btn-ghost inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to FBG Monitoring
      </Link>

      {/* Sensor header */}
      <div className={`card border-l-4 ${sensor.risk_level === 'SIMULATED_CRITICAL' ? 'border-l-critical'
          : sensor.risk_level === 'SIMULATED_WARNING' ? 'border-l-warning'
            : sensor.sensor_status === 'OFFLINE' ? 'border-l-offline'
              : 'border-l-healthy'
        }`}>
        <div className="card-header flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-[#172B3A]">{sensor.sensor_id}</h2>
              <span className={sensorStatusBadge(sensor.sensor_status)}>{sensor.sensor_status}</span>
              <span className={riskBadge(sensor.risk_level)}>{sensor.risk_level.replace('_', ' ')}</span>
              <SimBadge />
            </div>
            {asset && (
              <div className="mt-1 flex items-center gap-2">
                <Link to={`/assets/${asset.id}`} className="text-sm text-[#145DA0] hover:underline font-medium">
                  {asset.asset_id}
                </Link>
                <span className="text-xs text-[#64748B]">· {assetTypeLabel(asset.asset_type)}</span>
                <span className="text-xs text-[#64748B]">· {asset.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <TrendIcon trend={sensor.trend} />
            <span className={`text-sm font-semibold ${trendColor(sensor.trend)}`}>
              {trendLabel(sensor.trend)}
            </span>
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="col-span-1">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Baseline</p>
              <p className="mt-1 text-2xl font-bold text-[#172B3A]">{sensor.baseline_strain}</p>
              <p className="text-xs text-[#64748B]">µε</p>
            </div>
            <div className="col-span-1">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Current</p>
              <p className={`mt-1 text-2xl font-bold ${sensor.current_strain == null ? 'text-offline'
                  : (pctChange ?? 0) > 80 ? 'text-critical'
                    : (pctChange ?? 0) > 30 ? 'text-warning'
                      : 'text-healthy'
                }`}>
                {sensor.current_strain ?? '—'}
              </p>
              <p className="text-xs text-[#64748B]">{sensor.current_strain != null ? 'µε' : 'Offline'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Deviation</p>
              <p className={`mt-1 text-2xl font-bold ${(deviation ?? 0) > 0 ? 'text-critical' : 'text-healthy'}`}>
                {deviation != null ? `${deviation > 0 ? '+' : ''}${deviation.toFixed(0)}` : '—'}
              </p>
              <p className="text-xs text-[#64748B]">µε</p>
            </div>
            <div className="col-span-1">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Change</p>
              <p className={`mt-1 text-2xl font-bold ${(pctChange ?? 0) > 30 ? 'text-critical' : 'text-healthy'}`}>
                {pctChange != null ? `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}%` : '—'}
              </p>
            </div>
            <div className="col-span-1">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Wavelength</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{sensor.wavelength_nm?.toFixed(3) ?? '—'}</p>
              <p className="text-xs text-[#64748B]">nm</p>
            </div>
            <div className="col-span-1">
              <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last Reading</p>
              <p className="mt-1 text-sm font-medium text-[#172B3A]">{formatRelative(sensor.last_reading)}</p>
            </div>
          </div>

          {/* Important caveat */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-xs text-amber-800">
              <strong>Important — SIMULATED DATA:</strong> FBG strain readings indicate infrastructure condition only.
              They do not diagnose structural failure. Risk thresholds (Warning: +30%, Critical: +80%) are
              indicative SIMULATED engineering limits. A qualified engineer must assess any elevated reading
              before maintenance decisions are made.
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-header flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="section-title">Strain Time Series</h3>
            <p className="section-subtitle mt-0.5">{sensor.sensor_id} · {readings.length} data points</p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 7, 14, 30].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`text-xs px-3 py-1.5 rounded border font-medium transition-colors ${days === d ? 'bg-[#145DA0] text-white border-[#145DA0]'
                    : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
                  }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
        <div className="card-body">
          {sensor.sensor_status === 'OFFLINE' ? (
            <div className="flex flex-col items-center justify-center h-40 text-[#64748B]">
              <WifiOff className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">Sensor offline — no readings available</p>
              <p className="text-xs mt-1">Last data: {formatRelative(sensor.last_reading)}</p>
            </div>
          ) : readings.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#64748B] text-sm">
              No readings for this period
            </div>
          ) : (
            <FBGChart sensor={sensor} readings={readings} />
          )}
        </div>
      </div>

      {/* Actions */}
      {(sensor.risk_level === 'SIMULATED_WARNING' || sensor.risk_level === 'SIMULATED_CRITICAL') && (
        <div className="card border border-amber-200 bg-amber-50">
          <div className="card-body">
            <p className="text-sm font-semibold text-amber-800 mb-3">Sensor in elevated risk state — recommended actions:</p>
            <div className="flex flex-wrap gap-3">
              {asset && (
                <Link to={`/assets/${asset.id}`} className="btn-primary">
                  View Asset Detail
                </Link>
              )}
              <Link to="/inspections" className="btn-secondary">
                Create Inspection Task
              </Link>
              <Link to="/alerts" className="btn-ghost">
                View Related Alerts
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FBGMonitoring() {
  const { id } = useParams();
  const [sensors, setSensors] = useState<FBGSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getFBGSensors().then(setSensors).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;
  if (id) return <FBGDetail sensorId={id} />;

  const filtered = filter === 'ALL' ? sensors
    : sensors.filter(s => s.sensor_status === filter || s.risk_level === filter);

  return (
    <div className="space-y-4">
      {/* Intro */}
      <div className="card p-4 bg-[#EBF3FB] border border-[#C8E0F5]">
        <p className="text-sm text-[#145DA0]">
          <strong>FBG Structural Strain Monitoring</strong> — Fiber Bragg Grating sensors provide a secondary
          infrastructure-condition monitoring layer. They monitor physical strain on assets such as sleepers,
          bridges and retaining walls. <strong>FBG data does not replace track-circuit information.</strong>
          Track circuits confirm operational status; FBG sensors indicate structural condition.
        </p>
      </div>

      {/* Filter */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        {['ALL', 'ACTIVE', 'WARNING', 'FAULT', 'OFFLINE', 'CALIBRATING'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filter === f ? 'bg-[#145DA0] text-white border-[#145DA0]'
                : 'bg-white text-[#64748B] border-[#D9E1E8] hover:border-[#145DA0]'
              }`}
          >
            {f} {f !== 'ALL' && `(${sensors.filter(s => s.sensor_status === f).length})`}
          </button>
        ))}
        <div className="ml-auto"><SimBadge /></div>
      </div>

      {/* Sensor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(sensor => {
          const deviation = sensor.current_strain != null
            ? sensor.current_strain - sensor.baseline_strain : undefined;
          const pctChange = deviation != null
            ? (deviation / sensor.baseline_strain) * 100 : undefined;

          return (
            <Link
              key={sensor.id}
              to={`/fbg/${sensor.id}`}
              className={`card hover:shadow-md transition-shadow border-l-4 block ${sensor.risk_level === 'SIMULATED_CRITICAL' ? 'border-l-critical'
                  : sensor.risk_level === 'SIMULATED_WARNING' ? 'border-l-warning'
                    : sensor.sensor_status === 'OFFLINE' ? 'border-l-offline'
                      : sensor.sensor_status === 'CALIBRATING' ? 'border-l-[#00A6C7]'
                        : 'border-l-healthy'
                }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#172B3A]">{sensor.sensor_id}</span>
                      <span className={sensorStatusBadge(sensor.sensor_status)}>{sensor.sensor_status}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 truncate max-w-[180px]">
                      Asset: {sensor.asset_id.slice(-21)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={sensor.trend} />
                    <span className={`text-xs font-medium ${trendColor(sensor.trend)}`}>
                      {trendLabel(sensor.trend)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-[#64748B]">Baseline</p>
                    <p className="text-sm font-bold text-[#172B3A]">{sensor.baseline_strain}</p>
                    <p className="text-[10px] text-[#64748B]">µε</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Current</p>
                    <p className={`text-sm font-bold ${sensor.current_strain == null ? 'text-offline'
                        : (pctChange ?? 0) > 80 ? 'text-critical'
                          : (pctChange ?? 0) > 30 ? 'text-warning'
                            : 'text-healthy'
                      }`}>
                      {sensor.current_strain ?? '—'}
                    </p>
                    <p className="text-[10px] text-[#64748B]">{sensor.current_strain != null ? 'µε' : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#64748B]">Change</p>
                    <p className={`text-sm font-bold ${(pctChange ?? 0) > 30 ? 'text-critical' : 'text-healthy'
                      }`}>
                      {pctChange != null ? `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}%` : '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className={riskBadge(sensor.risk_level)}>{sensor.risk_level.replace('_', ' ')}</span>
                  <span className="text-[10px] text-[#64748B]">{formatRelative(sensor.last_reading)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
