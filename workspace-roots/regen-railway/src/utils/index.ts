import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TrackCircuitStatus, RiskLevel, AlertPriority, AssetCondition, FbgTrend, SensorStatus, MaintenanceStatus, InspectionStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Status colour mappings using REGEN colour system
export function getTrackCircuitStatusColor(status: TrackCircuitStatus): string {
  switch (status) {
    case "NORMAL": return "text-green-600 bg-green-50 border-green-200";
    case "OCCUPIED": return "text-blue-600 bg-blue-50 border-blue-200";
    case "FAULT": return "text-red-600 bg-red-50 border-red-200";
    case "UNKNOWN": return "text-amber-600 bg-amber-50 border-amber-200";
    case "OFFLINE": return "text-gray-500 bg-gray-50 border-gray-200";
    default: return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function getTrackCircuitStatusDot(status: TrackCircuitStatus): string {
  switch (status) {
    case "NORMAL": return "bg-green-500";
    case "OCCUPIED": return "bg-blue-500";
    case "FAULT": return "bg-red-500";
    case "UNKNOWN": return "bg-amber-500";
    case "OFFLINE": return "bg-gray-400";
    default: return "bg-gray-400";
  }
}

export function getRiskLevelColor(risk: RiskLevel): string {
  switch (risk) {
    case "LOW": return "text-green-600 bg-green-50 border-green-200";
    case "MODERATE": return "text-blue-600 bg-blue-50 border-blue-200";
    case "WARNING": return "text-amber-600 bg-amber-50 border-amber-200";
    case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200";
    case "CRITICAL": return "text-red-600 bg-red-50 border-red-200";
    case "OFFLINE": return "text-gray-500 bg-gray-50 border-gray-200";
    default: return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function getAlertPriorityColor(priority: AlertPriority): string {
  switch (priority) {
    case "NORMAL": return "text-green-600 bg-green-50 border-green-200";
    case "WARNING": return "text-amber-600 bg-amber-50 border-amber-200";
    case "HIGH": return "text-orange-600 bg-orange-50 border-orange-200";
    case "CRITICAL": return "text-red-600 bg-red-50 border-red-200";
    case "OFFLINE": return "text-gray-500 bg-gray-50 border-gray-200";
    default: return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function getAssetConditionColor(condition: AssetCondition): string {
  switch (condition) {
    case "GOOD": return "text-green-600 bg-green-50 border-green-200";
    case "FAIR": return "text-blue-600 bg-blue-50 border-blue-200";
    case "WARNING": return "text-amber-600 bg-amber-50 border-amber-200";
    case "CRITICAL": return "text-red-600 bg-red-50 border-red-200";
    case "REQUIRES_VERIFICATION": return "text-orange-600 bg-orange-50 border-orange-200";
    case "UNKNOWN": return "text-gray-500 bg-gray-50 border-gray-200";
    default: return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function getMaintenanceStatusColor(status: MaintenanceStatus): string {
  switch (status) {
    case "OPEN": return "text-red-600 bg-red-50 border-red-200";
    case "ASSIGNED": return "text-blue-600 bg-blue-50 border-blue-200";
    case "IN_PROGRESS": return "text-amber-600 bg-amber-50 border-amber-200";
    case "COMPLETED": return "text-green-600 bg-green-50 border-green-200";
    case "VERIFICATION_REQUIRED": return "text-orange-600 bg-orange-50 border-orange-200";
    case "VERIFIED": return "text-teal-600 bg-teal-50 border-teal-200";
    case "CLOSED": return "text-gray-500 bg-gray-50 border-gray-200";
    default: return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function getInspectionStatusColor(status: InspectionStatus): string {
  switch (status) {
    case "PENDING": return "text-amber-600 bg-amber-50 border-amber-200";
    case "ASSIGNED": return "text-blue-600 bg-blue-50 border-blue-200";
    case "IN_PROGRESS": return "text-orange-600 bg-orange-50 border-orange-200";
    case "COMPLETED": return "text-green-600 bg-green-50 border-green-200";
    case "CANCELLED": return "text-gray-500 bg-gray-50 border-gray-200";
    default: return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function getTrendIcon(trend: FbgTrend): string {
  switch (trend) {
    case "STABLE": return "→";
    case "INCREASING": return "↑";
    case "DECREASING": return "↓";
    case "SUDDEN_CHANGE": return "⚡";
    case "OFFLINE": return "—";
    default: return "—";
  }
}

export function getSensorStatusColor(status: SensorStatus): string {
  switch (status) {
    case "ONLINE": return "text-green-600 bg-green-50 border-green-200";
    case "OFFLINE": return "text-gray-500 bg-gray-50 border-gray-200";
    case "DEGRADED": return "text-amber-600 bg-amber-50 border-amber-200";
    case "CALIBRATING": return "text-blue-600 bg-blue-50 border-blue-200";
    default: return "text-gray-500 bg-gray-50 border-gray-200";
  }
}

export function formatTimestamp(ts: string): string {
  try {
    return new Date(ts).toLocaleString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export function formatDate(ts: string): string {
  try {
    return new Date(ts).toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return ts;
  }
}

export function timeAgo(ts: string): string {
  const now = new Date();
  const then = new Date(ts);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
