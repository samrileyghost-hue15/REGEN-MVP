import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getRailwayLines, getSections, getTrackCircuits, getAssets } from '../lib/dataService';
import type { RailwayLine, Section, TrackCircuit, Asset } from '../types';
import { statusDot, tcStatusBadge, conditionBadge } from '../lib/utils';

function StatusDot({ status, size = 10 }: { status: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: statusDot(status),
        flexShrink: 0,
      }}
    />
  );
}

export function NetworkMap() {
  const [lines, setLines] = useState<RailwayLine[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [tcs, setTcs] = useState<TrackCircuit[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLine, setExpandedLine] = useState<string | null>('10000000-0000-0000-0000-000000000001');
  const [expandedSection, setExpandedSection] = useState<string | null>('20000000-0000-0000-0000-000000000004');

  useEffect(() => {
    Promise.all([getRailwayLines(), getSections(), getTrackCircuits(), getAssets()])
      .then(([l, s, t, a]) => {
        setLines(l);
        setSections(s);
        setTcs(t);
        setAssets(a);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  const lineStatus = (line: RailwayLine) => {
    const lineSections = sections.filter(s => s.railway_line_id === line.id);
    const lineTCs = tcs.filter(tc => lineSections.some(s => s.id === tc.section_id));
    if (lineTCs.some(tc => tc.status === 'FAULT')) return 'FAULT';
    if (lineTCs.some(tc => tc.status === 'OFFLINE')) return 'OFFLINE';
    if (lineTCs.some(tc => tc.status === 'OCCUPIED')) return 'OCCUPIED';
    return line.status;
  };

  const sectionStatus = (section: Section) => {
    const secTCs = tcs.filter(tc => tc.section_id === section.id);
    if (secTCs.some(tc => tc.status === 'FAULT')) return 'FAULT';
    if (secTCs.some(tc => tc.status === 'OFFLINE')) return 'OFFLINE';
    if (secTCs.some(tc => tc.status === 'OCCUPIED')) return 'OCCUPIED';
    return section.status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#172B3A]">Railway Network Overview</h2>
            <p className="text-sm text-[#64748B] mt-0.5">
              Simplified topological view — click any element to drill down. <SimBadge />
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap text-xs text-[#64748B]">
            {[
              { label: 'Normal / Operational', color: '#16A34A' },
              { label: 'Occupied', color: '#145DA0' },
              { label: 'Warning / Degraded', color: '#F59E0B' },
              { label: 'Fault / Critical', color: '#DC2626' },
              { label: 'Offline / Unknown', color: '#6B7280' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network tree */}
      <div className="space-y-4">
        {lines.map(line => {
          const lineSecs = sections.filter(s => s.railway_line_id === line.id);
          const lStatus = lineStatus(line);
          const isExpanded = expandedLine === line.id;

          return (
            <div key={line.id} className="card overflow-hidden">
              {/* Line header */}
              <button
                onClick={() => setExpandedLine(isExpanded ? null : line.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#F5F7FA] transition-colors text-left"
              >
                <StatusDot status={lStatus} size={14} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#172B3A]">{line.name}</span>
                    <span className="text-xs text-[#64748B] font-mono">{line.code}</span>
                    {line.status === 'MAINTENANCE' && (
                      <span className="badge-warning">MAINTENANCE</span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {line.description} · {line.total_length_km} km · {lineSecs.length} sections
                  </p>
                </div>
                <span className="text-[#64748B] text-sm">{isExpanded ? '▲' : '▼'}</span>
              </button>

              {isExpanded && (
                <div className="border-t border-[#D9E1E8]">
                  {lineSecs.map(section => {
                    const secTCs = tcs.filter(tc => tc.section_id === section.id);
                    const secAssets = assets.filter(a => a.section_id === section.id);
                    const sStatus = sectionStatus(section);
                    const isSecExpanded = expandedSection === section.id;

                    return (
                      <div key={section.id} className="border-b border-[#D9E1E8] last:border-b-0">
                        {/* Section row */}
                        <button
                          onClick={() => setExpandedSection(isSecExpanded ? null : section.id)}
                          className="w-full flex items-center gap-3 px-8 py-3 hover:bg-[#F5F7FA] transition-colors text-left"
                        >
                          <div className="w-px h-full bg-[#D9E1E8] self-stretch mr-1" />
                          <StatusDot status={sStatus} size={10} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-[#172B3A]">{section.name}</span>
                              <span className="text-xs text-[#64748B] font-mono">{section.code}</span>
                              {section.status !== 'OPERATIONAL' && (
                                <span className="badge-warning text-[10px]">{section.status}</span>
                              )}
                            </div>
                            <p className="text-xs text-[#64748B]">
                              {section.start_location} → {section.end_location}
                              · {section.length_km} km
                              · {secTCs.length} TC · {secAssets.length} assets
                            </p>
                          </div>
                          <span className="text-[#64748B] text-xs">{isSecExpanded ? '▲' : '▼'}</span>
                        </button>

                        {/* Section expanded: TCs + Assets */}
                        {isSecExpanded && (
                          <div className="px-12 pb-4 space-y-3">
                            {/* Track Circuits */}
                            {secTCs.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                                  Track Circuits
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {secTCs.map(tc => (
                                    <Link
                                      key={tc.id}
                                      to={`/track-circuits/${tc.id}`}
                                      className="flex items-center gap-2 p-2.5 rounded border border-[#D9E1E8] bg-white hover:bg-[#F5F7FA] hover:border-[#145DA0] transition-colors"
                                    >
                                      <StatusDot status={tc.status} size={8} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-semibold text-[#172B3A]">{tc.track_circuit_id}</span>
                                          <span className={`${tcStatusBadge(tc.status)} text-[10px]`}>{tc.status}</span>
                                        </div>
                                        <p className="text-[10px] text-[#64748B] truncate">{tc.location}</p>
                                        {tc.signal_relationship && (
                                          <p className="text-[10px] text-[#00A6C7]">Signal: {tc.signal_relationship}</p>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Assets */}
                            {secAssets.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                                  Infrastructure Assets
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {secAssets.map(asset => (
                                    <Link
                                      key={asset.id}
                                      to={`/assets/${asset.id}`}
                                      className="flex items-center gap-2 p-2.5 rounded border border-[#D9E1E8] bg-white hover:bg-[#F5F7FA] hover:border-[#145DA0] transition-colors"
                                    >
                                      <StatusDot status={asset.condition} size={8} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs font-semibold text-[#172B3A]">{asset.asset_id}</span>
                                          <span className={`${conditionBadge(asset.condition)} text-[10px]`}>{asset.condition}</span>
                                        </div>
                                        <p className="text-[10px] text-[#64748B] truncate">{asset.asset_type.replace('_', ' ')}</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status summary bar */}
      <div className="card p-4">
        <h3 className="text-sm font-semibold text-[#172B3A] mb-3">Network Status Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Normal', count: tcs.filter(t => t.status === 'NORMAL').length, color: 'bg-green-100 text-green-800 border-green-200' },
            { label: 'Occupied', count: tcs.filter(t => t.status === 'OCCUPIED').length, color: 'bg-blue-100 text-blue-800 border-blue-200' },
            { label: 'Fault', count: tcs.filter(t => t.status === 'FAULT').length, color: 'bg-red-100 text-red-800 border-red-200' },
            { label: 'Unknown', count: tcs.filter(t => t.status === 'UNKNOWN').length, color: 'bg-gray-100 text-gray-600 border-gray-200' },
            { label: 'Offline', count: tcs.filter(t => t.status === 'OFFLINE').length, color: 'bg-gray-200 text-gray-600 border-gray-300' },
          ].map(item => (
            <div key={item.label} className={`rounded border ${item.color} px-3 py-2 text-center`}>
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-xs font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
