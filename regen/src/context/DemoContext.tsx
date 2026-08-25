import {
  createContext, useContext, useState, useRef, useCallback,
  type ReactNode,
} from 'react';
import type { DemoStage, Alert, WorkOrder } from '../types';
import { useAssets } from './AssetContext';

// Demo asset is always B12 / NFC_B12_001
const DEMO_ASSET_ID = 'B12';
const DEMO_SENSOR_ID = 'NFC_B12_001';

interface DemoContextValue {
  stage: DemoStage;
  isRunning: boolean;
  notification: string | null;
  demoWorkOrderId: string | null;
  startDemo: () => void;
  resetDemo: () => void;
  advanceDemo: () => void;  // manual step (for work-order creation)
  dismissNotification: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const { updateSensor, updateAsset, addAlert, addWorkOrder, updateWorkOrder, selectAsset, selectSensor } = useAssets();
  const [stage, setStage] = useState<DemoStage>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [demoWorkOrderId, setDemoWorkOrderId] = useState<string | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const demoAlertIdRef = useRef<string>('');

  const notify = (msg: string, durationMs = 4000) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), durationMs);
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
  };

  const resetDemo = useCallback(() => {
    clearTimeouts();
    setStage('idle');
    setIsRunning(false);
    setDemoWorkOrderId(null);
    // Reset sensor and asset back to baseline
    updateSensor(DEMO_SENSOR_ID, {
      currentValue: 0.72,
      severity: 'healthy',
      status: 'online',
      lastUpdate: new Date().toISOString(),
    });
    updateAsset(DEMO_ASSET_ID, { severity: 'healthy' });
    notify('Demo reset — network restored to healthy state.');
  }, [updateSensor, updateAsset]);

  const startDemo = useCallback(() => {
    clearTimeouts();
    setIsRunning(true);
    demoAlertIdRef.current = `ALT-DEMO-${Date.now()}`;
    const woId = `WO-${1042 + Math.floor(Math.random() * 100)}`;

    // ── Stage 1: Healthy ──────────────────── t = 0s
    setStage('healthy');
    updateSensor(DEMO_SENSOR_ID, { currentValue: 0.72, severity: 'healthy', lastUpdate: new Date().toISOString() });
    updateAsset(DEMO_ASSET_ID, { severity: 'healthy' });
    selectAsset(DEMO_ASSET_ID);
    notify('Stage 1 — B12 is healthy. Vibration: 0.72g');

    // ── Stage 2: Warning ─────────────────── t = 3s
    schedule(() => {
      setStage('warning');
      updateSensor(DEMO_SENSOR_ID, {
        currentValue: 0.86,
        severity: 'warning',
        lastUpdate: new Date().toISOString(),
      });
      updateAsset(DEMO_ASSET_ID, { severity: 'warning' });
      notify('Stage 2 — B12 vibration rising. Warning: 0.86g');
    }, 3000);

    // ── Stage 3: Critical ────────────────── t = 6s
    schedule(() => {
      setStage('critical');
      updateSensor(DEMO_SENSOR_ID, {
        currentValue: 1.24,
        severity: 'critical',
        lastUpdate: new Date().toISOString(),
      });
      updateAsset(DEMO_ASSET_ID, { severity: 'critical' });
      notify('⚠ Stage 3 — CRITICAL vibration on B12: 1.24g', 5000);
    }, 6000);

    // ── Stage 4: Alert ───────────────────── t = 8s
    schedule(() => {
      setStage('alert');
      const newAlert: Alert = {
        id: demoAlertIdRef.current,
        assetId: DEMO_ASSET_ID,
        sensorId: DEMO_SENSOR_ID,
        title: 'B12 — High vibration detected',
        description: 'Vibration sensor NFC_B12_001 exceeded critical threshold. Current: 1.24g. Immediate inspection required.',
        severity: 'critical',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      addAlert(newAlert);
      selectSensor(DEMO_SENSOR_ID);
      notify('Stage 4 — Alert generated: B12 high vibration', 4000);
    }, 8000);

    // ── Stage 5 + 6: Map focus + Prediction ─ t = 10s
    schedule(() => {
      setStage('prediction');
      notify('Stage 6 — Prediction: Risk HIGH · RUL 18 days · 78% failure probability');
    }, 10000);

    // ── Stage 7: Work-order prompt ────────── t = 13s
    schedule(() => {
      setStage('work-order');
      notify('Stage 7 — Create a Work Order to dispatch the maintenance team.', 6000);
    }, 13000);

    // ── Auto-create work order ─────────────── t = 18s
    schedule(() => {
      const wo: WorkOrder = {
        id: woId,
        assetId: DEMO_ASSET_ID,
        alertId: demoAlertIdRef.current,
        predictionId: 'PRD-001',
        title: `Inspect and repair Track B12 — high vibration`,
        description: 'Critical vibration (1.24g) on NFC_B12_001. Inspect rail fasteners, ballast, and rail profile at km 4.2.',
        priority: 'critical',
        status: 'open',
        assignedTeam: 'Maintenance Team Alpha',
        assignedTo: 'J. van der Berg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addWorkOrder(wo);
      setDemoWorkOrderId(woId);
      notify(`Stage 8 — Work Order ${woId} created · Status: Open`, 5000);
    }, 18000);

    // ── Stage 9: In-progress ──────────────── t = 23s
    schedule(() => {
      setStage('in-progress');
      setDemoWorkOrderId(prev => {
        if (prev) updateWorkOrder(prev, { status: 'in_progress' });
        return prev;
      });
      notify(`Stage 9 — Work Order ${woId} → In Progress`);
    }, 23000);

    // ── Stage 10: Resolved + recovery ─────── t = 28s
    schedule(() => {
      setStage('resolved');
      setDemoWorkOrderId(prev => {
        if (prev) updateWorkOrder(prev, {
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
          notes: 'Rail fasteners replaced. Ballast repacked. Vibration returning to normal.',
        });
        return prev;
      });
      notify(`Stage 9 — Work Order ${woId} → Resolved. Running sensor recovery…`);
    }, 28000);

    // Sensor recovery: 1.24 → 0.86 → 0.72
    schedule(() => {
      updateSensor(DEMO_SENSOR_ID, { currentValue: 0.86, severity: 'warning', lastUpdate: new Date().toISOString() });
    }, 31000);
    schedule(() => {
      updateSensor(DEMO_SENSOR_ID, { currentValue: 0.72, severity: 'healthy', lastUpdate: new Date().toISOString() });
      updateAsset(DEMO_ASSET_ID, { severity: 'healthy' });
      setStage('recovered');
      setIsRunning(false);
      notify('✓ Stage 10 — ASSET B12 VERIFIED HEALTHY. Sensor recovered.', 6000);
    }, 35000);
  }, [updateSensor, updateAsset, addAlert, addWorkOrder, updateWorkOrder, selectAsset, selectSensor]);

  const advanceDemo = useCallback(() => {
    // Manual step — used if user wants to trigger work-order creation themselves
    if (stage === 'work-order') {
      const woId = demoWorkOrderId ?? `WO-${1050 + Math.floor(Math.random() * 50)}`;
      const wo: WorkOrder = {
        id: woId,
        assetId: DEMO_ASSET_ID,
        alertId: demoAlertIdRef.current,
        title: 'Inspect and repair Track B12 — high vibration',
        description: 'Critical vibration (1.24g) on NFC_B12_001.',
        priority: 'critical',
        status: 'open',
        assignedTeam: 'Maintenance Team Alpha',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addWorkOrder(wo);
      setDemoWorkOrderId(woId);
    }
  }, [stage, demoWorkOrderId, addWorkOrder]);

  const dismissNotification = useCallback(() => setNotification(null), []);

  return (
    <DemoContext.Provider value={{
      stage, isRunning, notification, demoWorkOrderId,
      startDemo, resetDemo, advanceDemo, dismissNotification,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
