import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimulatedDataBanner, TrackCircuitStatusBadge, Button, PageHeader } from "../components/ui";
import { RAILWAY_LINES, SECTIONS, TRACK_CIRCUITS, ASSETS, FBG_SENSORS } from "../store/dataStore";
import type { TrackCircuit } from "../types";

const TC_C: Record<string,string> = {
  NORMAL:"var(--status-ok)",OCCUPIED:"var(--status-blue)",FAULT:"var(--status-crit)",
  UNKNOWN:"var(--status-warn)",OFFLINE:"var(--status-offline)",
};
const TCX: Record<string,number[]> = {
  "tc-001":[90,80],"tc-002":[130,80],"tc-003":[165,80],"tc-004":[195,80],
  "tc-005":[240,80],"tc-006":[280,80],"tc-007":[320,80],"tc-008":[370,80],
  "tc-009":[405,80],"tc-010":[440,80],"tc-011":[480,80],"tc-021":[535,80],"tc-013":[580,80],
  "tc-014":[100,190],"tc-015":[170,190],"tc-016":[270,190],"tc-017":[350,190],
  "tc-018":[105,300],"tc-019":[250,300],"tc-020":[460,300],
};
const STATIONS=[
  {x:60,y:75,t:"JHB Central"},{x:200,y:75,t:"Germiston Jct"},{x:335,y:75,t:"Boksburg N"},
  {x:455,y:75,t:"Benoni"},{x:607,y:75,t:"Daveyton"},
  {x:60,y:185,t:"Cape Town"},{x:215,y:185,t:"Bellville"},{x:365,y:185,t:"Kraaifontein"},{x:558,y:185,t:"Paarl"},
  {x:60,y:295,t:"Durban Hbr"},{x:195,y:295,t:"Rossburgh"},{x:385,y:295,t:"Amanzimtoti"},{x:578,y:295,t:"Umkomaas"},
];
const NETLINES=[
  {y:80,x1:60,x2:610,c:"#2a5298",label:"GC"},
  {y:190,x1:60,x2:560,c:"#1a8a8a",label:"CML"},
  {y:300,x1:60,x2:580,c:"#2a7a3a",label:"DCC"},
];

