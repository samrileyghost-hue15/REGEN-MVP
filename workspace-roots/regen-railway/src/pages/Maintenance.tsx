import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SimulatedDataBanner, MaintenanceStatusBadge, AlertPriorityBadge, Button, Modal, PageHeader, ListPanel, ListRow, Timeline } from "../components/ui";
import { fetchMaintenanceTasks, updateMaintenanceTask } from "../store/dataStore";
import { ASSETS, MAINTENANCE_VERIFICATIONS } from "../store/dataStore";
import { formatTimestamp, timeAgo } from "../utils";
import type { MaintenanceTask } from "../types";

const STEPS=["Open","Assigned","In Progress","Completed","Verify Required","Verified","Closed"];
const STEP_KEYS=["OPEN","ASSIGNED","IN_PROGRESS","COMPLETED","VERIFICATION_REQUIRED","VERIFIED","CLOSED"];

export function MaintenancePage() {
  const navigate=useNavigate();
  const [tasks,setTasks]        = useState<MaintenanceTask[]>([]);
  const [sel,setSel]            = useState<MaintenanceTask|null>(null);
  const [filter,setFilter]      = useState("active");
  const [verifyModal,setVM]     = useState(false);
  const [editModal,setEM]       = useState(false);
  const [verifyNotes,setVN]     = useState("");
  const [verifyPass,setVP]      = useState(true);
  const [editForm,setEF]        = useState({tech:"",parts:"",hours:""});
  const [feedback,setFeedback]  = useState<string|null>(null);

  const toast=(m:string)=>{ setFeedback(m); setTimeout(()=>setFeedback(null),3000); };

  const load=useCallback(()=>{
    fetchMaintenanceTasks().then(data=>{
      setTasks(data);
      if(!sel) setSel(data.find(t=>t.maintenance_id==="MAINT-001")??null);
    });
  },[]);

  useEffect(()=>{ load(); },[load]);

  const filtered=tasks.filter(t=>{
    if(filter==="active") return !["CLOSED","VERIFIED"].includes(t.status);
    if(filter==="closed") return ["CLOSED","VERIFIED"].includes(t.status);
    return true;
  });

  const stepIdx=(s:string)=>STEP_KEYS.indexOf(s);

  const nextAction=(t:MaintenanceTask)=>{
    switch(t.status){
      case "OPEN":        return {label:"Assign Technician",next:"ASSIGNED"};
      case "ASSIGNED":    return {label:"Start Work",next:"IN_PROGRESS"};
      case "IN_PROGRESS": return {label:"Mark Completed",next:"VERIFICATION_REQUIRED"};
      case "VERIFIED":    return {label:"Close Task",next:"CLOSED"};
      default:            return null;
    }
  };

  const handleStatus=async(t:MaintenanceTask,next:string)=>{
    const upd:Partial<MaintenanceTask>={status:next as any};
    if(next==="IN_PROGRESS"&&!t.started_at) upd.started_at=new Date().toISOString();
    await updateMaintenanceTask(t.id,upd);
    toast(`Status → ${next}`); load();
  };
  const handleVerify=async()=>{
    if(!sel) return;
    await updateMaintenanceTask(sel.id,{status:(verifyPass?"VERIFIED":"IN_PROGRESS") as any});
    setVM(false); toast(verifyPass?"Verified and closed":"Returned to In Progress"); load();
  };
  const handleEdit=async()=>{
    if(!sel) return;
    await updateMaintenanceTask(sel.id,{
      assigned_technician:editForm.tech||sel.assigned_technician,
      parts_used:editForm.parts||sel.parts_used,
      actual_hours:editForm.hours?parseFloat(editForm.hours):sel.actual_hours,
    });
    setEM(false); toast("Updated"); load();
  };

  const tl=(t:MaintenanceTask)=>{
    const items=[];
    if(t.created_at) items.push({id:"c",label:"Created",description:`${t.fault_description.substring(0,50)}…`,timestamp:timeAgo(t.created_at),status:"completed" as const});
    if(t.started_at) items.push({id:"s",label:"Started",description:`Assigned to ${t.assigned_technician??'—'}`,timestamp:timeAgo(t.started_at),status:"completed" as const});
    if(t.completed_at) items.push({id:"x",label:"Completed",description:"Work completed — awaiting verification",timestamp:timeAgo(t.completed_at),status:"completed" as const});
    if(t.status==="VERIFICATION_REQUIRED") items.push({id:"v",label:"Verification Required",description:"Pending verification",timestamp:"Now",status:"active" as const});
    if(t.status==="VERIFIED"||t.status==="CLOSED") items.push({id:"vd",label:"Verified",description:"Post-maintenance verification passed",timestamp:timeAgo(t.updated_at),status:"completed" as const});
    return items;
  };

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="Maintenance" title="Work Orders" subtitle="Infrastructure maintenance from fault detection to verified resolution">
        <select className="input-base" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="active">Active</option>
          <option value="all">All</option>
          <option value="closed">Closed</option>
        </select>
        <Button variant="primary" onClick={()=>navigate("/inspections")}>+ New work order</Button>
      </PageHeader>

      {/* Count cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[["ALL",tasks.length,""],[...STEPS.slice(0,3).map((l,i)=>[l.toUpperCase(),tasks.filter(t=>t.status===STEP_KEYS[i]).length,STEP_KEYS[i]])].flat()].slice(0,4).map((grp,i)=>{
          const label=i===0?"ALL":["SCHEDULED","IN PROGRESS","COMPLETED"][i-1];
          const count=i===0?tasks.length:tasks.filter(t=>t.status===["ASSIGNED","IN_PROGRESS","COMPLETED"][i-1]).length;
          return (
            <div key={i} className="card" style={{padding:18}}>
              <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>{label}</div>
              <div style={{fontSize:28,fontWeight:800,color:"var(--text-primary)"}}>{count}</div>
            </div>
          );
        })}
      </div>

      {feedback&&<div style={{background:"var(--status-ok-bg)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"7px 14px",fontSize:12,color:"var(--status-ok)",fontWeight:600}}>✓ {feedback}</div>}

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,minHeight:0}}>
        <ListPanel title={`${filtered.length} Orders`}>
          {filtered.map(task=>{
            const a=ASSETS.find(x=>x.id===task.asset_id);
            return (
              <ListRow key={task.id} active={sel?.id===task.id} onClick={()=>setSel(task)}>
                <div style={{display:"flex",gap:6,marginBottom:4,alignItems:"center"}}>
                  <div style={{width:24,height:24,borderRadius:4,background:"var(--bg-elevated)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
                    {task.status==="COMPLETED"||task.status==="VERIFIED"?"✓":"⚙"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:700,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.fault_description.substring(0,35)}…</div>
                    {a&&<div style={{fontSize:10,color:"var(--accent)",fontFamily:"monospace"}}>{a.asset_id}</div>}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                  <div style={{fontSize:10,color:"var(--text-muted)",fontFamily:"monospace"}}>{task.maintenance_id}</div>
                  <MaintenanceStatusBadge status={task.status}/>
                </div>
                {task.assigned_technician&&<div style={{fontSize:10,color:"var(--text-muted)",marginTop:3}}>👷 {task.assigned_technician}</div>}
                <div style={{fontSize:10,color:"var(--text-muted)",marginTop:2}}>{timeAgo(task.created_at)}</div>
              </ListRow>
            );
          })}
        </ListPanel>

        <div style={{display:"flex",flexDirection:"column",gap:16,overflow:"auto"}}>
          {sel?(<>
            {/* Header */}
            <div className="card" style={{padding:20}}>
              {/* WO ID and track */}
              <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>
                {sel.maintenance_id} · {ASSETS.find(a=>a.id===sel.asset_id)?.asset_id??"Asset"}
              </div>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                <h2 style={{fontSize:18,fontWeight:800,color:"var(--text-primary)",margin:0}}>{sel.fault_description.substring(0,50)}</h2>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
                <MaintenanceStatusBadge status={sel.status}/>
                <AlertPriorityBadge priority={sel.priority}/>
              </div>

              {/* Workflow steps */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Workflow</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                  {STEPS.map((step,i)=>(
                    <div key={step} style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{
                        padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:700,
                        background:i===stepIdx(sel.status)?"var(--accent)":i<stepIdx(sel.status)?"var(--status-ok-bg)":"var(--bg-elevated)",
                        color:i===stepIdx(sel.status)?"var(--text-inverse)":i<stepIdx(sel.status)?"var(--status-ok)":"var(--text-muted)",
                        border:`1px solid ${i===stepIdx(sel.status)?"var(--accent)":i<stepIdx(sel.status)?"var(--accent-border)":"var(--border)"}`,
                      }}>{step}</div>
                      {i<STEPS.length-1&&<span style={{color:"var(--border)",fontSize:10}}>→</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignee / Due / Asset */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                {[{l:"Assignee",v:sel.assigned_technician??"Unassigned"},{l:"Due",v:sel.started_at?timeAgo(sel.started_at):"Not started"},{l:"Asset",v:ASSETS.find(a=>a.id===sel.asset_id)?.asset_id??"—"}].map(d=>(
                  <div key={d.l} style={{background:"var(--bg-elevated)",borderRadius:6,padding:"10px 12px"}}>
                    <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>{d.l}</div>
                    <div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)"}}>{d.v}</div>
                  </div>
                ))}
              </div>

              {/* Notes / work description */}
              <div style={{background:"var(--bg-elevated)",borderRadius:6,padding:"10px 14px",marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Notes</div>
                <p style={{fontSize:12,color:"var(--text-primary)",margin:0,lineHeight:1.5}}>{sel.work_description}</p>
              </div>

              {sel.root_cause&&<div style={{background:"var(--bg-elevated)",borderRadius:6,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:6}}>Root Cause</div><p style={{fontSize:12,color:"var(--text-primary)",margin:0}}>{sel.root_cause}</p></div>}
              {sel.parts_used&&<div style={{background:"var(--status-blue-bg)",border:"1px solid rgba(74,158,255,.15)",borderRadius:6,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:10,fontWeight:700,color:"var(--status-blue)",textTransform:"uppercase",marginBottom:4}}>Parts Used</div><p style={{fontSize:12,color:"var(--text-primary)",margin:0}}>{sel.parts_used}</p></div>}

              {/* Verification badge */}
              {(()=>{const v=MAINTENANCE_VERIFICATIONS.find(x=>x.maintenance_task_id===sel.id);return v?(<div style={{background:v.passed?"var(--status-ok-bg)":"var(--status-crit-bg)",border:`1px solid ${v.passed?"var(--accent-border)":"rgba(232,64,64,.2)"}`,borderRadius:6,padding:"10px 14px",marginBottom:14}}><div style={{fontSize:10,fontWeight:700,color:v.passed?"var(--status-ok)":"var(--status-crit)",textTransform:"uppercase",marginBottom:4}}>Verification {v.passed?"Passed ✓":"Failed ✗"}</div><div style={{fontSize:11,color:"var(--text-secondary)"}}>By: {v.verified_by} · {formatTimestamp(v.verification_date)}</div>{v.notes&&<p style={{fontSize:11,color:"var(--text-primary)",margin:"6px 0 0"}}>{v.notes}</p>}</div>):null;})()}

              {/* Actions */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {(()=>{const a=nextAction(sel);return a?<Button variant="primary" size="sm" onClick={()=>handleStatus(sel,a.next)}>{a.label}</Button>:null;})()}
                {sel.status==="VERIFICATION_REQUIRED"&&<Button variant="primary" size="sm" onClick={()=>setVM(true)}>Verify Completion</Button>}
                <Button size="sm" onClick={()=>{setEF({tech:sel.assigned_technician??"",parts:sel.parts_used??"",hours:sel.actual_hours?.toString()??""});setEM(true);}}>Edit</Button>
                {sel.inspection_id&&<Button size="sm" variant="ghost" onClick={()=>navigate(`/inspections?id=${sel.inspection_id}`)}>Related Inspection</Button>}
              </div>
            </div>

            {/* Timeline */}
            <div className="card" style={{padding:16}}>
              <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",marginBottom:14}}>Timeline</div>
              <Timeline items={tl(sel)}/>
            </div>
          </>):(
            <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
              <div style={{textAlign:"center",color:"var(--text-muted)"}}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>⚙</div>
                <div style={{fontSize:13,fontWeight:600}}>Select a work order</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal open={verifyModal} onClose={()=>setVM(false)} title="Verify Maintenance Completion">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>Verification Notes</label>
          <textarea className="input-base" rows={3} value={verifyNotes} onChange={e=>setVN(e.target.value)} placeholder="Describe verification checks…" style={{width:"100%",resize:"vertical"}}/>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:"var(--text-primary)",fontWeight:500}}>
            <input type="checkbox" checked={verifyPass} onChange={e=>setVP(e.target.checked)} style={{width:14,height:14,accentColor:"var(--accent)"}}/>
            Verification Passed
          </label>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:8}}>
            <Button variant="ghost" onClick={()=>setVM(false)}>Cancel</Button>
            <Button variant={verifyPass?"primary":"danger"} onClick={handleVerify}>{verifyPass?"Mark Verified":"Return to In-Progress"}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={editModal} onClose={()=>setEM(false)} title="Update Work Order">
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[["Assigned Technician","tech","text"],["Parts Used","parts","text"],["Actual Hours","hours","number"]].map(([l,k,t])=>(
            <div key={k}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>{l}</label>
              <input className="input-base" type={t} value={(editForm as any)[k]} onChange={e=>setEF({...editForm,[k]:e.target.value})} style={{width:"100%"}}/>
            </div>
          ))}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:8}}>
            <Button variant="ghost" onClick={()=>setEM(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleEdit}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
