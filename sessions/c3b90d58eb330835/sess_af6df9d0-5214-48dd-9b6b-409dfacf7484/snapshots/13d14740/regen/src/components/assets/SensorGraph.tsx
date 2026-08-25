import { useMemo, useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { sensorsApi } from '../../lib/api';
import { SEVERITY_COLOR } from '../../utils/severity';
import type { Sensor, SensorReading } from '../../types';

// Fallback: generate readings locally if the API is unavailable
import { getReadingsForSensor } from '../../data/readings';

interface Props {
  sensor: Sensor;
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-surface2 border border-border rounded px-3 py-2 text-xs font-mono">
      <p className="text-text-dim mb-1">{label}</p>
      <p className="text-text-primary font-semibold">{val.toFixed(3)}</p>
    </div>
  );
};

export function SensorGraph({ sensor }: Props) {
  const [readings, setReadings] = useState<SensorReading[]>(() => getReadingsForSensor(sensor.id));

  useEffect(() => {
    let cancelled = false;
    sensorsApi.readings(sensor.id)
      .then(data => { if (!cancelled && data.length > 0) setReadings(data); })
      .catch(() => {/* keep fallback data */ });
    return () => { cancelled = true; };
  }, [sensor.id]);

  const chartData = useMemo(() =>
    readings.map(r => ({
      time: format(new Date(r.timestamp), 'HH:mm'),
      value: r.value,
    })),
    [readings]
  );

  const peak = readings.length ? Math.max(...readings.map(r => r.value)) : sensor.currentValue;
  const avg = readings.length
    ? readings.reduce((s, r) => s + r.value, 0) / readings.length
    : sensor.currentValue;

  const color = SEVERITY_COLOR[sensor.severity];

  if (readings.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-xs text-text-dim font-mono">
        No historical data available
      </div>
    );
  }

  return (
    <div>
      {/* Stats row */}
      <div className="flex gap-4 mb-3">
        <div>
          <p className="text-[10px] text-text-dim font-mono uppercase tracking-wider">Peak</p>
          <p className="text-sm font-mono font-bold" style={{ color }}>
            {peak.toFixed(3)}{sensor.unit}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-text-dim font-mono uppercase tracking-wider">Average</p>
          <p className="text-sm font-mono font-bold text-text-secondary">
            {avg.toFixed(3)}{sensor.unit}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-text-dim font-mono uppercase tracking-wider">Current</p>
          <p className="text-sm font-mono font-bold" style={{ color }}>
            {sensor.currentValue.toFixed(3)}{sensor.unit}
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 4" stroke="#1A1A1A" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 8, fill: '#444', fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 8, fill: '#444', fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={sensor.warningMax} stroke="#FFB020"
            strokeDasharray="3 3" strokeWidth={0.8}
            label={{ value: 'WARN', position: 'insideTopRight', fontSize: 7, fill: '#FFB020' }}
          />
          <ReferenceLine
            y={sensor.criticalMax} stroke="#FF3B3B"
            strokeDasharray="3 3" strokeWidth={0.8}
            label={{ value: 'CRIT', position: 'insideTopRight', fontSize: 7, fill: '#FF3B3B' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#grad-${sensor.id})`}
            dot={false}
            activeDot={{ r: 3, fill: color }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
