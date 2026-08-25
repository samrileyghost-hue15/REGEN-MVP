// ============================================================
// REGEN Railway Infrastructure Monitoring Platform
// TypeScript Type Definitions
// ============================================================

export type TrackCircuitStatus = "NORMAL" | "OCCUPIED" | "FAULT" | "UNKNOWN" | "OFFLINE";
export type RiskLevel = "LOW" | "MODERATE" | "WARNING" | "HIGH" | "CRITICAL" | "OFFLINE";
export type SensorStatus = "ONLINE" | "OFFLINE" | "DEGRADED" | "CALIBRATING";
export type FbgTrend = "STABLE" | "INCREASING" | "DECREASING" | "SUDDEN_CHANGE" | "OFFLINE";
export type AlertPriority = "NORMAL" | "WARNING" | "HIGH" | "CRITICAL" | "OFFLINE";
export type AlertSource = "TRACK_CIRCUIT" | "FBG_SENSOR" | "ASSET" | "COMMUNICATION" | "MAINTENANCE" | "COMBINED";
export type AlertStatus = "OPEN" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED" | "CLOSED";
export type InspectionStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type MaintenanceStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "VERIFICATION_REQUIRED" | "VERIFIED" | "CLOSED";
export type AssetType = "COMPOSITE_SLEEPER" | "RAIL_JOINT" | "SWITCH_ASSEMBLY" | "BRIDGE_STRUCTURE" | "CULVERT" | "RETAINING_WALL" | "RAIL_FASTENING" | "LEVEL_CROSSING" | "SIGNAL_GANTRY" | "OVERHEAD_LINE_SUPPORT";
export type AssetCondition = "GOOD" | "FAIR" | "WARNING" | "CRITICAL" | "REQUIRES_VERIFICATION" | "UNKNOWN";

// ============================================================
// ORGANISATION
// ============================================================
export interface Organisation {
  id: string;
  name: string;
  code: string;
  country: string;
  created_at: string;
}

// ============================================================
// RAILWAY NETWORK
// ============================================================
export interface RailwayLine {
  id: string;
  organisation_id: string;
  name: string;
  code: string;
  description: string;
  total_length_km: number;
  status: "OPERATIONAL" | "PARTIAL" | "SUSPENDED";
  created_at: string;
}

export interface Section {
  id: string;
  railway_line_id: string;
  name: string;
  code: string;
  start_location: string;
  end_location: string;
  length_km: number;
  status: "OPERATIONAL" | "RESTRICTED" | "MAINTENANCE" | "SUSPENDED";
  created_at: string;
  // Joined
  railway_line?: RailwayLine;
}

// ============================================================
// TRACK CIRCUITS
// ============================================================
export interface TrackCircuit {
  id: string;
  track_circuit_id: string;
  section_id: string;
  railway_line_id: string;
  location_description: string;
  latitude?: number;
  longitude?: number;
  status: TrackCircuitStatus;
  occupancy: boolean;
  signal_relationship: string;
  last_update: string;
  fault_status: string | null;
  fault_description: string | null;
  created_at: string;
  // Joined
  section?: Section;
  railway_line?: RailwayLine;
  events?: TrackCircuitEvent[];
}

export interface TrackCircuitEvent {
  id: string;
  track_circuit_id: string;
  previous_status: TrackCircuitStatus;
  new_status: TrackCircuitStatus;
  event_type: string;
  description: string;
  timestamp: string;
  created_at: string;
}

// ============================================================
// SIGNALS
// ============================================================
export interface Signal {
  id: string;
  signal_id: string;
  track_circuit_id: string;
  section_id: string;
  name: string;
  location_description: string;
  signal_type: string;
  status: "NORMAL" | "CAUTION" | "STOP" | "FAULT" | "OFFLINE";
  created_at: string;
}

// ============================================================
// ASSETS
// ============================================================
export interface Asset {
  id: string;
  asset_id: string;
  section_id: string;
  track_circuit_id: string;
  signal_id?: string;
  name: string;
  asset_type: AssetType;
  location_description: string;
  latitude?: number;
  longitude?: number;
  installation_date: string;
  condition: AssetCondition;
  last_inspection_date?: string;
  notes?: string;
  created_at: string;
  // Joined
  section?: Section;
  track_circuit?: TrackCircuit;
  fbg_sensors?: FbgSensor[];
  alerts?: Alert[];
  inspections?: Inspection[];
  maintenance_tasks?: MaintenanceTask[];
}

// ============================================================
// FBG SENSORS
// ============================================================
export interface FbgSensor {
  id: string;
  sensor_id: string;
  asset_id: string;
  sensor_name: string;
  baseline_strain: number;
  current_strain: number;
  deviation: number;
  percentage_change: number;
  trend: FbgTrend;
  wavelength_nm: number;
  sensor_status: SensorStatus;
  risk_level: RiskLevel;
  warning_threshold: number;
  critical_threshold: number;
  last_reading: string;
  created_at: string;
  // Joined
  asset?: Asset;
  readings?: FbgReading[];
}

