import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { SimulatedDataBanner, RiskBadge, TrendBadge, SensorStatusBadge, ListPanel, ListRow, InfoGrid, PageHeader, Button } from "../components/ui";
import { fetchFbgSensors, fetchFbgReadings } from "../store/dataStore";
import { ASSETS } from "../store/dataStore";
import { formatTime, timeAgo } from "../utils";
import { onSimUpdate } from "../store/simulation";
import type { FbgSensor, FbgReading } from "../types";

const TT = { background:"var(--bg-elevated)",border:"1px solid var(--border)",borderRadius:6,fontSize:11,color:"var(--text-primary)" };

export function FbgMonitoringPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [sensors, setSensors]   = useState<FbgSensor[]>([]);
  const [selected, setSelected] = useState<FbgSensor|null>(null);
  const [readings, setReadings] = useState<FbgReading[]>([]);
  const [filterRisk, setFR]     = useState("all");
  const [loading, setLoading]   = useState(true);

  const selectSensor = useCallback(async (s: FbgSensor) => {
    setSelected(s);
    const r = await fetchFbgReadings(s.id, 100);
    setReadings(r);
  }, []);

  const load = useCallback(() => {
    fetchFbgSensors().then(data => {
      setSensors(data);
      setLoading(false);
      const pid = params.get("id"), pa = params.get("asset");
      if (pid) { const f=data.find(s=>s.id===pid||s.sensor_id===pid); if(f){selectSensor(f);return;} }
      if (pa)  { const f=data.find(s=>s.asset_id===pa); if(f){selectSensor(f);return;} }
      if (!selected) { const demo=data.find(s=>s.sensor_id==="FBG-00021"); if(demo) selectSensor(demo); }
    });
  }, [params, selectSensor]);

  useEffect(()=>{ load(); },[load]);
  useEffect(()=>onSimUpdate(()=>{
    fetchFbgSensors().then(data=>{
      setSensors(data);
      if(selected){
        const upd=data.find(s=>s.id===selected.id);
        if(upd){ setSelected(upd); fetchFbgReadings(upd.id,100).then(setReadings); }
      }
    });
  }),[selected]);

  const filtered = sensors.filter(s => filterRisk==="all"||s.risk_level===filterRisk);

  const chartData = readings.map(r=>({
    t: formatTime(r.timestamp),
    v: r.strain_value,
  }));

  const asset = selected ? ASSETS.find(a=>a.id===selected.asset_id) : null;

  return (
    <div className="fade-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <SimulatedDataBanner/>
      <PageHeader breadcrumb="FBG" title="FBG Sensor Monitoring"
        subtitle="Fiber Bragg Grating structural strain — secondary infrastructure layer. Does not replace track circuit monitoring.">
        <select className="input-base" value={filterRisk} onChange={e=>setFR(e.target.value)}>
          <option value="all">All Risk Levels</option>
          {["LOW","MODERATE","WARNING","HIGH","CRITICAL","OFFLINE"].map(r=><option key={r}>{r}</option>)}
        </select>
      </PageHeader>

      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16,minHeight:0}}>
        <ListPanel title="Sensors" count={filtered.length}>
          {loading&&<div style={{padding:24,textAlign:"center",color:"var(--text-muted)",fontSize:12}}>Loading…</div>}
          {filtered.map(s=>{
            const a=ASSETS.find(x=>x.id===s.asset_id);
            const isHigh=["HIGH","CRITICAL","WARNING"].includes(s.risk_level);
            return (
              <ListRow key={s.id} active={selected?.id===s.id} onClick={()=>selectSensor(s)}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:4}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                      <span style={{fontSize:11,fontWeight:700,color:"var(--text-primary)",fontFamily:"monospace"}}>{s.sensor_id}</span>
                      {isHigh&&s.sensor_status==="ONLINE"&&<div style={{width:5,height:5,borderRadius:"50%",background:"var(--status-warn)"}} className="live-pulse"/>}
                    </div>
                    {a&&<div style={{fontSize:10,color:"var(--text-muted)",fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.asset_id}</div>}
                    <div style={{display:"flex",gap:8,marginTop:3,fontSize:11}}>
                      <span style={{fontWeight:600,color:s.percentage_change>50?"var(--status-crit)":s.percentage_change>20?"var(--status-warn)":"var(--text-primary)"}}>{s.current_strain} µε</span>
                      <span style={{color:s.percentage_change>0?"var(--status-crit)":"var(--status-ok)",fontWeight:600}}>{s.percentage_change>0?"+":""}{s.percentage_change.toFixed(1)}%</span>
                    </div>
                  </div>
                  <RiskBadge risk={s.risk_level}/>
                </div>
                <TrendBadge trend={s.trend}/>
              </ListRow>
            );
          })}
        </ListPanel>

        <div style={{display:"flex",flexDirection:"column",gap:16,overflow:"auto"}}>
          {selected?(<>
            {/* Sensor header */}
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:20,fontWeight:900,color:"var(--text-primary)",fontFamily:"monospace"}}>{selected.sensor_id}</span>
                    <SensorStatusBadge status={selected.sensor_status}/>
                    <RiskBadge risk={selected.risk_level}/>
                  </div>
                  <div style={{fontSize:12,color:"var(--text-muted)"}}>{selected.sensor_name}</div>
                  {asset&&<div style={{fontSize:11,color:"var(--text-muted)",marginTop:2}}>
                    Asset: <span style={{color:"var(--accent)",cursor:"pointer",fontWeight:600}} onClick={()=>navigate(`/assets?id=${asset.id}`)}>{asset.asset_id}</span> — {asset.location_description}
                  </div>}
                </div>
              </div>

              {(selected.risk_level==="WARNING"||selected.risk_level==="HIGH"||selected.risk_level==="CRITICAL")&&(
                <div style={{background:"var(--status-warn-bg)",border:"1px solid rgba(240,165,0,.2)",borderRadius:6,padding:"8px 14px",marginBottom:14}}>
                  <div style={{fontSize:10,fontWeight:700,color:"var(--status-warn)",textTransform:"uppercase"}}>Simulated {selected.risk_level} Risk</div>
                  <div style={{fontSize:11,color:"var(--text-secondary)",marginTop:3}}>
                    This FBG sensor reports strain above the simulated {selected.risk_level.toLowerCase()} threshold. Risk classification is SIMULATED — does not confirm structural failure.
                  </div>
                </div>
              )}

              <InfoGrid items={[
                {label:"Baseline",      value:`${selected.baseline_strain} µε`},
                {label:"Current",       value:<span style={{color:selected.percentage_change>50?"var(--status-crit)":"var(--text-primary)",fontWeight:700}}>{selected.current_strain} µε</span>},
                {label:"Deviation",     value:<span style={{color:selected.deviation>0?"var(--status-crit)":"var(--status-ok)",fontWeight:700}}>{selected.deviation>0?"+":""}{selected.deviation} µε</span>},
                {label:"% Change",      value:<span style={{color:selected.percentage_change>25?"var(--status-crit)":"var(--text-primary)",fontWeight:700}}>{selected.percentage_change>0?"+":""}{selected.percentage_change.toFixed(1)}%</span>},
                {label:"Warn Threshold",value:`${selected.warning_threshold} µε *`},
                {label:"Crit Threshold",value:`${selected.critical_threshold} µε *`},
                {label:"Wavelength",    value:`${selected.wavelength_nm} nm`},
                {label:"Last Reading",  value:timeAgo(selected.last_reading)},
              ]}/>
              <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                <TrendBadge trend={selected.trend}/>
                <Button size="sm" variant="primary" onClick={()=>navigate(`/assets?id=${selected.asset_id}`)}>Asset Detail</Button>
              </div>
            </div>

            {/* Chart */}
            <div className="card">
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Strain Time Series</div>
                  <div style={{fontSize:10,color:"var(--text-muted)",marginTop:2}}>{readings.length} readings — baseline, warning & critical thresholds shown *</div>
                </div>
              </div>
              <div style={{height:260}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{top:8,right:12,bottom:4,left:0}}>
                    <defs>
                      <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)"/>
                    <XAxis dataKey="t" tick={{fontSize:9,fill:"var(--text-muted)"}} interval={Math.ceil(chartData.length/8)}/>
                    <YAxis tick={{fontSize:9,fill:"var(--text-muted)"}} unit=" µε" width={58}/>
                    <Tooltip contentStyle={TT} formatter={(v:number)=>[`${v} µε`,"Strain"]}/>
                    <ReferenceLine y={selected.baseline_strain}   stroke="var(--status-ok)"   strokeDasharray="6 3" label={{value:`Baseline ${selected.baseline_strain}µε`,position:"insideTopLeft",fontSize:9,fill:"var(--status-ok)"}}/>
                    <ReferenceLine y={selected.warning_threshold} stroke="var(--status-warn)"  strokeDasharray="6 3" label={{value:`Warn* ${selected.warning_threshold}µε`,position:"insideTopLeft",fontSize:9,fill:"var(--status-warn)"}}/>
                    <ReferenceLine y={selected.critical_threshold}stroke="var(--status-crit)"  strokeDasharray="6 3" label={{value:`Crit* ${selected.critical_threshold}µε`,position:"insideTopLeft",fontSize:9,fill:"var(--status-crit)"}}/>
                    <Area type="monotone" dataKey="v" name="Strain" stroke="var(--accent)" strokeWidth={2} fill="url(#sGrad)" dot={false} activeDot={{r:3,fill:"var(--accent)"}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{fontSize:10,color:"var(--text-muted)",marginTop:8}}>* Thresholds are simulated engineering limits for demonstration purposes only.</div>
            </div>

            {/* Readings table */}
            <div className="card" style={{padding:0,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",fontSize:12,fontWeight:700,color:"var(--text-primary)"}}>Recent Readings ({readings.length})</div>
              <div style={{overflowX:"auto",maxHeight:220,overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead style={{position:"sticky",top:0,background:"var(--bg-elevated)"}}>
                    <tr>
                      {["Timestamp","Strain (µε)","vs Baseline","Wavelength (nm)"].map(h=>(
                        <th key={h} style={{padding:"7px 14px",textAlign:h==="Timestamp"?"left":"right",fontSize:10,color:"var(--text-muted)",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.4px",borderBottom:"1px solid var(--border)"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {readings.slice().reverse().slice(0,30).map(r=>{
                      const diff=r.strain_value-(selected?.baseline_strain??0);
                      return (
                        <tr key={r.id} className="table-row">
                          <td style={{padding:"6px 14px",fontFamily:"monospace",color:"var(--text-muted)"}}>{r.timestamp.replace("T"," ").substring(0,19)}</td>
                          <td style={{padding:"6px 14px",fontFamily:"monospace",textAlign:"right",fontWeight:600,color:r.strain_value>(selected?.critical_threshold??9999)?"var(--status-crit)":r.strain_value>(selected?.warning_threshold??9999)?"var(--status-warn)":"var(--text-primary)"}}>{r.strain_value.toFixed(1)}</td>
                          <td style={{padding:"6px 14px",fontFamily:"monospace",textAlign:"right",color:diff>0?"var(--status-crit)":diff<0?"var(--status-ok)":"var(--text-muted)"}}>{diff>0?"+":""}{diff.toFixed(1)}</td>
                          <td style={{padding:"6px 14px",fontFamily:"monospace",textAlign:"right",color:"var(--text-muted)"}}>{r.wavelength_nm.toFixed(4)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>):(
            <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:300}}>
              <div style={{textAlign:"center",color:"var(--text-muted)"}}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>⊕</div>
                <div style={{fontSize:13,fontWeight:600}}>Select a sensor</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

