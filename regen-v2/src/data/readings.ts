import type { SensorReading } from '../types';

// Generate historical readings for B12 primary sensor (vibration, showing degradation)
function makeReadings(
  sensorId: string,
  baseValue: number,
  drift: number,
  count: number,
  intervalMinutes = 5,
): SensorReading[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const ago = (count - i) * intervalMinutes * 60 * 1000;
    const progress = i / count;
    const value = baseValue + drift * progress + (Math.random() - 0.5) * 0.04;
    const clamped = Math.max(0, +value.toFixed(3));
    const severity =
      clamped > 1.00 ? 'critical' : clamped > 0.80 ? 'warning' : clamped > 0.65 ? 'info' : 'healthy';
    return {
      id: `${sensorId}-r${i}`,
      sensorId,
      value: clamped,
      timestamp: new Date(now - ago).toISOString(),
      severity,
    } as SensorReading;
  });
}

// B12 vibration history (escalating 0.48 → 1.24 over 50 readings)
export const B12_READINGS = makeReadings('NFC_B12_001', 0.48, 0.76, 50);

// A3 vibration (mild warning zone)
export const A3_READINGS = makeReadings('NFC_A3_001', 0.70, 0.18, 30);

// S04 strain (elevated but stable)
export const S04_READINGS = makeReadings('STR_S04_001', 260, 25, 30, 10);

// F5 vibration (approaching warning)
export const F5_READINGS = makeReadings('NFC_F5_001', 0.62, 0.14, 20);

// Stable sensor for comparison
export const C7_READINGS = makeReadings('NFC_C7_001', 0.38, 0.04, 20);

export const ALL_READINGS: SensorReading[] = [
  ...B12_READINGS,
  ...A3_READINGS,
  ...S04_READINGS,
  ...F5_READINGS,
  ...C7_READINGS,
];

export function getReadingsForSensor(sensorId: string): SensorReading[] {
  return ALL_READINGS.filter(r => r.sensorId === sensorId);
}