export interface FbgReading {
  id: string;
  sensor_id: string;
  strain_value: number;
  temperature?: number;
  wavelength_nm: number;
  timestamp: string;
  created_at: string;
}

// ============================================================
// ALERTS
// ============================================================
export interface Alert {
  id: string;
  alert_id: string;
  source: AlertSource;
  priority: AlertPriority;
  status: AlertStatus;
  title: string;
  description: string;
  asset_id?: string;
  track_circuit_id?: string;
  sensor_id?: string;
  section_id?: string;
  railway_line_id?: string;
  evidence_summary?: string;
  requires_inspection: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  // Joined
  asset?: Asset;
  track_circuit?: TrackCircuit;
  sensor?: FbgSensor;
  section?: Section;
}

// ============================================================
// INSPECTIONS
// ============================================================
export interface Inspection {
  id: string;
  inspection_id: string;
  alert_id?: string;
  asset_id: string;
  track_circuit_id?: string;
  sensor_id?: string;
  title: string;
  reason: string;
  priority: AlertPriority;
  status: InspectionStatus;
  assigned_inspector?: string;
  inspector_id?: string;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  location_description: string;
  observations?: string;
  findings?: string;
  fault_confirmed: boolean;
  false_alarm: boolean;
  photos?: string[];
  recommendations?: string;
  maintenance_required: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  asset?: Asset;
  alert?: Alert;
  track_circuit?: TrackCircuit;
  sensor?: FbgSensor;
}

// ============================================================
// MAINTENANCE
// ============================================================
export interface MaintenanceTask {
  id: string;
  maintenance_id: string;
  inspection_id?: string;
  alert_id?: string;
  asset_id: string;
  fault_description: string;
  root_cause?: string;
  work_description: string;
  assigned_technician?: string;
  technician_id?: string;
  status: MaintenanceStatus;
  priority: AlertPriority;
  started_at?: string;
  completed_at?: string;
  estimated_hours?: number;
  actual_hours?: number;
  parts_used?: string;
  cost_estimate?: number;
  created_at: string;
  updated_at: string;
  // Joined
  asset?: Asset;
  inspection?: Inspection;
  verification?: MaintenanceVerification;
}

export interface MaintenanceVerification {
  id: string;
  maintenance_task_id: string;
  verified_by: string;
  verification_date: string;
  track_circuit_status: TrackCircuitStatus;
  fbg_readings_normal: boolean;
  asset_condition: AssetCondition;
  notes: string;
  passed: boolean;
  created_at: string;
}

// ============================================================
// DATABASE TYPE (for Supabase client)
// ============================================================
export interface Database {
  public: {
    Tables: {
      organisations: { Row: Organisation; Insert: Partial<Organisation>; Update: Partial<Organisation> };
      railway_lines: { Row: RailwayLine; Insert: Partial<RailwayLine>; Update: Partial<RailwayLine> };
      sections: { Row: Section; Insert: Partial<Section>; Update: Partial<Section> };
      track_circuits: { Row: TrackCircuit; Insert: Partial<TrackCircuit>; Update: Partial<TrackCircuit> };
      track_circuit_events: { Row: TrackCircuitEvent; Insert: Partial<TrackCircuitEvent>; Update: Partial<TrackCircuitEvent> };
      signals: { Row: Signal; Insert: Partial<Signal>; Update: Partial<Signal> };
      assets: { Row: Asset; Insert: Partial<Asset>; Update: Partial<Asset> };
      fbg_sensors: { Row: FbgSensor; Insert: Partial<FbgSensor>; Update: Partial<FbgSensor> };
      fbg_readings: { Row: FbgReading; Insert: Partial<FbgReading>; Update: Partial<FbgReading> };
      alerts: { Row: Alert; Insert: Partial<Alert>; Update: Partial<Alert> };
      inspections: { Row: Inspection; Insert: Partial<Inspection>; Update: Partial<Inspection> };
      maintenance_tasks: { Row: MaintenanceTask; Insert: Partial<MaintenanceTask>; Update: Partial<MaintenanceTask> };
      maintenance_verifications: { Row: MaintenanceVerification; Insert: Partial<MaintenanceVerification>; Update: Partial<MaintenanceVerification> };
    };
  };
}

// ============================================================
// DASHBOARD SUMMARY TYPES
// ============================================================
export interface DashboardStats {
  totalSections: number;
  occupiedCircuits: number;
  trackCircuitFaults: number;
  infrastructureWarnings: number;
  criticalAssets: number;
  fbgSensorStatus: { online: number; offline: number; degraded: number };
  activeAlerts: number;
  openMaintenanceTasks: number;
}
