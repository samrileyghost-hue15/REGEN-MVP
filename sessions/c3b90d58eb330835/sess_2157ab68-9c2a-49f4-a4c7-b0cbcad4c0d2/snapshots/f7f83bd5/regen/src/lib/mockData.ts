// ============================================================
// REGEN - Mock Data (mirrors the SQL seed data)
// Used when VITE_USE_MOCK_DATA=true (offline / demo mode)
// ALL DATA IS SIMULATED — NOT REAL PRASA/TRANSNET INFRASTRUCTURE
// ============================================================

import type {
  RailwayLine, Section, TrackCircuit, Asset,
  FBGSensor, FBGReading, TrackCircuitEvent, Alert,
  Inspection, MaintenanceTask, MaintenanceVerification
} from '../types';

const now = new Date();
const ago = (m: number) => new Date(now.getTime() - m * 60000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

// ============================================================
// RAILWAY LINES
// ============================================================
export const mockRailwayLines: RailwayLine[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    organisation_id: '00000000-0000-0000-0000-000000000001',
    name: 'Gauteng Corridor',
    code: 'GAU-COR',
    description: 'Primary commuter and freight corridor through Gauteng province',
    total_length_km: 142.5,
    status: 'OPERATIONAL',
    created_at: daysAgo(365),
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    organisation_id: '00000000-0000-0000-0000-000000000001',
    name: 'Cape Metro Line',
    code: 'CPT-MET',
    description: 'Western Cape metropolitan commuter network',
    total_length_km: 98.3,
    status: 'OPERATIONAL',
    created_at: daysAgo(365),
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    organisation_id: '00000000-0000-0000-0000-000000000001',
    name: 'KwaZulu-Natal Coastal',
    code: 'KZN-CST',
    description: 'Durban coastal and inland freight connection',
    total_length_km: 87.6,
    status: 'MAINTENANCE',
    created_at: daysAgo(365),
  },
];

// ============================================================
// SECTIONS
// ============================================================
export const mockSections: Section[] = [
  { id: '20000000-0000-0000-0000-000000000001', railway_line_id: '10000000-0000-0000-0000-000000000001', name: 'Section 01 - Johannesburg Central', code: 'GAU-SEC-01', start_location: 'Park Station', end_location: 'Johannesburg Central', length_km: 12.4, status: 'OPERATIONAL', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000002', railway_line_id: '10000000-0000-0000-0000-000000000001', name: 'Section 02 - Soweto Link', code: 'GAU-SEC-02', start_location: 'Johannesburg South', end_location: 'Naledi', length_km: 18.7, status: 'OPERATIONAL', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000003', railway_line_id: '10000000-0000-0000-0000-000000000001', name: 'Section 03 - East Rand Corridor', code: 'GAU-SEC-03', start_location: 'Germiston', end_location: 'Springs', length_km: 22.1, status: 'OPERATIONAL', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000004', railway_line_id: '10000000-0000-0000-0000-000000000001', name: 'Section 04 - Pretoria South', code: 'GAU-SEC-04', start_location: 'Halfway House', end_location: 'Pretoria Central', length_km: 31.2, status: 'DEGRADED', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000005', railway_line_id: '10000000-0000-0000-0000-000000000002', name: 'Section 01 - Cape Town Central', code: 'CPT-SEC-01', start_location: 'Cape Town Station', end_location: 'Salt River', length_km: 8.3, status: 'OPERATIONAL', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000006', railway_line_id: '10000000-0000-0000-0000-000000000002', name: 'Section 02 - Southern Suburbs', code: 'CPT-SEC-02', start_location: 'Salt River', end_location: 'Claremont', length_km: 14.6, status: 'OPERATIONAL', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000007', railway_line_id: '10000000-0000-0000-0000-000000000002', name: "Section 03 - False Bay Line", code: 'CPT-SEC-03', start_location: 'Claremont', end_location: "Simon's Town", length_km: 28.9, status: 'OPERATIONAL', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000008', railway_line_id: '10000000-0000-0000-0000-000000000003', name: 'Section 01 - Durban Port', code: 'KZN-SEC-01', start_location: 'Durban Port', end_location: 'Umbilo', length_km: 9.2, status: 'MAINTENANCE', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000009', railway_line_id: '10000000-0000-0000-0000-000000000003', name: 'Section 02 - North Coast Link', code: 'KZN-SEC-02', start_location: 'Durban Central', end_location: 'Umhlanga', length_km: 16.4, status: 'OPERATIONAL', created_at: daysAgo(365) },
  { id: '20000000-0000-0000-0000-000000000010', railway_line_id: '10000000-0000-0000-0000-000000000003', name: 'Section 03 - Pinetown Freight', code: 'KZN-SEC-03', start_location: 'Pinetown', end_location: 'New Germany', length_km: 11.8, status: 'OPERATIONAL', created_at: daysAgo(365) },
];

