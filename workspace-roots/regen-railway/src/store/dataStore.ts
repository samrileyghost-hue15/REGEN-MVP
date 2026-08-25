// ============================================================
// REGEN Data Store
// ============================================================

import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  RAILWAY_LINES, SECTIONS, TRACK_CIRCUITS, TRACK_CIRCUIT_EVENTS,
  SIGNALS, ASSETS, FBG_SENSORS, FBG_READINGS, ALERTS, INSPECTIONS,
  MAINTENANCE_TASKS, MAINTENANCE_VERIFICATIONS,
  getEnrichedTrackCircuits, getEnrichedAssets, getEnrichedFbgSensors,
  getEnrichedAlerts, getEnrichedInspections, getEnrichedMaintenanceTasks,
  computeDashboardStats, ORGANISATION
} from "../data/seed";
import type {
  RailwayLine, Section, TrackCircuit, TrackCircuitEvent,
  Signal, Asset, FbgSensor, FbgReading, Alert, Inspection,
  MaintenanceTask, MaintenanceVerification, DashboardStats
} from "../types";

const USE_SUPABASE = isSupabaseConfigured();

export async function fetchRailwayLines(): Promise<RailwayLine[]> {
  if (USE_SUPABASE) {
    const { data } = await supabase.from("railway_lines").select("*").order("name");
    return (data as RailwayLine[]) ?? RAILWAY_LINES;
  }
  return RAILWAY_LINES;
}

export async function fetchSections(railwayLineId?: string): Promise<Section[]> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("sections").select("*, railway_line:railway_lines(*)");
    if (railwayLineId) q = q.eq("railway_line_id", railwayLineId);
    const { data } = await q.order("name");
    return (data as Section[]) ?? SECTIONS;
  }
  const sections = railwayLineId ? SECTIONS.filter(s => s.railway_line_id === railwayLineId) : SECTIONS;
  return sections.map(s => ({ ...s, railway_line: RAILWAY_LINES.find(l => l.id === s.railway_line_id) }));
}

export async function fetchTrackCircuits(sectionId?: string): Promise<TrackCircuit[]> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("track_circuits").select("*, section:sections(*), railway_line:railway_lines(*)");
    if (sectionId) q = q.eq("section_id", sectionId);
    const { data } = await q.order("track_circuit_id");
    return (data as TrackCircuit[]) ?? getEnrichedTrackCircuits();
  }
  const tcs = getEnrichedTrackCircuits();
  return sectionId ? tcs.filter(tc => tc.section_id === sectionId) : tcs;
}

export async function fetchTrackCircuitById(id: string): Promise<TrackCircuit | null> {
  if (USE_SUPABASE) {
    const { data } = await supabase
      .from("track_circuits")
      .select("*, section:sections(*), railway_line:railway_lines(*)")
      .eq("id", id)
      .single();
    return (data as TrackCircuit | null) ?? null;
  }
  return getEnrichedTrackCircuits().find(tc => tc.id === id || tc.track_circuit_id === id) ?? null;
}

export async function fetchTrackCircuitEvents(trackCircuitId: string): Promise<TrackCircuitEvent[]> {
  if (USE_SUPABASE) {
    const { data } = await supabase
      .from("track_circuit_events")
      .select("*")
      .eq("track_circuit_id", trackCircuitId)
      .order("timestamp", { ascending: false })
      .limit(50);
    return (data as TrackCircuitEvent[]) ?? [];
  }
  return TRACK_CIRCUIT_EVENTS
    .filter(e => e.track_circuit_id === trackCircuitId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function fetchAssets(sectionId?: string): Promise<Asset[]> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("assets").select("*, section:sections(*), track_circuit:track_circuits(*)");
    if (sectionId) q = q.eq("section_id", sectionId);
    const { data } = await q.order("asset_id");
    return (data as Asset[]) ?? getEnrichedAssets();
  }
  const assets = getEnrichedAssets();
  return sectionId ? assets.filter(a => a.section_id === sectionId) : assets;
}

export async function fetchAssetById(id: string): Promise<Asset | null> {
  if (USE_SUPABASE) {
    const { data } = await supabase
      .from("assets")
      .select("*, section:sections(*), track_circuit:track_circuits(*)")
      .eq("id", id)
      .single();
    return (data as Asset | null) ?? null;
  }
  return getEnrichedAssets().find(a => a.id === id || a.asset_id === id) ?? null;
}

export async function fetchFbgSensors(assetId?: string): Promise<FbgSensor[]> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("fbg_sensors").select("*, asset:assets(*)");
    if (assetId) q = q.eq("asset_id", assetId);
    const { data } = await q.order("sensor_id");
    return (data as FbgSensor[]) ?? getEnrichedFbgSensors();
  }
  const sensors = getEnrichedFbgSensors();
  return assetId ? sensors.filter(s => s.asset_id === assetId) : sensors;
}

