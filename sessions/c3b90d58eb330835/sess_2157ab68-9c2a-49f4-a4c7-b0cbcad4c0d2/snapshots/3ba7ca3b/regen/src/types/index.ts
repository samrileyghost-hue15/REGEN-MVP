export type TCStatus = 'NORMAL' | 'OCCUPIED' | 'FAULT' | 'UNKNOWN' | 'OFFLINE';
export type TCOccupancy = 'CLEAR' | 'OCCUPIED' | 'UNKNOWN';
export type SectionStatus = 'OPERATIONAL' | 'DEGRADED' | 'SUSPENDED' | 'MAINTENANCE' | 'OFFLINE';
export type LineStatus = 'OPERATIONAL' | 'SUSPENDED' | 'MAINTENANCE' | 'OFFLINE';
export type SignalStatus = 'CLEAR' | 'CAUTION' | 'DANGER' | 'UNKNOWN' | 'OFFLINE';
export type AssetCondition = 'GOOD' | 'FAIR' | 'WARNING' | 'CRITICAL' | 'UNKNOWN';
export type AssetType =
  | 'COMPOSITE_SLEEPER' | 'STEEL_RAIL' | 'BRIDGE' | 'CULVERT'
  | 'BALLAST_BED' | 'SWITCH_ASSEMBLY' | 'LEVEL_CROSSING'
  | 'RETAINING_WALL' | 'EMBANKMENT' | 'VIADUCT';
export type SensorStatus = 'ACTIVE' | 'WARNING' | 'FAULT' | 'OFFLINE' | 'CALIBRATING';
export type RiskLevel = 'NORMAL' | 'SIMULATED_WARNING' | 'SIMULATED_CRITICAL' | 'OFFLINE' | 'UNKNOWN';
export type AlertPriority = 'NORMAL' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'OFFLINE' | 'REQUIRES_VERIFICATION';
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED' | 'FALSE_ALARM';
export type AlertSource = 'TRACK_CIRCUIT' | 'FBG_SENSOR' | 'ASSET' | 'COMMUNICATION' | 'MAINTENANCE' | 'COMBINED';
export type InspectionStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InspectionPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type MaintenanceStatus =
  | 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  | 'VERIFICATION_REQUIRED' | 'VERIFIED' | 'CLOSED';
export type VerificationResult = 'PASSED' | 'FAILED' | 'PARTIAL' | 'REQUIRES_FOLLOW_UP';
export type TrendDirection = 'STABLE' | 'INCREASING' | 'DECREASING' | 'SUDDEN_CHANGE' | 'OFFLINE';

export interface Organisation {
  id: string; name: string; code: string; country: string;
  contact_email?: string; created_at: string;
}
export interface RailwayLine {
  id: string; organisation_id: string; name: string; code: string;
  description?: string; total_length_km?: number; status: LineStatus; created_at: string;
}
export interface Section {
  id: string; railway_line_id: string; name: string; code: string;
  description?: string; start_location?: string; end_location?: string;
  length_km?: number; status: SectionStatus; created_at: string;
  railway_line?: RailwayLine;
}
export interface TrackCircuit {
  id: string; section_id: string; track_circuit_id: string; railway_line: string;
  location: string; status: TCStatus; occupancy: TCOccupancy;
  signal_relationship?: string; last_update: string;
  fault_status?: string; fault_description?: string; created_at: string;
  section?: Section;
}
export interface Signal {
  id: string; section_id: string; track_circuit_id?: string; signal_id: string;
  signal_type: 'COLOUR_LIGHT' | 'SEMAPHORE' | 'DWARF' | 'SHUNTING';
  location: string; status: SignalStatus; created_at: string;
}
export interface Asset {
  id: string; section_id: string; track_circuit_id?: string; asset_id: string;
  asset_type: AssetType; description?: string; location: string;
  gps_lat?: number; gps_lon?: number; installation_date?: string;
  last_inspection?: string; condition: AssetCondition; created_at: string;
  section?: Section; track_circuit?: TrackCircuit;
  fbg_sensors?: FBGSensor[]; alerts?: Alert[];
}
export interface FBGSensor {
  id: string; asset_id: string; sensor_id: string;
  sensor_type: 'STRAIN' | 'TEMPERATURE' | 'DISPLACEMENT' | 'ACCELERATION';
  baseline_strain: number; current_strain?: number; wavelength_nm?: number;
  sensor_status: SensorStatus; risk_level: RiskLevel;
  install_date?: string; last_reading?: string; created_at: string;
  deviation?: number; percentage_change?: number; trend?: TrendDirection;
  asset?: Asset; recent_readings?: FBGReading[];
}
export interface FBGReading {
  id: string; sensor_id: string; timestamp: string;
  strain_value: number; wavelength?: number; temperature?: number; is_simulated: boolean;
}
export interface TrackCircuitEvent {
  id: string; track_circuit_id: string; timestamp: string;
  previous_status?: TCStatus; new_status: TCStatus;
  event_type: 'STATUS_CHANGE' | 'FAULT' | 'RECOVERY' | 'OFFLINE' | 'RECONNECT' | 'MANUAL_UPDATE';
  description?: string; is_simulated: boolean;
}
export interface Alert {
  id: string; alert_ref: string; source_type: AlertSource; priority: AlertPriority;
  title: string; description: string; track_circuit_id?: string; asset_id?: string;
  sensor_id?: string; section_id?: string; status: AlertStatus;
  acknowledged_by?: string; acknowledged_at?: string; resolved_at?: string;
  is_simulated: boolean; created_at: string; updated_at: string;
  track_circuit?: TrackCircuit; asset?: Asset; sensor?: FBGSensor; section?: Section;
}
export interface Inspection {
  id: string; inspection_ref: string; alert_id?: string; asset_id: string;
  track_circuit_id?: string; sensor_id?: string; title: string; reason: string;
  priority: InspectionPriority; assigned_to?: string; inspector_name?: string;
  status: InspectionStatus; scheduled_date?: string; completed_date?: string;
  location?: string; findings?: string; fault_confirmed?: boolean;
  false_alarm: boolean; photos_count: number; recommendation?: string;
  created_at: string; updated_at: string;
  asset?: Asset; alert?: Alert; track_circuit?: TrackCircuit; sensor?: FBGSensor;
}
export interface MaintenanceTask {
  id: string; maintenance_ref: string; inspection_id?: string; asset_id: string;
  alert_id?: string; title: string; fault_description: string; cause?: string;
  work_description?: string; assigned_technician?: string;
  priority: InspectionPriority; status: MaintenanceStatus;
  start_time?: string; completion_time?: string; created_at: string; updated_at: string;
  asset?: Asset; inspection?: Inspection; verifications?: MaintenanceVerification[];
}
export interface MaintenanceVerification {
  id: string; maintenance_task_id: string; verified_by: string;
  verification_date: string; result: VerificationResult; notes?: string;
  post_strain_reading?: number; tc_status_confirmed?: string; created_at: string;
}
export interface DashboardStats {
  totalSections: number; occupiedCircuits: number; tcFaults: number;
  infraWarnings: number; criticalAssets: number;
  fbgSensorStatus: { active: number; warning: number; fault: number; offline: number };
  activeAlerts: number; openMaintenance: number;
}
