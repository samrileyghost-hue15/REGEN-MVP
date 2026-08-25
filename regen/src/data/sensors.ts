import type { Sensor } from '../types';

export const MOCK_SENSORS: Sensor[] = [
  // B12 sensors — the demo asset
  {
    id: 'NFC_B12_001', assetId: 'B12',
    name: 'B12 Vibration Primary',
    type: 'vibration', unit: 'g',
    status: 'online', severity: 'critical',
    currentValue: 1.24, normalMin: 0, normalMax: 0.80,
    warningMax: 1.00, criticalMax: 1.00,
    lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
    mapX: 110, mapY: 192,
  },
  {
    id: 'TMP_B12_001', assetId: 'B12',
    name: 'B12 Temperature',
    type: 'temperature', unit: '°C',
    status: 'online', severity: 'warning',
    currentValue: 36, normalMin: 0, normalMax: 30,
    warningMax: 35, criticalMax: 45,
    lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
    mapX: 155, mapY: 205,
  },
  {
    id: 'STR_B12_001', assetId: 'B12',
    name: 'B12 Strain Gauge',
    type: 'strain', unit: 'µε',
    status: 'online', severity: 'healthy',
    currentValue: 142, normalMin: 0, normalMax: 250,
    warningMax: 300, criticalMax: 400,
    lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
    mapX: 128, mapY: 210,
  },
  // A3 sensors
  {
    id: 'NFC_A3_001', assetId: 'A3',
    name: 'A3 Vibration',
    type: 'vibration', unit: 'g',
    status: 'online', severity: 'warning',
    currentValue: 0.87, normalMin: 0, normalMax: 0.80,
    warningMax: 1.00, criticalMax: 1.00,
    lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
    mapX: 110, mapY: 99,
  },
  {
    id: 'TMP_A3_001', assetId: 'A3',
    name: 'A3 Temperature',
    type: 'temperature', unit: '°C',
    status: 'online', severity: 'healthy',
    currentValue: 28, normalMin: 0, normalMax: 30,
    warningMax: 35, criticalMax: 45,
    lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
    mapX: 155, mapY: 112,
  },
  // C7 sensors
  {
    id: 'STR_C7_001', assetId: 'C7',
    name: 'C7 Strain',
    type: 'strain', unit: 'µε',
    status: 'online', severity: 'healthy',
    currentValue: 98, normalMin: 0, normalMax: 250,
    warningMax: 300, criticalMax: 400,
    lastUpdate: new Date(Date.now() - 3 * 60000).toISOString(),
    mapX: 110, mapY: 240,
  },
  {
    id: 'NFC_C7_001', assetId: 'C7',
    name: 'C7 Vibration',
    type: 'vibration', unit: 'g',
    status: 'online', severity: 'healthy',
    currentValue: 0.42, normalMin: 0, normalMax: 0.80,
    warningMax: 1.00, criticalMax: 1.00,
    lastUpdate: new Date(Date.now() - 3 * 60000).toISOString(),
    mapX: 155, mapY: 252,
  },
  // S04 Bridge
  {
    id: 'STR_S04_001', assetId: 'S04',
    name: 'S04 Bridge Strain',
    type: 'strain', unit: 'µε',
    status: 'online', severity: 'warning',
    currentValue: 285, normalMin: 0, normalMax: 250,
    warningMax: 300, criticalMax: 400,
    lastUpdate: new Date(Date.now() - 8 * 60000).toISOString(),
    mapX: 110, mapY: 285,
  },
  {
    id: 'SES_S04_001', assetId: 'S04',
    name: 'S04 Seismic',
    type: 'seismic', unit: 'mm/s',
    status: 'online', severity: 'healthy',
    currentValue: 0.8, normalMin: 0, normalMax: 5,
    warningMax: 8, criticalMax: 15,
    lastUpdate: new Date(Date.now() - 8 * 60000).toISOString(),
    mapX: 155, mapY: 298,
  },
  // D8
  {
    id: 'STR_D8_001', assetId: 'D8',
    name: 'D8 Sleeper Strain',
    type: 'strain', unit: 'µε',
    status: 'online', severity: 'healthy',
    currentValue: 62, normalMin: 0, normalMax: 250,
    warningMax: 300, criticalMax: 400,
    lastUpdate: new Date(Date.now() - 4 * 60000).toISOString(),
    mapX: 110, mapY: 383,
  },
  // East–West sensors
  {
    id: 'NFC_F5_001', assetId: 'F5',
    name: 'F5 Vibration',
    type: 'vibration', unit: 'g',
    status: 'online', severity: 'info',
    currentValue: 0.76, normalMin: 0, normalMax: 0.80,
    warningMax: 1.00, criticalMax: 1.00,
    lastUpdate: new Date(Date.now() - 6 * 60000).toISOString(),
    mapX: 345, mapY: 410,
  },
  {
    id: 'TMP_F5_001', assetId: 'F5',
    name: 'F5 Temperature',
    type: 'temperature', unit: '°C',
    status: 'online', severity: 'healthy',
    currentValue: 24, normalMin: 0, normalMax: 30,
    warningMax: 35, criticalMax: 45,
    lastUpdate: new Date(Date.now() - 6 * 60000).toISOString(),
    mapX: 365, mapY: 455,
  },
  {
    id: 'STR_J3_001', assetId: 'J3',
    name: 'J3 Bridge Strain',
    type: 'strain', unit: 'µε',
    status: 'online', severity: 'info',
    currentValue: 195, normalMin: 0, normalMax: 250,
    warningMax: 300, criticalMax: 400,
    lastUpdate: new Date(Date.now() - 12 * 60000).toISOString(),
    mapX: 625, mapY: 410,
  },
  // Additional sensors across network
  {
    id: 'NFC_E2_001', assetId: 'E2',
    name: 'E2 Vibration',
    type: 'vibration', unit: 'g',
    status: 'online', severity: 'healthy',
    currentValue: 0.38, normalMin: 0, normalMax: 0.80,
    warningMax: 1.00, criticalMax: 1.00,
    lastUpdate: new Date(Date.now() - 3 * 60000).toISOString(),
    mapX: 205, mapY: 410,
  },
  {
    id: 'NFC_P1_001', assetId: 'P1',
    name: 'P1 Bridge Vibration',
    type: 'vibration', unit: 'g',
    status: 'online', severity: 'info',
    currentValue: 0.64, normalMin: 0, normalMax: 0.80,
    warningMax: 1.00, criticalMax: 1.00,
    lastUpdate: new Date(Date.now() - 15 * 60000).toISOString(),
    mapX: 190, mapY: 38,
  },
  // Offline sensor example
  {
    id: 'SES_K2_001', assetId: 'K2',
    name: 'K2 Seismic',
    type: 'seismic', unit: 'mm/s',
    status: 'offline', severity: 'offline',
    currentValue: 0, normalMin: 0, normalMax: 5,
    warningMax: 8, criticalMax: 15,
    lastUpdate: new Date(Date.now() - 42 * 60000).toISOString(),
    mapX: 415, mapY: 222,
  },
];

export function getSensorsForAsset(assetId: string): Sensor[] {
  return MOCK_SENSORS.filter(s => s.assetId === assetId);
}

export function getPrimarySensor(assetId: string): Sensor | undefined {
  const sensors = getSensorsForAsset(assetId);
  // Prefer most severe
  const order = { critical: 0, warning: 1, info: 2, healthy: 3, offline: 4 };
  return sensors.sort((a, b) => order[a.severity] - order[b.severity])[0];
}
