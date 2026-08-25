// ============================================================
// REGEN Railway Infrastructure Monitoring Platform
// Comprehensive Seed Data - South African Railway Context
// SIMULATED DATA - Not representative of real PRASA/Transnet infrastructure
// ============================================================

import type {
  Organisation, RailwayLine, Section, TrackCircuit, TrackCircuitEvent,
  Signal, Asset, FbgSensor, FbgReading, Alert, Inspection,
  MaintenanceTask, MaintenanceVerification
} from "../types";

// Fixed timestamps relative to a reference point
const NOW = new Date("2024-03-15T10:42:18Z");
const ts = (offsetMinutes: number): string =>
  new Date(NOW.getTime() + offsetMinutes * 60000).toISOString();
const tsH = (offsetHours: number): string => ts(offsetHours * 60);
const tsD = (offsetDays: number): string => ts(offsetDays * 1440);

// ============================================================
// ORGANISATION
// ============================================================
export const ORGANISATION: Organisation = {
  id: "org-001",
  name: "REGEN Railway Infrastructure Authority",
  code: "RRIA",
  country: "South Africa",
  created_at: tsD(-365),
};

// ============================================================
// RAILWAY LINES  (3 lines)
// ============================================================
export const RAILWAY_LINES: RailwayLine[] = [
  {
    id: "rl-001",
    organisation_id: "org-001",
    name: "Gauteng Corridor",
    code: "GC",
    description: "Main commuter and freight corridor through Gauteng province",
    total_length_km: 142.5,
    status: "OPERATIONAL",
    created_at: tsD(-365),
  },
  {
    id: "rl-002",
    organisation_id: "org-001",
    name: "Cape Metro Line",
    code: "CML",
    description: "Western Cape metropolitan rail network",
    total_length_km: 98.3,
    status: "PARTIAL",
    created_at: tsD(-365),
  },
  {
    id: "rl-003",
    organisation_id: "org-001",
    name: "Durban Coastal Corridor",
    code: "DCC",
    description: "KwaZulu-Natal coastal freight and passenger corridor",
    total_length_km: 76.8,
    status: "OPERATIONAL",
    created_at: tsD(-365),
  },
];

// ============================================================
// SECTIONS  (10 sections)
// ============================================================
export const SECTIONS: Section[] = [
  // Gauteng Corridor - 4 sections
  {
    id: "sec-001", railway_line_id: "rl-001",
    name: "Johannesburg Central - Germiston", code: "GC-SEC-01",
    start_location: "Johannesburg Central", end_location: "Germiston Junction",
    length_km: 18.2, status: "OPERATIONAL", created_at: tsD(-365),
  },
  {
    id: "sec-002", railway_line_id: "rl-001",
    name: "Germiston Junction - Boksburg", code: "GC-SEC-02",
    start_location: "Germiston Junction", end_location: "Boksburg North",
    length_km: 12.7, status: "OPERATIONAL", created_at: tsD(-365),
  },
  {
    id: "sec-003", railway_line_id: "rl-001",
    name: "Boksburg North - Benoni", code: "GC-SEC-03",
    start_location: "Boksburg North", end_location: "Benoni Station",
    length_km: 9.4, status: "OPERATIONAL", created_at: tsD(-365),
  },
  {
    id: "sec-004", railway_line_id: "rl-001",
    name: "Benoni - Daveyton", code: "GC-SEC-04",
    start_location: "Benoni Station", end_location: "Daveyton",
    length_km: 11.6, status: "MAINTENANCE", created_at: tsD(-365),
  },
  // Cape Metro Line - 3 sections
  {
    id: "sec-005", railway_line_id: "rl-002",
    name: "Cape Town - Bellville", code: "CML-SEC-01",
    start_location: "Cape Town Central", end_location: "Bellville Junction",
    length_km: 22.1, status: "OPERATIONAL", created_at: tsD(-365),
  },
  {
    id: "sec-006", railway_line_id: "rl-002",
    name: "Bellville - Kraaifontein", code: "CML-SEC-02",
    start_location: "Bellville Junction", end_location: "Kraaifontein",
    length_km: 14.8, status: "RESTRICTED", created_at: tsD(-365),
  },
  {
    id: "sec-007", railway_line_id: "rl-002",
    name: "Kraaifontein - Paarl", code: "CML-SEC-03",
    start_location: "Kraaifontein", end_location: "Paarl Station",
    length_km: 31.2, status: "OPERATIONAL", created_at: tsD(-365),
  },
  // Durban Coastal Corridor - 3 sections
  {
    id: "sec-008", railway_line_id: "rl-003",
    name: "Durban Harbour - Rossburgh", code: "DCC-SEC-01",
    start_location: "Durban Harbour", end_location: "Rossburgh",
    length_km: 8.9, status: "OPERATIONAL", created_at: tsD(-365),
  },
  {
    id: "sec-009", railway_line_id: "rl-003",
    name: "Rossburgh - Amanzimtoti", code: "DCC-SEC-02",
    start_location: "Rossburgh", end_location: "Amanzimtoti",
    length_km: 16.4, status: "OPERATIONAL", created_at: tsD(-365),
  },
  {
    id: "sec-010", railway_line_id: "rl-003",
    name: "Amanzimtoti - Umkomaas", code: "DCC-SEC-03",
    start_location: "Amanzimtoti", end_location: "Umkomaas",
    length_km: 18.7, status: "OPERATIONAL", created_at: tsD(-365),
  },
];

