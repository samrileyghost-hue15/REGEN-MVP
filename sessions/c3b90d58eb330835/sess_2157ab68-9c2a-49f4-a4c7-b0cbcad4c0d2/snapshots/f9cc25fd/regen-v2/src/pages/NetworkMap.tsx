import { RailwayMap } from '../components/map/RailwayMap';
import { AlertsPanel } from '../components/alerts/AlertsPanel';
import { AssetDetailPanel } from '../components/assets/AssetDetailPanel';
import { useAssets } from '../context/AssetContext';

export function NetworkMap() {
  const { selectAsset, selectSensor } = useAssets();

  const handleAlertClick = (assetId: string, sensorId?: string) => {
    selectAsset(assetId);
    if (sensorId) selectSensor(sensorId);
    // Stay on map page — panel will open
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Map — fills remaining space */}
      <div className="flex-1 relative overflow-hidden">
        <RailwayMap />
        {/* Asset detail panel overlays the map */}
        <AssetDetailPanel />
      </div>

      {/* Alerts panel — fixed right */}
      <AlertsPanel onAlertClick={handleAlertClick} />
    </div>
  );
}
