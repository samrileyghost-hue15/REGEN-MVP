import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from 'react';
import type { Asset, Sensor, Alert, WorkOrder } from '../types';
import { MOCK_ASSETS } from '../data/assets';
import { MOCK_SENSORS } from '../data/sensors';
import { MOCK_ALERTS } from '../data/alerts';
import { MOCK_WORK_ORDERS } from '../data/workOrders';

interface AssetContextValue {
  assets: Asset[];
  sensors: Sensor[];
  alerts: Alert[];
  workOrders: WorkOrder[];

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
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const selectedAsset = assets.find(a => a.id === selectedAssetId) ?? null;
  const selectedSensor = sensors.find(s => s.id === selectedSensorId) ?? null;

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

  const updateSensor = useCallback((sensorId: string, patch: Partial<Sensor>) => {
    setSensors(prev => prev.map(s => s.id === sensorId ? { ...s, ...patch } : s));
  }, []);

  const updateAsset = useCallback((assetId: string, patch: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, ...patch } : a));
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  }, []);

  const addWorkOrder = useCallback((wo: WorkOrder) => {
    setWorkOrders(prev => [wo, ...prev]);
  }, []);

  const updateWorkOrder = useCallback((workOrderId: string, patch: Partial<WorkOrder>) => {
    setWorkOrders(prev =>
      prev.map(wo => wo.id === workOrderId ? { ...wo, ...patch, updatedAt: new Date().toISOString() } : wo)
    );
  }, []);

  const acknowledgeAlert = useCallback((alertId: string, by: string) => {
    setAlerts(prev =>
      prev.map(a => a.id === alertId ? {
        ...a,
        status: 'acknowledged',
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy: by,
      } : a)
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => a.id === alertId ? {
        ...a,
        status: 'resolved',
        resolvedAt: new Date().toISOString(),
      } : a)
    );
  }, []);

  return (
    <AssetContext.Provider value={{
      assets, sensors, alerts, workOrders,
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