export async function fetchFbgReadings(sensorId: string, limit = 100): Promise<FbgReading[]> {
  if (USE_SUPABASE) {
    const { data } = await supabase
      .from("fbg_readings")
      .select("*")
      .eq("sensor_id", sensorId)
      .order("timestamp", { ascending: true })
      .limit(limit);
    return (data as FbgReading[]) ?? [];
  }
  return FBG_READINGS
    .filter(r => r.sensor_id === sensorId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-limit);
}

export async function fetchAlerts(status?: string): Promise<Alert[]> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("alerts").select("*, asset:assets(*), track_circuit:track_circuits(*), sensor:fbg_sensors(*), section:sections(*)");
    if (status) q = q.eq("status", status);
    const { data } = await q.order("created_at", { ascending: false });
    return (data as Alert[]) ?? getEnrichedAlerts();
  }
  const alerts = getEnrichedAlerts().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return status ? alerts.filter(a => a.status === status) : alerts;
}

export async function updateAlertStatus(id: string, status: string, updatedBy?: string): Promise<void> {
  if (USE_SUPABASE) {
    await (supabase.from("alerts") as any).update({
      status, acknowledged_by: updatedBy,
      acknowledged_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("id", id);
  }
  const alert = ALERTS.find(a => a.id === id);
  if (alert) {
    (alert as unknown as { status: string; acknowledged_by?: string }).status = status;
    if (updatedBy) (alert as unknown as { status: string; acknowledged_by?: string }).acknowledged_by = updatedBy;
  }
}

export async function fetchInspections(status?: string): Promise<Inspection[]> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("inspections").select("*, asset:assets(*), alert:alerts(*), track_circuit:track_circuits(*), sensor:fbg_sensors(*)");
    if (status) q = q.eq("status", status);
    const { data } = await q.order("created_at", { ascending: false });
    return (data as Inspection[]) ?? getEnrichedInspections();
  }
  const inspections = getEnrichedInspections().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return status ? inspections.filter(i => i.status === status) : inspections;
}

export async function updateInspection(id: string, updates: Partial<Inspection>): Promise<void> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("inspections") as any).update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
  }
  const insp = INSPECTIONS.find(i => i.id === id);
  if (insp) Object.assign(insp, updates);
}

export async function createInspection(inspection: Partial<Inspection>): Promise<Inspection> {
  const newInsp: Inspection = {
    id: `insp-${Date.now()}`,
    inspection_id: `INSP-NEW-${Date.now()}`,
    asset_id: inspection.asset_id ?? "",
    title: inspection.title ?? "",
    reason: inspection.reason ?? "",
    priority: inspection.priority ?? "NORMAL",
    status: "PENDING",
    location_description: inspection.location_description ?? "",
    fault_confirmed: false,
    false_alarm: false,
    photos: [],
    maintenance_required: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...inspection,
  };
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("inspections") as any).insert(newInsp).select().single();
    return ((data as Inspection | null) ?? newInsp);
  }
  (INSPECTIONS as Inspection[]).push(newInsp);
  return newInsp;
}

export async function fetchMaintenanceTasks(status?: string): Promise<MaintenanceTask[]> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = supabase.from("maintenance_tasks").select("*, asset:assets(*), inspection:inspections(*)");
    if (status) q = q.eq("status", status);
    const { data } = await q.order("created_at", { ascending: false });
    return (data as MaintenanceTask[]) ?? getEnrichedMaintenanceTasks();
  }
  const tasks = getEnrichedMaintenanceTasks().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return status ? tasks.filter(t => t.status === status) : tasks;
}

export async function updateMaintenanceTask(id: string, updates: Partial<MaintenanceTask>): Promise<void> {
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("maintenance_tasks") as any).update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
  }
  const task = MAINTENANCE_TASKS.find(t => t.id === id);
  if (task) Object.assign(task, updates);
}

export async function createMaintenanceTask(task: Partial<MaintenanceTask>): Promise<MaintenanceTask> {
  const newTask: MaintenanceTask = {
    id: `maint-${Date.now()}`,
    maintenance_id: `MAINT-NEW-${Date.now()}`,
    asset_id: task.asset_id ?? "",
    fault_description: task.fault_description ?? "",
    work_description: task.work_description ?? "",
    status: "OPEN",
    priority: task.priority ?? "NORMAL",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...task,
  };
  if (USE_SUPABASE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("maintenance_tasks") as any).insert(newTask).select().single();
    return ((data as MaintenanceTask | null) ?? newTask);
  }
  (MAINTENANCE_TASKS as MaintenanceTask[]).push(newTask);
  return newTask;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return computeDashboardStats();
}

export async function fetchSignals(): Promise<Signal[]> {
  if (USE_SUPABASE) {
    const { data } = await supabase.from("signals").select("*").order("signal_id");
    return (data as Signal[]) ?? SIGNALS;
  }
  return SIGNALS;
}

export {
  ORGANISATION, RAILWAY_LINES, SECTIONS, TRACK_CIRCUITS, ASSETS, FBG_SENSORS,
  ALERTS, INSPECTIONS, MAINTENANCE_TASKS, MAINTENANCE_VERIFICATIONS, SIGNALS
};


