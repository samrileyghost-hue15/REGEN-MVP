import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SimulatedDataBanner, AlertPriorityBadge, TrackCircuitStatusBadge, RiskBadge, AssetConditionBadge, Button, Modal, PageHeader, ListPanel, ListRow } from "../components/ui";
import { fetchAlerts, updateAlertStatus, createInspection } from "../store/dataStore";
import { formatTime, timeAgo } from "../utils";
import type { Alert } from "../types";

const SOURCE_COLOR: Record<string,string> = {
  COMBINED:"var(--status-warn)",TRACK_CIRCUIT:"var(--status-blue)",FBG_SENSOR:"#a78bfa",
  ASSET:"var(--status-ok)",COMMUNICATION:"var(--status-offline)",MAINTENANCE:"var(--status-ok)",
};
const STATUS_COLOR: Record<string,string> = {
  OPEN:"var(--status-crit)",ACKNOWLEDGED:"var(--status-blue)",INVESTIGATING:"var(--status-warn)",
  RESOLVED:"var(--status-ok)",CLOSED:"var(--status-offline)",
};

export function AlertsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [alerts, setAlerts]           = useState<Alert[]>([]);
  const [selected, setSelected]       = useState<Alert|null>(null);
  const [filterStatus, setFS]         = useState("active");
  const [filterPriority, setFP]       = useState("all");
  const [filterSource, setFSrc]       = useState("all");
  const [inspModal, setInspModal]     = useState(false);
  const [feedback, setFeedback]       = useState<string|null>(null);
  const [search, setSearch]           = useState("");

  const toast=(msg:string)=>{ setFeedback(msg); setTimeout(()=>setFeedback(null),3000); };

  const load=useCallback(()=>{
    fetchAlerts().then(data=>{
      setAlerts(data);
      const id=params.get("id");
      if(id){ const f=data.find(a=>a.id===id||a.alert_id===id); if(f){setSelected(f);return;} }
      if(!selected) setSelected(data.find(a=>a.alert_id==="ALERT-001")??null);
    });
  },[params]);

  useEffect(()=>{ load(); },[load]);

  const filtered=alerts.filter(a=>{
    if(filterStatus==="active"&&(a.status==="CLOSED"||a.status==="RESOLVED")) return false;
    if(filterStatus==="closed"&&a.status!=="CLOSED"&&a.status!=="RESOLVED") return false;
    if(filterPriority!=="all"&&a.priority!==filterPriority) return false;
    if(filterSource!=="all"&&a.source!==filterSource) return false;
    if(search&&!a.title.toLowerCase().includes(search.toLowerCase())&&!a.alert_id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAck=async()=>{ if(!selected) return; await updateAlertStatus(selected.id,"ACKNOWLEDGED","Control Room Operator"); toast("Alert acknowledged"); load(); };
  const handleInvest=async()=>{ if(!selected) return; await updateAlertStatus(selected.id,"INVESTIGATING"); toast("Set to Investigating"); load(); };
  const handleCreateInsp=async()=>{
    if(!selected) return;
    await createInspection({ alert_id:selected.id, asset_id:selected.asset_id??"", track_circuit_id:selected.track_circuit_id??undefined, sensor_id:selected.sensor_id??undefined, title:`Inspection — ${selected.title}`, reason:selected.description.substring(0,120), priority:selected.priority, location_description:(selected as any).asset?.location_description??"Location from alert" });
    setInspModal(false); toast("Inspection task created"); navigate("/inspections");
  };

  const countByStatus=(s:string)=>alerts.filter(a=>a.status===s).length;

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="Alerts" title="Alert Engine"
        subtitle="Simulated alerts from track circuits, FBG sensors, assets and maintenance systems">
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input className="input-base" placeholder="Search alerts…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:150}}/>
          <select className="input-base" value={filterStatus} onChange={e=>setFS(e.target.value)}>
            <option value="active">Active</option>
            <option value="all">All</option>
            <option value="closed">Closed</option>
          </select>
          <select className="input-base" value={filterPriority} onChange={e=>setFP(e.target.value)}>
            <option value="all">All Priority</option>
            {["CRITICAL","HIGH","WARNING","NORMAL"].map(p=><option key={p}>{p}</option>)}
          </select>
          <select className="input-base" value={filterSource} onChange={e=>setFSrc(e.target.value)}>
            <option value="all">All Sources</option>
            {["COMBINED","TRACK_CIRCUIT","FBG_SENSOR","ASSET","COMMUNICATION"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </PageHeader>

      {/* Status count row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
        {[["OPEN","var(--status-crit)"],["ACKNOWLEDGED","var(--status-blue)"],["INVESTIGATING","var(--status-warn)"],["RESOLVED","var(--status-ok)"],["CLOSED","var(--status-offline)"]].map(([s,c])=>(
          <div key={s} className="card" style={{padding:"12px 14px",cursor:"pointer"}} onClick={()=>setFS(s==="CLOSED"||s==="RESOLVED"?"closed":s==="all"?"all":"active")}>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{countByStatus(s)}</div>
            <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginTop:4}}>{s}</div>
          </div>
        ))}
      </div>

      {feedback&&(
        <div style={{background:"var(--status-ok-bg)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"7px 14px",fontSize:12,color:"var(--status-ok)",fontWeight:600}}>✓ {feedback}</div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,minHeight:0}}>
        <ListPanel title="Alerts" count={filtered.length}>
          {filtered.map(alert=>(
            <ListRow key={alert.id} active={selected?.id===alert.id} onClick={()=>setSelected(alert)}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
                <AlertPriorityBadge priority={alert.priority}/>
                <span style={{fontSize:10,color:"var(--text-muted)",fontFamily:"monospace",flexShrink:0}}>{timeAgo(alert.created_at)}</span>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:"var(--bg-elevated)",color:SOURCE_COLOR[alert.source]??"var(--text-muted)",fontWeight:700,textTransform:"uppercase"}}>{alert.source.replace(/_/g," ")}</span>
                <span style={{fontSize:9,padding:"1px 5px",borderRadius:3,background:"var(--bg-elevated)",color:STATUS_COLOR[alert.status]??"var(--text-muted)",fontWeight:700}}>{alert.status}</span>
              </div>
              <div style={{fontSize:11,fontWeight:600,color:"var(--text-primary)",lineHeight:1.4}}>{alert.title}</div>
            </ListRow>
          ))}
        </ListPanel>

        <div style={{display:"flex",flexDirection:"column",gap:16,overflow:"auto"}}>
          {selected?(<>
            <div className="card" style={{padding:20}}>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:700,color:"var(--text-muted)",fontFamily:"monospace"}}>{selected.alert_id}</span>
                  <AlertPriorityBadge priority={selected.priority}/>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"var(--bg-elevated)",color:STATUS_COLOR[selected.status]??"var(--text-muted)",fontWeight:700,border:`1px solid ${STATUS_COLOR[selected.status]??'var(--border)'}20`}}>{selected.status}</span>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"var(--bg-elevated)",color:SOURCE_COLOR[selected.source]??"var(--text-muted)",fontWeight:700}}>{selected.source.replace(/_/g," ")}</span>
                </div>
                <h2 style={{fontSize:17,fontWeight:800,color:"var(--text-primary)",margin:"0 0 6px"}}>{selected.title}</h2>
                <div style={{fontSize:11,color:"var(--text-muted)"}}>{formatTime(selected.created_at)} · {timeAgo(selected.created_at)}</div>
              </div>

              <div style={{background:"var(--bg-elevated)",borderRadius:6,padding:"12px 14px",marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Description</div>
                <p style={{fontSize:12,color:"var(--text-primary)",lineHeight:1.6,margin:0}}>{selected.description}</p>
              </div>

              {selected.evidence_summary&&(
                <div style={{background:"var(--status-blue-bg)",border:"1px solid rgba(74,158,255,.2)",borderRadius:6,padding:"12px 14px",marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--status-blue)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Evidence Summary</div>
                  <p style={{fontSize:11,color:"var(--text-secondary)",lineHeight:1.6,margin:0,fontFamily:"monospace"}}>{selected.evidence_summary}</p>
                </div>
              )}

              {selected.requires_inspection&&(
                <div style={{background:"rgba(249,115,22,.1)",border:"1px solid rgba(249,115,22,.2)",borderRadius:6,padding:"8px 14px",marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#f97316",textTransform:"uppercase"}}>⚠ Physical Verification Required</div>
                </div>
              )}

              {selected.acknowledged_by&&(
                <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:14}}>
                  Acknowledged by <span style={{fontWeight:600,color:"var(--text-secondary)"}}>{selected.acknowledged_by}</span>
                </div>
              )}

              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {selected.status==="OPEN"&&<Button variant="primary" size="sm" onClick={handleAck}>Acknowledge</Button>}
                {(selected.status==="OPEN"||selected.status==="ACKNOWLEDGED")&&<Button size="sm" onClick={handleInvest}>Set Investigating</Button>}
                {selected.requires_inspection&&selected.status!=="CLOSED"&&selected.status!=="RESOLVED"&&(
                  <Button variant="danger" size="sm" onClick={()=>setInspModal(true)}>Create Inspection</Button>
                )}
                {selected.track_circuit_id&&<Button size="sm" variant="ghost" onClick={()=>navigate(`/track-circuits?id=${selected.track_circuit_id}`)}>Track Circuit</Button>}
                {selected.asset_id&&<Button size="sm" variant="ghost" onClick={()=>navigate(`/assets?id=${selected.asset_id}`)}>Asset</Button>}
                {selected.sensor_id&&<Button size="sm" variant="ghost" onClick={()=>navigate(`/fbg-monitoring?id=${selected.sensor_id}`)}>FBG Sensor</Button>}
              </div>
            </div>

            {/* Related entities */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {selected.track_circuit_id&&(selected as any).track_circuit&&(
                <div className="card" style={{padding:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Track Circuit</div>
                  <div style={{fontSize:14,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace",marginBottom:6}}>{(selected as any).track_circuit.track_circuit_id}</div>
                  <TrackCircuitStatusBadge status={(selected as any).track_circuit.status}/>
                  <div style={{fontSize:10,color:"var(--text-muted)",marginTop:6}}>{(selected as any).track_circuit.location_description?.substring(0,50)}</div>
                </div>
              )}
              {selected.sensor_id&&(selected as any).sensor&&(
                <div className="card" style={{padding:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>FBG Sensor</div>
                  <div style={{fontSize:14,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace",marginBottom:6}}>{(selected as any).sensor.sensor_id}</div>
                  <RiskBadge risk={(selected as any).sensor.risk_level}/>
                  <div style={{fontSize:11,color:"var(--text-muted)",marginTop:6}}>{(selected as any).sensor.current_strain} µε ({(selected as any).sensor.percentage_change>0?"+":""}{(selected as any).sensor.percentage_change?.toFixed(1)}%)</div>
                </div>
              )}
              {selected.asset_id&&(selected as any).asset&&(
                <div className="card" style={{padding:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Asset</div>
                  <div style={{fontSize:14,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace",marginBottom:6}}>{(selected as any).asset.asset_id}</div>
                  <AssetConditionBadge condition={(selected as any).asset.condition}/>
                  <div style={{fontSize:10,color:"var(--text-muted)",marginTop:6}}>{(selected as any).asset.location_description?.substring(0,50)}</div>
                </div>
              )}
            </div>
          </>):(
            <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
              <div style={{textAlign:"center",color:"var(--text-muted)"}}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>⚠</div>
                <div style={{fontSize:13,fontWeight:600}}>Select an alert</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={inspModal} onClose={()=>setInspModal(false)} title="Create Inspection Task">
        {selected&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <p style={{fontSize:12,color:"var(--text-muted)",margin:0}}>Create a field inspection task from this alert. The inspector will receive full context.</p>
            <div style={{background:"var(--bg-elevated)",borderRadius:6,padding:"10px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:"var(--text-primary)",marginBottom:4}}>{selected.alert_id}</div>
              <div style={{fontSize:11,color:"var(--text-muted)"}}>{selected.title}</div>
            </div>
            {(selected as any).asset&&(
              <div style={{fontSize:11,color:"var(--text-muted)"}}>Asset: <span style={{fontWeight:600,color:"var(--text-primary)"}}>{(selected as any).asset.asset_id}</span></div>
            )}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:8}}>
              <Button variant="ghost" onClick={()=>setInspModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateInsp}>Create Inspection Task</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

