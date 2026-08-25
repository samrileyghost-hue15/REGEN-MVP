import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  SimulatedDataBanner, AssetConditionBadge, TrackCircuitStatusBadge,
  RiskBadge, TrendBadge, AlertPriorityBadge, InspectionStatusBadge,
  MaintenanceStatusBadge, Button, ListPanel, ListRow, InfoGrid, PageHeader
} from "../components/ui";
import { fetchAssets } from "../store/dataStore";
import { FBG_SENSORS, ALERTS, INSPECTIONS, MAINTENANCE_TASKS, TRACK_CIRCUITS, SECTIONS, RAILWAY_LINES } from "../store/dataStore";
import { formatDate, timeAgo } from "../utils";
import type { Asset } from "../types";

const TYPE_LABELS: Record<string,string> = {
  COMPOSITE_SLEEPER:"Composite Sleeper",RAIL_JOINT:"Rail Joint",SWITCH_ASSEMBLY:"Switch Assembly",
  BRIDGE_STRUCTURE:"Bridge Structure",CULVERT:"Culvert",RETAINING_WALL:"Retaining Wall",
  RAIL_FASTENING:"Rail Fastening",LEVEL_CROSSING:"Level Crossing",
  SIGNAL_GANTRY:"Signal Gantry",OVERHEAD_LINE_SUPPORT:"Overhead Line Support",
};

