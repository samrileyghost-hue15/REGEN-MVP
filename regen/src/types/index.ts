// ─────────────────────────────────────────────
// REGEN v2 — Core Type Definitions
// ─────────────────────────────────────────────

export type Role = 'maintenance_engineer' | 'operations_manager' | 'administrator';

export type SeverityLevel = 'critical' | 'warning' | 'info' | 'healthy' | 'offline';

export type AssetType = 'track' | 'switch' | 'bridge' | 'sleeper' | 'station';

export type SensorType = 'vibration' | 'temperature' | 'strain' | 'seismic';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export type WorkOrderStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type WorkOrderPriority = 'critical' | 'high' | 'medium' | 'low';

export type DemoStage =
  | 'idle'
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'alert'
  | 'prediction'
  | 'work-order'
  | 'in-progress'
  | 'resolved'
  | 'recovered';

// ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  location: string;
  lineId: string;
  severity: SeverityLevel;
  lastInspection: string;
  installDate: string;
  description?: string;
  // SVG map coordinates
  mapX: number;
  mapY: number;
}

export interface Sensor {
  id: string;
  assetId: string;
  name: string;
  type: SensorType;
  unit: string;
  status: 'online' | 'offline' | 'degraded';
  severity: SeverityLevel;
  currentValue: number;
  normalMin: number;
  normalMax: number;
  warningMax: number;
  criticalMax: number;
  lastUpdate: string;
  // Map position (relative to asset)
  mapX: number;
  mapY: number;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  value: number;
  timestamp: string;
  severity: SeverityLevel;
}

export interface Alert {
  id: string;
  assetId: string;
  sensorId?: string;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: AlertStatus;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  acknowledgedBy?: string;
}

export interface Prediction {
  id: string;
  assetId: string;
  sensorId?: string;
  riskLevel: 'high' | 'medium' | 'low';
  issue: string;
  rulDays: number;
  failureProbability: number;
  recommendedAction: string;
  generatedAt: string;
}

export interface WorkOrder {
  id: string;
  assetId: string;
  alertId?: string;
  predictionId?: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTeam: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  workOrderId?: string;
  type: string;
  description: string;
  performedBy: string;
  performedAt: string;
  outcome: 'completed' | 'partial' | 'deferred';
}

export interface RailwayLine {
  id: string;
  name: string;
  color: string;
  stations: Station[];
}

export interface Station {
  id: string;
  name: string;
  x: number;
  y: number;
  lineId: string;
}

// ─────────────────────────────────────────────
// Permission model
// ─────────────────────────────────────────────

export interface RolePermissions {
  dashboard: boolean;
  map: boolean;
  alerts: boolean;
  assets: boolean;
  workOrders: boolean;
  sensors: boolean;
  users: boolean;
  settings: boolean;
  reports: boolean;
  canCreateWorkOrder: boolean;
  canUpdateWorkOrderStatus: boolean;
  canAssignWorkOrder: boolean;
  canAcknowledgeAlert: boolean;
  canManageUsers: boolean;
  canConfigureSystem: boolean;
}
