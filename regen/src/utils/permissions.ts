import type { Role, RolePermissions } from '../types';

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  maintenance_engineer: {
    dashboard: true,
    map: true,
    alerts: true,
    assets: true,
    workOrders: true,
    sensors: false,
    users: false,
    settings: false,
    reports: false,
    canCreateWorkOrder: true,
    canUpdateWorkOrderStatus: true,
    canAssignWorkOrder: false,
    canAcknowledgeAlert: true,
    canManageUsers: false,
    canConfigureSystem: false,
  },
  operations_manager: {
    dashboard: true,
    map: true,
    alerts: true,
    assets: false,
    workOrders: true,
    sensors: false,
    users: false,
    settings: false,
    reports: true,
    canCreateWorkOrder: false,
    canUpdateWorkOrderStatus: false,
    canAssignWorkOrder: true,
    canAcknowledgeAlert: true,
    canManageUsers: false,
    canConfigureSystem: false,
  },
  administrator: {
    dashboard: true,
    map: false,
    alerts: false,
    assets: false,
    workOrders: false,
    sensors: true,
    users: true,
    settings: true,
    reports: true,
    canCreateWorkOrder: false,
    canUpdateWorkOrderStatus: false,
    canAssignWorkOrder: false,
    canAcknowledgeAlert: false,
    canManageUsers: true,
    canConfigureSystem: true,
  },
};

export function hasPermission(role: Role, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][permission] === true;
}

export const ROLE_LABELS: Record<Role, string> = {
  maintenance_engineer: 'Maintenance Engineer',
  operations_manager: 'Operations Manager',
  administrator: 'Administrator',
};