export function NetworkPage() {
  const navigate=useNavigate();
  const [selTc,setSelTc]=useState<TrackCircuit|null>(null);
  const [hov,setHov]=useState<string|null>(null);
  const [filterLine,setFL]=useState("all");

  const tcs=TRACK_CIRCUITS;
  const getTC=(id:string)=>tcs.find(t=>t.id===id);

  const lineCounts=RAILWAY_LINES.map(line=>({
    ...line,
    normal:tcs.filter(t=>t.railway_line_id===line.id&&t.status==="NORMAL").length,
    occupied:tcs.filter(t=>t.railway_line_id===line.id&&t.status==="OCCUPIED").length,
    fault:tcs.filter(t=>t.railway_line_id===line.id&&(t.status==="FAULT"||t.status==="UNKNOWN"||t.status==="OFFLINE")).length,
  }));

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="Network" title="Railway Network Map" subtitle="Simplified operational overview — schematic layout, not to scale">
        <select className="input-base" value={filterLine} onChange={e=>setFL(e.target.value)}>
          <option value="all">All Lines</option>
          {RAILWAY_LINES.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </PageHeader>

      {/* Line summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {lineCounts.map(line=>(
          <div key={line.id} className="card" style={{padding:14,cursor:"pointer",borderColor:filterLine===line.id?"var(--accent)":"var(--border)"}} onClick={()=>setFL(filterLine===line.id?"all":line.id)}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:NETLINES.find(n=>RAILWAY_LINES.indexOf(line)===NETLINES.indexOf(NETLINES[RAILWAY_LINES.indexOf(line)]))?.c??"var(--accent)"}}/>
              <span style={{fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>{line.name}</span>
            </div>
            <div style={{fontSize:11,color:"var(--text-muted)",marginBottom:8}}>{line.total_length_km} km · {line.status}</div>
            <div style={{display:"flex",gap:12,fontSize:11}}>
              <span style={{color:"var(--status-ok)",fontWeight:600}}>✓ {line.normal}</span>
              <span style={{color:"var(--status-blue)",fontWeight:600}}>● {line.occupied}</span>
              {line.fault>0&&<span style={{color:"var(--status-crit)",fontWeight:600}}>⚠ {line.fault}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* SVG map */}
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Network Diagram</div>
            <div style={{fontSize:10,color:"var(--text-muted)"}}>Click track circuits for detail. Pulsing = fault/unknown state.</div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {Object.entries(TC_C).map(([s,c])=>(
              <div key={s} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:10,color:"var(--text-muted)",fontWeight:600}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{overflowX:"auto",background:"var(--bg-base)"}}>
          <svg viewBox="0 0 680 380" style={{width:"100%",minWidth:600,minHeight:300}}>
            <rect width="680" height="380" fill="var(--bg-base)"/>
            {[80,160,240,320].map(y=><line key={y} x1="0" y1={y} x2="680" y2={y} stroke="var(--chart-grid)" strokeWidth="0.5"/>)}
            {NETLINES.map((nl,i)=>{
              if(filterLine!=="all"&&filterLine!==RAILWAY_LINES[i]?.id) return null;
              return (
                <g key={nl.label}>
                  <line x1={nl.x1} y1={nl.y} x2={nl.x2} y2={nl.y} stroke={nl.c} strokeWidth="5" strokeLinecap="round" opacity="0.8"/>
                  <text x="12" y={nl.y+4} fontSize="9" fill={nl.c} fontWeight="800" fontFamily="sans-serif">{nl.label}</text>
                  <text x={nl.x1} y={nl.y+16} fontSize="7" fill="var(--text-muted)" fontFamily="monospace" textAnchor="middle">{i===0?"GC-SEC-01–04":i===1?"CML-SEC-01–03":"DCC-SEC-01–03"}</text>
                </g>
              );
            })}
            {STATIONS.map((s,i)=>{
              const lineIdx=s.y<150?0:s.y<250?1:2;
              if(filterLine!=="all"&&filterLine!==RAILWAY_LINES[lineIdx]?.id) return null;
              return (
                <g key={i}>
                  <circle cx={s.x} cy={s.y} r="5" fill="var(--bg-surface)" stroke={NETLINES[lineIdx].c} strokeWidth="1.5"/>
                  <text x={s.x} y={s.y-10} textAnchor="middle" fontSize="8" fill="var(--text-muted)" fontFamily="sans-serif" fontWeight="600">{s.t}</text>
                </g>
              );
            })}
            {Object.entries(TCX).map(([id,[cx,cy]])=>{
              const tc=getTC(id);
              if(!tc) return null;
              if(filterLine!=="all"&&filterLine!==tc.railway_line_id) return null;
              const c=TC_C[tc.status]??"var(--status-offline)";
              const isFault=tc.status==="FAULT"||tc.status==="UNKNOWN";
              const isSel=selTc?.id===id;
              const isHov=hov===id;
              return (
                <g key={id} onClick={()=>setSelTc(isSel?null:tc)} onMouseEnter={()=>setHov(id)} onMouseLeave={()=>setHov(null)} style={{cursor:"pointer"}}>
                  {isFault&&<circle cx={cx} cy={cy} r="12" fill={c} opacity="0.15"><animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite"/></circle>}
                  <circle cx={cx} cy={cy} r={isSel||isHov?9:7} fill={c} stroke="var(--bg-surface)" strokeWidth={isSel?2.5:1.5}/>
                  {tc.status==="OCCUPIED"&&<circle cx={cx} cy={cy} r="3.5" fill="var(--bg-surface)" opacity="0.7"/>}
                  <text x={cx} y={cy+20} textAnchor="middle" fontSize="8" fill="var(--text-muted)" fontFamily="monospace" fontWeight={isFault?"bold":"normal"}>{tc.track_circuit_id}</text>
                </g>
              );
            })}
            <rect x="510" y="93" width="62" height="13" rx="2" fill="var(--status-crit)" opacity="0.9"/>
            <text x="541" y="102" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="bold">FAULT ⚠</text>
            <line x1="535" y1="87" x2="535" y2="93" stroke="var(--status-crit)" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      {/* Selected TC */}
      {selTc&&(
        <div className="card" style={{padding:16,borderColor:"var(--accent)"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"var(--text-primary)",fontFamily:"monospace",marginBottom:4}}>{selTc.track_circuit_id}</div>
              <div style={{fontSize:11,color:"var(--text-muted)"}}>{selTc.location_description}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <TrackCircuitStatusBadge status={selTc.status}/>
              <button onClick={()=>setSelTc(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",fontSize:18,lineHeight:1}}>&times;</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
            {[{l:"Signal",v:selTc.signal_relationship},{l:"Occupancy",v:selTc.occupancy?"OCCUPIED":"CLEAR"},{l:"Fault",v:selTc.fault_status??"None"},{l:"Last Update",v:new Date(selTc.last_update).toLocaleTimeString("en-ZA",{hour12:false})}].map(d=>(
              <div key={d.l} style={{background:"var(--bg-elevated)",borderRadius:6,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:3}}>{d.l}</div>
                <div style={{fontSize:12,fontWeight:600,color:"var(--text-primary)"}}>{d.v}</div>
              </div>
            ))}
          </div>
          {selTc.fault_description&&(
            <div style={{background:"var(--status-crit-bg)",border:"1px solid rgba(232,64,64,.2)",borderRadius:6,padding:"8px 12px",marginBottom:12,fontSize:11,color:"var(--text-primary)"}}>
              <span style={{color:"var(--status-crit)",fontWeight:700}}>Fault: </span>{selTc.fault_description}
            </div>
          )}
          <div style={{display:"flex",gap:8}}>
            <Button variant="primary" size="sm" onClick={()=>navigate(`/track-circuits?id=${selTc.id}`)}>Track Circuit Detail</Button>
            <Button size="sm" onClick={()=>navigate(`/assets?tc=${selTc.id}`)}>Related Assets</Button>
          </div>
        </div>
      )}

      {/* Section table */}
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Section Overview</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"var(--bg-elevated)"}}>
                {["Section","Line","Status","Track Circuits","Assets","FBG Sensors","Faults"].map(h=>(
                  <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"1px solid var(--border)"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTIONS.filter(sec=>filterLine==="all"||filterLine===sec.railway_line_id).map(sec=>{
                const line=RAILWAY_LINES.find(l=>l.id===sec.railway_line_id);
                const sTCs=TRACK_CIRCUITS.filter(t=>t.section_id===sec.id);
                const sAssets=ASSETS.filter(a=>a.section_id===sec.id);
                const sSensors=FBG_SENSORS.filter(s=>sAssets.some(a=>a.id===s.asset_id));
                const faults=sTCs.filter(t=>t.status==="FAULT"||t.status==="UNKNOWN"||t.status==="OFFLINE").length;
                return (
                  <tr key={sec.id} className="table-row">
                    <td style={{padding:"9px 14px",fontWeight:700,color:"var(--text-primary)",fontSize:12}}>{sec.name}</td>
                    <td style={{padding:"9px 14px",fontSize:11,color:"var(--text-muted)"}}>{line?.code}</td>
                    <td style={{padding:"9px 14px"}}>
                      <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,
                        background:sec.status==="OPERATIONAL"?"var(--status-ok-bg)":sec.status==="MAINTENANCE"?"var(--status-warn-bg)":"var(--status-crit-bg)",
                        color:sec.status==="OPERATIONAL"?"var(--status-ok)":sec.status==="MAINTENANCE"?"var(--status-warn)":"var(--status-crit)",
                        border:`1px solid ${sec.status==="OPERATIONAL"?"var(--accent-border)":"rgba(240,165,0,.2)"}`,
                      }}>{sec.status}</span>
                    </td>
                    <td style={{padding:"9px 14px",fontSize:12,fontFamily:"monospace",color:"var(--text-primary)"}}>{sTCs.length}</td>
                    <td style={{padding:"9px 14px",fontSize:12,fontFamily:"monospace",color:"var(--text-primary)"}}>{sAssets.length}</td>
                    <td style={{padding:"9px 14px",fontSize:12,fontFamily:"monospace",color:"var(--text-primary)"}}>{sSensors.length}</td>
                    <td style={{padding:"9px 14px"}}>{faults>0?<span style={{fontSize:11,fontWeight:700,color:"var(--status-crit)"}}>⚠ {faults}</span>:<span style={{fontSize:11,color:"var(--status-ok)"}}>✓ None</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
