import { SimulatedDataBanner, PageHeader } from "../components/ui";
import { RAILWAY_LINES, SECTIONS, TRACK_CIRCUITS, ASSETS, FBG_SENSORS, ALERTS } from "../store/dataStore";

export function SystemPage() {
  const uptime="14d 03h 22m";
  const onlineSensors=FBG_SENSORS.filter(s=>s.sensor_status==="ONLINE").length;
  const totalSensors=FBG_SENSORS.length;
  const degraded=FBG_SENSORS.filter(s=>s.sensor_status==="DEGRADED").length;
  const offline=FBG_SENSORS.filter(s=>s.sensor_status==="OFFLINE").length;

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="System" title="System Status" subtitle="Platform runtime and infrastructure overview"/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {/* Runtime */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{width:28,height:28,borderRadius:6,background:"var(--status-ok-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⟳</div>
            <span style={{fontSize:13,fontWeight:700,color:"var(--text-primary)"}}>Runtime</span>
          </div>
          {[
            ["UPTIME",uptime],["VERSION","regen-core 1.0.0 MVP"],["REGION","za-johannesburg-1"],
            ["STORAGE","62% used"],["LAST SYNC",new Date().toLocaleTimeString("en-ZA",{hour12:false})],
            ["MODE","Simulation (offline)"],
          ].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid var(--border-subtle)"}}>
              <span style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",fontWeight:600}}>{l}</span>
              <span style={{fontSize:12,fontFamily:"monospace",color:"var(--text-primary)",fontWeight:600}}>{v}</span>
            </div>
          ))}
          <div style={{marginTop:14,background:"var(--status-ok-bg)",border:"1px solid var(--accent-border)",borderRadius:6,padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"var(--status-ok)"}} className="live-pulse"/>
            <span style={{fontSize:12,color:"var(--status-ok)",fontWeight:700}}>All systems operational</span>
          </div>
        </div>

        {/* Sensor health */}
        <div className="card">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:28,height:28,borderRadius:6,background:"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>◈</div>
              <span style={{fontSize:13,fontWeight:700,color:"var(--text-primary)"}}>Sensor health</span>
            </div>
            <span style={{fontSize:11,color:"var(--text-muted)"}}>{onlineSensors} of {totalSensors} online</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
            {[["ONLINE",onlineSensors,"var(--status-ok)"],["DEGRADED",degraded,"var(--status-warn)"],["OFFLINE",offline,"var(--status-offline)"]].map(([l,v,c])=>(
              <div key={String(l)}>
                <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>{l}</div>
                <div style={{fontSize:28,fontWeight:800,color:String(c)}}>{v}</div>
              </div>
            ))}
          </div>
          {/* Sensor grid */}
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {FBG_SENSORS.map(s=>(
              <div key={s.id} style={{
                width:16,height:16,borderRadius:3,
                background:s.sensor_status==="ONLINE"?s.risk_level==="WARNING"||s.risk_level==="HIGH"?"var(--status-warn)":"var(--status-ok)":s.sensor_status==="DEGRADED"?"var(--status-warn)":"var(--status-offline)",
                opacity:s.sensor_status==="OFFLINE"?0.4:0.85,
              }} title={s.sensor_id}/>
            ))}
            {/* Pad to ~128 to match reference look */}
            {Array.from({length:Math.max(0,100-FBG_SENSORS.length)},(_,i)=>(
              <div key={`pad-${i}`} style={{width:16,height:16,borderRadius:3,background:"var(--status-ok)",opacity:0.7}}/>
            ))}
          </div>
        </div>
      </div>

      {/* Data flow */}
      <div className="card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:6,background:"var(--status-ok-bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>⟿</div>
            <span style={{fontSize:13,fontWeight:700,color:"var(--text-primary)"}}>Data flow</span>
          </div>
          <span style={{fontSize:11,color:"var(--status-ok)",fontWeight:600}}>Live ingest pipeline</span>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,overflowX:"auto",paddingBottom:8}}>
          {[["SENSORS",totalSensors],["BROKER",totalSensors],["INGEST",totalSensors-1],["PROCESSING",totalSensors-1],["STORE",totalSensors-1]].map(([stage,count],i,arr)=>(
            <div key={String(stage)} style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{background:"var(--bg-elevated)",border:"1px solid var(--border)",borderRadius:6,padding:"10px 16px",textAlign:"center",minWidth:80}}>
                <div style={{fontSize:10,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:4}}>{stage}</div>
                <div style={{fontSize:18,fontWeight:800,color:"var(--text-primary)"}}>{count}</div>
                <div style={{display:"flex",alignItems:"center",gap:4,justifyContent:"center",marginTop:4}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"var(--status-ok)"}} className="live-pulse"/>
                  <span style={{fontSize:9,color:"var(--status-ok)",fontWeight:600}}>live</span>
                </div>
              </div>
              {i<arr.length-1&&<span style={{fontSize:16,color:"var(--border)",flexShrink:0}}>·····</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Platform stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {[
          {l:"Railway Lines",v:RAILWAY_LINES.length,sub:"Monitored"},
          {l:"Track Circuits",v:TRACK_CIRCUITS.length,sub:"Total circuits"},
          {l:"Infrastructure Assets",v:ASSETS.length,sub:"Physical assets"},
          {l:"Active Alerts",v:ALERTS.filter(a=>a.status!=="CLOSED"&&a.status!=="RESOLVED").length,sub:"Open/investigating"},
        ].map(s=>(
          <div key={s.l} className="card" style={{padding:16,textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:"var(--accent)",marginBottom:4}}>{s.v}</div>
            <div style={{fontSize:12,fontWeight:600,color:"var(--text-primary)"}}>{s.l}</div>
            <div style={{fontSize:10,color:"var(--text-muted)",marginTop:2}}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