// ============================================================
// TRACK CIRCUITS  (20 circuits)
// ============================================================
export const TRACK_CIRCUITS: TrackCircuit[] = [
  // GC-SEC-01 (4 circuits)
  { id:"tc-001", track_circuit_id:"TC-001", section_id:"sec-001", railway_line_id:"rl-001",
    location_description:"Johannesburg Central Platform 4 approach", status:"NORMAL",
    occupancy:false, signal_relationship:"S-001", last_update:ts(-5),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  { id:"tc-002", track_circuit_id:"TC-002", section_id:"sec-001", railway_line_id:"rl-001",
    location_description:"Johannesburg Central - Doornfontein intermediate", status:"OCCUPIED",
    occupancy:true, signal_relationship:"S-002", last_update:ts(-2),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  { id:"tc-003", track_circuit_id:"TC-003", section_id:"sec-001", railway_line_id:"rl-001",
    location_description:"Doornfontein Station approach", status:"NORMAL",
    occupancy:false, signal_relationship:"S-003", last_update:ts(-8),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  { id:"tc-004", track_circuit_id:"TC-004", section_id:"sec-001", railway_line_id:"rl-001",
    location_description:"Germiston Junction entry", status:"NORMAL",
    occupancy:false, signal_relationship:"S-004", last_update:ts(-12),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  // GC-SEC-02 (3 circuits)
  { id:"tc-005", track_circuit_id:"TC-005", section_id:"sec-002", railway_line_id:"rl-001",
    location_description:"Germiston Junction exit - Boksburg approach", status:"NORMAL",
    occupancy:false, signal_relationship:"S-005", last_update:ts(-15),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  { id:"tc-006", track_circuit_id:"TC-006", section_id:"sec-002", railway_line_id:"rl-001",
    location_description:"Boksburg intermediate section", status:"OCCUPIED",
    occupancy:true, signal_relationship:"S-006", last_update:ts(-3),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  { id:"tc-007", track_circuit_id:"TC-007", section_id:"sec-002", railway_line_id:"rl-001",
    location_description:"Boksburg North platform entry", status:"NORMAL",
    occupancy:false, signal_relationship:"S-007", last_update:ts(-20),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  // GC-SEC-03 (3 circuits)
  { id:"tc-008", track_circuit_id:"TC-008", section_id:"sec-003", railway_line_id:"rl-001",
    location_description:"Boksburg North exit - Benoni approach", status:"NORMAL",
    occupancy:false, signal_relationship:"S-008", last_update:ts(-10),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  { id:"tc-009", track_circuit_id:"TC-009", section_id:"sec-003", railway_line_id:"rl-001",
    location_description:"Benoni East intermediate", status:"OFFLINE",
    occupancy:false, signal_relationship:"S-009", last_update:tsH(-2),
    fault_status:"COMMUNICATION_FAILURE", fault_description:"Track circuit communication timeout — no telemetry for 2 hours",
    created_at:tsD(-300) },
  { id:"tc-010", track_circuit_id:"TC-010", section_id:"sec-003", railway_line_id:"rl-001",
    location_description:"Benoni Station approach", status:"NORMAL",
    occupancy:false, signal_relationship:"S-010", last_update:ts(-18),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  // GC-SEC-04 (3 circuits) — TC-021 is the DEMONSTRATION circuit
  { id:"tc-011", track_circuit_id:"TC-011", section_id:"sec-004", railway_line_id:"rl-001",
    location_description:"Benoni Station exit - Daveyton approach", status:"UNKNOWN",
    occupancy:false, signal_relationship:"S-011", last_update:ts(-45),
    fault_status:"INTERMITTENT_LOSS", fault_description:"Intermittent loss of track circuit data",
    created_at:tsD(-300) },
  { id:"tc-021", track_circuit_id:"TC-021", section_id:"sec-004", railway_line_id:"rl-001",
    location_description:"Daveyton intermediate — Composite Sleeper Zone", status:"FAULT",
    occupancy:false, signal_relationship:"S-021", last_update:ts(0),
    fault_status:"COMMUNICATION_FAILURE", fault_description:"Track circuit communication failure — joint bond suspected. Physical verification required.",
    created_at:tsD(-300) },
  { id:"tc-013", track_circuit_id:"TC-013", section_id:"sec-004", railway_line_id:"rl-001",
    location_description:"Daveyton Station approach", status:"NORMAL",
    occupancy:false, signal_relationship:"S-013", last_update:ts(-6),
    fault_status:null, fault_description:null, created_at:tsD(-300) },
  // CML-SEC-01 (2 circuits)
  { id:"tc-014", track_circuit_id:"TC-014", section_id:"sec-005", railway_line_id:"rl-002",
    location_description:"Cape Town Central departure", status:"OCCUPIED",
    occupancy:true, signal_relationship:"S-014", last_update:ts(-1),
    fault_status:null, fault_description:null, created_at:tsD(-200) },
  { id:"tc-015", track_circuit_id:"TC-015", section_id:"sec-005", railway_line_id:"rl-002",
    location_description:"Parow intermediate", status:"NORMAL",
    occupancy:false, signal_relationship:"S-015", last_update:ts(-25),
    fault_status:null, fault_description:null, created_at:tsD(-200) },
  // CML-SEC-02 (2 circuits)
  { id:"tc-016", track_circuit_id:"TC-016", section_id:"sec-006", railway_line_id:"rl-002",
    location_description:"Bellville Junction exit", status:"FAULT",
    occupancy:false, signal_relationship:"S-016", last_update:tsH(-1),
    fault_status:"RELAY_FAILURE", fault_description:"Suspected relay failure at Bellville Junction exit",
    created_at:tsD(-200) },
  { id:"tc-017", track_circuit_id:"TC-017", section_id:"sec-006", railway_line_id:"rl-002",
    location_description:"Kraaifontein approach", status:"NORMAL",
    occupancy:false, signal_relationship:"S-017", last_update:ts(-30),
    fault_status:null, fault_description:null, created_at:tsD(-200) },
  // DCC-SEC-01 (1 circuit)
  { id:"tc-018", track_circuit_id:"TC-018", section_id:"sec-008", railway_line_id:"rl-003",
    location_description:"Durban Harbour exit", status:"OCCUPIED",
    occupancy:true, signal_relationship:"S-018", last_update:ts(-4),
    fault_status:null, fault_description:null, created_at:tsD(-150) },
  // DCC-SEC-02 (1 circuit)
  { id:"tc-019", track_circuit_id:"TC-019", section_id:"sec-009", railway_line_id:"rl-003",
    location_description:"Rossburgh - Bluff intermediate", status:"NORMAL",
    occupancy:false, signal_relationship:"S-019", last_update:ts(-22),
    fault_status:null, fault_description:null, created_at:tsD(-150) },
  // DCC-SEC-03 (1 circuit)
  { id:"tc-020", track_circuit_id:"TC-020", section_id:"sec-010", railway_line_id:"rl-003",
    location_description:"Amanzimtoti - Umkomaas bridge approach", status:"WARNING" as any,
    occupancy:false, signal_relationship:"S-020", last_update:ts(-35),
    fault_status:"BOND_DEGRADATION", fault_description:"Possible track circuit bond degradation near coastal bridge",
    created_at:tsD(-150) },
];

// ============================================================
// TRACK CIRCUIT EVENTS (100+ events for demonstration)
// ============================================================
export const TRACK_CIRCUIT_EVENTS: TrackCircuitEvent[] = [
  // TC-021 DEMONSTRATION SCENARIO (key scenario)
  { id:"tce-001", track_circuit_id:"tc-021", previous_status:"NORMAL", new_status:"OCCUPIED",
    event_type:"OCCUPANCY", description:"Train detected in section — TC-021 shows occupancy",
    timestamp:ts(-7), created_at:ts(-7) },
  { id:"tce-002", track_circuit_id:"tc-021", previous_status:"OCCUPIED", new_status:"OCCUPIED",
    event_type:"OCCUPANCY_CONTINUED", description:"Train still in section — occupancy sustained",
    timestamp:ts(-5), created_at:ts(-5) },
  { id:"tce-003", track_circuit_id:"tc-021", previous_status:"OCCUPIED", new_status:"FAULT",
    event_type:"FAULT_DETECTED", description:"TC-021 transitioned to FAULT state. Track circuit communication failure detected. Signal S-021 affected.",
    timestamp:ts(-3), created_at:ts(-3) },
  { id:"tce-004", track_circuit_id:"tc-021", previous_status:"FAULT", new_status:"FAULT",
    event_type:"FAULT_SUSTAINED", description:"TC-021 fault condition sustained — no recovery detected",
    timestamp:ts(-2), created_at:ts(-2) },
  { id:"tce-005", track_circuit_id:"tc-021", previous_status:"FAULT", new_status:"UNKNOWN",
    event_type:"STATUS_UNKNOWN", description:"TC-021 telemetry ambiguous — possible intermittent failure",
    timestamp:ts(-1), created_at:ts(-1) },
  { id:"tce-006", track_circuit_id:"tc-021", previous_status:"UNKNOWN", new_status:"FAULT",
    event_type:"FAULT_RECONFIRMED", description:"TC-021 confirmed FAULT state — awaiting physical inspection",
    timestamp:ts(0), created_at:ts(0) },
  // Historical events for TC-021
  { id:"tce-007", track_circuit_id:"tc-021", previous_status:"FAULT", new_status:"NORMAL",
    event_type:"RESOLVED", description:"Previous TC-021 fault cleared after inspection and bond repair",
    timestamp:tsD(-14), created_at:tsD(-14) },
  { id:"tce-008", track_circuit_id:"tc-021", previous_status:"NORMAL", new_status:"FAULT",
    event_type:"FAULT_DETECTED", description:"TC-021 fault detected — bond wear identified",
    timestamp:tsD(-28), created_at:tsD(-28) },
  // TC-009 events
  { id:"tce-009", track_circuit_id:"tc-009", previous_status:"NORMAL", new_status:"OFFLINE",
    event_type:"COMMS_LOST", description:"TC-009 communication lost — no telemetry received",
    timestamp:tsH(-2), created_at:tsH(-2) },
  { id:"tce-010", track_circuit_id:"tc-009", previous_status:"NORMAL", new_status:"NORMAL",
    event_type:"STATUS_OK", description:"TC-009 operating normally", timestamp:tsH(-3), created_at:tsH(-3) },
  // TC-016 events
  { id:"tce-011", track_circuit_id:"tc-016", previous_status:"NORMAL", new_status:"FAULT",
    event_type:"FAULT_DETECTED", description:"TC-016 relay failure suspected at Bellville Junction",
    timestamp:tsH(-1), created_at:tsH(-1) },
  // TC-011 events
  { id:"tce-012", track_circuit_id:"tc-011", previous_status:"NORMAL", new_status:"UNKNOWN",
    event_type:"INTERMITTENT", description:"TC-011 showing intermittent data loss",
    timestamp:ts(-45), created_at:ts(-45) },
  // Normal occupancy events for various circuits
  { id:"tce-013", track_circuit_id:"tc-002", previous_status:"NORMAL", new_status:"OCCUPIED",
    event_type:"OCCUPANCY", description:"TC-002 train occupancy detected", timestamp:ts(-2), created_at:ts(-2) },
  { id:"tce-014", track_circuit_id:"tc-006", previous_status:"NORMAL", new_status:"OCCUPIED",
    event_type:"OCCUPANCY", description:"TC-006 train occupancy detected", timestamp:ts(-3), created_at:ts(-3) },
  { id:"tce-015", track_circuit_id:"tc-014", previous_status:"NORMAL", new_status:"OCCUPIED",
    event_type:"OCCUPANCY", description:"TC-014 train occupancy detected", timestamp:ts(-1), created_at:ts(-1) },
  { id:"tce-016", track_circuit_id:"tc-018", previous_status:"NORMAL", new_status:"OCCUPIED",
    event_type:"OCCUPANCY", description:"TC-018 train occupancy detected", timestamp:ts(-4), created_at:ts(-4) },
  // Additional historical TC-021 events
  { id:"tce-017", track_circuit_id:"tc-021", previous_status:"NORMAL", new_status:"NORMAL",
    event_type:"STATUS_OK", description:"TC-021 verified normal post-maintenance", timestamp:tsD(-7), created_at:tsD(-7) },
  { id:"tce-018", track_circuit_id:"tc-021", previous_status:"NORMAL", new_status:"OCCUPIED",
    event_type:"OCCUPANCY", description:"Regular train passage TC-021", timestamp:tsD(-3), created_at:tsD(-3) },
  { id:"tce-019", track_circuit_id:"tc-021", previous_status:"OCCUPIED", new_status:"NORMAL",
    event_type:"CLEAR", description:"TC-021 cleared after train passage", timestamp:tsD(-3)+1, created_at:tsD(-3)+1 },
  { id:"tce-020", track_circuit_id:"tc-001", previous_status:"NORMAL", new_status:"OCCUPIED",
    event_type:"OCCUPANCY", description:"TC-001 regular train passage", timestamp:tsH(-1), created_at:tsH(-1) },
];

// ============================================================
// SIGNALS  (10 signals)
// ============================================================
export const SIGNALS: Signal[] = [
  { id:"sig-001", signal_id:"S-001", track_circuit_id:"tc-001", section_id:"sec-001", name:"Signal S-001", location_description:"JHB Central P4 approach", signal_type:"COLOUR_LIGHT", status:"NORMAL", created_at:tsD(-300) },
  { id:"sig-002", signal_id:"S-002", track_circuit_id:"tc-002", section_id:"sec-001", name:"Signal S-002", location_description:"JHB Central - Doornfontein intermediate", signal_type:"COLOUR_LIGHT", status:"CAUTION", created_at:tsD(-300) },
  { id:"sig-005", signal_id:"S-005", track_circuit_id:"tc-005", section_id:"sec-002", name:"Signal S-005", location_description:"Germiston Junction exit", signal_type:"COLOUR_LIGHT", status:"NORMAL", created_at:tsD(-300) },
  { id:"sig-008", signal_id:"S-008", track_circuit_id:"tc-008", section_id:"sec-003", name:"Signal S-008", location_description:"Boksburg North exit", signal_type:"COLOUR_LIGHT", status:"NORMAL", created_at:tsD(-300) },
  { id:"sig-009", signal_id:"S-009", track_circuit_id:"tc-009", section_id:"sec-003", name:"Signal S-009", location_description:"Benoni East intermediate", signal_type:"COLOUR_LIGHT", status:"OFFLINE", created_at:tsD(-300) },
  { id:"sig-011", signal_id:"S-011", track_circuit_id:"tc-011", section_id:"sec-004", name:"Signal S-011", location_description:"Benoni exit - Daveyton approach", signal_type:"COLOUR_LIGHT", status:"CAUTION", created_at:tsD(-300) },
  { id:"sig-021", signal_id:"S-021", track_circuit_id:"tc-021", section_id:"sec-004", name:"Signal S-021", location_description:"Daveyton intermediate zone", signal_type:"COLOUR_LIGHT", status:"FAULT", created_at:tsD(-300) },
  { id:"sig-014", signal_id:"S-014", track_circuit_id:"tc-014", section_id:"sec-005", name:"Signal S-014", location_description:"Cape Town Central departure", signal_type:"COLOUR_LIGHT", status:"NORMAL", created_at:tsD(-200) },
  { id:"sig-016", signal_id:"S-016", track_circuit_id:"tc-016", section_id:"sec-006", name:"Signal S-016", location_description:"Bellville Junction exit", signal_type:"COLOUR_LIGHT", status:"FAULT", created_at:tsD(-200) },
  { id:"sig-018", signal_id:"S-018", track_circuit_id:"tc-018", section_id:"sec-008", name:"Signal S-018", location_description:"Durban Harbour exit", signal_type:"COLOUR_LIGHT", status:"NORMAL", created_at:tsD(-150) },
];

// ============================================================
// ASSETS  (30 assets)
// ============================================================
export const ASSETS: Asset[] = [
  // GC-SEC-04 — KEY DEMONSTRATION ASSET
  { id:"ast-021", asset_id:"COMPOSITE-SLEEPER-021", section_id:"sec-004", track_circuit_id:"tc-021",
    signal_id:"sig-021", name:"Composite Sleeper 021", asset_type:"COMPOSITE_SLEEPER",
    location_description:"GC-SEC-04 — Daveyton intermediate zone, 6.2km from Benoni", 
    latitude:-26.1425, longitude:28.3691,
    installation_date:"2019-03-10", condition:"REQUIRES_VERIFICATION",
    last_inspection_date:"2024-03-01", notes:"DEMONSTRATION ASSET — TC-021 fault and FBG-00021 elevated strain. Requires immediate physical verification.",
    created_at:tsD(-300) },
  // GC-SEC-01 assets
  { id:"ast-001", asset_id:"RAIL-JOINT-001", section_id:"sec-001", track_circuit_id:"tc-001",
    name:"Rail Joint 001", asset_type:"RAIL_JOINT",
    location_description:"JHB Central approach, km 1.2",
    installation_date:"2020-06-15", condition:"GOOD", created_at:tsD(-300) },
  { id:"ast-002", asset_id:"SWITCH-ASM-002", section_id:"sec-001", track_circuit_id:"tc-002",
    name:"Switch Assembly 002", asset_type:"SWITCH_ASSEMBLY",
    location_description:"Doornfontein Station turnout",
    installation_date:"2021-01-20", condition:"FAIR", created_at:tsD(-300) },
  { id:"ast-003", asset_id:"COMPOSITE-SLEEPER-003", section_id:"sec-001", track_circuit_id:"tc-003",
    name:"Composite Sleeper Zone 003", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Doornfontein intermediate, km 9.4",
    installation_date:"2018-11-05", condition:"GOOD", created_at:tsD(-300) },
  { id:"ast-004", asset_id:"SIGNAL-GANTRY-004", section_id:"sec-001", track_circuit_id:"tc-004",
    name:"Signal Gantry 004", asset_type:"SIGNAL_GANTRY",
    location_description:"Germiston Junction entry signal structure",
    installation_date:"2017-08-12", condition:"FAIR", created_at:tsD(-300) },
  // GC-SEC-02 assets
  { id:"ast-005", asset_id:"COMPOSITE-SLEEPER-005", section_id:"sec-002", track_circuit_id:"tc-005",
    name:"Composite Sleeper Zone 005", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Germiston exit zone, km 19.5",
    installation_date:"2019-05-22", condition:"GOOD", created_at:tsD(-300) },
  { id:"ast-006", asset_id:"RAIL-FASTENING-006", section_id:"sec-002", track_circuit_id:"tc-006",
    name:"Rail Fastening System 006", asset_type:"RAIL_FASTENING",
    location_description:"Boksburg intermediate, km 25.1",
    installation_date:"2020-03-18", condition:"GOOD", created_at:tsD(-300) },
  { id:"ast-007", asset_id:"SWITCH-ASM-007", section_id:"sec-002", track_circuit_id:"tc-007",
    name:"Switch Assembly 007", asset_type:"SWITCH_ASSEMBLY",
    location_description:"Boksburg North platform approach",
    installation_date:"2021-07-30", condition:"GOOD", created_at:tsD(-300) },
  // GC-SEC-03 assets
  { id:"ast-008", asset_id:"COMPOSITE-SLEEPER-008", section_id:"sec-003", track_circuit_id:"tc-008",
    name:"Composite Sleeper Zone 008", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Benoni approach, km 33.8",
    installation_date:"2018-09-14", condition:"WARNING",
    notes:"Minor wear observed during routine inspection. Monitor FBG-00008.", created_at:tsD(-300) },
  { id:"ast-009", asset_id:"RAIL-JOINT-009", section_id:"sec-003", track_circuit_id:"tc-009",
    name:"Rail Joint 009", asset_type:"RAIL_JOINT",
    location_description:"Benoni East intermediate, km 37.2",
    installation_date:"2019-12-01", condition:"UNKNOWN",
    notes:"Track circuit TC-009 offline — asset condition cannot be confirmed remotely.", created_at:tsD(-300) },
  { id:"ast-010", asset_id:"LEVEL-CROSSING-010", section_id:"sec-003", track_circuit_id:"tc-010",
    name:"Level Crossing 010", asset_type:"LEVEL_CROSSING",
    location_description:"Benoni industrial area crossing",
    installation_date:"2016-04-20", condition:"FAIR", created_at:tsD(-300) },
  // GC-SEC-04 additional assets
  { id:"ast-011", asset_id:"COMPOSITE-SLEEPER-011", section_id:"sec-004", track_circuit_id:"tc-011",
    name:"Composite Sleeper Zone 011", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Benoni exit zone, km 43.5",
    installation_date:"2019-02-28", condition:"WARNING", created_at:tsD(-300) },
  { id:"ast-013", asset_id:"RETAINING-WALL-013", section_id:"sec-004", track_circuit_id:"tc-013",
    name:"Retaining Wall 013", asset_type:"RETAINING_WALL",
    location_description:"Daveyton Station cutting wall",
    installation_date:"2015-06-10", condition:"FAIR", created_at:tsD(-300) },
  // CML assets
  { id:"ast-014", asset_id:"COMPOSITE-SLEEPER-014", section_id:"sec-005", track_circuit_id:"tc-014",
    name:"Composite Sleeper Zone 014", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Cape Town departure, km 1.8",
    installation_date:"2020-11-15", condition:"GOOD", created_at:tsD(-200) },
  { id:"ast-015", asset_id:"SWITCH-ASM-015", section_id:"sec-005", track_circuit_id:"tc-015",
    name:"Switch Assembly 015 — Parow", asset_type:"SWITCH_ASSEMBLY",
    location_description:"Parow station junction",
    installation_date:"2021-09-05", condition:"GOOD", created_at:tsD(-200) },
  { id:"ast-016", asset_id:"BRIDGE-STRUCT-016", section_id:"sec-006", track_circuit_id:"tc-016",
    name:"Bridge Structure 016 — Bellville", asset_type:"BRIDGE_STRUCTURE",
    location_description:"Bellville Junction overpass structure",
    installation_date:"2008-03-22", condition:"WARNING",
    notes:"Relay failure on associated TC-016. Bridge structure FBG sensors show moderate readings.", created_at:tsD(-200) },
  { id:"ast-017", asset_id:"COMPOSITE-SLEEPER-017", section_id:"sec-007", track_circuit_id:"tc-017",
    name:"Composite Sleeper Zone 017", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Kraaifontein section, km 58.4",
    installation_date:"2020-07-19", condition:"GOOD", created_at:tsD(-200) },
  // DCC assets
  { id:"ast-018", asset_id:"RAIL-JOINT-018", section_id:"sec-008", track_circuit_id:"tc-018",
    name:"Rail Joint 018 — Harbour Zone", asset_type:"RAIL_JOINT",
    location_description:"Durban Harbour exit, km 1.5",
    installation_date:"2021-02-10", condition:"GOOD", created_at:tsD(-150) },
  { id:"ast-019", asset_id:"COMPOSITE-SLEEPER-019", section_id:"sec-009", track_circuit_id:"tc-019",
    name:"Composite Sleeper Zone 019 — Bluff", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Rossburgh - Bluff zone, km 12.3",
    installation_date:"2019-08-25", condition:"GOOD", created_at:tsD(-150) },
  { id:"ast-020", asset_id:"BRIDGE-STRUCT-020", section_id:"sec-010", track_circuit_id:"tc-020",
    name:"Coastal Bridge Structure 020 — Umkomaas", asset_type:"BRIDGE_STRUCTURE",
    location_description:"Amanzimtoti coastal bridge, km 28.7",
    installation_date:"2005-11-30", condition:"WARNING",
    notes:"Coastal exposure. TC-020 showing bond degradation warning. FBG sensors monitoring girder strain.", created_at:tsD(-150) },
  // Additional assets
  { id:"ast-022", asset_id:"CULVERT-022", section_id:"sec-004", track_circuit_id:"tc-013",
    name:"Culvert 022", asset_type:"CULVERT",
    location_description:"Daveyton drainage culvert, km 52.1",
    installation_date:"2012-05-16", condition:"FAIR", created_at:tsD(-300) },
  { id:"ast-023", asset_id:"OVERHEAD-LINE-023", section_id:"sec-001", track_circuit_id:"tc-001",
    name:"Overhead Line Support 023", asset_type:"OVERHEAD_LINE_SUPPORT",
    location_description:"JHB Central OHL mast 23",
    installation_date:"2015-03-08", condition:"GOOD", created_at:tsD(-300) },
  { id:"ast-024", asset_id:"RAIL-FASTENING-024", section_id:"sec-009", track_circuit_id:"tc-019",
    name:"Rail Fastening 024 — Coastal Zone", asset_type:"RAIL_FASTENING",
    location_description:"Bluff coastal section, km 14.8",
    installation_date:"2020-01-12", condition:"FAIR", created_at:tsD(-150) },
  { id:"ast-025", asset_id:"SWITCH-ASM-025", section_id:"sec-005", track_circuit_id:"tc-015",
    name:"Switch Assembly 025 — Bellville", asset_type:"SWITCH_ASSEMBLY",
    location_description:"Bellville approach junction",
    installation_date:"2022-04-20", condition:"GOOD", created_at:tsD(-200) },
  { id:"ast-026", asset_id:"COMPOSITE-SLEEPER-026", section_id:"sec-007", track_circuit_id:"tc-017",
    name:"Composite Sleeper Zone 026 — Paarl", asset_type:"COMPOSITE_SLEEPER",
    location_description:"Paarl approach zone, km 86.2",
    installation_date:"2021-11-03", condition:"GOOD", created_at:tsD(-200) },
  { id:"ast-027", asset_id:"SIGNAL-GANTRY-027", section_id:"sec-008", track_circuit_id:"tc-018",
    name:"Signal Gantry 027 — Harbour", asset_type:"SIGNAL_GANTRY",
    location_description:"Durban Harbour entry gantry",
    installation_date:"2016-09-14", condition:"FAIR", created_at:tsD(-150) },
  { id:"ast-028", asset_id:"RETAINING-WALL-028", section_id:"sec-010", track_circuit_id:"tc-020",
    name:"Retaining Wall 028 — Coastal", asset_type:"RETAINING_WALL",
    location_description:"Umkomaas coastal cutting",
    installation_date:"2009-07-22", condition:"CRITICAL",
    notes:"FBG sensors indicate elevated strain. High coastal erosion risk.", created_at:tsD(-150) },
  { id:"ast-029", asset_id:"LEVEL-CROSSING-029", section_id:"sec-002", track_circuit_id:"tc-005",
    name:"Level Crossing 029 — Germiston Industrial", asset_type:"LEVEL_CROSSING",
    location_description:"Germiston industrial zone crossing",
    installation_date:"2017-02-28", condition:"GOOD", created_at:tsD(-300) },
  { id:"ast-030", asset_id:"BRIDGE-STRUCT-030", section_id:"sec-003", track_circuit_id:"tc-008",
    name:"Bridge Structure 030 — Benoni Overpass", asset_type:"BRIDGE_STRUCTURE",
    location_description:"Benoni approach overpass",
    installation_date:"2011-08-16", condition:"FAIR", created_at:tsD(-300) },
];

// ============================================================
// FBG SENSORS  (20 sensors)
// ============================================================
export const FBG_SENSORS: FbgSensor[] = [
  // FBG-00021 — KEY DEMONSTRATION SENSOR (increasing trend, warning)
  { id:"fbg-021", sensor_id:"FBG-00021", asset_id:"ast-021", sensor_name:"FBG Strain Sensor FBG-00021",
    baseline_strain:250, current_strain:612, deviation:362, percentage_change:144.8,
    trend:"INCREASING", wavelength_nm:1550.24, sensor_status:"ONLINE",
    risk_level:"WARNING", warning_threshold:400, critical_threshold:600,
    last_reading:ts(0), created_at:tsD(-180) },
  // FBG-00008 — WARNING sensor on ast-008
  { id:"fbg-008", sensor_id:"FBG-00008", asset_id:"ast-008", sensor_name:"FBG Strain Sensor FBG-00008",
    baseline_strain:230, current_strain:318, deviation:88, percentage_change:38.3,
    trend:"INCREASING", wavelength_nm:1549.82, sensor_status:"ONLINE",
    risk_level:"MODERATE", warning_threshold:380, critical_threshold:560,
    last_reading:ts(-5), created_at:tsD(-180) },
  // FBG-00016 — BRIDGE sensor, moderate
  { id:"fbg-016", sensor_id:"FBG-00016", asset_id:"ast-016", sensor_name:"FBG Bridge Sensor FBG-00016",
    baseline_strain:320, current_strain:395, deviation:75, percentage_change:23.4,
    trend:"STABLE", wavelength_nm:1551.10, sensor_status:"ONLINE",
    risk_level:"MODERATE", warning_threshold:500, critical_threshold:750,
    last_reading:ts(-8), created_at:tsD(-180) },
  // FBG-00020 — COASTAL BRIDGE, high risk
  { id:"fbg-020", sensor_id:"FBG-00020", asset_id:"ast-020", sensor_name:"FBG Bridge Sensor FBG-00020",
    baseline_strain:280, current_strain:498, deviation:218, percentage_change:77.9,
    trend:"INCREASING", wavelength_nm:1548.65, sensor_status:"ONLINE",
    risk_level:"WARNING", warning_threshold:420, critical_threshold:620,
    last_reading:ts(-3), created_at:tsD(-150) },
  // FBG-00028 — CRITICAL retaining wall
  { id:"fbg-028", sensor_id:"FBG-00028", asset_id:"ast-028", sensor_name:"FBG Wall Sensor FBG-00028",
    baseline_strain:180, current_strain:641, deviation:461, percentage_change:256.1,
    trend:"INCREASING", wavelength_nm:1552.33, sensor_status:"ONLINE",
    risk_level:"HIGH", warning_threshold:320, critical_threshold:550,
    last_reading:ts(-2), created_at:tsD(-150) },
  // FBG-00011 — WARNING on sec-004 sleeper
  { id:"fbg-011", sensor_id:"FBG-00011", asset_id:"ast-011", sensor_name:"FBG Strain Sensor FBG-00011",
    baseline_strain:245, current_strain:312, deviation:67, percentage_change:27.3,
    trend:"STABLE", wavelength_nm:1550.88, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:390, critical_threshold:580,
    last_reading:ts(-12), created_at:tsD(-180) },
  // FBG-00013 — Retaining wall, stable
  { id:"fbg-013", sensor_id:"FBG-00013", asset_id:"ast-013", sensor_name:"FBG Wall Sensor FBG-00013",
    baseline_strain:195, current_strain:208, deviation:13, percentage_change:6.7,
    trend:"STABLE", wavelength_nm:1549.45, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:320, critical_threshold:500,
    last_reading:ts(-20), created_at:tsD(-300) },
  // FBG-00003 — Sleeper, stable
  { id:"fbg-003", sensor_id:"FBG-00003", asset_id:"ast-003", sensor_name:"FBG Strain Sensor FBG-00003",
    baseline_strain:225, current_strain:231, deviation:6, percentage_change:2.7,
    trend:"STABLE", wavelength_nm:1550.12, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:370, critical_threshold:550,
    last_reading:ts(-15), created_at:tsD(-300) },
  // FBG-00005 — Sleeper, stable
  { id:"fbg-005", sensor_id:"FBG-00005", asset_id:"ast-005", sensor_name:"FBG Strain Sensor FBG-00005",
    baseline_strain:240, current_strain:248, deviation:8, percentage_change:3.3,
    trend:"STABLE", wavelength_nm:1549.99, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:390, critical_threshold:580,
    last_reading:ts(-18), created_at:tsD(-300) },
  // FBG-00014 — Cape Town sleeper, stable
  { id:"fbg-014", sensor_id:"FBG-00014", asset_id:"ast-014", sensor_name:"FBG Strain Sensor FBG-00014",
    baseline_strain:220, current_strain:224, deviation:4, percentage_change:1.8,
    trend:"STABLE", wavelength_nm:1550.55, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:360, critical_threshold:540,
    last_reading:ts(-22), created_at:tsD(-200) },
  // FBG-00019 — Bluff sleeper, stable
  { id:"fbg-019", sensor_id:"FBG-00019", asset_id:"ast-019", sensor_name:"FBG Strain Sensor FBG-00019",
    baseline_strain:255, current_strain:263, deviation:8, percentage_change:3.1,
    trend:"STABLE", wavelength_nm:1550.77, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:400, critical_threshold:600,
    last_reading:ts(-30), created_at:tsD(-150) },
  // FBG-00030 — Bridge, decreasing (post-repair)
  { id:"fbg-030", sensor_id:"FBG-00030", asset_id:"ast-030", sensor_name:"FBG Bridge Sensor FBG-00030",
    baseline_strain:290, current_strain:275, deviation:-15, percentage_change:-5.2,
    trend:"DECREASING", wavelength_nm:1551.60, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:460, critical_threshold:680,
    last_reading:ts(-25), created_at:tsD(-300) },
  // FBG-00002 — Rail joint, stable
  { id:"fbg-002", sensor_id:"FBG-00002", asset_id:"ast-002", sensor_name:"FBG Joint Sensor FBG-00002",
    baseline_strain:175, current_strain:182, deviation:7, percentage_change:4.0,
    trend:"STABLE", wavelength_nm:1549.30, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:290, critical_threshold:420,
    last_reading:ts(-40), created_at:tsD(-300) },
  // FBG-00009 — OFFLINE sensor
  { id:"fbg-009", sensor_id:"FBG-00009", asset_id:"ast-009", sensor_name:"FBG Strain Sensor FBG-00009",
    baseline_strain:235, current_strain:235, deviation:0, percentage_change:0,
    trend:"OFFLINE", wavelength_nm:1550.40, sensor_status:"OFFLINE",
    risk_level:"OFFLINE", warning_threshold:380, critical_threshold:560,
    last_reading:tsH(-2), created_at:tsD(-180) },
  // FBG-00017 — Paarl sleeper, stable
  { id:"fbg-017", sensor_id:"FBG-00017", asset_id:"ast-017", sensor_name:"FBG Strain Sensor FBG-00017",
    baseline_strain:230, current_strain:238, deviation:8, percentage_change:3.5,
    trend:"STABLE", wavelength_nm:1550.22, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:370, critical_threshold:550,
    last_reading:ts(-35), created_at:tsD(-200) },
  // FBG-00026 — Paarl zone, stable
  { id:"fbg-026", sensor_id:"FBG-00026", asset_id:"ast-026", sensor_name:"FBG Strain Sensor FBG-00026",
    baseline_strain:218, current_strain:225, deviation:7, percentage_change:3.2,
    trend:"STABLE", wavelength_nm:1549.75, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:355, critical_threshold:530,
    last_reading:ts(-45), created_at:tsD(-200) },
  // FBG-00004 — Gantry sensor, stable
  { id:"fbg-004", sensor_id:"FBG-00004", asset_id:"ast-004", sensor_name:"FBG Gantry Sensor FBG-00004",
    baseline_strain:145, current_strain:152, deviation:7, percentage_change:4.8,
    trend:"STABLE", wavelength_nm:1549.11, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:240, critical_threshold:360,
    last_reading:ts(-50), created_at:tsD(-300) },
  // FBG-00006 — Rail fastening, stable
  { id:"fbg-006", sensor_id:"FBG-00006", asset_id:"ast-006", sensor_name:"FBG Fastening Sensor FBG-00006",
    baseline_strain:120, current_strain:125, deviation:5, percentage_change:4.2,
    trend:"STABLE", wavelength_nm:1548.90, sensor_status:"ONLINE",
    risk_level:"LOW", warning_threshold:200, critical_threshold:300,
    last_reading:ts(-55), created_at:tsD(-300) },
  // FBG-00010 — Level crossing, stable
  { id:"fbg-010", sensor_id:"FBG-00010", asset_id:"ast-010", sensor_name:"FBG Crossing Sensor FBG-00010",
    baseline_strain:310, current_strain:318, deviation:8, percentage_change:2.6,
    trend:"STABLE", wavelength_nm:1552.10, sensor_status:"DEGRADED",
    risk_level:"LOW", warning_threshold:500, critical_threshold:750,
    last_reading:ts(-60), created_at:tsD(-300) },
  // FBG-00024 — Coastal fastening, slight increase
  { id:"fbg-024", sensor_id:"FBG-00024", asset_id:"ast-024", sensor_name:"FBG Fastening Sensor FBG-00024",
    baseline_strain:130, current_strain:158, deviation:28, percentage_change:21.5,
    trend:"INCREASING", wavelength_nm:1549.60, sensor_status:"ONLINE",
    risk_level:"MODERATE", warning_threshold:210, critical_threshold:315,
    last_reading:ts(-8), created_at:tsD(-150) },
];

// ============================================================
// FBG READINGS  (1000+ simulated time-series readings)
// ============================================================

function generateReadings(
  sensorId: string,
  baseWavelength: number,
  baseline: number,
  pattern: "stable" | "increasing" | "decreasing" | "sudden" | "offline",
  count: number = 100,
  startOffset: number = -1440 // minutes ago (24 hours)
): FbgReading[] {
  const readings: FbgReading[] = [];
  const interval = Math.abs(startOffset) / count;

  for (let i = 0; i < count; i++) {
    const minuteOffset = startOffset + i * interval;
    let strain = baseline;
    const progress = i / count;

    switch (pattern) {
      case "increasing":
        strain = baseline + (baseline * 1.45 * progress) + (Math.random() - 0.5) * 8;
        break;
      case "decreasing":
        strain = baseline * (1.0 - 0.3 * progress) + (Math.random() - 0.5) * 5;
        break;
      case "sudden":
        if (progress < 0.7) {
          strain = baseline + (Math.random() - 0.5) * 6;
        } else {
          strain = baseline * 1.8 + (Math.random() - 0.5) * 20;
        }
        break;
      case "offline":
        if (i < count * 0.85) {
          strain = baseline + (Math.random() - 0.5) * 4;
        } else {
          readings.push({
            id: `fbgr-${sensorId}-${i}`,
            sensor_id: sensorId,
            strain_value: 0,
            temperature: undefined,
            wavelength_nm: baseWavelength,
            timestamp: ts(minuteOffset),
            created_at: ts(minuteOffset),
          });
          continue;
        }
        break;
      default: // stable
        strain = baseline + (Math.random() - 0.5) * 10;
        break;
    }

    readings.push({
      id: `fbgr-${sensorId}-${i}`,
      sensor_id: sensorId,
      strain_value: Math.round(strain * 10) / 10,
      temperature: 22 + Math.random() * 8,
      wavelength_nm: baseWavelength + (Math.random() - 0.5) * 0.01,
      timestamp: ts(minuteOffset),
      created_at: ts(minuteOffset),
    });
  }
  return readings;
}

// FBG-00021 — KEY: specific increasing values matching the demonstration scenario
const FBG021_READINGS_SPECIFIC: FbgReading[] = [
  { id:"fbgr-021-s01", sensor_id:"fbg-021", strain_value:250, temperature:24.1, wavelength_nm:1550.24, timestamp:tsH(-23), created_at:tsH(-23) },
  { id:"fbgr-021-s02", sensor_id:"fbg-021", strain_value:254, temperature:24.3, wavelength_nm:1550.24, timestamp:tsH(-22), created_at:tsH(-22) },
  { id:"fbgr-021-s03", sensor_id:"fbg-021", strain_value:251, temperature:24.0, wavelength_nm:1550.25, timestamp:tsH(-21), created_at:tsH(-21) },
  { id:"fbgr-021-s04", sensor_id:"fbg-021", strain_value:258, temperature:24.5, wavelength_nm:1550.24, timestamp:tsH(-20), created_at:tsH(-20) },
  { id:"fbgr-021-s05", sensor_id:"fbg-021", strain_value:253, temperature:24.2, wavelength_nm:1550.24, timestamp:tsH(-19), created_at:tsH(-19) },
  { id:"fbgr-021-s06", sensor_id:"fbg-021", strain_value:261, temperature:24.6, wavelength_nm:1550.25, timestamp:tsH(-18), created_at:tsH(-18) },
  { id:"fbgr-021-s07", sensor_id:"fbg-021", strain_value:265, temperature:24.8, wavelength_nm:1550.25, timestamp:tsH(-17), created_at:tsH(-17) },
  { id:"fbgr-021-s08", sensor_id:"fbg-021", strain_value:271, temperature:25.1, wavelength_nm:1550.25, timestamp:tsH(-16), created_at:tsH(-16) },
  { id:"fbgr-021-s09", sensor_id:"fbg-021", strain_value:281, temperature:25.4, wavelength_nm:1550.26, timestamp:tsH(-15), created_at:tsH(-15) },
  { id:"fbgr-021-s10", sensor_id:"fbg-021", strain_value:295, temperature:25.2, wavelength_nm:1550.26, timestamp:tsH(-14), created_at:tsH(-14) },
  { id:"fbgr-021-s11", sensor_id:"fbg-021", strain_value:310, temperature:25.6, wavelength_nm:1550.27, timestamp:tsH(-13), created_at:tsH(-13) },
  { id:"fbgr-021-s12", sensor_id:"fbg-021", strain_value:328, temperature:25.9, wavelength_nm:1550.27, timestamp:tsH(-12), created_at:tsH(-12) },
  { id:"fbgr-021-s13", sensor_id:"fbg-021", strain_value:340, temperature:26.1, wavelength_nm:1550.28, timestamp:tsH(-11), created_at:tsH(-11) },
  { id:"fbgr-021-s14", sensor_id:"fbg-021", strain_value:355, temperature:26.3, wavelength_nm:1550.28, timestamp:tsH(-10), created_at:tsH(-10) },
  { id:"fbgr-021-s15", sensor_id:"fbg-021", strain_value:374, temperature:26.5, wavelength_nm:1550.29, timestamp:tsH(-9), created_at:tsH(-9) },
  { id:"fbgr-021-s16", sensor_id:"fbg-021", strain_value:395, temperature:26.8, wavelength_nm:1550.29, timestamp:tsH(-8), created_at:tsH(-8) },
  { id:"fbgr-021-s17", sensor_id:"fbg-021", strain_value:420, temperature:27.0, wavelength_nm:1550.30, timestamp:tsH(-7), created_at:tsH(-7) },
  { id:"fbgr-021-s18", sensor_id:"fbg-021", strain_value:452, temperature:27.2, wavelength_nm:1550.31, timestamp:tsH(-6), created_at:tsH(-6) },
  { id:"fbgr-021-s19", sensor_id:"fbg-021", strain_value:484, temperature:27.4, wavelength_nm:1550.32, timestamp:tsH(-5), created_at:tsH(-5) },
  { id:"fbgr-021-s20", sensor_id:"fbg-021", strain_value:510, temperature:27.6, wavelength_nm:1550.33, timestamp:tsH(-4), created_at:tsH(-4) },
  { id:"fbgr-021-s21", sensor_id:"fbg-021", strain_value:545, temperature:27.8, wavelength_nm:1550.34, timestamp:tsH(-3), created_at:tsH(-3) },
  { id:"fbgr-021-s22", sensor_id:"fbg-021", strain_value:574, temperature:28.0, wavelength_nm:1550.35, timestamp:tsH(-2), created_at:tsH(-2) },
  { id:"fbgr-021-s23", sensor_id:"fbg-021", strain_value:596, temperature:28.2, wavelength_nm:1550.36, timestamp:tsH(-1), created_at:tsH(-1) },
  { id:"fbgr-021-s24", sensor_id:"fbg-021", strain_value:612, temperature:28.4, wavelength_nm:1550.37, timestamp:ts(0), created_at:ts(0) },
];

// Generate bulk readings for other sensors
const ALL_FBG_READINGS: FbgReading[] = [
  ...FBG021_READINGS_SPECIFIC,
  ...generateReadings("fbg-008", 1549.82, 230, "increasing", 80, -1080),
  ...generateReadings("fbg-016", 1551.10, 320, "stable", 80, -1080),
  ...generateReadings("fbg-020", 1548.65, 280, "increasing", 80, -1080),
  ...generateReadings("fbg-028", 1552.33, 180, "increasing", 80, -1080),
  ...generateReadings("fbg-011", 1550.88, 245, "stable", 60, -1080),
  ...generateReadings("fbg-013", 1549.45, 195, "stable", 60, -1080),
  ...generateReadings("fbg-003", 1550.12, 225, "stable", 60, -1080),
  ...generateReadings("fbg-005", 1549.99, 240, "stable", 50, -720),
  ...generateReadings("fbg-014", 1550.55, 220, "stable", 50, -720),
  ...generateReadings("fbg-019", 1550.77, 255, "stable", 50, -720),
  ...generateReadings("fbg-030", 1551.60, 290, "decreasing", 50, -720),
  ...generateReadings("fbg-002", 1549.30, 175, "stable", 40, -720),
  ...generateReadings("fbg-009", 1550.40, 235, "offline", 40, -720),
  ...generateReadings("fbg-017", 1550.22, 230, "stable", 40, -720),
  ...generateReadings("fbg-026", 1549.75, 218, "stable", 40, -720),
  ...generateReadings("fbg-004", 1549.11, 145, "stable", 30, -720),
  ...generateReadings("fbg-006", 1548.90, 120, "stable", 30, -720),
  ...generateReadings("fbg-010", 1552.10, 310, "sudden", 30, -720),
  ...generateReadings("fbg-024", 1549.60, 130, "increasing", 40, -720),
];

export const FBG_READINGS: FbgReading[] = ALL_FBG_READINGS;

// ============================================================
// ALERTS  (20 alerts)
// ============================================================
export const ALERTS: Alert[] = [
  // ALERT-001 — KEY DEMONSTRATION: Combined TC-021 + FBG-00021
  { id:"alert-001", alert_id:"ALERT-001", source:"COMBINED", priority:"HIGH", status:"INVESTIGATING",
    title:"TC-021 Fault + FBG-00021 Elevated Strain — Requires Verification",
    description:"Track circuit TC-021 has entered a FAULT state in section GC-SEC-04. Concurrently, FBG sensor FBG-00021 on COMPOSITE-SLEEPER-021 is reporting an increasing strain trend significantly above baseline. These are separate evidence sources that may be spatially related. Physical verification is recommended.",
    asset_id:"ast-021", track_circuit_id:"tc-021", sensor_id:"fbg-021", section_id:"sec-004", railway_line_id:"rl-001",
    evidence_summary:"TC-021: FAULT (communication failure). FBG-00021: current 612 µε vs baseline 250 µε (+144.8%, INCREASING trend). Spatial proximity suggests joint bond and/or sleeper degradation. NOTE: FBG data does not confirm TC fault cause — both sources require physical investigation.",
    requires_inspection:true,
    acknowledged_by:"Control Room Operator — K. Nkosi", acknowledged_at:ts(2),
    resolved_by:undefined, resolved_at:undefined,
    created_at:ts(0), updated_at:ts(5) },
  // ALERT-002 — TC-021 fault
  { id:"alert-002", alert_id:"ALERT-002", source:"TRACK_CIRCUIT", priority:"WARNING", status:"ACKNOWLEDGED",
    title:"TC-021 Track Circuit Fault Detected",
    description:"TC-021 has entered a FAULT state. Track circuit communication failure detected. Signal S-021 relationship affected. This is a READ-ONLY status report from the track monitoring system.",
    asset_id:"ast-021", track_circuit_id:"tc-021", sensor_id:undefined, section_id:"sec-004", railway_line_id:"rl-001",
    evidence_summary:"TC-021 status: FAULT. Last known state: OCCUPIED → FAULT transition at 10:42:18. Communication failure suspected.",
    requires_inspection:true,
    acknowledged_by:"Control Room Operator — K. Nkosi", acknowledged_at:ts(1),
    resolved_by:undefined, resolved_at:undefined,
    created_at:ts(-1), updated_at:ts(1) },
  // ALERT-003 — FBG-00021 strain
  { id:"alert-003", alert_id:"ALERT-003", source:"FBG_SENSOR", priority:"WARNING", status:"OPEN",
    title:"FBG-00021 Increasing Strain Trend — Simulated Warning",
    description:"FBG sensor FBG-00021 on COMPOSITE-SLEEPER-021 shows an increasing strain trend relative to its established baseline. Current reading is 144.8% above baseline. Risk classification: SIMULATED WARNING (MVP prototype). This alert represents a structural monitoring observation and should not be interpreted as confirmed structural failure.",
    asset_id:"ast-021", track_circuit_id:undefined, sensor_id:"fbg-021", section_id:"sec-004", railway_line_id:"rl-001",
    evidence_summary:"Baseline: 250 µε. Current: 612 µε. Deviation: +362 µε. Change: +144.8%. Trend: INCREASING over 24h. Exceeds simulated warning threshold (400 µε).",
    requires_inspection:true,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-8), updated_at:tsH(-8) },
  // ALERT-004 — TC-009 offline
  { id:"alert-004", alert_id:"ALERT-004", source:"COMMUNICATION", priority:"WARNING", status:"OPEN",
    title:"TC-009 Communication Loss — Benoni East",
    description:"Track circuit TC-009 at Benoni East intermediate has lost communication. No telemetry received for 2+ hours. Asset condition for RAIL-JOINT-009 cannot be confirmed remotely.",
    asset_id:"ast-009", track_circuit_id:"tc-009", sensor_id:"fbg-009", section_id:"sec-003", railway_line_id:"rl-001",
    evidence_summary:"TC-009 last contact: 2 hours ago. FBG-00009 also offline. No train movement data available for this section.",
    requires_inspection:true,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-2), updated_at:tsH(-2) },
  // ALERT-005 — TC-016 relay
  { id:"alert-005", alert_id:"ALERT-005", source:"TRACK_CIRCUIT", priority:"WARNING", status:"ACKNOWLEDGED",
    title:"TC-016 Relay Failure Suspected — Bellville Junction",
    description:"TC-016 at Bellville Junction has entered a FAULT state. Suspected relay failure. Bridge Structure 016 FBG sensors showing moderate readings — not elevated to warning level.",
    asset_id:"ast-016", track_circuit_id:"tc-016", sensor_id:"fbg-016", section_id:"sec-006", railway_line_id:"rl-002",
    evidence_summary:"TC-016: FAULT (relay failure suspected). FBG-00016: 395 µε vs baseline 320 µε (+23.4%) — MODERATE, STABLE trend.",
    requires_inspection:true,
    acknowledged_by:"Control Room — W. van der Berg", acknowledged_at:tsH(-0.5),
    resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-1), updated_at:tsH(-0.5) },
  // ALERT-006 — FBG-00028 critical wall
  { id:"alert-006", alert_id:"ALERT-006", source:"FBG_SENSOR", priority:"CRITICAL", status:"OPEN",
    title:"FBG-00028 — Coastal Retaining Wall Elevated Strain — HIGH RISK (SIMULATED)",
    description:"FBG-00028 on Retaining Wall 028 shows strain at 256.1% above baseline. Trend is INCREASING. Risk classification: SIMULATED HIGH. This alert is a simulated infrastructure monitoring observation. Physical verification is strongly recommended.",
    asset_id:"ast-028", track_circuit_id:"tc-020", sensor_id:"fbg-028", section_id:"sec-010", railway_line_id:"rl-003",
    evidence_summary:"Baseline: 180 µε. Current: 641 µε. Deviation: +461 µε (+256.1%). Trend: INCREASING. Exceeds simulated critical threshold (550 µε). Coastal erosion risk factor.",
    requires_inspection:true,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-4), updated_at:tsH(-4) },
  // ALERT-007 — TC-011 intermittent
  { id:"alert-007", alert_id:"ALERT-007", source:"TRACK_CIRCUIT", priority:"WARNING", status:"OPEN",
    title:"TC-011 Intermittent Status Loss — Benoni Exit",
    description:"TC-011 showing intermittent loss of track circuit status data. Section GC-SEC-04 entry affected.",
    asset_id:"ast-011", track_circuit_id:"tc-011", sensor_id:"fbg-011", section_id:"sec-004", railway_line_id:"rl-001",
    evidence_summary:"TC-011 status: UNKNOWN (intermittent). FBG-00011: 312 µε vs baseline 245 µε (+27.3%) — LOW risk, STABLE.",
    requires_inspection:false,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:ts(-45), updated_at:ts(-45) },
  // ALERT-008 — FBG-00020 coastal bridge
  { id:"alert-008", alert_id:"ALERT-008", source:"FBG_SENSOR", priority:"WARNING", status:"ACKNOWLEDGED",
    title:"FBG-00020 — Coastal Bridge Increasing Strain — Simulated Warning",
    description:"FBG-00020 on Coastal Bridge 020 shows an increasing strain trend. Current reading is 77.9% above baseline. Risk: SIMULATED WARNING.",
    asset_id:"ast-020", track_circuit_id:"tc-020", sensor_id:"fbg-020", section_id:"sec-010", railway_line_id:"rl-003",
    evidence_summary:"Baseline: 280 µε. Current: 498 µε (+77.9%). Trend: INCREASING. TC-020 showing bond degradation warning.",
    requires_inspection:true,
    acknowledged_by:"Infrastructure Engineer — T. Dlamini", acknowledged_at:tsH(-3),
    resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-5), updated_at:tsH(-3) },
  // RESOLVED ALERTS
  { id:"alert-009", alert_id:"ALERT-009", source:"TRACK_CIRCUIT", priority:"WARNING", status:"CLOSED",
    title:"TC-021 Previous Fault — Resolved (14 days ago)",
    description:"Previous TC-021 fault event resolved after physical inspection and joint bond repair.",
    asset_id:"ast-021", track_circuit_id:"tc-021", sensor_id:"fbg-021", section_id:"sec-004", railway_line_id:"rl-001",
    evidence_summary:"Joint bond wear confirmed. Repair completed. TC-021 returned to NORMAL. FBG readings stabilising post-repair.",
    requires_inspection:false,
    acknowledged_by:"Control Room", acknowledged_at:tsD(-14),
    resolved_by:"Technician — P. Mokoena", resolved_at:tsD(-13),
    created_at:tsD(-14), updated_at:tsD(-13) },
  { id:"alert-010", alert_id:"ALERT-010", source:"MAINTENANCE", priority:"NORMAL", status:"CLOSED",
    title:"Scheduled Maintenance Completed — TC-004 Section",
    description:"Routine maintenance on TC-004 section completed. All systems verified normal.",
    asset_id:"ast-004", track_circuit_id:"tc-004", sensor_id:undefined, section_id:"sec-001", railway_line_id:"rl-001",
    evidence_summary:"Scheduled maintenance. No faults found. Asset in GOOD condition.",
    requires_inspection:false,
    acknowledged_by:"Maintenance Team", acknowledged_at:tsD(-30),
    resolved_by:"Technician — J. Botha", resolved_at:tsD(-30),
    created_at:tsD(-31), updated_at:tsD(-30) },
  // Additional alerts
  { id:"alert-011", alert_id:"ALERT-011", source:"FBG_SENSOR", priority:"NORMAL", status:"OPEN",
    title:"FBG-00008 Moderate Strain Increase — Monitor",
    description:"FBG-00008 on Composite Sleeper Zone 008 shows a moderate strain increase. Currently below warning threshold. Continue monitoring.",
    asset_id:"ast-008", track_circuit_id:"tc-008", sensor_id:"fbg-008", section_id:"sec-003", railway_line_id:"rl-001",
    evidence_summary:"Baseline: 230 µε. Current: 318 µε (+38.3%). Below warning threshold (380 µε). INCREASING trend — monitor.",
    requires_inspection:false,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-12), updated_at:tsH(-12) },
  { id:"alert-012", alert_id:"ALERT-012", source:"FBG_SENSOR", priority:"NORMAL", status:"OPEN",
    title:"FBG-00024 Coastal Fastening Strain Increase",
    description:"FBG-00024 on Rail Fastening 024 coastal zone showing a gradual strain increase. Below warning threshold.",
    asset_id:"ast-024", track_circuit_id:"tc-019", sensor_id:"fbg-024", section_id:"sec-009", railway_line_id:"rl-003",
    evidence_summary:"Baseline: 130 µε. Current: 158 µε (+21.5%). Trend: INCREASING (gradual).",
    requires_inspection:false,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-6), updated_at:tsH(-6) },
  { id:"alert-013", alert_id:"ALERT-013", source:"ASSET", priority:"WARNING", status:"ACKNOWLEDGED",
    title:"Asset Condition Warning — Retaining Wall 028",
    description:"Retaining Wall 028 classified as CRITICAL condition based on FBG monitoring and last inspection findings.",
    asset_id:"ast-028", track_circuit_id:"tc-020", sensor_id:"fbg-028", section_id:"sec-010", railway_line_id:"rl-003",
    evidence_summary:"Asset condition: CRITICAL. FBG-00028: HIGH risk. Coastal erosion noted in previous inspection.",
    requires_inspection:true,
    acknowledged_by:"Infrastructure Manager — N. Sithole", acknowledged_at:tsH(-2),
    resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-6), updated_at:tsH(-2) },
  { id:"alert-014", alert_id:"ALERT-014", source:"COMMUNICATION", priority:"OFFLINE", status:"OPEN",
    title:"TC-009 and FBG-00009 Both Offline — Benoni East",
    description:"Both TC-009 and its associated FBG sensor FBG-00009 are showing offline status simultaneously. Investigation required to determine if communication infrastructure or field equipment issue.",
    asset_id:"ast-009", track_circuit_id:"tc-009", sensor_id:"fbg-009", section_id:"sec-003", railway_line_id:"rl-001",
    evidence_summary:"TC-009: OFFLINE since 08:42. FBG-00009: OFFLINE since 08:42. Simultaneous loss suggests communication infrastructure issue.",
    requires_inspection:true,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-2), updated_at:tsH(-2) },
  { id:"alert-015", alert_id:"ALERT-015", source:"ASSET", priority:"NORMAL", status:"CLOSED",
    title:"Scheduled Inspection Completed — Switch Assembly 002",
    description:"Routine inspection of Switch Assembly 002 completed. Minor wear noted — classified FAIR condition.",
    asset_id:"ast-002", track_circuit_id:"tc-002", sensor_id:undefined, section_id:"sec-001", railway_line_id:"rl-001",
    evidence_summary:"Routine inspection. Minor wear on switch mechanism. Condition updated to FAIR. No immediate maintenance required.",
    requires_inspection:false,
    acknowledged_by:"Inspector — M. Pietersen", acknowledged_at:tsD(-5),
    resolved_by:"Inspector — M. Pietersen", resolved_at:tsD(-5),
    created_at:tsD(-7), updated_at:tsD(-5) },
  { id:"alert-016", alert_id:"ALERT-016", source:"TRACK_CIRCUIT", priority:"NORMAL", status:"RESOLVED",
    title:"TC-020 Bond Degradation Warning — Coastal Bridge",
    description:"TC-020 showing possible track circuit bond degradation near coastal bridge. Inspection recommended.",
    asset_id:"ast-020", track_circuit_id:"tc-020", sensor_id:"fbg-020", section_id:"sec-010", railway_line_id:"rl-003",
    evidence_summary:"TC-020: Bond degradation warning status. Coastal environment corrosion factor.",
    requires_inspection:true,
    acknowledged_by:"Control Room — Durban", acknowledged_at:ts(-35),
    resolved_by:undefined, resolved_at:undefined,
    created_at:tsH(-2), updated_at:ts(-35) },
  { id:"alert-017", alert_id:"ALERT-017", source:"MAINTENANCE", priority:"NORMAL", status:"OPEN",
    title:"Maintenance Verification Required — Bridge Structure 016",
    description:"Recent maintenance on Bridge Structure 016 requires formal verification before alert closure.",
    asset_id:"ast-016", track_circuit_id:"tc-016", sensor_id:"fbg-016", section_id:"sec-006", railway_line_id:"rl-002",
    evidence_summary:"Maintenance task MAINT-016 completed. Verification pending.",
    requires_inspection:false,
    acknowledged_by:"Maintenance Manager", acknowledged_at:tsD(-2),
    resolved_by:undefined, resolved_at:undefined,
    created_at:tsD(-3), updated_at:tsD(-2) },
  { id:"alert-018", alert_id:"ALERT-018", source:"COMMUNICATION", priority:"WARNING", status:"OPEN",
    title:"TC-010 Sensor Degradation — FBG-00010",
    description:"FBG-00010 at Level Crossing 010 showing DEGRADED sensor status. Readings may not be fully reliable.",
    asset_id:"ast-010", track_circuit_id:"tc-010", sensor_id:"fbg-010", section_id:"sec-003", railway_line_id:"rl-001",
    evidence_summary:"FBG-00010 status: DEGRADED. Level Crossing 010 asset condition: FAIR.",
    requires_inspection:false,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsD(-1), updated_at:tsD(-1) },
  { id:"alert-019", alert_id:"ALERT-019", source:"FBG_SENSOR", priority:"NORMAL", status:"RESOLVED",
    title:"FBG-00030 — Post-Repair Strain Normalising",
    description:"FBG-00030 on Benoni Overpass Bridge showing decreasing strain trend following recent repair work. Readings approaching baseline.",
    asset_id:"ast-030", track_circuit_id:"tc-008", sensor_id:"fbg-030", section_id:"sec-003", railway_line_id:"rl-001",
    evidence_summary:"Pre-repair: 330 µε. Current: 275 µε (DECREASING). Approaching baseline of 290 µε.",
    requires_inspection:false,
    acknowledged_by:"Infrastructure Engineer", acknowledged_at:tsD(-8),
    resolved_by:"Infrastructure Engineer", resolved_at:tsD(-3),
    created_at:tsD(-10), updated_at:tsD(-3) },
  { id:"alert-020", alert_id:"ALERT-020", source:"ASSET", priority:"NORMAL", status:"OPEN",
    title:"Asset Due for Scheduled Inspection — Composite Sleeper Zone 011",
    description:"Composite Sleeper Zone 011 in GC-SEC-04 is due for its 6-monthly scheduled inspection.",
    asset_id:"ast-011", track_circuit_id:"tc-011", sensor_id:"fbg-011", section_id:"sec-004", railway_line_id:"rl-001",
    evidence_summary:"Last inspection: 180 days ago. Scheduled inspection due. FBG-00011: LOW risk, STABLE.",
    requires_inspection:true,
    acknowledged_by:undefined, acknowledged_at:undefined, resolved_by:undefined, resolved_at:undefined,
    created_at:tsD(-2), updated_at:tsD(-2) },
];

