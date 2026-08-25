import { format, formatDistanceToNow } from 'date-fns';
import type { TCStatus, AssetCondition, SensorStatus, RiskLevel, AlertPriority, AlertStatus, InspectionStatus, MaintenanceStatus, AssetType, TrendDirection } from '../types';

export const formatDate = (iso?: string) => iso ? format(new Date(iso), 'dd MMM yyyy') : '—';
export const formatDateTime = (iso?: string) => iso ? format(new Date(iso), 'dd MMM yyyy HH:mm') : '—';
export const formatTime = (iso?: string) => iso ? format(new Date(iso), 'HH:mm:ss') : '—';
export const formatRelative = (iso?: string) => iso ? formatDistanceToNow(new Date(iso), { addSuffix: true }) : '—';

export function tcStatusBadge(s: TCStatus) {
  return s === 'NORMAL' ? 'badge-normal' : s === 'OCCUPIED' ? 'badge-occupied' : s === 'FAULT' ? 'badge-fault' : 'badge-offline';
}
export function conditionBadge(c: AssetCondition) {
  return c === 'GOOD' ? 'badge-normal' : c === 'CRITICAL' ? 'badge-critical' : c === 'UNKNOWN' ? 'badge-unknown' : 'badge-warning';
}
export function sensorStatusBadge(s: SensorStatus) {
  return s === 'ACTIVE' ? 'badge-normal' : s === 'WARNING' ? 'badge-warning' : s === 'FAULT' ? 'badge-fault' : s === 'CALIBRATING' ? 'badge-unknown' : 'badge-offline';
}
export function riskBadge(r: RiskLevel) {
  return r === 'NORMAL' ? 'badge-normal' : r === 'SIMULATED_CRITICAL' ? 'badge-critical' : r === 'OFFLINE' ? 'badge-offline' : r === 'UNKNOWN' ? 'badge-unknown' : 'badge-warning';
}
export function alertPriorityBadge(p: AlertPriority) {
  return p === 'NORMAL' ? 'badge-normal' : p === 'CRITICAL' ? 'badge-critical' : p === 'OFFLINE' ? 'badge-offline' : p === 'REQUIRES_VERIFICATION' ? 'badge-verify' : 'badge-warning';
}
export function alertStatusBadge(s: AlertStatus) {
  return s === 'OPEN' ? 'badge-fault' : s === 'RESOLVED' || s === 'CLOSED' ? 'badge-normal' : s === 'FALSE_ALARM' ? 'badge-offline' : 'badge-warning';
}
export function inspectionStatusBadge(s: InspectionStatus) {
  return s === 'OPEN' ? 'badge-fault' : s === 'ASSIGNED' ? 'badge-warning' : s === 'IN_PROGRESS' ? 'badge-occupied' : s === 'COMPLETED' ? 'badge-normal' : 'badge-offline';
}
export function maintenanceStatusBadge(s: MaintenanceStatus) {
  return s === 'OPEN' ? 'badge-fault' : s === 'ASSIGNED' ? 'badge-warning' : s === 'IN_PROGRESS' ? 'badge-occupied' : s === 'VERIFICATION_REQUIRED' ? 'badge-verify' : s === 'CLOSED' ? 'badge-offline' : 'badge-normal';
}
export function assetTypeLabel(t: AssetType) {
  const m: Record<AssetType, string> = { COMPOSITE_SLEEPER: 'Composite Sleeper', STEEL_RAIL: 'Steel Rail', BRIDGE: 'Bridge', CULVERT: 'Culvert', BALLAST_BED: 'Ballast Bed', SWITCH_ASSEMBLY: 'Switch Assembly', LEVEL_CROSSING: 'Level Crossing', RETAINING_WALL: 'Retaining Wall', EMBANKMENT: 'Embankment', VIADUCT: 'Viaduct' };
  return m[t] ?? t;
}
export function trendLabel(t?: TrendDirection) {
  if (!t) return '—';
  return { STABLE: 'Stable', INCREASING: 'Increasing', DECREASING: 'Decreasing', SUDDEN_CHANGE: 'Sudden Change', OFFLINE: 'Offline' }[t];
}
export function trendColor(t?: TrendDirection) {
  if (!t) return 'text-gray-500';
  return t === 'INCREASING' ? 'text-red-600' : t === 'DECREASING' ? 'text-blue-600' : t === 'OFFLINE' ? 'text-gray-500' : 'text-green-600';
}
export function statusDot(status: string) {
  const s = status?.toUpperCase();
  if (['NORMAL', 'OPERATIONAL', 'GOOD', 'ACTIVE', 'CLEAR'].includes(s)) return '#16A34A';
  if (['OCCUPIED'].includes(s)) return '#145DA0';
  if (['WARNING', 'DEGRADED', 'FAIR', 'CAUTION', 'SIMULATED_WARNING'].includes(s)) return '#F59E0B';
  if (['FAULT', 'CRITICAL', 'DANGER', 'SIMULATED_CRITICAL'].includes(s)) return '#DC2626';
  return '#6B7280';
}
