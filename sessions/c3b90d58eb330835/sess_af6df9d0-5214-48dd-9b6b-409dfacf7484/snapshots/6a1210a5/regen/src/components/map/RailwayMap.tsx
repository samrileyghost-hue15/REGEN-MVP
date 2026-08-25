import { useRef, useState, useCallback } from 'react';
import { useAssets } from '../../context/AssetContext';
import { SEVERITY_COLOR } from '../../utils/severity';
import type { Sensor } from '../../types';

// Static SVG layout constants — these are map coordinates, not runtime data
const STATIONS = [
  { id: 's-pretoria', name: 'Pretoria', x: 140, y: 60, lineId: 'north-south' },
  { id: 's-centurion', name: 'Centurion', x: 140, y: 150, lineId: 'north-south' },
  { id: 's-midrand', name: 'Midrand', x: 140, y: 245, lineId: 'north-south' },
  { id: 's-marlboro', name: 'Marlboro', x: 140, y: 340, lineId: 'north-south' },
  { id: 's-sandton', name: 'Sandton', x: 140, y: 435, lineId: 'north-south' },
  { id: 's-rosebank', name: 'Rosebank', x: 280, y: 435, lineId: 'east-west' },
  { id: 's-park', name: 'Park', x: 420, y: 435, lineId: 'east-west' },
  { id: 's-rhodesfield', name: 'Rhodesfield', x: 560, y: 435, lineId: 'east-west' },
  { id: 's-or-tambo', name: 'O.R. Tambo', x: 700, y: 435, lineId: 'east-west' },
  { id: 's-hatfield', name: 'Hatfield', x: 420, y: 60, lineId: 'loop' },
];

const VB_W = 900;
const VB_H = 520;

// Track segment definitions [x1,y1,x2,y2, lineId]
const TRACK_SEGMENTS = [
  // North–South mainline
  { x1: 140, y1: 60, x2: 140, y2: 150, line: 'north-south' },
  { x1: 140, y1: 150, x2: 140, y2: 245, line: 'north-south' },
  { x1: 140, y1: 245, x2: 140, y2: 340, line: 'north-south' },
  { x1: 140, y1: 340, x2: 140, y2: 435, line: 'north-south' },
  // East–West mainline
  { x1: 140, y1: 435, x2: 280, y2: 435, line: 'east-west' },
  { x1: 280, y1: 435, x2: 420, y2: 435, line: 'east-west' },
  { x1: 420, y1: 435, x2: 560, y2: 435, line: 'east-west' },
  { x1: 560, y1: 435, x2: 700, y2: 435, line: 'east-west' },
  // City Loop — diagonal
  { x1: 420, y1: 435, x2: 420, y2: 245, line: 'loop' },
  { x1: 420, y1: 245, x2: 420, y2: 60, line: 'loop' },
  // Connector Sandton ↔ Rosebank
  { x1: 140, y1: 435, x2: 280, y2: 435, line: 'east-west' },
  // OR Tambo spur
  { x1: 700, y1: 435, x2: 700, y2: 390, line: 'east-west' },
  { x1: 700, y1: 390, x2: 700, y2: 340, line: 'east-west' },
];

const LINE_COLOR: Record<string, string> = {
  'north-south': '#00FFC6',
  'east-west': '#00D1FF',
  'loop': '#FFB020',
};

interface SensorTooltipData {
  sensor: Sensor;
  x: number;
  y: number;
}

