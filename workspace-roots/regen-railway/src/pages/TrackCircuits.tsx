import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card, SimulatedDataBanner, TrackCircuitStatusBadge, Button,
  Timeline, ListPanel, ListRow, InfoGrid, PageHeader
} from "../components/ui";
import { fetchTrackCircuits, fetchTrackCircuitEvents } from "../store/dataStore";
import { RAILWAY_LINES } from "../store/dataStore";
import { formatTime, timeAgo } from "../utils";
import { onSimUpdate } from "../store/simulation";
import type { TrackCircuit, TrackCircuitEvent } from "../types";

const STEPS = ["Normal","Occupied","Fault Detected","Investigation","Assigned","Resolved","Verified"];

export function TrackCircuitsPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [circuits, setCircuits] = useState<TrackCircuit[]>([]);
  const [selected, setSelected] = useState<TrackCircuit | null>(null);
  const [events, setEvents] = useState<TrackCircuitEvent[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLine, setFilterLine]   = useState("all");
  const [loading, setLoading]         = useState(true);

  const selectCircuit = useCallback(async (tc: TrackCircuit) => {
    setSelected(tc);
    const evts = await fetchTrackCircuitEvents(tc.id);
    setEvents(evts);
  }, []);

  const load = useCallback(() => {
    fetchTrackCircuits().then(data => {
      setCircuits(data);
      setLoading(false);
      const paramId = params.get("id");
      if (paramId) {
        const found = data.find(tc => tc.id === paramId || tc.track_circuit_id === paramId);
        if (found) selectCircuit(found);
      } else if (!selected) {
        const demo = data.find(tc => tc.track_circuit_id === "TC-021");
        if (demo) selectCircuit(demo);
      }
    });
  }, [params, selectCircuit]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => onSimUpdate(() => {
    fetchTrackCircuits().then(data => {
      setCircuits(data);
      if (selected) {
        const updated = data.find(t => t.id === selected.id);
        if (updated) setSelected(updated);
      }
    });
  }), [selected]);

  const filtered = circuits.filter(tc => {
    if (filterStatus !== "all" && tc.status !== filterStatus) return false;
    if (filterLine   !== "all" && tc.railway_line_id !== filterLine) return false;
    return true;
  });

  const timelineItems = events.slice(0, 8).map(evt => ({
    id: evt.id,
    label: evt.new_status === "FAULT" ? "Fault Detected" : evt.new_status === "OCCUPIED" ? "Occupied" :
           evt.new_status === "NORMAL" ? "Normal" : evt.new_status,
    description: evt.description,
    timestamp: formatTime(evt.timestamp),
    status: (evt.new_status === "FAULT" ? "fault" : evt.new_status === "NORMAL" ? "completed" :
             evt.new_status === "OCCUPIED" ? "active" : "pending") as "completed"|"active"|"pending"|"fault",
  }));

  const currentStep = selected ? (
    selected.status === "FAULT" || selected.status === "UNKNOWN" ? 2 :
    selected.status === "OCCUPIED" ? 1 : 0
  ) : -1;

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <SimulatedDataBanner />
      <PageHeader breadcrumb="Track" title="Track Circuit Monitoring"
        subtitle="Read-only status received from signalling systems. REGEN does not control track circuits.">
        <div style={{ display:"flex", gap:8 }}>
          <select className="input-base" value={filterLine} onChange={e=>setFilterLine(e.target.value)}>
            <option value="all">All Lines</option>
            {RAILWAY_LINES.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <select className="input-base" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            {["NORMAL","OCCUPIED","FAULT","UNKNOWN","OFFLINE"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </PageHeader>

      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:16, minHeight:0 }}>
        {/* List */}
        <ListPanel title="Track Circuits" count={filtered.length}>
          {loading && <div style={{padding:24,textAlign:"center",color:"var(--text-muted)",fontSize:12}}>Loading...</div>}
          {filtered.map(tc => (
            <ListRow key={tc.id} active={selected?.id===tc.id} onClick={()=>selectCircuit(tc)}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",fontFamily:"monospace"}}>{tc.track_circuit_id}</span>
                    {tc.fault_status&&<div style={{width:6,height:6,borderRadius:"50%",background:"var(--status-crit)",flexShrink:0}} className="live-pulse"/>}
                  </div>
                  <div style={{fontSize:10,color:"var(--text-muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tc.location_description}</div>
                  <div style={{fontSize:10,color:"var(--text-muted)",fontFamily:"monospace",marginTop:2}}>{tc.signal_relationship}</div>
                </div>
                <TrackCircuitStatusBadge status={tc.status}/>
              </div>
              {tc.fault_description&&(
                <div style={{marginTop:6,fontSize:10,color:"var(--status-crit)",background:"var(--status-crit-bg)",borderRadius:4,padding:"3px 7px"}}>
                  {tc.fault_description.substring(0,55)}…
                </div>
              )}
            </ListRow>
          ))}
        </ListPanel>

        {/* Detail */}
        <div style={{display:"flex",flexDirection:"column",gap:16,overflow:"auto"}}>
          {selected ? (<>
            {/* Header card */}
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
                    <span style={{fontSize:24,fontWeight:900,color:"var(--text-primary)",fontFamily:"monospace"}}>{selected.track_circuit_id}</span>
                    <TrackCircuitStatusBadge status={selected.status}/>
                  </div>
                  <div style={{fontSize:12,color:"var(--text-muted)"}}>{selected.location_description}</div>
                </div>
                <div style={{textAlign:"right",fontSize:10,color:"var(--text-muted)"}}>
                  <div>Last update</div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--text-primary)",fontFamily:"monospace"}}>{formatTime(selected.last_update)}</div>
                  <div>{timeAgo(selected.last_update)}</div>
                </div>
              </div>

              {selected.fault_description&&(
                <div style={{background:"var(--status-crit-bg)",border:"1px solid rgba(232,64,64,.25)",borderRadius:6,padding:"10px 14px",marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--status-crit)",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>⚠ Fault Condition</div>
                  <div style={{fontSize:12,color:"var(--text-primary)"}}>{selected.fault_description}</div>
                  <div style={{fontSize:11,color:"var(--status-warn)",marginTop:4,fontWeight:600}}>Action: Physical verification required</div>
                </div>
              )}

              <InfoGrid items={[
                {label:"Section",       value:(selected as any).section?.code ?? "—"},
                {label:"Line",          value:(selected as any).railway_line?.name?.split(" ")[0] ?? "—"},
                {label:"Occupancy",     value:selected.occupancy?"OCCUPIED":"CLEAR"},
                {label:"Signal",        value:selected.signal_relationship},
                {label:"Fault Status",  value:selected.fault_status ?? "None"},
                {label:"Last Update",   value:timeAgo(selected.last_update)},
              ]}/>

              <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                <Button variant="primary" size="sm" onClick={()=>navigate(`/assets?tc=${selected.id}`)}>Related Assets</Button>
                <Button size="sm" onClick={()=>navigate(`/alerts?tc=${selected.id}`)}>Alerts</Button>
                {(selected.status==="FAULT"||selected.status==="UNKNOWN")&&(
                  <Button variant="danger" size="sm" onClick={()=>navigate(`/inspections?create=1&tc=${selected.id}`)}>Create Inspection</Button>
                )}
              </div>
            </div>

            {/* Workflow */}
            <div className="card">
              <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",marginBottom:12}}>Fault Response Workflow</div>
              <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                {STEPS.map((step,i)=>(
                  <div key={step} style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{
                      padding:"4px 10px",borderRadius:4,fontSize:10,fontWeight:700,
                      background:i===currentStep?"var(--accent)":i<currentStep?"var(--status-ok-bg)":"var(--bg-elevated)",
                      color:i===currentStep?"var(--text-inverse)":i<currentStep?"var(--status-ok)":"var(--text-muted)",
                      border:`1px solid ${i===currentStep?"var(--accent)":i<currentStep?"var(--status-ok)":"var(--border)"}`,
                    }}>{step}</div>
                    {i<STEPS.length-1&&<span style={{color:"var(--border)",fontSize:11}}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",marginBottom:14}}>
                Event Timeline <span style={{fontSize:10,color:"var(--text-muted)",fontWeight:400}}>({events.length} events)</span>
              </div>
              {timelineItems.length>0
                ? <Timeline items={timelineItems}/>
                : <div style={{fontSize:11,color:"var(--text-muted)",textAlign:"center",padding:"16px 0"}}>No events recorded</div>
              }
            </div>
          </>) : (
            <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
              <div style={{textAlign:"center",color:"var(--text-muted)"}}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>⊡</div>
                <div style={{fontSize:13,fontWeight:600}}>Select a track circuit</div>
                <div style={{fontSize:11,marginTop:6}}>Click a circuit from the list to view details</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
