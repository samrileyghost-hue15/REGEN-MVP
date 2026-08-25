// ============================================================
// REGEN Data Service — static imports only
// ============================================================
import { supabase, useMockData } from './supabase';
import {
  mockRailwayLines, mockSections, mockTrackCircuits, mockAssets,
  mockFBGSensors, mockTCEvents, mockAlerts, mockInspections,
  mockMaintenanceTasks, mockVerifications, generateFBGReadings,
} from './mockData';
import type {
  RailwayLine, Section, TrackCircuit, Asset, FBGSensor,
  FBGReading, TrackCircuitEvent, Alert, Inspection,
  MaintenanceTask, MaintenanceVerification, DashboardStats,
} from '../types';

export async function getRailwayLines(): Promise<RailwayLine[]> {
  if (useMockData) return mockRailwayLines;
  const { data } = await supabase.from('railway_lines').select('*').order('name');
  return data ?? [];
}

export async function getSections(lineId?: string): Promise<Section[]> {
  if (useMockData) return lineId ? mockSections.filter(s => s.railway_line_id === lineId) : mockSections;
  let q = supabase.from('sections').select('*');
  if (lineId) q = q.eq('railway_line_id', lineId);
  const { data } = await q.order('name');
  return data ?? [];
}

export async function getTrackCircuits(sectionId?: string): Promise<TrackCircuit[]> {
  if (useMockData) return sectionId ? mockTrackCircuits.filter(tc => tc.section_id === sectionId) : mockTrackCircuits;
  let q = supabase.from('track_circuits').select('*');
  if (sectionId) q = q.eq('section_id', sectionId);
  const { data } = await q.order('track_circuit_id');
  return data ?? [];
}

export async function getTrackCircuit(id: string): Promise<TrackCircuit | null> {
  if (useMockData) return mockTrackCircuits.find(tc => tc.id === id || tc.track_circuit_id === id) ?? null;
  const { data } = await supabase.from('track_circuits').select('*').eq('id', id).single();
  return data;
}