export function RailwayMap() {
  const { sensors, assets, selectedAsset, selectedSensor, selectAsset, selectSensor } = useAssets();
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<SensorTooltipData | null>(null);
  const [mapTransform, setMapTransform] = useState({ scale: 1, tx: 0, ty: 0 });

  // Focus map on an asset (smooth zoom toward asset position)
  const focusOnAsset = useCallback((assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset || !svgRef.current) return;
    const { mapX, mapY } = asset;
    const targetScale = 1.15;
    const cx = VB_W / 2;
    const cy = VB_H / 2;
    const tx = cx - mapX * targetScale;
    const ty = cy - mapY * targetScale;
    setMapTransform({ scale: targetScale, tx, ty });
  }, [assets]);

  const handleSensorClick = useCallback((sensor: Sensor) => {
    selectSensor(sensor.id);
    focusOnAsset(sensor.assetId);
    setTooltip(null);
  }, [selectSensor, focusOnAsset]);

  const handleAssetClick = useCallback((assetId: string) => {
    selectAsset(assetId);
    focusOnAsset(assetId);
  }, [selectAsset, focusOnAsset]);

  const handleSensorHover = useCallback((sensor: Sensor, svgX: number, svgY: number) => {
    setTooltip({ sensor, x: svgX, y: svgY });
  }, []);

  const handleBgClick = useCallback(() => {
    selectAsset(null);
    setMapTransform({ scale: 1, tx: 0, ty: 0 });
    setTooltip(null);
  }, [selectAsset]);

  const transform = `translate(${mapTransform.tx}, ${mapTransform.ty}) scale(${mapTransform.scale})`;

  return (
    <div className="relative w-full h-full bg-bg overflow-hidden select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full h-full"
        style={{ transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)' }}
        aria-label="Gautrain Network Map"
        role="img"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A1A" strokeWidth="0.5" />
          </pattern>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-amber">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={VB_W} height={VB_H} fill="url(#grid)" onClick={handleBgClick} cursor="default" />

        {/* Animated group for zoom */}
        <g style={{ transition: 'transform 400ms cubic-bezier(0.4,0,0.2,1)' }} transform={transform}>

          {/* Track lines */}
          {TRACK_SEGMENTS.map((seg, i) => {
            const color = LINE_COLOR[seg.line] ?? '#2A2A2A';
            return (
              <g key={i}>
                {/* Track shadow / glow */}
                <line
                  x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                  stroke={color} strokeWidth="6" strokeOpacity="0.12"
                />
                {/* Main track */}
                <line
                  x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                  stroke={color} strokeWidth="2.5" strokeOpacity="0.7"
                />
                {/* Rail detail lines */}
                <line
                  x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                  stroke={color} strokeWidth="0.5" strokeOpacity="0.3"
                  strokeDasharray="4 8"
                />
              </g>
            );
          })}

          {/* Stations */}
          {STATIONS.map(station => (
            <g key={station.id}>
              {/* Station outer ring */}
              <circle cx={station.x} cy={station.y} r={10}
                fill="none"
                stroke={LINE_COLOR[station.lineId] ?? '#2A2A2A'}
                strokeWidth="1.5" strokeOpacity="0.5"
              />
              {/* Station fill */}
              <circle cx={station.x} cy={station.y} r={6}
                fill="#111111"
                stroke={LINE_COLOR[station.lineId] ?? '#2A2A2A'}
                strokeWidth="2"
              />
              {/* Station dot */}
              <circle cx={station.x} cy={station.y} r={2.5}
                fill={LINE_COLOR[station.lineId] ?? '#666'}
              />
              {/* Station label */}
              <text
                x={station.x + 14} y={station.y + 1}
                fontSize="9" fontFamily="JetBrains Mono, monospace"
                fill="#A0A0A0" dominantBaseline="middle"
              >
                {station.name}
              </text>
            </g>
          ))}

          {/* Asset markers (clickable zones around sensors) */}
          {assets.map(asset => {
            const assetSensors = sensors.filter(s => s.assetId === asset.id);
            if (assetSensors.length === 0) return null;
            const isSelected = selectedAsset?.id === asset.id;
            return (
              <rect
                key={asset.id}
                x={asset.mapX - 22} y={asset.mapY - 22}
                width={44} height={44}
                fill="transparent"
                rx={4}
                stroke={isSelected ? 'rgba(0,255,198,0.5)' : 'transparent'}
                strokeWidth="1"
                cursor="pointer"
                onClick={(e) => { e.stopPropagation(); handleAssetClick(asset.id); }}
              />
            );
          })}

          {/* Sensor nodes */}
          {sensors.map(sensor => {
            const color = SEVERITY_COLOR[sensor.severity];
            const r = sensor.severity === 'critical' ? 7 : sensor.severity === 'warning' ? 5.5 : 4.5;
            const isSelected = selectedSensor?.id === sensor.id;
            const filterId =
              sensor.severity === 'critical' ? 'glow-red'
                : sensor.severity === 'warning' ? 'glow-amber'
                  : 'glow-green';

            return (
              <g key={sensor.id}>
                {/* Pulse ring for warning/critical */}
                {(sensor.severity === 'critical' || sensor.severity === 'warning') && (
                  <circle cx={sensor.mapX} cy={sensor.mapY} r={r + 4}
                    fill="none" stroke={color} strokeWidth="0.8" strokeOpacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      values={`${r + 2};${r + 10};${r + 2}`}
                      dur={sensor.severity === 'critical' ? '1s' : '2s'}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      values="0.4;0;0.4"
                      dur={sensor.severity === 'critical' ? '1s' : '2s'}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Selected ring */}
                {isSelected && (
                  <circle cx={sensor.mapX} cy={sensor.mapY} r={r + 5}
                    fill="none" stroke="#00FFC6" strokeWidth="1.5" strokeOpacity="0.8"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Sensor dot */}
                <circle
                  cx={sensor.mapX} cy={sensor.mapY} r={r}
                  fill={color}
                  filter={`url(#${filterId})`}
                  cursor="pointer"
                  role="button"
                  aria-label={`Sensor ${sensor.id} — ${sensor.severity}`}
                  onClick={(e) => { e.stopPropagation(); handleSensorClick(sensor); }}
                  onMouseEnter={() => handleSensorHover(sensor, sensor.mapX, sensor.mapY)}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ transition: 'r 300ms' }}
                />

                {/* Sensor ID label */}
                <text
                  x={sensor.mapX + r + 3} y={sensor.mapY}
                  fontSize="7" fontFamily="JetBrains Mono, monospace"
                  fill="#666666" dominantBaseline="middle"
                  pointerEvents="none"
                >
                  {sensor.id.split('_').slice(1, 3).join('_')}
                </text>
              </g>
            );
          })}

          {/* Line legend */}
          {Object.entries(LINE_COLOR).map(([lineId, color], i) => {
            const labels: Record<string, string> = {
              'north-south': 'N–S Line',
              'east-west': 'E–W Line',
              'loop': 'City Loop',
            };
            return (
              <g key={lineId} transform={`translate(${VB_W - 110}, ${30 + i * 20})`}>
                <line x1={0} y1={6} x2={20} y2={6} stroke={color} strokeWidth="2.5" strokeOpacity="0.7" />
                <text x={26} y={6} fontSize="9" fontFamily="JetBrains Mono, monospace"
                  fill="#A0A0A0" dominantBaseline="middle">
                  {labels[lineId]}
                </text>
              </g>
            );
          })}
        </g>

        {/* Tooltip (rendered outside transform group, in SVG overlay coordinates) */}
        {tooltip && (() => {
          const { sensor } = tooltip;
          const svgEl = svgRef.current;
          if (!svgEl) return null;
          // Map sensor coordinates through current transform to screen-space SVG coords
          const tx = tooltip.x * mapTransform.scale + mapTransform.tx;
          const ty = tooltip.y * mapTransform.scale + mapTransform.ty;
          // Convert SVG units to viewBox-relative
          const bx = Math.min(tx + 12, VB_W - 160);
          const by = Math.max(ty - 90, 5);
          return (
            <g pointerEvents="none">
              <rect x={bx} y={by} width={155} height={110}
                rx={4} fill="#111111" stroke="rgba(0,255,198,0.35)" strokeWidth="0.75"
              />
              <text x={bx + 10} y={by + 18} fontSize="10" fontFamily="JetBrains Mono, monospace"
                fill="#00FFC6" fontWeight="600">
                {sensor.assetId}
              </text>
              <text x={bx + 10} y={by + 32} fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#666">
                Sensor
              </text>
              <text x={bx + 10} y={by + 43} fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#A0A0A0">
                {sensor.id}
              </text>
              <text x={bx + 10} y={by + 57} fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#666">
                Status
              </text>
              <text x={bx + 10} y={by + 68} fontSize="9" fontFamily="JetBrains Mono, monospace"
                fill={SEVERITY_COLOR[sensor.severity]}>
                {sensor.severity.toUpperCase()}
              </text>
              <text x={bx + 10} y={by + 82} fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#666">
                {sensor.type.charAt(0).toUpperCase() + sensor.type.slice(1)}
              </text>
              <text x={bx + 10} y={by + 95} fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#F0F0F0"
                fontWeight="600">
                {sensor.currentValue.toFixed(2)}{sensor.unit}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