// ============================================================
// TRACK CIRCUITS
// ============================================================
export const mockTrackCircuits: TrackCircuit[] = [
  { id: '30000000-0000-0000-0000-000000000001', section_id: '20000000-0000-0000-0000-000000000001', track_circuit_id: 'TC-001', railway_line: 'Gauteng Corridor', location: 'Park Station - Platform 1', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-001', last_update: ago(2), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000002', section_id: '20000000-0000-0000-0000-000000000001', track_circuit_id: 'TC-002', railway_line: 'Gauteng Corridor', location: 'Park Station - Platform 2', status: 'OCCUPIED', occupancy: 'OCCUPIED', signal_relationship: 'S-002', last_update: ago(1), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000003', section_id: '20000000-0000-0000-0000-000000000002', track_circuit_id: 'TC-003', railway_line: 'Gauteng Corridor', location: 'Johannesburg South - Approach', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-003', last_update: ago(3), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000004', section_id: '20000000-0000-0000-0000-000000000002', track_circuit_id: 'TC-004', railway_line: 'Gauteng Corridor', location: 'Naledi Station Loop', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-004', last_update: ago(4), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000005', section_id: '20000000-0000-0000-0000-000000000003', track_circuit_id: 'TC-005', railway_line: 'Gauteng Corridor', location: 'Germiston Junction - North', status: 'OCCUPIED', occupancy: 'OCCUPIED', signal_relationship: 'S-005', last_update: ago(1), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000006', section_id: '20000000-0000-0000-0000-000000000003', track_circuit_id: 'TC-006', railway_line: 'Gauteng Corridor', location: 'Germiston Junction - South', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-006', last_update: ago(5), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000007', section_id: '20000000-0000-0000-0000-000000000003', track_circuit_id: 'TC-007', railway_line: 'Gauteng Corridor', location: 'Springs Approach East', status: 'OFFLINE', occupancy: 'UNKNOWN', signal_relationship: 'S-007', last_update: ago(45), fault_status: 'COMMUNICATION_LOSS', fault_description: 'Track circuit telemetry link offline', created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000008', section_id: '20000000-0000-0000-0000-000000000004', track_circuit_id: 'TC-008', railway_line: 'Gauteng Corridor', location: 'Halfway House - North Approach', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-008', last_update: ago(2), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000009', section_id: '20000000-0000-0000-0000-000000000004', track_circuit_id: 'TC-009', railway_line: 'Gauteng Corridor', location: 'Midrand Industrial Siding', status: 'FAULT', occupancy: 'UNKNOWN', signal_relationship: 'S-009', last_update: ago(12), fault_status: 'SHUNT_FAILURE', fault_description: 'Shunt current below detection threshold', created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000021', section_id: '20000000-0000-0000-0000-000000000004', track_circuit_id: 'TC-021', railway_line: 'Gauteng Corridor', location: 'Pretoria South - Composite Sleeper Zone', status: 'FAULT', occupancy: 'UNKNOWN', signal_relationship: 'S-021', last_update: ago(8), fault_status: 'COMMUNICATION_FAILURE', fault_description: 'Track circuit communication failure — physical verification required', created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000011', section_id: '20000000-0000-0000-0000-000000000005', track_circuit_id: 'TC-011', railway_line: 'Cape Metro Line', location: 'Cape Town Station - Bay 1', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-011', last_update: ago(1), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000012', section_id: '20000000-0000-0000-0000-000000000005', track_circuit_id: 'TC-012', railway_line: 'Cape Metro Line', location: 'Cape Town Station - Bay 2', status: 'OCCUPIED', occupancy: 'OCCUPIED', signal_relationship: 'S-012', last_update: ago(2), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000013', section_id: '20000000-0000-0000-0000-000000000005', track_circuit_id: 'TC-013', railway_line: 'Cape Metro Line', location: 'Salt River Junction', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-013', last_update: ago(3), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000014', section_id: '20000000-0000-0000-0000-000000000006', track_circuit_id: 'TC-014', railway_line: 'Cape Metro Line', location: 'Rondebosch Station', status: 'OCCUPIED', occupancy: 'OCCUPIED', signal_relationship: 'S-014', last_update: ago(1), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000015', section_id: '20000000-0000-0000-0000-000000000006', track_circuit_id: 'TC-015', railway_line: 'Cape Metro Line', location: 'Claremont Station Approach', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-015', last_update: ago(4), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000016', section_id: '20000000-0000-0000-0000-000000000007', track_circuit_id: 'TC-016', railway_line: 'Cape Metro Line', location: 'Lakeside Coastal Section', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-016', last_update: ago(6), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000017', section_id: '20000000-0000-0000-0000-000000000008', track_circuit_id: 'TC-017', railway_line: 'KwaZulu-Natal Coastal', location: 'Durban Port - Wharf Siding', status: 'OFFLINE', occupancy: 'UNKNOWN', signal_relationship: 'S-017', last_update: ago(180), fault_status: 'PLANNED_MAINTENANCE', fault_description: 'Planned maintenance outage - KZN-SEC-01', created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000018', section_id: '20000000-0000-0000-0000-000000000009', track_circuit_id: 'TC-018', railway_line: 'KwaZulu-Natal Coastal', location: 'Berea Road Junction', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-018', last_update: ago(2), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000019', section_id: '20000000-0000-0000-0000-000000000010', track_circuit_id: 'TC-019', railway_line: 'KwaZulu-Natal Coastal', location: 'Pinetown Freight Yard - North', status: 'OCCUPIED', occupancy: 'OCCUPIED', signal_relationship: 'S-019', last_update: ago(3), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
  { id: '30000000-0000-0000-0000-000000000020', section_id: '20000000-0000-0000-0000-000000000010', track_circuit_id: 'TC-020', railway_line: 'KwaZulu-Natal Coastal', location: 'New Germany Marshalling', status: 'NORMAL', occupancy: 'CLEAR', signal_relationship: 'S-020', last_update: ago(5), fault_status: undefined, fault_description: undefined, created_at: daysAgo(365) },
];

// ============================================================
// ASSETS (key ones — full 30 in the real DB)
// ============================================================
export const mockAssets: Asset[] = [
  { id: '50000000-0000-0000-0000-000000000001', section_id: '20000000-0000-0000-0000-000000000001', track_circuit_id: '30000000-0000-0000-0000-000000000001', asset_id: 'STEEL-RAIL-001', asset_type: 'STEEL_RAIL', description: 'Main line steel rail - Park Station northbound', location: 'Park Station - Platform 1, Northbound', gps_lat: -26.1952, gps_lon: 28.0439, installation_date: '2018-03-15', last_inspection: '2024-01-10', condition: 'GOOD', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000002', section_id: '20000000-0000-0000-0000-000000000001', track_circuit_id: '30000000-0000-0000-0000-000000000002', asset_id: 'COMPOSITE-SLEEPER-002', asset_type: 'COMPOSITE_SLEEPER', description: 'Composite sleeper installation - Platform 2 Zone', location: 'Park Station - Platform 2, Mid-section', gps_lat: -26.1958, gps_lon: 28.0445, installation_date: '2019-07-20', last_inspection: '2024-01-10', condition: 'FAIR', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000003', section_id: '20000000-0000-0000-0000-000000000002', track_circuit_id: '30000000-0000-0000-0000-000000000003', asset_id: 'BALLAST-001', asset_type: 'BALLAST_BED', description: 'Ballast bed - Johannesburg South', location: 'Johannesburg South - Approach km 2.4', gps_lat: -26.2341, gps_lon: 28.0123, installation_date: '2017-11-01', last_inspection: '2023-11-20', condition: 'GOOD', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000004', section_id: '20000000-0000-0000-0000-000000000002', track_circuit_id: '30000000-0000-0000-0000-000000000004', asset_id: 'SWITCH-ASSEMBLY-001', asset_type: 'SWITCH_ASSEMBLY', description: 'Switch assembly - Naledi loop junction', location: 'Naledi Station - Loop Junction', gps_lat: -26.2780, gps_lon: 27.8654, installation_date: '2020-04-12', last_inspection: '2024-02-05', condition: 'GOOD', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000005', section_id: '20000000-0000-0000-0000-000000000003', track_circuit_id: '30000000-0000-0000-0000-000000000005', asset_id: 'BRIDGE-001', asset_type: 'BRIDGE', description: 'Germiston Junction overpass bridge structure', location: 'Germiston Junction - North Span', gps_lat: -26.2099, gps_lon: 28.1678, installation_date: '2005-08-22', last_inspection: '2023-09-15', condition: 'WARNING', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000006', section_id: '20000000-0000-0000-0000-000000000003', track_circuit_id: '30000000-0000-0000-0000-000000000006', asset_id: 'COMPOSITE-SLEEPER-006', asset_type: 'COMPOSITE_SLEEPER', description: 'Composite sleeper panel - Germiston South', location: 'Germiston Junction - South Approach', gps_lat: -26.2134, gps_lon: 28.1590, installation_date: '2021-01-08', last_inspection: '2024-01-22', condition: 'GOOD', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000007', section_id: '20000000-0000-0000-0000-000000000003', track_circuit_id: '30000000-0000-0000-0000-000000000007', asset_id: 'EMBANKMENT-001', asset_type: 'EMBANKMENT', description: 'Earthwork embankment - Springs approach', location: 'Springs Approach - East Embankment km 19.8', gps_lat: -26.2435, gps_lon: 28.4123, installation_date: '2003-06-10', last_inspection: '2023-07-14', condition: 'WARNING', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000008', section_id: '20000000-0000-0000-0000-000000000004', track_circuit_id: '30000000-0000-0000-0000-000000000008', asset_id: 'COMPOSITE-SLEEPER-008', asset_type: 'COMPOSITE_SLEEPER', description: 'Composite sleeper block - Halfway House North', location: 'Halfway House - North Approach km 1.2', gps_lat: -25.9767, gps_lon: 28.1256, installation_date: '2020-03-18', last_inspection: '2024-01-30', condition: 'GOOD', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000009', section_id: '20000000-0000-0000-0000-000000000004', track_circuit_id: '30000000-0000-0000-0000-000000000009', asset_id: 'BRIDGE-009', asset_type: 'BRIDGE', description: 'Midrand industrial viaduct - west span', location: 'Midrand Industrial Siding - Bridge West', gps_lat: -25.9870, gps_lon: 28.1432, installation_date: '2008-05-14', last_inspection: '2023-10-08', condition: 'CRITICAL', created_at: daysAgo(365) },
  // THE MAIN DEMO ASSET
  { id: '50000000-0000-0000-0000-000000000021', section_id: '20000000-0000-0000-0000-000000000004', track_circuit_id: '30000000-0000-0000-0000-000000000021', asset_id: 'COMPOSITE-SLEEPER-021', asset_type: 'COMPOSITE_SLEEPER', description: 'Composite sleeper panel - Pretoria South Zone, TC-021 corridor', location: 'Pretoria South - Composite Sleeper Zone km 28.4', gps_lat: -25.7461, gps_lon: 28.1889, installation_date: '2021-06-01', last_inspection: '2023-12-15', condition: 'WARNING', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000011', section_id: '20000000-0000-0000-0000-000000000005', track_circuit_id: '30000000-0000-0000-0000-000000000011', asset_id: 'STEEL-RAIL-011', asset_type: 'STEEL_RAIL', description: 'Main line rail - Cape Town Station Bay 1', location: 'Cape Town Station - Bay 1', gps_lat: -33.9249, gps_lon: 18.4241, installation_date: '2019-02-14', last_inspection: '2024-02-01', condition: 'GOOD', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000012', section_id: '20000000-0000-0000-0000-000000000005', track_circuit_id: '30000000-0000-0000-0000-000000000012', asset_id: 'COMPOSITE-SLEEPER-012', asset_type: 'COMPOSITE_SLEEPER', description: 'Composite sleeper - Cape Town Bay 2 zone', location: 'Cape Town Station - Bay 2', gps_lat: -33.9254, gps_lon: 18.4248, installation_date: '2020-09-22', last_inspection: '2024-02-01', condition: 'FAIR', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000016', section_id: '20000000-0000-0000-0000-000000000007', track_circuit_id: '30000000-0000-0000-0000-000000000016', asset_id: 'RETAINING-WALL-016', asset_type: 'RETAINING_WALL', description: 'Coastal retaining wall - Lakeside embankment', location: 'Lakeside - Coastal Section km 4.2', gps_lat: -34.0580, gps_lon: 18.4789, installation_date: '2006-12-01', last_inspection: '2023-08-20', condition: 'WARNING', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000018', section_id: '20000000-0000-0000-0000-000000000008', track_circuit_id: '30000000-0000-0000-0000-000000000017', asset_id: 'BRIDGE-018', asset_type: 'BRIDGE', description: 'Durban Port wharf access bridge', location: 'Durban Port - Wharf Siding Bridge', gps_lat: -29.8587, gps_lon: 31.0218, installation_date: '2001-04-30', last_inspection: '2023-06-10', condition: 'WARNING', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000030', section_id: '20000000-0000-0000-0000-000000000004', track_circuit_id: '30000000-0000-0000-0000-000000000009', asset_id: 'RETAINING-WALL-030', asset_type: 'RETAINING_WALL', description: 'Cutting retaining wall - Midrand industrial', location: 'Midrand Industrial - Retaining Wall East', gps_lat: -25.9885, gps_lon: 28.1440, installation_date: '2009-08-17', last_inspection: '2023-10-08', condition: 'CRITICAL', created_at: daysAgo(365) },
  { id: '50000000-0000-0000-0000-000000000026', section_id: '20000000-0000-0000-0000-000000000007', track_circuit_id: '30000000-0000-0000-0000-000000000016', asset_id: 'EMBANKMENT-026', asset_type: 'EMBANKMENT', description: 'False Bay coastal earthwork embankment', location: 'False Bay Line - Coastal Embankment km 8.9', gps_lat: -34.0920, gps_lon: 18.4700, installation_date: '1998-11-20', last_inspection: '2023-08-20', condition: 'WARNING', created_at: daysAgo(365) },
];

// ============================================================
// FBG SENSORS
// ============================================================
export const mockFBGSensors: FBGSensor[] = [
  { id: '60000000-0000-0000-0000-000000000021', asset_id: '50000000-0000-0000-0000-000000000021', sensor_id: 'FBG-00021', sensor_type: 'STRAIN', baseline_strain: 250, current_strain: 612, wavelength_nm: 1550.324, sensor_status: 'WARNING', risk_level: 'SIMULATED_WARNING', install_date: '2021-06-15', last_reading: ago(3), created_at: daysAgo(365), deviation: 362, percentage_change: 144.8, trend: 'INCREASING' },
  { id: '60000000-0000-0000-0000-000000000001', asset_id: '50000000-0000-0000-0000-000000000005', sensor_id: 'FBG-00001', sensor_type: 'STRAIN', baseline_strain: 180, current_strain: 267, wavelength_nm: 1548.112, sensor_status: 'WARNING', risk_level: 'SIMULATED_WARNING', install_date: '2021-09-01', last_reading: ago(5), created_at: daysAgo(365), deviation: 87, percentage_change: 48.3, trend: 'STABLE' },
  { id: '60000000-0000-0000-0000-000000000002', asset_id: '50000000-0000-0000-0000-000000000009', sensor_id: 'FBG-00002', sensor_type: 'STRAIN', baseline_strain: 220, current_strain: 489, wavelength_nm: 1549.876, sensor_status: 'FAULT', risk_level: 'SIMULATED_CRITICAL', install_date: '2020-10-20', last_reading: ago(4), created_at: daysAgo(365), deviation: 269, percentage_change: 122.3, trend: 'INCREASING' },
  { id: '60000000-0000-0000-0000-000000000003', asset_id: '50000000-0000-0000-0000-000000000018', sensor_id: 'FBG-00003', sensor_type: 'STRAIN', baseline_strain: 195, current_strain: undefined, wavelength_nm: 1551.005, sensor_status: 'OFFLINE', risk_level: 'OFFLINE', install_date: '2019-07-22', last_reading: ago(360), created_at: daysAgo(365), deviation: undefined, percentage_change: undefined, trend: 'OFFLINE' },
  { id: '60000000-0000-0000-0000-000000000004', asset_id: '50000000-0000-0000-0000-000000000002', sensor_id: 'FBG-00004', sensor_type: 'STRAIN', baseline_strain: 230, current_strain: 238, wavelength_nm: 1549.234, sensor_status: 'ACTIVE', risk_level: 'NORMAL', install_date: '2021-08-10', last_reading: ago(2), created_at: daysAgo(365), deviation: 8, percentage_change: 3.5, trend: 'STABLE' },
  { id: '60000000-0000-0000-0000-000000000005', asset_id: '50000000-0000-0000-0000-000000000006', sensor_id: 'FBG-00005', sensor_type: 'STRAIN', baseline_strain: 245, current_strain: 261, wavelength_nm: 1550.001, sensor_status: 'ACTIVE', risk_level: 'NORMAL', install_date: '2021-01-15', last_reading: ago(6), created_at: daysAgo(365), deviation: 16, percentage_change: 6.5, trend: 'STABLE' },
  { id: '60000000-0000-0000-0000-000000000006', asset_id: '50000000-0000-0000-0000-000000000008', sensor_id: 'FBG-00006', sensor_type: 'STRAIN', baseline_strain: 240, current_strain: 245, wavelength_nm: 1548.750, sensor_status: 'ACTIVE', risk_level: 'NORMAL', install_date: '2020-04-01', last_reading: ago(3), created_at: daysAgo(365), deviation: 5, percentage_change: 2.1, trend: 'STABLE' },
  { id: '60000000-0000-0000-0000-000000000007', asset_id: '50000000-0000-0000-0000-000000000016', sensor_id: 'FBG-00007', sensor_type: 'STRAIN', baseline_strain: 160, current_strain: 312, wavelength_nm: 1552.340, sensor_status: 'WARNING', risk_level: 'SIMULATED_WARNING', install_date: '2022-01-20', last_reading: ago(7), created_at: daysAgo(365), deviation: 152, percentage_change: 95.0, trend: 'INCREASING' },
  { id: '60000000-0000-0000-0000-000000000008', asset_id: '50000000-0000-0000-0000-000000000030', sensor_id: 'FBG-00008', sensor_type: 'STRAIN', baseline_strain: 175, current_strain: 193, wavelength_nm: 1549.560, sensor_status: 'ACTIVE', risk_level: 'NORMAL', install_date: '2021-11-05', last_reading: ago(4), created_at: daysAgo(365), deviation: 18, percentage_change: 10.3, trend: 'DECREASING' },
  { id: '60000000-0000-0000-0000-000000000009', asset_id: '50000000-0000-0000-0000-000000000012', sensor_id: 'FBG-00009', sensor_type: 'STRAIN', baseline_strain: 235, current_strain: 239, wavelength_nm: 1550.890, sensor_status: 'ACTIVE', risk_level: 'NORMAL', install_date: '2020-10-01', last_reading: ago(2), created_at: daysAgo(365), deviation: 4, percentage_change: 1.7, trend: 'STABLE' },
  { id: '60000000-0000-0000-0000-000000000010', asset_id: '50000000-0000-0000-0000-000000000012', sensor_id: 'FBG-00010', sensor_type: 'STRAIN', baseline_strain: 248, current_strain: 252, wavelength_nm: 1548.900, sensor_status: 'ACTIVE', risk_level: 'NORMAL', install_date: '2021-03-15', last_reading: ago(3), created_at: daysAgo(365), deviation: 4, percentage_change: 1.6, trend: 'STABLE' },
  { id: '60000000-0000-0000-0000-000000000011', asset_id: '50000000-0000-0000-0000-000000000007', sensor_id: 'FBG-00011', sensor_type: 'STRAIN', baseline_strain: 140, current_strain: 198, wavelength_nm: 1553.110, sensor_status: 'WARNING', risk_level: 'SIMULATED_WARNING', install_date: '2022-06-08', last_reading: ago(8), created_at: daysAgo(365), deviation: 58, percentage_change: 41.4, trend: 'INCREASING' },
  { id: '60000000-0000-0000-0000-000000000016', asset_id: '50000000-0000-0000-0000-000000000026', sensor_id: 'FBG-00016', sensor_type: 'STRAIN', baseline_strain: 110, current_strain: 178, wavelength_nm: 1554.001, sensor_status: 'WARNING', risk_level: 'SIMULATED_WARNING', install_date: '2022-03-07', last_reading: ago(9), created_at: daysAgo(365), deviation: 68, percentage_change: 61.8, trend: 'INCREASING' },
  { id: '60000000-0000-0000-0000-000000000018', asset_id: '50000000-0000-0000-0000-000000000001', sensor_id: 'FBG-00018', sensor_type: 'STRAIN', baseline_strain: 210, current_strain: 210, wavelength_nm: 1550.000, sensor_status: 'CALIBRATING', risk_level: 'NORMAL', install_date: '2023-11-01', last_reading: ago(15), created_at: daysAgo(365), deviation: 0, percentage_change: 0, trend: 'STABLE' },
];

// ============================================================
// GENERATE FBG READINGS for a sensor (for charts)
// ============================================================
export function generateFBGReadings(sensorId: string, days = 30): FBGReading[] {
  const sensor = mockFBGSensors.find(s => s.id === sensorId);
  if (!sensor) return [];

  const readings: FBGReading[] = [];
  const baseline = sensor.baseline_strain;
  const current = sensor.current_strain ?? baseline;
  const totalMinutes = days * 24 * 60;
  const intervalMinutes = 60; // hourly
  const points = Math.floor(totalMinutes / intervalMinutes);

  for (let i = 0; i <= points; i++) {
    const minutesAgo = totalMinutes - i * intervalMinutes;
    const ts = new Date(now.getTime() - minutesAgo * 60000).toISOString();
    const progress = i / points; // 0 at start, 1 at end

    let value: number;
    switch (sensor.trend) {
      case 'INCREASING': {
        // Exponential growth towards current
        const t = Math.pow(progress, 2.5);
        value = baseline + (current - baseline) * t + (Math.random() * 12 - 6);
        break;
      }
      case 'DECREASING': {
        // Was higher, now declining back towards baseline
        const peak = baseline * 1.4;
        const t = 1 - Math.pow(progress, 0.5);
        value = baseline + (peak - baseline) * t + (Math.random() * 8 - 4);
        break;
      }
      case 'OFFLINE':
        // Stop producing readings 6 hours ago
        if (minutesAgo < 360) { continue; }
        value = baseline + (Math.random() * 10 - 5);
        break;
      case 'STABLE':
      default:
        value = current + (Math.random() * 14 - 7);
        // Add a single spike at 33% of the timeline for FBG-00009
        if (sensor.sensor_id === 'FBG-00009' && progress > 0.32 && progress < 0.35) {
          value = baseline * 1.65;
        }
    }

    if (value !== undefined) {
      readings.push({
        id: `reading-${sensorId}-${i}`,
        sensor_id: sensorId,
        timestamp: ts,
        strain_value: Math.max(0, Math.round(value * 10) / 10),
        wavelength: sensor.wavelength_nm,
        is_simulated: true,
      });
    }
  }
  return readings;
}

// ============================================================
// TRACK CIRCUIT EVENTS
// ============================================================
export const mockTCEvents: TrackCircuitEvent[] = [
  { id: '70000000-0000-0000-0000-000000000001', track_circuit_id: '30000000-0000-0000-0000-000000000021', timestamp: ago(75), previous_status: undefined, new_status: 'NORMAL', event_type: 'STATUS_CHANGE', description: 'TC-021 online and reporting normal status', is_simulated: true },
  { id: '70000000-0000-0000-0000-000000000002', track_circuit_id: '30000000-0000-0000-0000-000000000021', timestamp: ago(60), previous_status: 'NORMAL', new_status: 'OCCUPIED', event_type: 'STATUS_CHANGE', description: 'TC-021 section occupied — train movement detected', is_simulated: true },
  { id: '70000000-0000-0000-0000-000000000003', track_circuit_id: '30000000-0000-0000-0000-000000000021', timestamp: ago(45), previous_status: 'OCCUPIED', new_status: 'OCCUPIED', event_type: 'STATUS_CHANGE', description: 'TC-021 section still occupied — normal passage', is_simulated: true },
  { id: '70000000-0000-0000-0000-000000000004', track_circuit_id: '30000000-0000-0000-0000-000000000021', timestamp: ago(30), previous_status: 'OCCUPIED', new_status: 'FAULT', event_type: 'FAULT', description: 'TC-021 entered FAULT state — communication failure detected. Shunt current loss. Physical verification required.', is_simulated: true },
  { id: '70000000-0000-0000-0000-000000000005', track_circuit_id: '30000000-0000-0000-0000-000000000021', timestamp: ago(28), previous_status: 'FAULT', new_status: 'FAULT', event_type: 'FAULT', description: 'TC-021 fault persisting — no recovery. Alert generated.', is_simulated: true },
  { id: '70000000-0000-0000-0000-000000000006', track_circuit_id: '30000000-0000-0000-0000-000000000021', timestamp: ago(20), previous_status: 'FAULT', new_status: 'UNKNOWN', event_type: 'STATUS_CHANGE', description: 'TC-021 status UNKNOWN — telemetry intermittent. FBG-00021 simultaneously shows elevated strain.', is_simulated: true },
  { id: '70000000-0000-0000-0000-000000000007', track_circuit_id: '30000000-0000-0000-0000-000000000021', timestamp: ago(8), previous_status: 'UNKNOWN', new_status: 'FAULT', event_type: 'FAULT', description: 'TC-021 confirmed FAULT. Inspection task INS-2024-001 created. Technician assigned.', is_simulated: true },
  // TC-009
  { id: '70000000-0000-0000-0000-000000000008', track_circuit_id: '30000000-0000-0000-0000-000000000009', timestamp: ago(120), previous_status: undefined, new_status: 'NORMAL', event_type: 'STATUS_CHANGE', description: 'TC-009 normal status', is_simulated: true },
  { id: '70000000-0000-0000-0000-000000000009', track_circuit_id: '30000000-0000-0000-0000-000000000009', timestamp: ago(30), previous_status: 'NORMAL', new_status: 'FAULT', event_type: 'FAULT', description: 'TC-009 shunt current below detection threshold — possible shunting failure or contamination', is_simulated: true },
  // TC-007
  { id: '70000000-0000-0000-0000-000000000010', track_circuit_id: '30000000-0000-0000-0000-000000000007', timestamp: ago(90), previous_status: 'NORMAL', new_status: 'OFFLINE', event_type: 'OFFLINE', description: 'TC-007 telemetry link dropped — communication unit fault suspected', is_simulated: true },
];

// ============================================================
// ALERTS
// ============================================================
export const mockAlerts: Alert[] = [
  {
    id: '80000000-0000-0000-0000-000000000001', alert_ref: 'ALT-2024-001', source_type: 'COMBINED', priority: 'REQUIRES_VERIFICATION',
    title: 'TC-021 Fault + FBG-00021 Elevated Strain — Verification Required',
    description: 'TC-021 has entered a FAULT state (communication failure). Separately, FBG-00021 on COMPOSITE-SLEEPER-021 reports an increasing strain trend (+144.8% above baseline). These are two independent evidence sources in the same physical zone. Physical verification is recommended. SIMULATED DATA — MVP only.',
    track_circuit_id: '30000000-0000-0000-0000-000000000021', asset_id: '50000000-0000-0000-0000-000000000021', sensor_id: '60000000-0000-0000-0000-000000000021', section_id: '20000000-0000-0000-0000-000000000004',
    status: 'INVESTIGATING', acknowledged_by: 'Control Room Operator A. Nkosi', acknowledged_at: ago(25), is_simulated: true, created_at: ago(30), updated_at: ago(8),
  },
  {
    id: '80000000-0000-0000-0000-000000000002', alert_ref: 'ALT-2024-002', source_type: 'TRACK_CIRCUIT', priority: 'HIGH',
    title: 'TC-021 Track Circuit Communication Failure',
    description: 'TC-021 (Pretoria South - Composite Sleeper Zone) has entered a FAULT state. Communication failure detected. Last valid status: OCCUPIED. Physical verification required. SIMULATED DATA.',
    track_circuit_id: '30000000-0000-0000-0000-000000000021', asset_id: '50000000-0000-0000-0000-000000000021', sensor_id: undefined, section_id: '20000000-0000-0000-0000-000000000004',
    status: 'INVESTIGATING', acknowledged_by: 'Control Room Operator A. Nkosi', acknowledged_at: ago(27), is_simulated: true, created_at: ago(30), updated_at: ago(27),
  },
  {
    id: '80000000-0000-0000-0000-000000000003', alert_ref: 'ALT-2024-003', source_type: 'FBG_SENSOR', priority: 'WARNING',
    title: 'FBG-00021 Increasing Strain Trend on COMPOSITE-SLEEPER-021',
    description: 'FBG-00021 monitoring COMPOSITE-SLEEPER-021 reports an increasing strain trend. Current reading: 612 µε vs baseline 250 µε (deviation +362 µε, +144.8%). Trend: INCREASING. Risk: SIMULATED WARNING. This is infrastructure condition data only — it does not confirm a structural fault. SIMULATED DATA.',
    track_circuit_id: undefined, asset_id: '50000000-0000-0000-0000-000000000021', sensor_id: '60000000-0000-0000-0000-000000000021', section_id: '20000000-0000-0000-0000-000000000004',
    status: 'INVESTIGATING', acknowledged_by: 'Infrastructure Engineer B. van der Merwe', acknowledged_at: ago(22), is_simulated: true, created_at: ago(25), updated_at: ago(22),
  },
  {
    id: '80000000-0000-0000-0000-000000000004', alert_ref: 'ALT-2024-004', source_type: 'TRACK_CIRCUIT', priority: 'WARNING',
    title: 'TC-009 Shunt Current Below Detection Threshold',
    description: 'TC-009 (Midrand Industrial Siding) reports shunt current below detection threshold. Possible contamination, track degradation or shunting equipment issue. SIMULATED DATA.',
    track_circuit_id: '30000000-0000-0000-0000-000000000009', asset_id: '50000000-0000-0000-0000-000000000009', sensor_id: undefined, section_id: '20000000-0000-0000-0000-000000000004',
    status: 'OPEN', acknowledged_by: undefined, acknowledged_at: undefined, is_simulated: true, created_at: ago(30), updated_at: ago(30),
  },
  {
    id: '80000000-0000-0000-0000-000000000005', alert_ref: 'ALT-2024-005', source_type: 'FBG_SENSOR', priority: 'CRITICAL',
    title: 'FBG-00002 SIMULATED CRITICAL Strain on BRIDGE-009 Midrand',
    description: 'FBG-00002 monitoring BRIDGE-009 shows SIMULATED CRITICAL strain reading of 489 µε vs baseline 220 µε (+122.3%). This is a simulated alert for MVP demonstration. SIMULATED DATA ONLY.',
    track_circuit_id: undefined, asset_id: '50000000-0000-0000-0000-000000000009', sensor_id: '60000000-0000-0000-0000-000000000002', section_id: '20000000-0000-0000-0000-000000000004',
    status: 'ACKNOWLEDGED', acknowledged_by: 'Senior Engineer T. Dlamini', acknowledged_at: ago(60), is_simulated: true, created_at: ago(65), updated_at: ago(60),
  },
  {
    id: '80000000-0000-0000-0000-000000000006', alert_ref: 'ALT-2024-006', source_type: 'COMMUNICATION', priority: 'WARNING',
    title: 'TC-007 Telemetry Link Offline',
    description: 'TC-007 (Springs Approach East) telemetry link is offline. Communication unit fault suspected. Last status: NORMAL. SIMULATED DATA.',
    track_circuit_id: '30000000-0000-0000-0000-000000000007', asset_id: '50000000-0000-0000-0000-000000000007', sensor_id: undefined, section_id: '20000000-0000-0000-0000-000000000003',
    status: 'ACKNOWLEDGED', acknowledged_by: 'Control Room Operator P. Sithole', acknowledged_at: ago(80), is_simulated: true, created_at: ago(90), updated_at: ago(80),
  },
  {
    id: '80000000-0000-0000-0000-000000000007', alert_ref: 'ALT-2024-007', source_type: 'FBG_SENSOR', priority: 'WARNING',
    title: 'FBG-00007 Elevated Strain on RETAINING-WALL-016 Lakeside',
    description: 'FBG-00007 on RETAINING-WALL-016 reports elevated strain of 312 µε vs baseline 160 µε (+95%). Trend: INCREASING. Possible coastal erosion. SIMULATED DATA.',
    track_circuit_id: undefined, asset_id: '50000000-0000-0000-0000-000000000016', sensor_id: '60000000-0000-0000-0000-000000000007', section_id: '20000000-0000-0000-0000-000000000007',
    status: 'OPEN', acknowledged_by: undefined, acknowledged_at: undefined, is_simulated: true, created_at: ago(120), updated_at: ago(120),
  },
  {
    id: '80000000-0000-0000-0000-000000000008', alert_ref: 'ALT-2024-008', source_type: 'COMMUNICATION', priority: 'OFFLINE',
    title: 'TC-017 and FBG-00003 Offline — KZN-SEC-01 Planned Maintenance',
    description: 'TC-017 and FBG-00003 are offline as part of planned maintenance on KZN-SEC-01. No unplanned fault suspected. SIMULATED DATA.',
    track_circuit_id: '30000000-0000-0000-0000-000000000017', asset_id: '50000000-0000-0000-0000-000000000018', sensor_id: '60000000-0000-0000-0000-000000000003', section_id: '20000000-0000-0000-0000-000000000008',
    status: 'ACKNOWLEDGED', acknowledged_by: 'Maintenance Manager S. Maharaj', acknowledged_at: ago(180), is_simulated: true, created_at: ago(185), updated_at: ago(180),
  },
  {
    id: '80000000-0000-0000-0000-000000000009', alert_ref: 'ALT-2024-009', source_type: 'FBG_SENSOR', priority: 'WARNING',
    title: 'FBG-00001 Elevated Strain — BRIDGE-001 Germiston Junction',
    description: 'FBG-00001 on BRIDGE-001 shows elevated strain of 267 µε vs baseline 180 µε (+48.3%). Trend: STABLE. SIMULATED DATA.',
    track_circuit_id: undefined, asset_id: '50000000-0000-0000-0000-000000000005', sensor_id: '60000000-0000-0000-0000-000000000001', section_id: '20000000-0000-0000-0000-000000000003',
    status: 'OPEN', acknowledged_by: undefined, acknowledged_at: undefined, is_simulated: true, created_at: ago(200), updated_at: ago(200),
  },
  {
    id: '80000000-0000-0000-0000-000000000014', alert_ref: 'ALT-2024-014', source_type: 'ASSET', priority: 'WARNING',
    title: 'BRIDGE-009 Asset Condition CRITICAL — Engineering Review Required',
    description: 'BRIDGE-009 Midrand industrial viaduct is rated CRITICAL condition. Engineering review and condition assessment required. SIMULATED DATA.',
    track_circuit_id: '30000000-0000-0000-0000-000000000009', asset_id: '50000000-0000-0000-0000-000000000009', sensor_id: '60000000-0000-0000-0000-000000000002', section_id: '20000000-0000-0000-0000-000000000004',
    status: 'OPEN', acknowledged_by: undefined, acknowledged_at: undefined, is_simulated: true, created_at: ago(250), updated_at: ago(250),
  },
  {
    id: '80000000-0000-0000-0000-000000000011', alert_ref: 'ALT-2024-011', source_type: 'TRACK_CIRCUIT', priority: 'WARNING',
    title: 'TC-014 Brief Occupation Anomaly — Resolved',
    description: 'TC-014 showed anomalous occupation signal. Investigation found vegetation on track. Vegetation cleared. SIMULATED DATA.',
    track_circuit_id: '30000000-0000-0000-0000-000000000014', asset_id: undefined, sensor_id: undefined, section_id: '20000000-0000-0000-0000-000000000006',
    status: 'CLOSED', acknowledged_by: 'Inspector M. Botha', acknowledged_at: daysAgo(5), is_simulated: true, created_at: daysAgo(5), updated_at: daysAgo(5),
  },
  {
    id: '80000000-0000-0000-0000-000000000020', alert_ref: 'ALT-2024-020', source_type: 'COMBINED', priority: 'HIGH',
    title: 'TC-009 + BRIDGE-009 + RETAINING-WALL-030 — GAU-SEC-04 Risk Cluster',
    description: 'Multiple concurrent issues in GAU-SEC-04: TC-009 shunt failure, BRIDGE-009 CRITICAL condition, RETAINING-WALL-030 CRITICAL condition. Coordinated engineering review warranted. SIMULATED DATA.',
    track_circuit_id: '30000000-0000-0000-0000-000000000009', asset_id: '50000000-0000-0000-0000-000000000009', sensor_id: '60000000-0000-0000-0000-000000000002', section_id: '20000000-0000-0000-0000-000000000004',
    status: 'OPEN', acknowledged_by: undefined, acknowledged_at: undefined, is_simulated: true, created_at: ago(300), updated_at: ago(300),
  },
];

// ============================================================
// INSPECTIONS
// ============================================================
export const mockInspections: Inspection[] = [
  {
    id: '90000000-0000-0000-0000-000000000001', inspection_ref: 'INS-2024-001',
    alert_id: '80000000-0000-0000-0000-000000000001',
    asset_id: '50000000-0000-0000-0000-000000000021',
    track_circuit_id: '30000000-0000-0000-0000-000000000021',
    sensor_id: '60000000-0000-0000-0000-000000000021',
    title: 'TC-021 Physical Verification — COMPOSITE-SLEEPER-021',
    reason: 'TC-021 fault detected. FBG-00021 shows elevated strain. Physical inspection required.',
    priority: 'URGENT', assigned_to: 'Field Inspector J. Mokoena', inspector_name: 'J. Mokoena',
    status: 'IN_PROGRESS', scheduled_date: new Date().toISOString().split('T')[0], completed_date: undefined,
    location: 'Pretoria South - Composite Sleeper Zone km 28.4',
    findings: 'Preliminary visual: visible cracking observed on 3 sleeper panels in the TC-021 zone. Track geometry appears disturbed. FBG-00021 sensor cable intact. TC-021 bonding joint requires inspection.',
    fault_confirmed: undefined, false_alarm: false, photos_count: 2,
    recommendation: 'Detailed crack assessment required. Consider emergency maintenance if cracking is structural. TC-021 bonding joint may require replacement.',
    created_at: ago(25), updated_at: ago(10),
  },
  {
    id: '90000000-0000-0000-0000-000000000002', inspection_ref: 'INS-2024-002',
    alert_id: '80000000-0000-0000-0000-000000000005',
    asset_id: '50000000-0000-0000-0000-000000000009',
    track_circuit_id: '30000000-0000-0000-0000-000000000009',
    sensor_id: '60000000-0000-0000-0000-000000000002',
    title: 'BRIDGE-009 Structural Assessment — Midrand Viaduct',
    reason: 'FBG-00002 critical strain reading. Asset rated CRITICAL.',
    priority: 'URGENT', assigned_to: 'Senior Inspector T. Dlamini', inspector_name: 'T. Dlamini',
    status: 'COMPLETED', scheduled_date: daysAgo(3).split('T')[0], completed_date: daysAgo(2).split('T')[0],
    location: 'Midrand Industrial Siding - Bridge West',
    findings: 'Inspection found significant spalling on west abutment. Two main girder welds showing stress cracks. Bridge rated CRITICAL. Immediate maintenance intervention required.',
    fault_confirmed: true, false_alarm: false, photos_count: 8,
    recommendation: 'Emergency structural repair required. Restrict use pending repair. Assign structural engineer.',
    created_at: daysAgo(4), updated_at: daysAgo(2),
  },
  {
    id: '90000000-0000-0000-0000-000000000003', inspection_ref: 'INS-2024-003',
    alert_id: '80000000-0000-0000-0000-000000000009',
    asset_id: '50000000-0000-0000-0000-000000000005',
    track_circuit_id: '30000000-0000-0000-0000-000000000005',
    sensor_id: '60000000-0000-0000-0000-000000000001',
    title: 'BRIDGE-001 6-Monthly Inspection — Germiston Junction',
    reason: 'Scheduled 6-monthly inspection. Asset in WARNING condition.',
    priority: 'NORMAL', assigned_to: 'Inspector K. Pretorius', inspector_name: 'K. Pretorius',
    status: 'ASSIGNED', scheduled_date: new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0],
    completed_date: undefined, location: 'Germiston Junction - North Span',
    findings: undefined, fault_confirmed: undefined, false_alarm: false, photos_count: 0, recommendation: undefined,
    created_at: daysAgo(2), updated_at: daysAgo(2),
  },
  {
    id: '90000000-0000-0000-0000-000000000004', inspection_ref: 'INS-2024-004',
    alert_id: '80000000-0000-0000-0000-000000000006',
    asset_id: '50000000-0000-0000-0000-000000000007',
    track_circuit_id: '30000000-0000-0000-0000-000000000007',
    sensor_id: undefined,
    title: 'TC-007 Communication Unit Inspection',
    reason: 'TC-007 telemetry link offline. Communication unit fault suspected.',
    priority: 'HIGH', assigned_to: 'Technician R. Williams', inspector_name: 'R. Williams',
    status: 'COMPLETED', scheduled_date: daysAgo(1).split('T')[0], completed_date: new Date().toISOString().split('T')[0],
    location: 'Springs Approach East - Signal Equipment Room',
    findings: 'Communication unit power supply board failed. Board replaced. TC-007 telemetry restored.',
    fault_confirmed: true, false_alarm: false, photos_count: 3,
    recommendation: 'Replace communication unit power supply. Monitor TC-007 for 24 hours.',
    created_at: daysAgo(3), updated_at: ago(60),
  },
  {
    id: '90000000-0000-0000-0000-000000000006', inspection_ref: 'INS-2024-006',
    alert_id: '80000000-0000-0000-0000-000000000011',
    asset_id: '50000000-0000-0000-0000-000000000021',
    track_circuit_id: '30000000-0000-0000-0000-000000000014',
    sensor_id: undefined,
    title: 'TC-014 Vegetation Clearance Inspection',
    reason: 'Anomalous occupation signal on TC-014.',
    priority: 'NORMAL', assigned_to: 'Inspector M. Botha', inspector_name: 'M. Botha',
    status: 'COMPLETED', scheduled_date: daysAgo(5).split('T')[0], completed_date: daysAgo(5).split('T')[0],
    location: 'Rondebosch Station - Platform Zone',
    findings: 'Vegetation growing onto track in TC-014 zone. Track cleared.',
    fault_confirmed: true, false_alarm: false, photos_count: 4,
    recommendation: 'Schedule regular vegetation clearance for TC-014 zone.',
    created_at: daysAgo(6), updated_at: daysAgo(5),
  },
];

// ============================================================
// MAINTENANCE TASKS
// ============================================================
export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: 'A0000000-0000-0000-0000-000000000001', maintenance_ref: 'MNT-2024-001',
    inspection_id: '90000000-0000-0000-0000-000000000001',
    asset_id: '50000000-0000-0000-0000-000000000021',
    alert_id: '80000000-0000-0000-0000-000000000001',
    title: 'COMPOSITE-SLEEPER-021 Crack Assessment and Repair + TC-021 Bonding Joint',
    fault_description: 'Visible cracking on 3 composite sleeper panels. TC-021 bonding joint suspected communication failure. FBG-00021 elevated strain.',
    cause: 'Physical deterioration of sleeper material combined with bonding joint degradation. Cause under investigation.',
    work_description: 'Step 1: Full crack survey of COMPOSITE-SLEEPER-021 zone. Step 2: Replace TC-021 bonding joint. Step 3: Repair/replace damaged sleeper panels. Step 4: Verify FBG-00021 baseline post-repair. Step 5: Confirm TC-021 returns to NORMAL.',
    assigned_technician: 'Senior Technician A. Nkosi', priority: 'URGENT', status: 'IN_PROGRESS',
    start_time: ago(120), completion_time: undefined, created_at: ago(130), updated_at: ago(120),
  },
  {
    id: 'A0000000-0000-0000-0000-000000000002', maintenance_ref: 'MNT-2024-002',
    inspection_id: '90000000-0000-0000-0000-000000000002',
    asset_id: '50000000-0000-0000-0000-000000000009',
    alert_id: '80000000-0000-0000-0000-000000000005',
    title: 'BRIDGE-009 Emergency Structural Repair — West Abutment',
    fault_description: 'Spalling on west abutment. Two main girder welds with stress cracks. Critical condition.',
    cause: 'Material fatigue and age-related deterioration. Load stress cracking at welded joints.',
    work_description: 'Structural repair: spall repair at west abutment, weld repair and reinforcement on main girders. Engineering drawings required.',
    assigned_technician: 'Structural Engineer C. van Niekerk + Team', priority: 'URGENT', status: 'ASSIGNED',
    start_time: undefined, completion_time: undefined, created_at: daysAgo(2), updated_at: daysAgo(2),
  },
  {
    id: 'A0000000-0000-0000-0000-000000000003', maintenance_ref: 'MNT-2024-003',
    inspection_id: '90000000-0000-0000-0000-000000000004',
    asset_id: '50000000-0000-0000-0000-000000000007',
    alert_id: '80000000-0000-0000-0000-000000000006',
    title: 'TC-007 Communication Unit Power Supply Replacement',
    fault_description: 'Communication unit power supply board failure. TC-007 telemetry offline.',
    cause: 'Electronic component failure — power supply board. Age/heat-related.',
    work_description: 'Replace failed power supply board. Test telemetry link. Monitor for 24 hours.',
    assigned_technician: 'Technician R. Williams', priority: 'HIGH', status: 'VERIFICATION_REQUIRED',
    start_time: ago(360), completion_time: ago(60), created_at: daysAgo(1), updated_at: ago(60),
  },
  {
    id: 'A0000000-0000-0000-0000-000000000004', maintenance_ref: 'MNT-2024-004',
    inspection_id: '90000000-0000-0000-0000-000000000006',
    asset_id: '50000000-0000-0000-0000-000000000021',
    alert_id: '80000000-0000-0000-0000-000000000011',
    title: 'TC-014 Zone Vegetation Clearance',
    fault_description: 'Vegetation on track causing anomalous occupation signal.',
    cause: 'Overgrown vegetation from adjacent embankment.',
    work_description: 'Clear vegetation from TC-014 section. Apply herbicide. Inspect track geometry.',
    assigned_technician: 'Track Gang Supervisor D. Molefe', priority: 'NORMAL', status: 'CLOSED',
    start_time: daysAgo(5), completion_time: new Date(daysAgo(5).valueOf() - 3600000).toISOString(), created_at: daysAgo(6), updated_at: daysAgo(5),
  },
  {
    id: 'A0000000-0000-0000-0000-000000000005', maintenance_ref: 'MNT-2024-005',
    inspection_id: undefined,
    asset_id: '50000000-0000-0000-0000-000000000030',
    alert_id: undefined,
    title: 'RETAINING-WALL-030 Structural Repair — Midrand',
    fault_description: 'Retaining wall in CRITICAL condition.',
    cause: 'Under investigation — inspection pending.',
    work_description: 'Pending inspection findings.',
    assigned_technician: 'Structural Engineer C. van Niekerk', priority: 'HIGH', status: 'OPEN',
    start_time: undefined, completion_time: undefined, created_at: daysAgo(3), updated_at: daysAgo(3),
  },
  {
    id: 'A0000000-0000-0000-0000-000000000007', maintenance_ref: 'MNT-2024-007',
    inspection_id: undefined,
    asset_id: '50000000-0000-0000-0000-000000000016',
    alert_id: undefined,
    title: 'TC-016 Communication Unit Power Supply Replacement',
    fault_description: 'TC-016 telemetry intermittent — power supply fault.',
    cause: 'Electronic component failure.',
    work_description: 'Replace power supply in TC-016 unit.',
    assigned_technician: 'Technician R. Williams', priority: 'HIGH', status: 'VERIFIED',
    start_time: daysAgo(15), completion_time: new Date(daysAgo(15).valueOf() + 7200000).toISOString(), created_at: daysAgo(16), updated_at: daysAgo(14),
  },
  {
    id: 'A0000000-0000-0000-0000-000000000009', maintenance_ref: 'MNT-2024-009',
    inspection_id: undefined,
    asset_id: '50000000-0000-0000-0000-000000000018',
    alert_id: undefined,
    title: 'BRIDGE-018 Surface Corrosion Treatment — Durban Port',
    fault_description: 'Minor surface corrosion on steel girders.',
    cause: 'Marine coastal environment — salt corrosion.',
    work_description: 'Apply anti-corrosion coating to affected surfaces.',
    assigned_technician: 'Maintenance Team Supervisor S. Maharaj', priority: 'NORMAL', status: 'IN_PROGRESS',
    start_time: ago(300), completion_time: undefined, created_at: daysAgo(1), updated_at: ago(300),
  },
];

// ============================================================
// MAINTENANCE VERIFICATIONS
// ============================================================
export const mockVerifications: MaintenanceVerification[] = [
  {
    id: 'B0000000-0000-0000-0000-000000000001',
    maintenance_task_id: 'A0000000-0000-0000-0000-000000000007',
    verified_by: 'Control Room Supervisor V. Jacobs',
    verification_date: daysAgo(14),
    result: 'PASSED',
    notes: 'TC-016 telemetry confirmed stable for 24 hours post-repair.',
    post_strain_reading: undefined,
    tc_status_confirmed: 'NORMAL',
    created_at: daysAgo(14),
  },
];
