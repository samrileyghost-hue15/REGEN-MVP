import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { SimulatedDataBanner, PageHeader, Tabs } from "../components/ui";
import { TRACK_CIRCUITS, SECTIONS, ASSETS, FBG_SENSORS, ALERTS, INSPECTIONS, MAINTENANCE_TASKS, RAILWAY_LINES } from "../store/dataStore";

const TT={background:"var(--bg-elevated)",border:"1px solid var(--border)",borderRadius:6,fontSize:11,color:"var(--text-primary)"};

export function ReportsPage() {
  const [tab,setTab]=useState("overview");

  const tcStatus=[
    {n:"Normal",   v:TRACK_CIRCUITS.filter(t=>t.status==="NORMAL").length,   c:"var(--status-ok)"},
    {n:"Occupied", v:TRACK_CIRCUITS.filter(t=>t.status==="OCCUPIED").length,  c:"var(--status-blue)"},
    {n:"Fault",    v:TRACK_CIRCUITS.filter(t=>t.status==="FAULT").length,     c:"var(--status-crit)"},
    {n:"Unknown",  v:TRACK_CIRCUITS.filter(t=>t.status==="UNKNOWN").length,   c:"var(--status-warn)"},
    {n:"Offline",  v:TRACK_CIRCUITS.filter(t=>t.status==="OFFLINE").length,   c:"var(--status-offline)"},
  ];
  const assetCond=[
    {n:"Good",     v:ASSETS.filter(a=>a.condition==="GOOD").length,                     c:"var(--status-ok)"},
    {n:"Fair",     v:ASSETS.filter(a=>a.condition==="FAIR").length,                     c:"var(--status-blue)"},
    {n:"Warning",  v:ASSETS.filter(a=>a.condition==="WARNING").length,                  c:"var(--status-warn)"},
    {n:"Critical", v:ASSETS.filter(a=>a.condition==="CRITICAL").length,                 c:"var(--status-crit)"},
    {n:"Req Verify",v:ASSETS.filter(a=>a.condition==="REQUIRES_VERIFICATION").length,   c:"#f97316"},
  ];
  const sensorRisk=[
    {n:"Low",     v:FBG_SENSORS.filter(s=>s.risk_level==="LOW").length,      c:"var(--status-ok)"},
    {n:"Moderate",v:FBG_SENSORS.filter(s=>s.risk_level==="MODERATE").length, c:"var(--status-blue)"},
    {n:"Warning", v:FBG_SENSORS.filter(s=>s.risk_level==="WARNING").length,  c:"var(--status-warn)"},
    {n:"High",    v:FBG_SENSORS.filter(s=>s.risk_level==="HIGH").length,     c:"#f97316"},
    {n:"Critical",v:FBG_SENSORS.filter(s=>s.risk_level==="CRITICAL").length, c:"var(--status-crit)"},
    {n:"Offline", v:FBG_SENSORS.filter(s=>s.risk_level==="OFFLINE").length,  c:"var(--status-offline)"},
  ];
  const maintStatus=[
    {n:"Open",     v:MAINTENANCE_TASKS.filter(t=>t.status==="OPEN").length,                    c:"var(--status-crit)"},
    {n:"Assigned", v:MAINTENANCE_TASKS.filter(t=>t.status==="ASSIGNED").length,                c:"var(--status-blue)"},
    {n:"In Progress",v:MAINTENANCE_TASKS.filter(t=>t.status==="IN_PROGRESS").length,           c:"var(--status-warn)"},
    {n:"Completed",v:MAINTENANCE_TASKS.filter(t=>t.status==="COMPLETED").length,               c:"var(--status-ok)"},
    {n:"Verify",   v:MAINTENANCE_TASKS.filter(t=>t.status==="VERIFICATION_REQUIRED").length,   c:"#f97316"},
    {n:"Verified", v:MAINTENANCE_TASKS.filter(t=>t.status==="VERIFIED").length,                c:"var(--accent)"},
    {n:"Closed",   v:MAINTENANCE_TASKS.filter(t=>t.status==="CLOSED").length,                  c:"var(--status-offline)"},
  ];
  const perLine=RAILWAY_LINES.map(line=>{
    const secs=SECTIONS.filter(s=>s.railway_line_id===line.id);
    const lineTCs=TRACK_CIRCUITS.filter(t=>t.railway_line_id===line.id);
    const lineAssets=ASSETS.filter(a=>secs.some(s=>s.id===a.section_id));
    const lineSensors=FBG_SENSORS.filter(s=>lineAssets.some(a=>a.id===s.asset_id));
    return {n:line.code,sections:secs.length,circuits:lineTCs.length,assets:lineAssets.length,sensors:lineSensors.length,alerts:ALERTS.filter(a=>a.railway_line_id===line.id&&a.status!=="CLOSED").length,faults:lineTCs.filter(t=>t.status==="FAULT").length};
  });
  const trend=[
    {m:"Oct",alerts:12,faults:3},{m:"Nov",alerts:8,faults:2},{m:"Dec",alerts:15,faults:5},
    {m:"Jan",alerts:10,faults:2},{m:"Feb",alerts:18,faults:6},{m:"Mar",alerts:ALERTS.length,faults:TRACK_CIRCUITS.filter(t=>t.status==="FAULT").length},
  ];
  const summary=[
    {l:"Railway Lines",v:RAILWAY_LINES.length},{l:"Sections",v:SECTIONS.length},
    {l:"Track Circuits",v:TRACK_CIRCUITS.length},{l:"Infrastructure Assets",v:ASSETS.length},
    {l:"FBG Sensors",v:FBG_SENSORS.length},{l:"Total Alerts",v:ALERTS.length},
    {l:"Inspections",v:INSPECTIONS.length},{l:"Maintenance Tasks",v:MAINTENANCE_TASKS.length},
  ];

  const Chart=({data,title,sub}:{data:{n:string;v:number;c:string}[];title:string;sub?:string})=>(
    <div className="card">
      <div style={{marginBottom:10}}><div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>{title}</div>{sub&&<div style={{fontSize:10,color:"var(--text-muted)",marginTop:2}}>{sub}</div>}</div>
      <div style={{height:180}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{top:4,right:4,bottom:4,left:-20}}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)"/>
            <XAxis dataKey="n" tick={{fontSize:9,fill:"var(--text-muted)"}}/>
            <YAxis allowDecimals={false} tick={{fontSize:9,fill:"var(--text-muted)"}}/>
            <Tooltip contentStyle={TT}/>
            <Bar dataKey="v" name="Count" radius={[3,3,0,0]}>{data.map((e,i)=><Cell key={i} fill={e.c}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="Reports" title="Reports" subtitle="Platform analytics — simulated data only"/>
      <Tabs
        tabs={[{id:"overview",label:"Overview"},{id:"network",label:"By Line"},{id:"sensors",label:"Sensors"},{id:"trends",label:"Trends"}]}
        active={tab} onChange={setTab}
      />

      {tab==="overview"&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            {summary.map(s=>(
              <div key={s.l} className="card" style={{padding:14,textAlign:"center"}}>
                <div style={{fontSize:26,fontWeight:800,color:"var(--accent)"}}>{s.v}</div>
                <div style={{fontSize:11,fontWeight:600,color:"var(--text-primary)",marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Chart data={tcStatus} title="Track Circuit Status Distribution"/>
            <Chart data={assetCond} title="Asset Condition Distribution"/>
            <Chart data={maintStatus} title="Maintenance Task Status"/>
            <div className="card">
              <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",marginBottom:10}}>FBG Risk Levels</div>
              <div style={{height:180}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sensorRisk} cx="50%" cy="50%" outerRadius={70} dataKey="v" label={({name, value}: any) => `${name}: ${value}`} labelLine={false} fontSize={9}>
                      {sensorRisk.map((e,i)=><Cell key={i} fill={e.c}/>)}
                    </Pie>
                    <Tooltip contentStyle={TT}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="network"&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card">
            <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",marginBottom:14}}>Per-Line Summary</div>
            <div style={{height:220}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perLine} margin={{top:4,right:4,bottom:4,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)"/>
                  <XAxis dataKey="n" tick={{fontSize:11,fill:"var(--text-muted)"}}/>
                  <YAxis allowDecimals={false} tick={{fontSize:9,fill:"var(--text-muted)"}}/>
                  <Tooltip contentStyle={TT}/>
                  <Legend wrapperStyle={{fontSize:10}}/>
                  {[["sections","var(--accent)"],["circuits","var(--status-blue)"],["assets","var(--status-ok)"],["sensors","var(--status-warn)"],["alerts","var(--status-crit)"]].map(([k,c])=>(
                    <Bar key={k} dataKey={k} name={k.charAt(0).toUpperCase()+k.slice(1)} fill={String(c)} radius={[3,3,0,0]}/>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Per-Line Detail</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"var(--bg-elevated)"}}>
                  {["Line","Sections","Circuits","Faults","Assets","FBG Sensors","Active Alerts"].map(h=>(
                    <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"1px solid var(--border)"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perLine.map(d=>(
                  <tr key={d.n} className="table-row">
                    <td style={{padding:"9px 14px",fontWeight:700,color:"var(--text-primary)"}}>{d.n}</td>
                    {[d.sections,d.circuits].map((v,i)=><td key={i} style={{padding:"9px 14px",color:"var(--text-muted)",fontFamily:"monospace"}}>{v}</td>)}
                    <td style={{padding:"9px 14px"}}>{d.faults>0?<span style={{color:"var(--status-crit)",fontWeight:700}}>⚠ {d.faults}</span>:<span style={{color:"var(--status-ok)"}}>✓ 0</span>}</td>
                    {[d.assets,d.sensors].map((v,i)=><td key={i} style={{padding:"9px 14px",color:"var(--text-muted)",fontFamily:"monospace"}}>{v}</td>)}
                    <td style={{padding:"9px 14px"}}>{d.alerts>0?<span style={{color:"var(--status-warn)",fontWeight:700}}>{d.alerts}</span>:<span style={{color:"var(--text-muted)"}}>0</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==="sensors"&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Chart data={sensorRisk} title="FBG Sensor Risk Distribution" sub="All sensors by simulated risk level"/>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"10px 16px",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>FBG Sensor Summary</div>
            <div style={{overflowX:"auto",maxHeight:400,overflowY:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead style={{position:"sticky",top:0,background:"var(--bg-elevated)"}}>
                  <tr>{["Sensor","Asset","Baseline","Current","Deviation","Change","Trend","Risk","Status"].map(h=>(
                    <th key={h} style={{padding:"7px 12px",textAlign:h==="Sensor"||h==="Asset"?"left":"right",fontSize:9,fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"1px solid var(--border)"}}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {FBG_SENSORS.map(s=>(
                    <tr key={s.id} className="table-row">
                      <td style={{padding:"6px 12px",fontFamily:"monospace",fontWeight:600,color:"var(--text-primary)"}}>{s.sensor_id}</td>
                      <td style={{padding:"6px 12px",fontFamily:"monospace",color:"var(--text-muted)"}}>{ASSETS.find(a=>a.id===s.asset_id)?.asset_id}</td>
                      <td style={{padding:"6px 12px",textAlign:"right",color:"var(--text-muted)"}}>{s.baseline_strain}</td>
                      <td style={{padding:"6px 12px",textAlign:"right",fontWeight:600,color:"var(--text-primary)"}}>{s.current_strain}</td>
                      <td style={{padding:"6px 12px",textAlign:"right",fontWeight:600,color:s.deviation>0?"var(--status-crit)":"var(--status-ok)"}}>{s.deviation>0?"+":""}{s.deviation}</td>
                      <td style={{padding:"6px 12px",textAlign:"right",fontWeight:600,color:s.percentage_change>25?"var(--status-crit)":"var(--text-primary)"}}>{s.percentage_change>0?"+":""}{s.percentage_change.toFixed(1)}%</td>
                      <td style={{padding:"6px 12px",textAlign:"right",color:"var(--text-muted)"}}>{s.trend}</td>
                      <td style={{padding:"6px 12px",textAlign:"right",fontWeight:600,color:s.risk_level==="HIGH"||s.risk_level==="CRITICAL"?"var(--status-crit)":s.risk_level==="WARNING"?"var(--status-warn)":"var(--status-ok)"}}>{s.risk_level}</td>
                      <td style={{padding:"6px 12px",textAlign:"right",color:"var(--text-muted)"}}>{s.sensor_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab==="trends"&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div className="card" style={{background:"var(--status-warn-bg)",border:"1px solid rgba(240,165,0,.2)",padding:"8px 14px",fontSize:11,color:"var(--status-warn)"}}>
            <span style={{fontWeight:700}}>Note: </span>Monthly trend data is simulated for demonstration purposes.
          </div>
          <div className="card">
            <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",marginBottom:4}}>Alert Volume Trend (6 months)</div>
            <div style={{fontSize:10,color:"var(--text-muted)",marginBottom:14}}>Simulated historical data</div>
            <div style={{height:220}}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{top:4,right:12,bottom:4,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)"/>
                  <XAxis dataKey="m" tick={{fontSize:11,fill:"var(--text-muted)"}}/>
                  <YAxis allowDecimals={false} tick={{fontSize:9,fill:"var(--text-muted)"}}/>
                  <Tooltip contentStyle={TT}/>
                  <Legend wrapperStyle={{fontSize:10}}/>
                  <Line type="monotone" dataKey="alerts" name="Total Alerts" stroke="var(--accent)" strokeWidth={2} dot={{r:4,fill:"var(--accent)"}}/>
                  <Line type="monotone" dataKey="faults" name="TC Faults" stroke="var(--status-crit)" strokeWidth={2} dot={{r:4,fill:"var(--status-crit)"}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)",marginBottom:14}}>Platform Metrics</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {[
                {l:"TC Operational Rate", v:`${((TRACK_CIRCUITS.filter(t=>t.status==="NORMAL").length/TRACK_CIRCUITS.length)*100).toFixed(0)}%`},
                {l:"FBG Online Rate",      v:`${((FBG_SENSORS.filter(s=>s.sensor_status==="ONLINE").length/FBG_SENSORS.length)*100).toFixed(0)}%`},
                {l:"Alert Resolution",    v:`${((ALERTS.filter(a=>a.status==="CLOSED"||a.status==="RESOLVED").length/ALERTS.length)*100).toFixed(0)}%`},
                {l:"Inspection Completion",v:`${((INSPECTIONS.filter(i=>i.status==="COMPLETED").length/INSPECTIONS.length)*100).toFixed(0)}%`},
                {l:"Open Maintenance",    v:`${MAINTENANCE_TASKS.filter(t=>!["CLOSED","VERIFIED"].includes(t.status)).length} tasks`},
                {l:"Network Coverage",    v:`${RAILWAY_LINES.length} lines · ${SECTIONS.length} sections`},
              ].map(m=>(
                <div key={m.l} style={{background:"var(--bg-elevated)",borderRadius:6,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>{m.l}</div>
                  <div style={{fontSize:16,fontWeight:700,color:"var(--accent)"}}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

