import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SimulatedDataBanner, InspectionStatusBadge, AlertPriorityBadge, TrackCircuitStatusBadge, RiskBadge, Button, Modal, PageHeader, ListPanel, ListRow } from "../components/ui";
import { fetchInspections, updateInspection, createMaintenanceTask, createInspection } from "../store/dataStore";
import { ASSETS, TRACK_CIRCUITS, FBG_SENSORS } from "../store/dataStore";
import { timeAgo } from "../utils";
import type { Inspection } from "../types";

export function InspectionsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [list, setList]             = useState<Inspection[]>([]);
  const [sel, setSel]               = useState<Inspection|null>(null);
  const [filterStatus, setFS]       = useState("all");
  const [obs, setObs]               = useState("");
  const [findings, setFind]         = useState("");
  const [recs, setRecs]             = useState("");
  const [faultConf, setFC]          = useState(false);
  const [falseAlarm, setFA]         = useState(false);
  const [feedback, setFeedback]     = useState<string|null>(null);
  const [createModal, setCreate]    = useState(params.get("create")==="1");
  const [createForm, setCF]         = useState({ asset_id:params.get("asset")??"", tc_id:params.get("tc")??"", title:"", reason:"", priority:"WARNING", loc:"" });

  const toast=(m:string)=>{ setFeedback(m); setTimeout(()=>setFeedback(null),3000); };

  const load=useCallback(()=>{
    fetchInspections().then(data=>{
      setList(data);
      const id=params.get("id");
      if(id){ const f=data.find(i=>i.id===id||i.inspection_id===id); if(f){selectInsp(f);return;} }
      if(!sel) { const demo=data.find(i=>i.inspection_id==="INSP-001"); if(demo) selectInsp(demo); }
    });
  },[params]);

  const selectInsp=(i:Inspection)=>{ setSel(i); setObs(i.observations??""); setFind(i.findings??""); setRecs(i.recommendations??""); setFC(i.fault_confirmed); setFA(i.false_alarm); };

  useEffect(()=>{ load(); },[load]);

  const filtered=list.filter(i=>filterStatus==="all"||i.status===filterStatus);

  const handleUpdate=async()=>{ if(!sel) return; await updateInspection(sel.id,{observations:obs,findings:findings||undefined,recommendations:recs||undefined,fault_confirmed:faultConf,false_alarm:falseAlarm,status:"IN_PROGRESS",started_at:sel.started_at??new Date().toISOString()}); toast("Updated"); load(); };
  const handleComplete=async()=>{ if(!sel) return; await updateInspection(sel.id,{status:"COMPLETED",completed_at:new Date().toISOString(),observations:obs,findings:findings||sel.findings,fault_confirmed:faultConf,false_alarm:falseAlarm,recommendations:recs,maintenance_required:faultConf}); toast("Inspection completed"); load(); };
  const handleMaint=async()=>{ if(!sel) return; await createMaintenanceTask({inspection_id:sel.id,alert_id:sel.alert_id??undefined,asset_id:sel.asset_id,fault_description:sel.findings??"Fault confirmed during inspection",work_description:sel.recommendations??"Remediation required",priority:sel.priority,status:"OPEN"}); toast("Maintenance task created"); navigate("/maintenance"); };
  const handleCreate=async()=>{ if(!createForm.title||!createForm.asset_id) return; const a=ASSETS.find(x=>x.id===createForm.asset_id||x.asset_id===createForm.asset_id); await createInspection({asset_id:a?.id??createForm.asset_id,track_circuit_id:createForm.tc_id||undefined,title:createForm.title,reason:createForm.reason,priority:createForm.priority as any,location_description:createForm.loc||a?.location_description||"",status:"PENDING"}); setCreate(false); toast("Inspection created"); load(); };

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="Inspections" title="Field Inspections" subtitle="Inspection tasks for physical field verification of monitoring alerts">
        <div style={{display:"flex",gap:8}}>
          <select className="input-base" value={filterStatus} onChange={e=>setFS(e.target.value)}>
            <option value="all">All</option>
            {["PENDING","ASSIGNED","IN_PROGRESS","COMPLETED","CANCELLED"].map(s=><option key={s}>{s}</option>)}
          </select>
          <Button variant="primary" onClick={()=>setCreate(true)}>+ New Inspection</Button>
        </div>
      </PageHeader>

      {feedback&&<div style={{background:"var(--status-ok-bg)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"7px 14px",fontSize:12,color:"var(--status-ok)",fontWeight:600}}>✓ {feedback}</div>}

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,minHeight:0}}>
        <ListPanel title="Inspections" count={filtered.length}>
          {filtered.map(insp=>{
            const a=ASSETS.find(x=>x.id===insp.asset_id);
            return (
              <ListRow key={insp.id} active={sel?.id===insp.id} onClick={()=>selectInsp(insp)}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:700,color:"var(--text-primary)",fontFamily:"monospace"}}>{insp.inspection_id}</span>
                  <InspectionStatusBadge status={insp.status}/>
                </div>
                <div style={{display:"flex",gap:6,marginBottom:4}}>
                  <AlertPriorityBadge priority={insp.priority}/>
                  <span style={{fontSize:10,color:"var(--text-muted)"}}>{timeAgo(insp.created_at)}</span>
                </div>
                <div style={{fontSize:11,color:"var(--text-primary)",lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{insp.title}</div>
                {a&&<div style={{fontSize:10,color:"var(--accent)",fontFamily:"monospace",marginTop:2}}>{a.asset_id}</div>}
                {insp.assigned_inspector&&<div style={{fontSize:10,color:"var(--text-muted)",marginTop:2}}>👤 {insp.assigned_inspector}</div>}
              </ListRow>
            );
          })}
        </ListPanel>

        <div style={{display:"flex",flexDirection:"column",gap:16,overflow:"auto"}}>
          {sel?(<>
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:12,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace"}}>{sel.inspection_id}</span>
                <InspectionStatusBadge status={sel.status}/>
                <AlertPriorityBadge priority={sel.priority}/>
              </div>
              <h2 style={{fontSize:16,fontWeight:800,color:"var(--text-primary)",margin:"0 0 12px"}}>{sel.title}</h2>
              <div style={{background:"var(--bg-elevated)",borderRadius:6,padding:"10px 14px",marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Reason</div>
                <p style={{fontSize:12,color:"var(--text-primary)",margin:0,lineHeight:1.5}}>{sel.reason}</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                {[{l:"Location",v:sel.location_description},{l:"Inspector",v:sel.assigned_inspector??"Unassigned"},{l:"Created",v:timeAgo(sel.created_at)}].map(d=>(
                  <div key={d.l} style={{background:"var(--bg-elevated)",borderRadius:6,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>{d.l}</div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--text-primary)"}}>{d.v}</div>
                  </div>
                ))}
              </div>

              {/* Associated TC + Sensor */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {sel.track_circuit_id&&(()=>{const tc=TRACK_CIRCUITS.find(t=>t.id===sel.track_circuit_id);return tc?(<div style={{background:"var(--bg-elevated)",borderRadius:6,padding:"8px 10px"}}><div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>Track Circuit</div><div style={{fontSize:13,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace",marginBottom:4}}>{tc.track_circuit_id}</div><TrackCircuitStatusBadge status={tc.status}/></div>):null;})()}
                {sel.sensor_id&&(()=>{const s=FBG_SENSORS.find(x=>x.id===sel.sensor_id);return s?(<div style={{background:"var(--bg-elevated)",borderRadius:6,padding:"8px 10px"}}><div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>FBG Sensor</div><div style={{fontSize:13,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace",marginBottom:4}}>{s.sensor_id}</div><RiskBadge risk={s.risk_level}/><div style={{fontSize:10,color:"var(--text-muted)",marginTop:4}}>{s.current_strain} µε ({s.percentage_change>0?"+":""}{s.percentage_change.toFixed(1)}%)</div></div>):null;})()}
              </div>

              {sel.observations&&<div style={{background:"var(--status-blue-bg)",border:"1px solid rgba(74,158,255,.15)",borderRadius:6,padding:"10px 14px",marginBottom:10}}><div style={{fontSize:10,fontWeight:700,color:"var(--status-blue)",textTransform:"uppercase",marginBottom:4}}>Field Observations</div><p style={{fontSize:12,color:"var(--text-primary)",margin:0}}>{sel.observations}</p></div>}
              {sel.findings&&<div style={{background:"var(--status-ok-bg)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"10px 14px",marginBottom:10}}><div style={{fontSize:10,fontWeight:700,color:"var(--status-ok)",textTransform:"uppercase",marginBottom:4}}>Findings</div><p style={{fontSize:12,color:"var(--text-primary)",margin:0}}>{sel.findings}</p></div>}
              {sel.recommendations&&<div style={{background:"var(--status-warn-bg)",border:"1px solid rgba(240,165,0,.2)",borderRadius:6,padding:"10px 14px",marginBottom:10}}><div style={{fontSize:10,fontWeight:700,color:"var(--status-warn)",textTransform:"uppercase",marginBottom:4}}>Recommendations</div><p style={{fontSize:12,color:"var(--text-primary)",margin:0}}>{sel.recommendations}</p></div>}
            </div>

            {sel.status!=="COMPLETED"&&sel.status!=="CANCELLED"&&(
              <div className="card" style={{padding:20}}>
                <div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)",marginBottom:14}}>Record Field Findings</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {([ {label:"Field Observations",val:obs,setter:setObs,ph:"Describe what was observed on site…"},{label:"Findings",val:findings,setter:setFind,ph:"Summary of findings…"},{label:"Recommendations",val:recs,setter:setRecs,ph:"Recommended actions…"} ] as {label:string,val:string,setter:(v:string)=>void,ph:string}[]).map(({label,val,setter,ph})=>(
                    <div key={String(label)}>
                      <label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>{label}</label>
                      <textarea className="input-base" rows={2} value={String(val)} onChange={e=>(setter as any)(e.target.value)} placeholder={String(ph)} style={{width:"100%",resize:"vertical",minHeight:60}}/>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:16}}>
                    {([{l:"Fault Confirmed",v:faultConf,s:setFC},{l:"False Alarm",v:falseAlarm,s:setFA}] as {l:string,v:boolean,s:(v:boolean)=>void}[]).map(({l,v,s})=>(
                      <label key={String(l)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"var(--text-primary)",fontWeight:500}}>
                        <input type="checkbox" checked={Boolean(v)} onChange={e=>(s as any)(e.target.checked)} style={{width:14,height:14,accentColor:"var(--accent)"}}/>
                        {l}
                      </label>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <Button size="sm" onClick={handleUpdate}>Save</Button>
                    <Button size="sm" variant="primary" onClick={handleComplete}>Mark Complete</Button>
                    {faultConf&&<Button size="sm" variant="danger" onClick={handleMaint}>Create Maintenance Task</Button>}
                  </div>
                </div>
              </div>
            )}
          </>):(
            <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
              <div style={{textAlign:"center",color:"var(--text-muted)"}}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>◎</div>
                <div style={{fontSize:13,fontWeight:600}}>Select an inspection</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={createModal} onClose={()=>setCreate(false)} title="New Inspection Task">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[["Title *","title","text","Inspection title…"],["Asset ID *","asset_id","text","e.g. COMPOSITE-SLEEPER-021"],["Track Circuit (optional)","tc_id","text","e.g. tc-021"],["Location Description","loc","text","Location…"]].map(([l,k,t,p])=>(
            <div key={k}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>{l}</label>
              <input className="input-base" type={String(t)} value={(createForm as any)[k]} onChange={e=>setCF({...createForm,[k]:e.target.value})} placeholder={String(p)} style={{width:"100%"}}/>
            </div>
          ))}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>Reason</label>
            <textarea className="input-base" rows={2} value={createForm.reason} onChange={e=>setCF({...createForm,reason:e.target.value})} placeholder="Reason for inspection…" style={{width:"100%",resize:"vertical"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>Priority</label>
            <select className="input-base" value={createForm.priority} onChange={e=>setCF({...createForm,priority:e.target.value})}>
              {["NORMAL","WARNING","HIGH","CRITICAL"].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:8}}>
            <Button variant="ghost" onClick={()=>setCreate(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!createForm.title||!createForm.asset_id}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