export function AssetsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [assets, setAssets]           = useState<Asset[]>([]);
  const [selected, setSelected]       = useState<Asset | null>(null);
  const [filterCondition, setFC]      = useState("all");
  const [filterLine, setFL]           = useState("all");
  const [search, setSearch]           = useState("");

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
      const id = params.get("id"), tc = params.get("tc");
      if (id)   { setSelected(data.find(a=>a.id===id||a.asset_id===id)??null); return; }
      if (tc)   { setSelected(data.find(a=>a.track_circuit_id===tc)??null); return; }
      setSelected(data.find(a=>a.asset_id==="COMPOSITE-SLEEPER-021")??null);
    });
  }, []);

  const filtered = assets.filter(a => {
    if (filterCondition!=="all" && a.condition!==filterCondition) return false;
    if (filterLine!=="all") {
      const sec=SECTIONS.find(s=>s.id===a.section_id);
      if(!sec||sec.railway_line_id!==filterLine) return false;
    }
    if (search && !a.asset_id.toLowerCase().includes(search.toLowerCase()) &&
        !a.location_description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sensors  = selected ? FBG_SENSORS.filter(s=>s.asset_id===selected.id) : [];
  const aAlerts  = selected ? ALERTS.filter(a=>a.asset_id===selected.id&&a.status!=="CLOSED") : [];
  const aInsps   = selected ? INSPECTIONS.filter(i=>i.asset_id===selected.id) : [];
  const aMaint   = selected ? MAINTENANCE_TASKS.filter(m=>m.asset_id===selected.id) : [];
  const tc       = selected ? TRACK_CIRCUITS.find(t=>t.id===selected.track_circuit_id) : null;

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="Assets" title="Infrastructure Assets"
        subtitle="Physical railway infrastructure with FBG sensor associations">
        <div style={{display:"flex",gap:8}}>
          <input className="input-base" placeholder="Search assets…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:160}}/>
          <select className="input-base" value={filterLine} onChange={e=>setFL(e.target.value)}>
            <option value="all">All Lines</option>
            {RAILWAY_LINES.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select className="input-base" value={filterCondition} onChange={e=>setFC(e.target.value)}>
            <option value="all">All Conditions</option>
            {["GOOD","FAIR","WARNING","CRITICAL","REQUIRES_VERIFICATION","UNKNOWN"].map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
      </PageHeader>

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,minHeight:0}}>
        <ListPanel title="Assets" count={filtered.length}>
          {filtered.map(asset=>{
            const hasSensorWarn=FBG_SENSORS.filter(s=>s.asset_id===asset.id).some(s=>["WARNING","HIGH","CRITICAL"].includes(s.risk_level));
            const atc=TRACK_CIRCUITS.find(t=>t.id===asset.track_circuit_id);
            return (
              <ListRow key={asset.id} active={selected?.id===asset.id} onClick={()=>setSelected(asset)}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                      <span style={{fontSize:11,fontWeight:700,color:"var(--text-primary)",fontFamily:"monospace"}}>{asset.asset_id}</span>
                      {hasSensorWarn&&<div style={{width:5,height:5,borderRadius:"50%",background:"var(--status-warn)"}}/>}
                    </div>
                    <div style={{fontSize:10,color:"var(--text-muted)"}}>{TYPE_LABELS[asset.asset_type]}</div>
                    {atc&&<div style={{marginTop:3,display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:9,color:"var(--text-muted)",fontFamily:"monospace"}}>{atc.track_circuit_id}</span>
                      <TrackCircuitStatusBadge status={atc.status}/>
                    </div>}
                  </div>
                  <AssetConditionBadge condition={asset.condition}/>
                </div>
              </ListRow>
            );
          })}
        </ListPanel>

        <div style={{display:"flex",flexDirection:"column",gap:16,overflow:"auto"}}>
          {selected?(<>
            {/* Asset header */}
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:20,fontWeight:900,color:"var(--text-primary)",fontFamily:"monospace"}}>{selected.asset_id}</span>
                    <AssetConditionBadge condition={selected.condition}/>
                  </div>
                  <div style={{fontSize:12,color:"var(--text-muted)"}}>{TYPE_LABELS[selected.asset_type]}</div>
                </div>
              </div>

              {selected.condition==="REQUIRES_VERIFICATION"&&(
                <div style={{background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.25)",borderRadius:6,padding:"8px 14px",marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#f97316",textTransform:"uppercase"}}>⚠ Requires Physical Verification</div>
                  <div style={{fontSize:11,color:"var(--text-secondary)",marginTop:3}}>Multiple data sources indicate an anomaly. Physical inspection recommended.</div>
                </div>
              )}
              {selected.condition==="CRITICAL"&&(
                <div style={{background:"var(--status-crit-bg)",border:"1px solid rgba(232,64,64,.25)",borderRadius:6,padding:"8px 14px",marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--status-crit)",textTransform:"uppercase"}}>⚠ Critical Condition — Immediate inspection required</div>
                </div>
              )}

              <InfoGrid items={[
                {label:"Location",      value:selected.location_description},
                {label:"Asset Type",    value:TYPE_LABELS[selected.asset_type]},
                {label:"Installed",     value:formatDate(selected.installation_date)},
                {label:"Last Inspect",  value:selected.last_inspection_date?formatDate(selected.last_inspection_date):"Not recorded"},
              ]}/>

              {selected.notes&&(
                <div style={{marginTop:12,background:"var(--bg-elevated)",borderRadius:6,padding:"8px 12px",fontSize:11,color:"var(--text-muted)"}}>
                  {selected.notes}
                </div>
              )}

              <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                <Button variant="primary" size="sm" onClick={()=>navigate(`/track-circuits?id=${selected.track_circuit_id}`)}>Track Circuit</Button>
                <Button size="sm" onClick={()=>navigate(`/fbg-monitoring?asset=${selected.id}`)}>FBG Sensors</Button>
                {(selected.condition==="WARNING"||selected.condition==="CRITICAL"||selected.condition==="REQUIRES_VERIFICATION")&&(
                  <Button variant="danger" size="sm" onClick={()=>navigate(`/inspections?create=1&asset=${selected.id}`)}>Create Inspection</Button>
                )}
              </div>
            </div>

            {/* TC + Sensors row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {tc&&(
                <div className="card">
                  <div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>Track Circuit</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontSize:16,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace"}}>{tc.track_circuit_id}</span>
                    <TrackCircuitStatusBadge status={tc.status}/>
                  </div>
                  <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:8}}>{tc.location_description}</div>
                  {tc.fault_description&&<div style={{fontSize:11,color:"var(--status-crit)",background:"var(--status-crit-bg)",borderRadius:4,padding:"5px 8px"}}>{tc.fault_description}</div>}
                </div>
              )}
              <div className="card">
                <div style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:10}}>FBG Sensors ({sensors.length})</div>
                {sensors.length===0&&<div style={{fontSize:11,color:"var(--text-muted)"}}>No sensors assigned</div>}
                {sensors.map(s=>(
                  <div key={s.id} style={{marginBottom:8,paddingBottom:8,borderBottom:"1px solid var(--border-subtle)"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",fontFamily:"monospace",cursor:"pointer"}} onClick={()=>navigate(`/fbg-monitoring?id=${s.id}`)}>{s.sensor_id}</span>
                      <RiskBadge risk={s.risk_level}/>
                    </div>
                    <div style={{display:"flex",gap:12,fontSize:11}}>
                      <span style={{color:"var(--text-muted)"}}>Base: <span style={{color:"var(--text-primary)",fontWeight:600}}>{s.baseline_strain} µε</span></span>
                      <span style={{color:"var(--text-muted)"}}>Now: <span style={{color:s.percentage_change>25?"var(--status-crit)":"var(--text-primary)",fontWeight:600}}>{s.current_strain} µε</span></span>
                      <span style={{color:s.percentage_change>0?"var(--status-crit)":"var(--status-ok)",fontWeight:600}}>{s.percentage_change>0?"+":""}{s.percentage_change.toFixed(1)}%</span>
                    </div>
                    <div style={{marginTop:4}}><TrendBadge trend={s.trend}/></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts + history */}
            {aAlerts.length>0&&(
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Active Alerts ({aAlerts.length})</div>
                {aAlerts.map(alert=>(
                  <div key={alert.id} className="table-row" style={{padding:"9px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}} onClick={()=>navigate(`/alerts?id=${alert.id}`)}>
                    <AlertPriorityBadge priority={alert.priority}/>
                    <span style={{fontSize:12,color:"var(--text-primary)",flex:1}}>{alert.title}</span>
                    <span style={{fontSize:10,color:"var(--text-muted)"}}>{timeAgo(alert.created_at)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Inspect + Maintenance row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Inspections ({aInsps.length})</div>
                {aInsps.slice(0,4).map(i=>(
                  <div key={i.id} className="table-row" style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:11,fontWeight:600,color:"var(--text-primary)",fontFamily:"monospace"}}>{i.inspection_id}</div>
                    <div style={{fontSize:10,color:"var(--text-muted)"}}>{timeAgo(i.created_at)}</div></div>
                    <InspectionStatusBadge status={i.status}/>
                  </div>
                ))}
                {aInsps.length===0&&<div style={{padding:"12px 14px",fontSize:11,color:"var(--text-muted)"}}>No inspections</div>}
              </div>
              <div className="card" style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Maintenance ({aMaint.length})</div>
                {aMaint.slice(0,4).map(m=>(
                  <div key={m.id} className="table-row" style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:11,fontWeight:600,color:"var(--text-primary)",fontFamily:"monospace"}}>{m.maintenance_id}</div>
                    <div style={{fontSize:10,color:"var(--text-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:160}}>{m.fault_description.substring(0,40)}</div></div>
                    <MaintenanceStatusBadge status={m.status}/>
                  </div>
                ))}
                {aMaint.length===0&&<div style={{padding:"12px 14px",fontSize:11,color:"var(--text-muted)"}}>No maintenance tasks</div>}
              </div>
            </div>
          </>):(
            <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
              <div style={{textAlign:"center",color:"var(--text-muted)"}}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>◧</div>
                <div style={{fontSize:13,fontWeight:600}}>Select an asset</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
