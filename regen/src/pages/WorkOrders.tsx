import { useState } from 'react';
import { useAssets } from '../context/AssetContext';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/permissions';
import { EmptyState } from '../components/ui';
import { format, formatDistanceToNow } from 'date-fns';
import type { WorkOrderStatus, WorkOrderPriority } from '../types';
import { ChevronDown } from 'lucide-react';

const STATUS_STYLES: Record<WorkOrderStatus, { color: string; bg: string }> = {
  open:        { color: '#FF3B3B', bg: 'rgba(255,59,59,0.12)' },
  in_progress: { color: '#00D1FF', bg: 'rgba(0,209,255,0.12)' },
  resolved:    { color: '#39FF14', bg: 'rgba(57,255,20,0.10)' },
  closed:      { color: '#666666', bg: 'rgba(102,102,102,0.12)' },
};

const PRIORITY_COLOR: Record<WorkOrderPriority, string> = {
  critical: '#FF3B3B',
  high:     '#FFB020',
  medium:   '#00D1FF',
  low:      '#39FF14',
};

const STATUS_FLOW: WorkOrderStatus[] = ['open', 'in_progress', 'resolved', 'closed'];

export function WorkOrdersPage() {
  const { workOrders, updateWorkOrder, assets } = useAssets();
  const { user } = useAuth();
  const [filter, setFilter] = useState<WorkOrderStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const canUpdateStatus = user ? hasPermission(user.role, 'canUpdateWorkOrderStatus') : false;
  const canAssign = user ? hasPermission(user.role, 'canAssignWorkOrder') : false;

  const filtered = filter === 'all'
    ? workOrders
    : workOrders.filter(wo => wo.status === filter);

  // Sort: open → in_progress → resolved → closed, then by created desc
  const sorted = [...filtered].sort((a, b) => {
    const statusOrder = STATUS_FLOW.indexOf(a.status) - STATUS_FLOW.indexOf(b.status);
    if (statusOrder !== 0) return statusOrder;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const counts = {
    all: workOrders.length,
    open: workOrders.filter(w => w.status === 'open').length,
    in_progress: workOrders.filter(w => w.status === 'in_progress').length,
    resolved: workOrders.filter(w => w.status === 'resolved').length,
    closed: workOrders.filter(w => w.status === 'closed').length,
  };

  const advanceStatus = (woId: string, current: WorkOrderStatus) => {
    const next = STATUS_FLOW[STATUS_FLOW.indexOf(current) + 1];
    if (!next) return;
    const patch: Partial<typeof workOrders[0]> = { status: next };
    if (next === 'resolved') patch.resolvedAt = new Date().toISOString();
    updateWorkOrder(woId, patch);
  };

  const nextStatusLabel: Record<WorkOrderStatus, string | null> = {
    open:        '→ In Progress',
    in_progress: '→ Resolved',
    resolved:    '→ Close',
    closed:      null,
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-sm font-mono font-semibold text-text-primary">
          Work Orders
        </h1>
        <div className="text-xs font-mono text-text-dim">
          {counts.open} open · {counts.in_progress} in progress · {counts.resolved} resolved
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
              filter === s
                ? 'border-cyan/50 text-cyan bg-cyan/8'
                : 'border-border text-text-dim hover:text-text-secondary hover:border-border/80'
            }`}
          >
            {s.replace('_', ' ').toUpperCase()}
            <span className="ml-1.5 opacity-60">
              ({counts[s]})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <EmptyState title="No work orders" subtitle="No active work orders" />
      ) : (
        <div className="panel overflow-hidden">
          <table className="w-full text-xs font-mono" aria-label="Work orders">
            <thead>
              <tr className="border-b border-border">
                {['ID', 'Asset', 'Issue', 'Priority', 'Status', 'Team', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-text-dim uppercase tracking-wider font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map(wo => {
                const asset = assets.find(a => a.id === wo.assetId);
                const s = STATUS_STYLES[wo.status];
                const isExpanded = expandedId === wo.id;
                const nextLabel = nextStatusLabel[wo.status];

                return (
                  <>
                    <tr
                      key={wo.id}
                      className={`hover:bg-surface2 transition-colors cursor-pointer ${isExpanded ? 'bg-surface2' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : wo.id)}
                    >
                      <td className="px-4 py-3">
                        <span className="text-cyan font-semibold">{wo.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-text-primary font-semibold">{asset?.name ?? wo.assetId}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-text-secondary truncate">{wo.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span style={{ color: PRIORITY_COLOR[wo.priority] }}>
                          {wo.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded" style={{ color: s.color, background: s.bg }}>
                          {wo.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {wo.assignedTeam}
                      </td>
                      <td className="px-4 py-3 text-text-dim whitespace-nowrap">
                        {formatDistanceToNow(new Date(wo.createdAt), { addSuffix: true })}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          {/* Status advance — maintenance engineer */}
                          {canUpdateStatus && nextLabel && (
                            <button
                              onClick={() => advanceStatus(wo.id, wo.status)}
                              className="btn-ghost text-[10px] whitespace-nowrap"
                            >
                              {nextLabel}
                            </button>
                          )}
                          {/* Priority change — operations manager */}
                          {canAssign && (
                            <select
                              value={wo.priority}
                              onChange={e => updateWorkOrder(wo.id, { priority: e.target.value as WorkOrderPriority })}
                              className="regen-select py-0.5 px-1 text-[10px]"
                              aria-label="Change priority"
                            >
                              {['critical','high','medium','low'].map(p => (
                                <option key={p} value={p}>{p.toUpperCase()}</option>
                              ))}
                            </select>
                          )}
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-text-dim transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {isExpanded && (
                      <tr key={`${wo.id}-exp`} className="bg-surface2">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="data-label mb-1">Description</p>
                              <p className="text-text-secondary leading-relaxed">{wo.description}</p>
                              {wo.notes && (
                                <>
                                  <p className="data-label mt-3 mb-1">Notes</p>
                                  <p className="text-text-secondary leading-relaxed">{wo.notes}</p>
                                </>
                              )}
                            </div>
                            <div className="space-y-2">
                              {wo.assignedTo && (
                                <div className="data-row">
                                  <span className="data-label">Assigned To</span>
                                  <span className="data-value">{wo.assignedTo}</span>
                                </div>
                              )}
                              <div className="data-row">
                                <span className="data-label">Created</span>
                                <span className="data-value">{format(new Date(wo.createdAt), 'dd MMM yyyy HH:mm')}</span>
                              </div>
                              {wo.resolvedAt && (
                                <div className="data-row">
                                  <span className="data-label">Resolved</span>
                                  <span className="data-value text-green">{format(new Date(wo.resolvedAt), 'dd MMM yyyy HH:mm')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
