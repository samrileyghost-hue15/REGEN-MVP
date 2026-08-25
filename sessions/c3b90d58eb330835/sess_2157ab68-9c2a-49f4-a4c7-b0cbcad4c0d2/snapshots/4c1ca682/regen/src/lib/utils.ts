import { format, formatDistanceToNow } from 'date-fns';
import type {
  TCStatus, AssetCondition, SensorStatus, RiskLevel,
  AlertPriority, AlertStatus, InspectionStatus, MaintenanceStatus,
  AssetType, TrendDirection,
} from '../types';

// -------------------------------------------------------
// Date Formatting
// -------------------------------------------------------
export function formatDate(iso: string | undefined): string {
  if (!iso) return '—';
  return format(new Date(iso), 'dd MMM yyyy');
}

export function formatDateTime(iso: string | undefined): string {
  if (!iso) return '—';
  return format(new Date(iso), 'dd MMM yyyy HH:mm');
}

export function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  return format(new Date(iso), 'HH:mm:ss');
}

export function formatRelative(iso: string | undefined): string {
  if (!iso) return '—';
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

// -------------------------------------------------------
// Status Colour Mappings
// -------------------------------------------------------
export function tcStatusColor(status: TCStatus): string {
  switch (status) {
    case 'NORMAL':   return 'text-healthy bg-green-50 border-green-200';
    case 'OCCUPIED': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'FAULT':    return 'text-critical bg-red-50 border-red-200';
    case 'UNKNOWN':  return 'text-offline bg-gray-50 border-gray-200';
    case 'OFFLINE':  return 'text-offline bg-gray-100 border-gray-300';
  }
}

export function tcStatusBadge(status: TCStatus): string {
  switch (status) {
    case 'NORMAL':   return 'badge-normal';
    case 'OCCUPIED': return 'badge-occupied';
    case 'FAULT':    return 'badge-fault';
    case 'UNKNOWN':  return 'badge-unknown';
    case 'OFFLINE':  return 'badge-offline';
  }
}

export function conditionBadge(c: AssetCondition): string {
  switch (c) {
    case 'GOOD':     return 'badge-normal';
    case 'FAIR':     return 'badge-warning';
    case 'WARNING':  return 'badge-warning';
    case 'CRITICAL': return 'badge-critical';
    case 'UNKNOWN':  return 'badge-unknown';
  }
}

export function sensorStatusBadge(s: SensorStatus): string {
  switch (s) {
    case 'ACTIVE':      return 'badge-normal';
    case 'WARNING':     return 'badge-warning';
    case 'FAULT':       return 'badge-fault';
    case 'OFFLINE':     return 'badge-offline';
    case 'CALIBRATING': return 'badge-unknown';
  }
}

export function riskBadge(r: RiskLevel): string {
  switch (r) {
    case 'NORMAL':              return 'badge-normal';
    case 'SIMULATED_WARNING':   return 'badge-warning';
    case 'SIMULATED_CRITICAL':  return 'badge-critical';
    case 'OFFLINE':             return 'badge-offline';
    case 'UNKNOWN':             return 'badge-unknown';
  }
}

export function alertPriorityBadge(p: AlertPriority): string {
  switch (p) {
    case 'NORMAL':                return 'badge-normal';
    case 'WARNING':               return 'badge-warning';
    case 'HIGH':                  return 'badge-warning';
    case 'CRITICAL':              return 'badge-critical';
    case 'OFFLINE':               return 'badge-offline';
    case 'REQUIRES_VERIFICATION': return 'badge-verify';
  }
}

export function alertStatusBadge(s: AlertStatus): string {
  switch (s) {
    case 'OPEN':           return 'badge-fault';
    case 'ACKNOWLEDGED':   return 'badge-warning';
    case 'INVESTIGATING':  return 'badge-warning';
    case 'RESOLVED':       return 'badge-normal';
    case 'CLOSED':         return 'badge-normal';
    case 'FALSE_ALARM':    return 'badge-offline';
  }
}

export function inspectionStatusBadge(s: InspectionStatus): string {
  switch (s) {
    case 'OPEN':        return 'badge-fault';
    case 'ASSIGNED':    return 'badge-warning';
    case 'IN_PROGRESS': return 'badge-occupied';
    case 'COMPLETED':   return 'badge-normal';
    case 'CANCELLED':   return 'badge-offline';
  }
}

export function maintenanceStatusBadge(s: MaintenanceStatus): string {
  switch (s) {
    case 'OPEN':                  return 'badge-fault';
    case 'ASSIGNED':              return 'badge-warning';
    case 'IN_PROGRESS':           return 'badge-occupied';
    case 'COMPLETED':             return 'badge-normal';
    case 'VERIFICATION_REQUIRED': return 'badge-verify';
    case 'VERIFIED':              return 'badge-normal';
    case 'CLOSED':                return 'badge-offline';
  }
}

// -------------------------------------------------------
// Labels
// -------------------------------------------------------
export function assetTypeLabel(t: AssetType): string {
  const labels: Record<AssetType, string> = {
    COMPOSITE_SLEEPER: 'Composite Sleeper',
    STEEL_RAIL:        'Steel Rail',
    BRIDGE:            'Bridge',
    CULVERT:           'Culvert',
    BALLAST_BED:       'Ballast Bed',
    SWITCH_ASSEMBLY:   'Switch Assembly',
    LEVEL_CROSSING:    'Level Crossing',
    RETAINING_WALL:    'Retaining Wall',
    EMBANKMENT:        'Embankment',
    VIADUCT:           'Viaduct',
  };
  return labels[t] ?? t;
}

export function trendLabel(t: TrendDirection | undefined): string {
  if (!t) return '—';
  const labels: Record<TrendDirection, string> = {
    STABLE:        'Stable',
    INCREASING:    'Increasing',
    DECREASING:    'Decreasing',
    SUDDEN_CHANGE: 'Sudden Change',
    OFFLINE:       'Offline',
  };
  return labels[t];
}

export function trendColor(t: TrendDirection | undefined): string {
  if (!t) return 'text-gray-500';
  switch (t) {
    case 'STABLE':        return 'text-healthy';
    case 'INCREASING':    return 'text-critical';
    case 'DECREASING':    return 'text-railway-500';
    case 'SUDDEN_CHANGE': return 'text-warning';
    case 'OFFLINE':       return 'text-offline';
  }
}

export function alertSourceLabel(s: string): string {
  const labels: Record<string, string> = {
    TRACK_CIRCUIT: 'Track Circuit',
    FBG_SENSOR:    'FBG Sensor',
    ASSET:         'Asset',
    COMMUNICATION: 'Communication',
    MAINTENANCE:   'Maintenance',
    COMBINED:      'Combined',
  };
  return labels[s] ?? s;
}

// -------------------------------------------------------
// Network Map dot colour
// -------------------------------------------------------
export function statusDot(status: string): string {
  const s = status?.toUpperCase();
  if (['NORMAL', 'OPERATIONAL', 'GOOD', 'ACTIVE', 'CLEAR'].includes(s)) return '#16A34A';
  if (['OCCUPIED'].includes(s)) return '#145DA0';
  if (['WARNING', 'DEGRADED', 'FAIR', 'CAUTION', 'SIMULATED_WARNING'].includes(s)) return '#F59E0B';
  if (['FAULT', 'CRITICAL', 'DANGER', 'SIMULATED_CRITICAL'].includes(s)) return '#DC2626';
  if (['OFFLINE', 'UNKNOWN'].includes(s)) return '#6B7280';
  return '#6B7280';
}
