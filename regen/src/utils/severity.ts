import type { SeverityLevel } from '../types';

export function getSeverityFromValue(value: number, sensor: {
  normalMax: number;
  warningMax: number;
  criticalMax: number;
}): SeverityLevel {
  if (value > sensor.criticalMax) return 'critical';
  if (value > sensor.warningMax) return 'warning';
  if (value >= sensor.normalMax * 0.8) return 'info';
  return 'healthy';
}

export const SEVERITY_COLOR: Record<SeverityLevel, string> = {
  critical: '#FF3B3B',
  warning:  '#FFB020',
  info:     '#00D1FF',
  healthy:  '#39FF14',
  offline:  '#666666',
};

export const SEVERITY_BG: Record<SeverityLevel, string> = {
  critical: 'rgba(255, 59, 59, 0.15)',
  warning:  'rgba(255, 176, 32, 0.12)',
  info:     'rgba(0, 209, 255, 0.12)',
  healthy:  'rgba(57, 255, 20, 0.10)',
  offline:  'rgba(102, 102, 102, 0.15)',
};

export const SEVERITY_LABEL: Record<SeverityLevel, string> = {
  critical: 'CRITICAL',
  warning:  'WARNING',
  info:     'INFO',
  healthy:  'HEALTHY',
  offline:  'OFFLINE',
};

export const SEVERITY_ORDER: Record<SeverityLevel, number> = {
  critical: 0,
  warning:  1,
  info:     2,
  healthy:  3,
  offline:  4,
};

export function sortBySeverity<T extends { severity: SeverityLevel }>(items: T[]): T[] {
  return [...items].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
}
