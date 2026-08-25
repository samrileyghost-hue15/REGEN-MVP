import type { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'J. van der Berg',
    role: 'maintenance_engineer',
    email: 'j.vanderberg@regen.rail',
  },
  {
    id: 'USR-002',
    name: 'S. Mahlangu',
    role: 'operations_manager',
    email: 's.mahlangu@regen.rail',
  },
  {
    id: 'USR-003',
    name: 'A. Patel',
    role: 'administrator',
    email: 'a.patel@regen.rail',
  },
];

export const MAINTENANCE_RECORDS = [
  {
    id: 'MR-001', assetId: 'B12', workOrderId: 'WO-1039',
    type: 'Inspection', description: 'Routine vibration check and rail fastener inspection.',
    performedBy: 'J. van der Berg', performedAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-002', assetId: 'B12',
    type: 'Repair', description: 'Replaced 3 worn rail fasteners. Topped up ballast on km 4.2.',
    performedBy: 'J. van der Berg', performedAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-003', assetId: 'A3',
    type: 'Inspection', description: 'Ballast profile survey and rail joint inspection.',
    performedBy: 'P. Nkosi', performedAt: new Date(Date.now() - 45 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-004', assetId: 'S04',
    type: 'Inspection', description: 'Annual bridge structural inspection. NDT on main girders.',
    performedBy: 'Bridge Inspection Unit', performedAt: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-005', assetId: 'D8',
    type: 'Inspection', description: 'Quarterly sleeper check. All fasteners within torque spec.',
    performedBy: 'T. Dlamini', performedAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-006', assetId: 'C7',
    type: 'Maintenance', description: 'Lubricated switch points. Recalibrated detection.',
    performedBy: 'J. van der Berg', performedAt: new Date(Date.now() - 6 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-007', assetId: 'B12',
    type: 'Monitoring', description: 'Vibration trend review. Values within normal range at time of check.',
    performedBy: 'J. van der Berg', performedAt: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-008', assetId: 'J3',
    type: 'Inspection', description: 'N3 bridge visual inspection. Minor surface corrosion noted.',
    performedBy: 'Bridge Inspection Unit', performedAt: new Date(Date.now() - 120 * 24 * 3600000).toISOString(),
    outcome: 'partial' as const,
  },
  {
    id: 'MR-009', assetId: 'A3',
    type: 'Repair', description: 'Rail joint grinding on km 2.8.',
    performedBy: 'P. Nkosi', performedAt: new Date(Date.now() - 100 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
  {
    id: 'MR-010', assetId: 'C7',
    type: 'Inspection', description: 'Annual switch inspection. All components serviceable.',
    performedBy: 'J. van der Berg', performedAt: new Date(Date.now() - 180 * 24 * 3600000).toISOString(),
    outcome: 'completed' as const,
  },
];