// ============================================================
// INSPECTIONS  (15 inspections)
// ============================================================
export const INSPECTIONS: Inspection[] = [
  // INSP-001 — KEY: TC-021 / FBG-00021 verification inspection
  { id:"insp-001", inspection_id:"INSP-001", alert_id:"alert-001", asset_id:"ast-021",
    track_circuit_id:"tc-021", sensor_id:"fbg-021",
    title:"Physical Verification — TC-021 Fault & FBG-00021 Elevated Strain",
    reason:"Combined alert: TC-021 FAULT state and FBG-00021 showing elevated strain trend. Physical inspection required to determine if spatially related. NOT a safety intervention — READ-ONLY monitoring has flagged this for investigation.",
    priority:"HIGH", status:"IN_PROGRESS",
    assigned_inspector:"Field Inspector — L. Mahlangu", inspector_id:"insp-lm-001",
    scheduled_date:ts(30), started_at:ts(20),
    location_description:"GC-SEC-04, Daveyton intermediate zone, 6.2km from Benoni Station",
    observations:"On-site: TC-021 bond visible degradation at fishplate joint. Joint bond wire appears corroded at connection point. FBG sensor cable intact. Composite sleeper showing surface cracking on field side.",
    findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:["photo_tc021_joint.jpg","photo_sleeper_crack.jpg"],
    recommendations:undefined, maintenance_required:false,
    created_at:ts(5), updated_at:ts(25) },
  // INSP-002 — TC-009 offline
  { id:"insp-002", inspection_id:"INSP-002", alert_id:"alert-004", asset_id:"ast-009",
    track_circuit_id:"tc-009", sensor_id:"fbg-009",
    title:"Field Investigation — TC-009 Communication Loss",
    reason:"TC-009 and FBG-00009 both offline. Communication infrastructure investigation required.",
    priority:"WARNING", status:"ASSIGNED",
    assigned_inspector:"Field Technician — S. Khumalo", inspector_id:"insp-sk-002",
    scheduled_date:ts(60),
    location_description:"GC-SEC-03, Benoni East intermediate, km 37.2",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:tsH(-1), updated_at:tsH(-1) },
  // INSP-003 — TC-016 Bellville
  { id:"insp-003", inspection_id:"INSP-003", alert_id:"alert-005", asset_id:"ast-016",
    track_circuit_id:"tc-016", sensor_id:"fbg-016",
    title:"Inspection — TC-016 Relay Failure & Bridge Structure 016",
    reason:"TC-016 relay fault at Bellville Junction. Bridge structure 016 FBG monitoring shows moderate readings.",
    priority:"WARNING", status:"PENDING",
    assigned_inspector:undefined,
    location_description:"CML-SEC-02, Bellville Junction overpass",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:tsH(-0.5), updated_at:tsH(-0.5) },
  // INSP-004 — Retaining wall critical
  { id:"insp-004", inspection_id:"INSP-004", alert_id:"alert-006", asset_id:"ast-028",
    track_circuit_id:"tc-020", sensor_id:"fbg-028",
    title:"Urgent Inspection — Retaining Wall 028 Coastal Strain",
    reason:"FBG-00028 showing HIGH RISK (simulated) strain level on coastal retaining wall. Coastal erosion noted previously.",
    priority:"CRITICAL", status:"PENDING",
    assigned_inspector:undefined,
    location_description:"DCC-SEC-03, Umkomaas coastal cutting",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:tsH(-4), updated_at:tsH(-4) },
  // INSP-005 — Completed historical inspection
  { id:"insp-005", inspection_id:"INSP-005", alert_id:"alert-009", asset_id:"ast-021",
    track_circuit_id:"tc-021", sensor_id:"fbg-021",
    title:"Inspection — Previous TC-021 Fault (14 days ago)",
    reason:"Previous TC-021 fault. Joint bond wear investigation.",
    priority:"WARNING", status:"COMPLETED",
    assigned_inspector:"Field Inspector — L. Mahlangu", inspector_id:"insp-lm-001",
    scheduled_date:tsD(-14), started_at:tsD(-14), completed_at:tsD(-14),
    location_description:"GC-SEC-04, Daveyton intermediate zone",
    observations:"Joint bond wire broken at fishplate. Corrosion present. Sleeper in acceptable condition at time of previous inspection.",
    findings:"Confirmed: TC-021 joint bond failure. Joint bond wire broken. No structural concern with sleeper at that time. FBG readings stabilised after previous repair.",
    fault_confirmed:true, false_alarm:false,
    photos:["photo_bond_broken_14d.jpg"],
    recommendations:"Replace joint bond wire. Schedule 3-month follow-up inspection.",
    maintenance_required:true,
    created_at:tsD(-14), updated_at:tsD(-13) },
  // INSP-006 — Coastal bridge
  { id:"insp-006", inspection_id:"INSP-006", alert_id:"alert-008", asset_id:"ast-020",
    track_circuit_id:"tc-020", sensor_id:"fbg-020",
    title:"Coastal Bridge 020 — FBG Monitoring Verification",
    reason:"FBG-00020 showing increasing strain trend. TC-020 bond degradation warning.",
    priority:"WARNING", status:"ASSIGNED",
    assigned_inspector:"Bridge Inspector — A. Faber", inspector_id:"insp-af-003",
    scheduled_date:tsH(4),
    location_description:"DCC-SEC-03, Amanzimtoti coastal bridge, km 28.7",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:tsH(-3), updated_at:tsH(-3) },
  // INSP-007 — Completed switch
  { id:"insp-007", inspection_id:"INSP-007", alert_id:"alert-015", asset_id:"ast-002",
    track_circuit_id:"tc-002", sensor_id:undefined,
    title:"Routine Inspection — Switch Assembly 002",
    reason:"Scheduled 6-monthly inspection of Switch Assembly 002.",
    priority:"NORMAL", status:"COMPLETED",
    assigned_inspector:"Field Inspector — M. Pietersen", inspector_id:"insp-mp-004",
    scheduled_date:tsD(-5), started_at:tsD(-5), completed_at:tsD(-5),
    location_description:"GC-SEC-01, Doornfontein Station turnout",
    observations:"Minor wear on switch point. Lubrication required. Electrical connections intact.",
    findings:"Switch mechanism showing early-stage wear. No immediate safety concern. Recommend lubrication and schedule replacement within 6 months.",
    fault_confirmed:false, false_alarm:false,
    photos:["photo_switch_002.jpg"],
    recommendations:"Apply switch lubricant. Schedule replacement planning within 6 months.",
    maintenance_required:false,
    created_at:tsD(-7), updated_at:tsD(-5) },
  // INSP-008 — Benoni overpass
  { id:"insp-008", inspection_id:"INSP-008", alert_id:"alert-019", asset_id:"ast-030",
    track_circuit_id:"tc-008", sensor_id:"fbg-030",
    title:"Post-Repair Verification — Bridge Structure 030",
    reason:"FBG-00030 readings decreasing post-repair. Verification inspection required.",
    priority:"NORMAL", status:"COMPLETED",
    assigned_inspector:"Bridge Inspector — A. Faber", inspector_id:"insp-af-003",
    scheduled_date:tsD(-3), started_at:tsD(-3), completed_at:tsD(-3),
    location_description:"GC-SEC-03, Benoni approach overpass",
    observations:"Post-repair: Repair work appears complete. No visible cracking. FBG readings consistent with sensor data (decreasing towards baseline).",
    findings:"Repair verified. Bridge structure in FAIR condition. FBG readings approaching baseline. Recommend continued monitoring for 30 days.",
    fault_confirmed:false, false_alarm:false,
    photos:["photo_bridge_030_postrepair.jpg"],
    recommendations:"Monitor FBG-00030 for 30 days. Schedule next formal inspection in 6 months.",
    maintenance_required:false,
    created_at:tsD(-4), updated_at:tsD(-3) },
  // INSP-009 — TC-011 intermittent
  { id:"insp-009", inspection_id:"INSP-009", alert_id:"alert-007", asset_id:"ast-011",
    track_circuit_id:"tc-011", sensor_id:"fbg-011",
    title:"Investigation — TC-011 Intermittent Status Loss",
    reason:"TC-011 showing intermittent loss of status data.",
    priority:"WARNING", status:"PENDING",
    assigned_inspector:undefined,
    location_description:"GC-SEC-04, Benoni exit zone, km 43.5",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:ts(-40), updated_at:ts(-40) },
  // INSP-010 — Scheduled composite sleeper 008
  { id:"insp-010", inspection_id:"INSP-010", alert_id:"alert-011", asset_id:"ast-008",
    track_circuit_id:"tc-008", sensor_id:"fbg-008",
    title:"Monitoring Inspection — Composite Sleeper 008",
    reason:"FBG-00008 showing moderate increasing strain. Routine monitoring inspection.",
    priority:"NORMAL", status:"PENDING",
    assigned_inspector:undefined,
    location_description:"GC-SEC-03, Benoni approach, km 33.8",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:tsH(-10), updated_at:tsH(-10) },
  // Additional inspections
  { id:"insp-011", inspection_id:"INSP-011", alert_id:undefined, asset_id:"ast-005",
    track_circuit_id:"tc-005", sensor_id:"fbg-005",
    title:"Scheduled Inspection — Composite Sleeper Zone 005",
    reason:"Scheduled 6-monthly inspection.",
    priority:"NORMAL", status:"COMPLETED",
    assigned_inspector:"Field Inspector — B. Nkomo", inspector_id:"insp-bn-005",
    scheduled_date:tsD(-10), started_at:tsD(-10), completed_at:tsD(-10),
    location_description:"GC-SEC-02, Germiston exit zone, km 19.5",
    observations:"Sleepers in good condition. FBG readings stable. No concerns.",
    findings:"GOOD condition confirmed. No maintenance required.",
    fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:"Next inspection in 6 months.", maintenance_required:false,
    created_at:tsD(-12), updated_at:tsD(-10) },
  { id:"insp-012", inspection_id:"INSP-012", alert_id:undefined, asset_id:"ast-014",
    track_circuit_id:"tc-014", sensor_id:"fbg-014",
    title:"Scheduled Inspection — Composite Sleeper Zone 014 Cape Town",
    reason:"Scheduled 12-monthly inspection.",
    priority:"NORMAL", status:"COMPLETED",
    assigned_inspector:"Field Inspector — C. Adams", inspector_id:"insp-ca-006",
    scheduled_date:tsD(-20), started_at:tsD(-20), completed_at:tsD(-20),
    location_description:"CML-SEC-01, Cape Town departure, km 1.8",
    observations:"Good condition. FBG-00014 stable.",
    findings:"GOOD. No issues.",
    fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:"Next inspection in 12 months.", maintenance_required:false,
    created_at:tsD(-22), updated_at:tsD(-20) },
  { id:"insp-013", inspection_id:"INSP-013", alert_id:"alert-020", asset_id:"ast-011",
    track_circuit_id:"tc-011", sensor_id:"fbg-011",
    title:"Scheduled Inspection Due — Composite Sleeper 011",
    reason:"6-monthly scheduled inspection.",
    priority:"NORMAL", status:"PENDING",
    assigned_inspector:undefined,
    location_description:"GC-SEC-04, Benoni exit zone, km 43.5",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:tsD(-2), updated_at:tsD(-2) },
  { id:"insp-014", inspection_id:"INSP-014", alert_id:"alert-013", asset_id:"ast-028",
    track_circuit_id:"tc-020", sensor_id:"fbg-028",
    title:"Urgent — Retaining Wall 028 Asset Condition Inspection",
    reason:"Asset classified CRITICAL. FBG showing HIGH risk strain.",
    priority:"CRITICAL", status:"PENDING",
    assigned_inspector:undefined,
    location_description:"DCC-SEC-03, Umkomaas coastal cutting",
    observations:undefined, findings:undefined, fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:undefined, maintenance_required:false,
    created_at:tsH(-6), updated_at:tsH(-6) },
  { id:"insp-015", inspection_id:"INSP-015", alert_id:undefined, asset_id:"ast-019",
    track_circuit_id:"tc-019", sensor_id:"fbg-019",
    title:"Scheduled Inspection — Composite Sleeper 019 Bluff",
    reason:"Annual scheduled inspection.",
    priority:"NORMAL", status:"COMPLETED",
    assigned_inspector:"Field Inspector — D. Govender", inspector_id:"insp-dg-007",
    scheduled_date:tsD(-30), started_at:tsD(-30), completed_at:tsD(-30),
    location_description:"DCC-SEC-02, Rossburgh - Bluff zone, km 12.3",
    observations:"Sleepers in good condition. Coastal environment — minor surface oxidation noted.",
    findings:"GOOD condition. Minor surface oxidation — normal for coastal environment.",
    fault_confirmed:false, false_alarm:false,
    photos:[], recommendations:"Apply anti-corrosion treatment at next scheduled maintenance.", maintenance_required:false,
    created_at:tsD(-32), updated_at:tsD(-30) },
];