export async function getTrackCircuitEvents(tcId: string): Promise<TrackCircuitEvent[]> {
  if (useMockData) return mockTCEvents.filter(e => e.track_circuit_id === tcId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const { data } = await supabase.from('track_circuit_events').select('*').eq('track_circuit_id', tcId).order('timestamp', { ascending: true });
  return data ?? [];
}

export async function getAssets(sectionId?: string): Promise<Asset[]> {
  if (useMockData) return sectionId ? mockAssets.filter(a => a.section_id === sectionId) : mockAssets;
  let q = supabase.from('assets').select('*');
  if (sectionId) q = q.eq('section_id', sectionId);
  const { data } = await q.order('asset_id');
  return data ?? [];
}

export async function getAsset(id: string): Promise<Asset | null> {
  if (useMockData) return mockAssets.find(a => a.id === id || a.asset_id === id) ?? null;
  const { data } = await supabase.from('assets').select('*').eq('id', id).single();
  return data;
}

export async function getFBGSensors(assetId?: string): Promise<FBGSensor[]> {
  if (useMockData) return assetId ? mockFBGSensors.filter(s => s.asset_id === assetId) : mockFBGSensors;
  let q = supabase.from('fbg_sensors').select('*');
  if (assetId) q = q.eq('asset_id', assetId);
  const { data } = await q.order('sensor_id');
  return data ?? [];
}

export async function getFBGSensor(id: string): Promise<FBGSensor | null> {
  if (useMockData) return mockFBGSensors.find(s => s.id === id || s.sensor_id === id) ?? null;
  const { data } = await supabase.from('fbg_sensors').select('*').eq('id', id).single();
  return data;
}

export async function getFBGReadings(sensorId: string, days = 30): Promise<FBGReading[]> {
  if (useMockData) return generateFBGReadings(sensorId, days);
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await supabase.from('fbg_readings').select('*').eq('sensor_id', sensorId).gte('timestamp', since).order('timestamp', { ascending: true });
  return data ?? [];
}

export async function getAlerts(statusFilter?: string[]): Promise<Alert[]> {
  if (useMockData) {
    let alerts = [...mockAlerts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (statusFilter) alerts = alerts.filter(a => statusFilter.includes(a.status));
    return alerts;
  }
  let q = supabase.from('alerts').select('*');
  if (statusFilter) q = q.in('status', statusFilter);
  const { data } = await q.order('created_at', { ascending: false });
  return data ?? [];
}

export async function getAlert(id: string): Promise<Alert | null> {
  if (useMockData) return mockAlerts.find(a => a.id === id || a.alert_ref === id) ?? null;
  const { data } = await supabase.from('alerts').select('*').eq('id', id).single();
  return data;
}

export async function updateAlertStatus(id: string, status: string, acknowledgedBy?: string): Promise<void> {
  if (useMockData) {
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) { (alert as Alert).status = status as Alert['status']; if (acknowledgedBy) (alert as Alert).acknowledged_by = acknowledgedBy; }
    return;
  }
  await supabase.from('alerts').update({ status, acknowledged_by: acknowledgedBy }).eq('id', id);
}

export async function getInspections(statusFilter?: string[]): Promise<Inspection[]> {
  if (useMockData) {
    let items = [...mockInspections].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (statusFilter) items = items.filter(i => statusFilter.includes(i.status));
    return items;
  }
  let q = supabase.from('inspections').select('*');
  if (statusFilter) q = q.in('status', statusFilter);
  const { data } = await q.order('created_at', { ascending: false });
  return data ?? [];
}

export async function getInspection(id: string): Promise<Inspection | null> {
  if (useMockData) return mockInspections.find(i => i.id === id || i.inspection_ref === id) ?? null;
  const { data } = await supabase.from('inspections').select('*').eq('id', id).single();
  return data;
}

export async function updateInspection(id: string, updates: Partial<Inspection>): Promise<void> {
  if (useMockData) { const idx = mockInspections.findIndex(i => i.id === id); if (idx >= 0) Object.assign(mockInspections[idx], updates); return; }
  await supabase.from('inspections').update(updates).eq('id', id);
}

export async function createInspection(inspection: Omit<Inspection, 'id' | 'created_at' | 'updated_at'>): Promise<Inspection> {
  const newItem: Inspection = { ...inspection, id: `mock-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  if (useMockData) { mockInspections.unshift(newItem); return newItem; }
  const { data } = await supabase.from('inspections').insert(newItem).select().single();
  return data;
}

export async function getMaintenanceTasks(statusFilter?: string[]): Promise<MaintenanceTask[]> {
  if (useMockData) {
    let items = [...mockMaintenanceTasks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (statusFilter) items = items.filter(t => statusFilter.includes(t.status));
    return items;
  }
  let q = supabase.from('maintenance_tasks').select('*');
  if (statusFilter) q = q.in('status', statusFilter);
  const { data } = await q.order('created_at', { ascending: false });
  return data ?? [];
}

export async function getMaintenanceTask(id: string): Promise<MaintenanceTask | null> {
  if (useMockData) return mockMaintenanceTasks.find(t => t.id === id || t.maintenance_ref === id) ?? null;
  const { data } = await supabase.from('maintenance_tasks').select('*').eq('id', id).single();
  return data;
}

export async function updateMaintenanceTask(id: string, updates: Partial<MaintenanceTask>): Promise<void> {
  if (useMockData) { const idx = mockMaintenanceTasks.findIndex(t => t.id === id); if (idx >= 0) Object.assign(mockMaintenanceTasks[idx], updates); return; }
  await supabase.from('maintenance_tasks').update(updates).eq('id', id);
}

export async function createMaintenanceTask(task: Omit<MaintenanceTask, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceTask> {
  const newItem: MaintenanceTask = { ...task, id: `mock-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  if (useMockData) { mockMaintenanceTasks.unshift(newItem); return newItem; }
  const { data } = await supabase.from('maintenance_tasks').insert(newItem).select().single();
  return data;
}

export async function getVerifications(taskId: string): Promise<MaintenanceVerification[]> {
  if (useMockData) return mockVerifications.filter(v => v.maintenance_task_id === taskId);
  const { data } = await supabase.from('maintenance_verifications').select('*').eq('maintenance_task_id', taskId);
  return data ?? [];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (useMockData) {
    return {
      totalSections: mockSections.length,
      occupiedCircuits: mockTrackCircuits.filter(tc => tc.status === 'OCCUPIED').length,
      tcFaults: mockTrackCircuits.filter(tc => tc.status === 'FAULT' || tc.status === 'OFFLINE').length,
      infraWarnings: mockAssets.filter(a => a.condition === 'WARNING' || a.condition === 'CRITICAL').length,
      criticalAssets: mockAssets.filter(a => a.condition === 'CRITICAL').length,
      fbgSensorStatus: {
        active: mockFBGSensors.filter(s => s.sensor_status === 'ACTIVE').length,
        warning: mockFBGSensors.filter(s => s.sensor_status === 'WARNING').length,
        fault: mockFBGSensors.filter(s => s.sensor_status === 'FAULT').length,
        offline: mockFBGSensors.filter(s => s.sensor_status === 'OFFLINE' || s.sensor_status === 'CALIBRATING').length,
      },
      activeAlerts: mockAlerts.filter(a => ['OPEN', 'ACKNOWLEDGED', 'INVESTIGATING'].includes(a.status)).length,
      openMaintenance: mockMaintenanceTasks.filter(t => !['CLOSED', 'VERIFIED'].includes(t.status)).length,
    };
  }
  const [tcs, sensors, alerts, tasks, assets, sections] = await Promise.all([
    supabase.from('track_circuits').select('status'),
    supabase.from('fbg_sensors').select('sensor_status'),
    supabase.from('alerts').select('status'),
    supabase.from('maintenance_tasks').select('status'),
    supabase.from('assets').select('condition'),
    supabase.from('sections').select('id', { count: 'exact' }),
  ]);
  const tcRows = (tcs.data ?? []) as { status: string }[];
  const sensorRows = (sensors.data ?? []) as { sensor_status: string }[];
  const alertRows = (alerts.data ?? []) as { status: string }[];
  const taskRows = (tasks.data ?? []) as { status: string }[];
  const assetRows = (assets.data ?? []) as { condition: string }[];
  return {
    totalSections: sections.count ?? 0,
    occupiedCircuits: tcRows.filter(r => r.status === 'OCCUPIED').length,
    tcFaults: tcRows.filter(r => ['FAULT', 'OFFLINE'].includes(r.status)).length,
    infraWarnings: assetRows.filter(r => ['WARNING', 'CRITICAL'].includes(r.condition)).length,
    criticalAssets: assetRows.filter(r => r.condition === 'CRITICAL').length,
    fbgSensorStatus: {
      active: sensorRows.filter(r => r.sensor_status === 'ACTIVE').length,
      warning: sensorRows.filter(r => r.sensor_status === 'WARNING').length,
      fault: sensorRows.filter(r => r.sensor_status === 'FAULT').length,
      offline: sensorRows.filter(r => ['OFFLINE', 'CALIBRATING'].includes(r.sensor_status)).length,
    },
    activeAlerts: alertRows.filter(r => ['OPEN', 'ACKNOWLEDGED', 'INVESTIGATING'].includes(r.status)).length,
    openMaintenance: taskRows.filter(r => !['CLOSED', 'VERIFIED'].includes(r.status)).length,
  };
}
