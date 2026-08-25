import {
  createContext, useContext, useState, useCallback, useEffect,
  type ReactNode,
} from 'react';
import type { Asset, Sensor, Alert, WorkOrder, Prediction } from '../types';
import { assetsApi, sensorsApi, alertsApi, workOrdersApi, predictionsApi } from '../lib/api';

// Fallback to local mock data if the API is unavailable (e.g. static preview)
import { MOCK_ASSETS } from '../data/assets';
import { MOCK_SENSORS } from '../data/sensors';
import { MOCK_ALERTS } from '../data/alerts';
import { MOCK_WORK_ORDERS } from '../data/workOrders';
import { MOCK_PREDICTIONS } from '../data/predictions';

interface AssetContextValue {
  assets: Asset[];
  sensors: Sensor[];
  alerts: Alert[];
  workOrders: WorkOrder[];
  predictions: Prediction[];
  loading: boolean;

  selectedAsset: Asset | null;
  selectedSensor: Sensor | null;

  selectAsset: (assetId: string | null) => void;
  selectSensor: (sensorId: string | null) => void;

  updateSensor: (sensorId: string, patch: Partial<Sensor>) => void;
  updateAsset: (assetId: string, patch: Partial<Asset>) => void;
  addAlert: (alert: Alert) => void;
  addWorkOrder: (wo: WorkOrder) => void;
  updateWorkOrder: (workOrderId: string, patch: Partial<WorkOrder>) => void;
  acknowledgeAlert: (alertId: string, by: string) => void;
  resolveAlert: (alertId: string) => void;
}

const AssetContext = createContext<AssetContextValue | null>(null);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [sensors, setSensors] = useState<Sensor[]>(MOCK_SENSORS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [predictions, setPredictions] = useState<Prediction[]>(MOCK_PREDICTIONS);
  const [loading, setLoading] = useState(true);

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  // ── Bootstrap: load everything from the API ──────────────────────────────
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      assetsApi.list(),
      sensorsApi.list(),
      alertsApi.list(),
      workOrdersApi.list(),
      predictionsApi.list(),
    ])
      .then(([a, s, al, wo, pr]) => {
        if (cancelled) return;
        setAssets(a);
        setSensors(s);
        setAlerts(al);
        setWorkOrders(wo);
        setPredictions(pr);
      })
      .catch(() => {
        // API unreachable — keep the pre-loaded mock data as fallback
        console.warn('[regen] API unreachable, using local mock data');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Derived selections ───────────────────────────────────────────────────
  const selectedAsset = assets.find(a => a.id === selectedAssetId) ?? null;
  const selectedSensor = sensors.find(s => s.id === selectedSensorId) ?? null;

  // ── Selection ────────────────────────────────────────────────────────────
  const selectAsset = useCallback((assetId: string | null) => {
    setSelectedAssetId(assetId);
    if (!assetId) setSelectedSensorId(null);
  }, []);

  const selectSensor = useCallback((sensorId: string | null) => {
    setSelectedSensorId(sensorId);
    if (sensorId) {
      const sensor = sensors.find(s => s.id === sensorId);
      if (sensor) setSelectedAssetId(sensor.assetId);
    }
  }, [sensors]);

  // ── Mutations — optimistic local update + fire-and-forget to API ─────────
  const updateSensor = useCallback((sensorId: string, patch: Partial<Sensor>) => {
    setSensors(prev => prev.map(s => s.id === sensorId ? { ...s, ...patch } : s));
    sensorsApi.patch(sensorId, patch).catch(() => {/* demo: ignore errors */ });
  }, []);

  const updateAsset = useCallback((assetId: string, patch: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, ...patch } : a));
    assetsApi.patch(assetId, patch).catch(() => { });
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
    alertsApi.create(alert).catch(() => { });
  }, []);

  const addWorkOrder = useCallback((wo: WorkOrder) => {
    setWorkOrders(prev => [wo, ...prev]);
    workOrdersApi.create(wo).catch(() => { });
  }, []);

  const updateWorkOrder = useCallback((workOrderId: string, patch: Partial<WorkOrder>) => {
    setWorkOrders(prev =>
      prev.map(wo => wo.id === workOrderId
        ? { ...wo, ...patch, updatedAt: new Date().toISOString() }
        : wo
      )
    );
    workOrdersApi.patch(workOrderId, patch).catch(() => { });
  }, []);

  const acknowledgeAlert = useCallback((alertId: string, by: string) => {
    setAlerts(prev =>
      prev.map(a => a.id === alertId ? {
        ...a,
        status: 'acknowledged' as const,
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy: by,
      } : a)
    );
    alertsApi.acknowledge(alertId, by).catch(() => { });
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => a.id === alertId ? {
        ...a,
        status: 'resolved' as const,
        resolvedAt: new Date().toISOString(),
      } : a)
    );
    alertsApi.resolve(alertId).catch(() => { });
  }, []);

  return (
    <AssetContext.Provider value={{
      assets, sensors, alerts, workOrders, predictions, loading,
      selectedAsset, selectedSensor,
      selectAsset, selectSensor,
      updateSensor, updateAsset,
      addAlert, addWorkOrder, updateWorkOrder,
      acknowledgeAlert, resolveAlert,
    }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssets() {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error('useAssets must be used within AssetProvider');
  return ctx;
}