// ============================================================
// MAINTENANCE TASKS  (10 tasks)
// ============================================================
export const MAINTENANCE_TASKS: MaintenanceTask[] = [
  // MAINT-001 — KEY: Will be created after INSP-001 finds fault
  { id:"maint-001", maintenance_id:"MAINT-001", inspection_id:"insp-001", alert_id:"alert-001", asset_id:"ast-021",
    fault_description:"TC-021 joint bond failure and composite sleeper surface cracking — discovered during physical inspection of combined TC fault and FBG strain alert.",
    root_cause:"Joint bond wire corrosion and mechanical fatigue. Composite sleeper showing surface crack consistent with cumulative load stress indicated by FBG trend.",
    work_description:"1. Replace TC-021 joint bond wire assembly. 2. Inspect and remediate composite sleeper surface cracking. 3. Clean and treat connection points. 4. Verify TC-021 returns to NORMAL status. 5. Monitor FBG-00021 readings post-repair.",
    assigned_technician:"Technician — P. Mokoena", technician_id:"tech-pm-001",
    status:"IN_PROGRESS", priority:"HIGH",
    started_at:ts(40), completed_at:undefined,
    estimated_hours:4, actual_hours:undefined,
    parts_used:"TC Bond wire assembly x2, Joint fishplate bolts x4, Sleeper repair compound",
    cost_estimate:4500,
    created_at:ts(30), updated_at:ts(45) },
  // MAINT-002 — Previous TC-021 repair (resolved)
  { id:"maint-002", maintenance_id:"MAINT-002", inspection_id:"insp-005", alert_id:"alert-009", asset_id:"ast-021",
    fault_description:"TC-021 joint bond wire broken. Previous fault event 14 days ago.",
    root_cause:"Joint bond wire corrosion — normal lifecycle degradation in outdoor environment.",
    work_description:"Replace joint bond wire. Clean fishplate connections. Verify TC return to NORMAL.",
    assigned_technician:"Technician — P. Mokoena", technician_id:"tech-pm-001",
    status:"CLOSED", priority:"WARNING",
    started_at:tsD(-14), completed_at:tsD(-13),
    estimated_hours:2, actual_hours:2.5,
    parts_used:"TC Bond wire assembly x1, Cleaning materials",
    cost_estimate:1800,
    created_at:tsD(-14), updated_at:tsD(-13) },
  // MAINT-003 — Bridge 030 repair (completed)
  { id:"maint-003", maintenance_id:"MAINT-003", inspection_id:"insp-008", alert_id:"alert-019", asset_id:"ast-030",
    fault_description:"Benoni overpass bridge — cracking identified in previous inspection. FBG readings elevated.",
    root_cause:"Concrete fatigue crack propagation from traffic loading. Age-related deterioration.",
    work_description:"Crack injection with epoxy resin. Apply protective surface coating. Monitor FBG-00030 post-repair.",
    assigned_technician:"Bridge Technician — H. van Niekerk", technician_id:"tech-hvn-002",
    status:"VERIFIED", priority:"WARNING",
    started_at:tsD(-8), completed_at:tsD(-6),
    estimated_hours:16, actual_hours:14,
    parts_used:"Epoxy resin injection kit, Surface coating compound, Scaffolding hire",
    cost_estimate:28000,
    created_at:tsD(-10), updated_at:tsD(-3) },
  // MAINT-004 — TC-016 relay
  { id:"maint-004", maintenance_id:"MAINT-004", inspection_id:"insp-003", alert_id:"alert-005", asset_id:"ast-016",
    fault_description:"TC-016 relay failure at Bellville Junction.",
    root_cause:"To be confirmed during inspection.",
    work_description:"Inspect relay cabinet. Replace faulty relay module. Test and verify TC-016 restoration.",
    assigned_technician:undefined,
    status:"OPEN", priority:"WARNING",
    started_at:undefined, completed_at:undefined,
    estimated_hours:3, actual_hours:undefined,
    parts_used:undefined,
    cost_estimate:2200,
    created_at:tsH(-1), updated_at:tsH(-1) },
  // MAINT-005 — Coastal retaining wall
  { id:"maint-005", maintenance_id:"MAINT-005", inspection_id:"insp-004", alert_id:"alert-006", asset_id:"ast-028",
    fault_description:"Retaining Wall 028 — elevated FBG strain. CRITICAL asset condition. Coastal erosion.",
    root_cause:"Pending inspection findings.",
    work_description:"Emergency structural assessment. Implement temporary stabilisation if required. Plan remediation works.",
    assigned_technician:undefined,
    status:"OPEN", priority:"CRITICAL",
    started_at:undefined, completed_at:undefined,
    estimated_hours:undefined, actual_hours:undefined,
    parts_used:undefined,
    cost_estimate:undefined,
    created_at:tsH(-4), updated_at:tsH(-4) },
  // MAINT-006 — TC-009 comms
  { id:"maint-006", maintenance_id:"MAINT-006", inspection_id:"insp-002", alert_id:"alert-014", asset_id:"ast-009",
    fault_description:"TC-009 and FBG-00009 communication failure.",
    root_cause:"Pending investigation.",
    work_description:"Investigate communication cabling and telemetry equipment. Restore connectivity.",
    assigned_technician:"Technician — S. Khumalo", technician_id:"tech-sk-003",
    status:"ASSIGNED", priority:"WARNING",
    started_at:undefined, completed_at:undefined,
    estimated_hours:3, actual_hours:undefined,
    parts_used:undefined,
    cost_estimate:1500,
    created_at:tsH(-1), updated_at:tsH(-1) },
  // MAINT-007 — Previous MAINT from 30 days ago (closed)
  { id:"maint-007", maintenance_id:"MAINT-007", inspection_id:undefined, alert_id:"alert-010", asset_id:"ast-004",
    fault_description:"Scheduled routine maintenance — Signal Gantry 004.",
    root_cause:"Scheduled preventive maintenance.",
    work_description:"Inspect signal gantry structure. Tighten fasteners. Apply anti-corrosion treatment. Check foundations.",
    assigned_technician:"Technician — J. Botha", technician_id:"tech-jb-004",
    status:"CLOSED", priority:"NORMAL",
    started_at:tsD(-31), completed_at:tsD(-30),
    estimated_hours:8, actual_hours:7,
    parts_used:"Anti-corrosion paint, Fastener set",
    cost_estimate:3200,
    created_at:tsD(-31), updated_at:tsD(-30) },
  // MAINT-008 — Coastal bridge ongoing
  { id:"maint-008", maintenance_id:"MAINT-008", inspection_id:"insp-006", alert_id:"alert-008", asset_id:"ast-020",
    fault_description:"Coastal Bridge 020 — TC-020 bond degradation and FBG-00020 increasing strain.",
    root_cause:"Pending inspection.",
    work_description:"Inspect bridge bearings and deck. Check track circuit bond connections. Anti-corrosion treatment if required.",
    assigned_technician:"Bridge Technician — H. van Niekerk", technician_id:"tech-hvn-002",
    status:"ASSIGNED", priority:"WARNING",
    started_at:undefined, completed_at:undefined,
    estimated_hours:12, actual_hours:undefined,
    parts_used:undefined,
    cost_estimate:18000,
    created_at:tsH(-3), updated_at:tsH(-3) },
  // MAINT-009 — Level crossing degraded sensor
  { id:"maint-009", maintenance_id:"MAINT-009", inspection_id:undefined, alert_id:"alert-018", asset_id:"ast-010",
    fault_description:"FBG-00010 sensor degraded at Level Crossing 010.",
    root_cause:"Sensor degradation — possible cable damage from vehicle crossing.",
    work_description:"Inspect FBG sensor and cable routing at level crossing. Replace cable if damaged. Recalibrate sensor.",
    assigned_technician:undefined,
    status:"OPEN", priority:"NORMAL",
    started_at:undefined, completed_at:undefined,
    estimated_hours:4, actual_hours:undefined,
    parts_used:undefined,
    cost_estimate:3800,
    created_at:tsD(-1), updated_at:tsD(-1) },
  // MAINT-010 — Bridge 016 from previous (verification required)
  { id:"maint-010", maintenance_id:"MAINT-010", inspection_id:undefined, alert_id:"alert-017", asset_id:"ast-016",
    fault_description:"Bridge Structure 016 — scheduled maintenance and relay pre-emption.",
    root_cause:"Age-related and scheduled maintenance.",
    work_description:"Bridge deck inspection. Bearing replacement. Anti-corrosion treatment.",
    assigned_technician:"Bridge Technician — H. van Niekerk", technician_id:"tech-hvn-002",
    status:"VERIFICATION_REQUIRED", priority:"NORMAL",
    started_at:tsD(-4), completed_at:tsD(-2),
    estimated_hours:24, actual_hours:22,
    parts_used:"Bridge bearings x4, Anti-corrosion compound, Sealant",
    cost_estimate:45000,
    created_at:tsD(-5), updated_at:tsD(-2) },
];

