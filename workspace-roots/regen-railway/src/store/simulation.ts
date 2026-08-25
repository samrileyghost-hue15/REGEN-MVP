// ============================================================
// REGEN Live Simulation Engine
// Simulates real-time track circuit and FBG sensor updates
// This runs entirely client-side for demo purposes
// ============================================================

import { TRACK_CIRCUITS, FBG_SENSORS, ALERTS, FBG_READINGS } from "../data/seed";
import type { TrackCircuitStatus } from "../types";

type SimCallback = () => void;

const listeners: Set<SimCallback> = new Set();
let simInterval: ReturnType<typeof setInterval> | null = null;
let tickCount = 0;

// Register a listener to be called when simulation updates
export function onSimUpdate(cb: SimCallback): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notify() {
  listeners.forEach(cb => cb());
}

// Simulate a TC status change
function simTCUpdate() {
  // Occasionally flicker TC-021 between states to show live demo
  const demo = TRACK_CIRCUITS.find(tc => tc.track_circuit_id === "TC-021");
  if (demo) {
    const states: TrackCircuitStatus[] = ["FAULT", "FAULT", "FAULT", "UNKNOWN", "FAULT"];
    demo.status = states[tickCount % states.length];
    demo.last_update = new Date().toISOString();
  }

  // Occasionally update a random TC occupancy
  const occupiedTCs = TRACK_CIRCUITS.filter(tc => tc.status === "NORMAL");
  if (occupiedTCs.length > 0 && tickCount % 5 === 0) {
    const randomTC = occupiedTCs[Math.floor(Math.random() * occupiedTCs.length)];
    // Briefly show occupied and back to normal
    if (Math.random() > 0.7) {
      randomTC.status = "OCCUPIED";
      randomTC.occupancy = true;
      randomTC.last_update = new Date().toISOString();
      setTimeout(() => {
        if (randomTC.status === "OCCUPIED") {
          randomTC.status = "NORMAL";
          randomTC.occupancy = false;
          randomTC.last_update = new Date().toISOString();
          notify();
        }
      }, 3000);
    }
  }
}

// Simulate FBG reading updates
function simFBGUpdate() {
  FBG_SENSORS.forEach(sensor => {
    if (sensor.sensor_status === "OFFLINE") return;

    let newStrain = sensor.current_strain;
    const baseNoise = (Math.random() - 0.5) * 4;

    switch (sensor.trend) {
      case "INCREASING":
        // FBG-00021 keeps climbing slightly each tick
        if (sensor.sensor_id === "FBG-00021") {
          newStrain = Math.min(sensor.current_strain + (Math.random() * 2), 680);
        } else {
          newStrain = sensor.current_strain + (Math.random() * 1.5) + baseNoise;
        }
        break;
      case "DECREASING":
        newStrain = Math.max(sensor.current_strain - (Math.random() * 1), sensor.baseline_strain * 0.9);
        break;
      case "STABLE":
        newStrain = sensor.baseline_strain + baseNoise + (Math.random() - 0.5) * 8;
        break;
      default:
        newStrain = sensor.current_strain + baseNoise;
    }

    newStrain = Math.max(50, newStrain);
    sensor.current_strain = Math.round(newStrain * 10) / 10;
    sensor.deviation = Math.round((sensor.current_strain - sensor.baseline_strain) * 10) / 10;
    sensor.percentage_change = Math.round(((sensor.current_strain - sensor.baseline_strain) / sensor.baseline_strain) * 1000) / 10;
    sensor.last_reading = new Date().toISOString();

    // Update risk level dynamically
    if (sensor.current_strain >= sensor.critical_threshold) {
      sensor.risk_level = "HIGH";
    } else if (sensor.current_strain >= sensor.warning_threshold) {
      sensor.risk_level = "WARNING";
    } else if (sensor.current_strain >= sensor.baseline_strain * 1.15) {
      sensor.risk_level = "MODERATE";
    } else {
      sensor.risk_level = "LOW";
    }

    // Add to readings array for live chart updates
    const newReading = {
      id: `live-${sensor.id}-${Date.now()}`,
      sensor_id: sensor.id,
      strain_value: sensor.current_strain,
      temperature: 24 + Math.random() * 6,
      wavelength_nm: sensor.wavelength_nm + (Math.random() - 0.5) * 0.005,
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    FBG_READINGS.push(newReading);
    // Keep array manageable
    if (FBG_READINGS.filter(r => r.sensor_id === sensor.id).length > 150) {
      const firstIdx = FBG_READINGS.findIndex(r => r.sensor_id === sensor.id);
      if (firstIdx !== -1) FBG_READINGS.splice(firstIdx, 1);
    }
  });
}

// Main simulation tick
function tick() {
  tickCount++;
  simTCUpdate();
  simFBGUpdate();
  notify();
}

export function startSimulation(intervalMs = 4000) {
  if (simInterval) return;
  simInterval = setInterval(tick, intervalMs);
  console.log("[REGEN Simulation] Started — simulated data only");
}

export function stopSimulation() {
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
  }
}

export function getSimStats() {
  return {
    faults: TRACK_CIRCUITS.filter(tc => tc.status === "FAULT" || tc.status === "UNKNOWN").length,
    alerts: ALERTS.filter(a => a.status !== "CLOSED" && a.status !== "RESOLVED").length,
    occupied: TRACK_CIRCUITS.filter(tc => tc.status === "OCCUPIED").length,
  };
}

