import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLoading } from '../components/ui/LoadingSpinner';
import { SimBadge } from '../components/ui/SimBadge';
import { getRailwayLines, getSections, getTrackCircuits, getAssets } from '../lib/dataService';
import type { RailwayLine, Section, TrackCircuit, Asset } from '../types';
import { tcStatusBadge, conditionBadge, statusDot } from '../lib/utils';

function Dot({ status, size = 10 }: { status: string; size?: number }) {
  return <span style={{ display:'inline-block', width:size, height:size, borderRadius:'50%', backgroundColor:statusDot(status), flexShrink:0 }} />;
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
      .then(([l,s,t,a]) => { setLines(l); setSections(s); setTcs(t); setAssets(a); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoading />;

  const lineStatus = (line: RailwayLine) => {
    const secIds = sections.filter(s => s.railway_line_id === line.id).map(s => s.id);
    const lineTCs = tcs.filter(tc => secIds.includes(tc.section_id));
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
      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div><h2 className="text-base font-semibold text-[#172B3A]">Railway Network Overview</h2><p className="text-sm text-[#64748B] mt-0.5">Click any element to drill down. <SimBadge /></p></div>
          <div className="flex items-center gap-4 flex-wrap text-xs text-[#64748B]">
            {[{l:'Normal',c:'#16A34A'},{l:'Occupied',c:'#145DA0'},{l:'Warning',c:'#F59E0B'},{l:'Fault',c:'#DC2626'},{l:'Offline',c:'#6B7280'}].map(x=>(
              <div key={x.l} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full inline-block" style={{backgroundColor:x.c}} />{x.l}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {lines.map(line => {
          const lineSecs = sections.filter(s => s.railway_line_id === line.id);
          const isExp = expandedLine === line.id;
          return (
            <div key={line.id} className="card overflow-hidden">
              <button onClick={() => setExpandedLine(isExp ? null : line.id)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#F5F7FA] transition-colors text-left">
                <Dot status={lineStatus(line)} size={14} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[#172B3A]">{line.name}</span>
                    <span className="text-xs text-[#64748B] font-mono">{line.code}</span>
                    {line.status === 'MAINTENANCE' && <span className="badge-warning">MAINTENANCE</span>}
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">{line.description} · {line.total_length_km} km · {lineSecs.length} sections</p>
                </div>
                <span className="text-[#64748B]">{isExp ? '▲' : '▼'}</span>
              </button>
              {isExp && (
                <div className="border-t border-[#D9E1E8]">
                  {lineSecs.map(sec => {
                    const secTCs = tcs.filter(tc => tc.section_id === sec.id);
                    const secAssets = assets.filter(a => a.section_id === sec.id);
                    const isSecExp = expandedSection === sec.id;
                    return (
                      <div key={sec.id} className="border-b border-[#D9E1E8] last:border-b-0">
                        <button onClick={() => setExpandedSection(isSecExp ? null : sec.id)} className="w-full flex items-center gap-3 px-8 py-3 hover:bg-[#F5F7FA] transition-colors text-left">
                          <Dot status={sectionStatus(sec)} size={10} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-[#172B3A]">{sec.name}</span>
                              <span className="text-xs text-[#64748B] font-mono">{sec.code}</span>
                              {sec.status !== 'OPERATIONAL' && <span className="badge-warning text-[10px]">{sec.status}</span>}
                            </div>
                            <p className="text-xs text-[#64748B]">{sec.start_location} → {sec.end_location} · {sec.length_km} km · {secTCs.length} TC · {secAssets.length} assets</p>
                          </div>
                          <span className="text-[#64748B] text-xs">{isSecExp ? '▲' : '▼'}</span>
                        </button>
                        {isSecExp && (
                          <div className="px-12 pb-4 space-y-3">
                            {secTCs.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Track Circuits</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {secTCs.map(tc => (
                                    <Link key={tc.id} to={`/track-circuits/${tc.id}`} className="flex items-center gap-2 p-2.5 rounded border border-[#D9E1E8] bg-white hover:bg-[#F5F7FA] hover:border-[#145DA0] transition-colors">
                                      <Dot status={tc.status} size={8} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5"><span className="text-xs font-semibold text-[#172B3A]">{tc.track_circuit_id}</span><span className={`${tcStatusBadge(tc.status)} text-[10px]`}>{tc.status}</span></div>
                                        <p className="text-[10px] text-[#64748B] truncate">{tc.location}</p>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                            {secAssets.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Infrastructure Assets</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {secAssets.map(asset => (
                                    <Link key={asset.id} to={`/assets/${asset.id}`} className="flex items-center gap-2 p-2.5 rounded border border-[#D9E1E8] bg-white hover:bg-[#F5F7FA] hover:border-[#145DA0] transition-colors">
                                      <Dot status={asset.condition} size={8} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5"><span className="text-xs font-semibold text-[#172B3A]">{asset.asset_id}</span><span className={`${conditionBadge(asset.condition)} text-[10px]`}>{asset.condition}</span></div>
                                        <p className="text-[10px] text-[#64748B] truncate">{asset.asset_type.replace('_',' ')}</p>
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

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-[#172B3A] mb-3">Network Status Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[{l:'Normal',c:tcs.filter(t=>t.status==='NORMAL').length,cls:'bg-green-100 text-green-800 border-green-200'},
            {l:'Occupied',c:tcs.filter(t=>t.status==='OCCUPIED').length,cls:'bg-blue-100 text-blue-800 border-blue-200'},
            {l:'Fault',c:tcs.filter(t=>t.status==='FAULT').length,cls:'bg-red-100 text-red-800 border-red-200'},
            {l:'Unknown',c:tcs.filter(t=>t.status==='UNKNOWN').length,cls:'bg-gray-100 text-gray-600 border-gray-200'},
            {l:'Offline',c:tcs.filter(t=>t.status==='OFFLINE').length,cls:'bg-gray-200 text-gray-600 border-gray-300'},
          ].map(item => (
            <div key={item.l} className={`rounded border ${item.cls} px-3 py-2 text-center`}>
              <div className="text-2xl font-bold">{item.c}</div>
              <div className="text-xs font-medium">{item.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