// ============================================================
// MAINTENANCE VERIFICATIONS
// ============================================================
export const MAINTENANCE_VERIFICATIONS: MaintenanceVerification[] = [
  // Verification for MAINT-002 (closed TC-021 repair)
  { id:"mv-001", maintenance_task_id:"maint-002",
    verified_by:"Inspector — L. Mahlangu",
    verification_date:tsD(-13),
    track_circuit_status:"NORMAL",
    fbg_readings_normal:true,
    asset_condition:"GOOD",
    notes:"TC-021 returned to NORMAL status after bond wire replacement. FBG-00021 readings stabilised within expected range. Asset condition GOOD at that time.",
    passed:true, created_at:tsD(-13) },
  // Verification for MAINT-003 (bridge 030)
  { id:"mv-002", maintenance_task_id:"maint-003",
    verified_by:"Bridge Inspector — A. Faber",
    verification_date:tsD(-3),
    track_circuit_status:"NORMAL",
    fbg_readings_normal:true,
    asset_condition:"FAIR",
    notes:"Crack injection appears effective. FBG-00030 readings decreasing towards baseline. TC-008 normal. Asset classified FAIR condition.",
    passed:true, created_at:tsD(-3) },
  // Verification for MAINT-007 (gantry)
  { id:"mv-003", maintenance_task_id:"maint-007",
    verified_by:"Inspector — J. Botha",
    verification_date:tsD(-30),
    track_circuit_status:"NORMAL",
    fbg_readings_normal:true,
    asset_condition:"FAIR",
    notes:"Gantry maintenance completed satisfactorily. Structure in FAIR condition.",
    passed:true, created_at:tsD(-30) },
];

// ============================================================
// COMPUTED ENRICHMENT — attach relationships for UI use
// ============================================================
export function getEnrichedTrackCircuits(): TrackCircuit[] {
  return TRACK_CIRCUITS.map(tc => ({
    ...tc,
    section: SECTIONS.find(s => s.id === tc.section_id),
    railway_line: RAILWAY_LINES.find(l => l.id === tc.railway_line_id),
    events: TRACK_CIRCUIT_EVENTS.filter(e => e.track_circuit_id === tc.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  }));
}

export function getEnrichedAssets(): Asset[] {
  return ASSETS.map(asset => ({
    ...asset,
    section: SECTIONS.find(s => s.id === asset.section_id),
    track_circuit: TRACK_CIRCUITS.find(tc => tc.id === asset.track_circuit_id),
    fbg_sensors: FBG_SENSORS.filter(s => s.asset_id === asset.id),
    alerts: ALERTS.filter(a => a.asset_id === asset.id),
    inspections: INSPECTIONS.filter(i => i.asset_id === asset.id),
    maintenance_tasks: MAINTENANCE_TASKS.filter(m => m.asset_id === asset.id),
  }));
}

export function getEnrichedFbgSensors(): FbgSensor[] {
  return FBG_SENSORS.map(sensor => ({
    ...sensor,
    asset: ASSETS.find(a => a.id === sensor.asset_id),
    readings: FBG_READINGS.filter(r => r.sensor_id === sensor.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
  }));
}

export function getEnrichedAlerts(): Alert[] {
  return ALERTS.map(alert => ({
    ...alert,
    asset: ASSETS.find(a => a.id === alert.asset_id),
    track_circuit: TRACK_CIRCUITS.find(tc => tc.id === alert.track_circuit_id),
    sensor: FBG_SENSORS.find(s => s.id === alert.sensor_id),
    section: SECTIONS.find(s => s.id === alert.section_id),
  }));
}

export function getEnrichedInspections(): Inspection[] {
  return INSPECTIONS.map(insp => ({
    ...insp,
    asset: ASSETS.find(a => a.id === insp.asset_id),
    alert: ALERTS.find(a => a.id === insp.alert_id),
    track_circuit: TRACK_CIRCUITS.find(tc => tc.id === insp.track_circuit_id),
    sensor: FBG_SENSORS.find(s => s.id === insp.sensor_id),
  }));
}

export function getEnrichedMaintenanceTasks(): MaintenanceTask[] {
  return MAINTENANCE_TASKS.map(task => ({
    ...task,
    asset: ASSETS.find(a => a.id === task.asset_id),
    inspection: INSPECTIONS.find(i => i.id === task.inspection_id),
    verification: MAINTENANCE_VERIFICATIONS.find(v => v.maintenance_task_id === task.id),
  }));
}

// ============================================================
// DASHBOARD STATS (computed from seed data)
// ============================================================
export function computeDashboardStats() {
  const activeTCs = TRACK_CIRCUITS;
  const occupiedCount = activeTCs.filter(tc => tc.status === "OCCUPIED").length;
  const faultCount = activeTCs.filter(tc => tc.status === "FAULT" || tc.status === "UNKNOWN").length;
  const infraWarnings = ASSETS.filter(a => a.condition === "WARNING" || a.condition === "CRITICAL" || a.condition === "REQUIRES_VERIFICATION").length;
  const criticalAssets = ASSETS.filter(a => a.condition === "CRITICAL" || a.condition === "REQUIRES_VERIFICATION").length;
  const onlineSensors = FBG_SENSORS.filter(s => s.sensor_status === "ONLINE").length;
  const offlineSensors = FBG_SENSORS.filter(s => s.sensor_status === "OFFLINE").length;
  const degradedSensors = FBG_SENSORS.filter(s => s.sensor_status === "DEGRADED").length;
  const activeAlerts = ALERTS.filter(a => a.status !== "CLOSED" && a.status !== "RESOLVED").length;
  const openMaint = MAINTENANCE_TASKS.filter(m => m.status !== "CLOSED" && m.status !== "VERIFIED").length;

  return {
    totalSections: SECTIONS.length,
    occupiedCircuits: occupiedCount,
    trackCircuitFaults: faultCount,
    infrastructureWarnings: infraWarnings,
    criticalAssets,
    fbgSensorStatus: { online: onlineSensors, offline: offlineSensors, degraded: degradedSensors },
    activeAlerts,
    openMaintenanceTasks: openMaint,
  };
}

