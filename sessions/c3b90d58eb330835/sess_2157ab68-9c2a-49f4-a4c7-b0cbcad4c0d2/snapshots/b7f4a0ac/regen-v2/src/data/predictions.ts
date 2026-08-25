import type { Prediction } from '../types';

export const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: 'PRD-001',
    assetId: 'B12',
    sensorId: 'NFC_B12_001',
    riskLevel: 'high',
    issue: 'Track degradation — progressive rail fatigue',
    rulDays: 18,
    failureProbability: 78,
    recommendedAction: 'Immediate inspection of Track B12. Verify rail fastening and ballast condition. Schedule repair within 72 hours.',
    generatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'PRD-002',
    assetId: 'A3',
    sensorId: 'NFC_A3_001',
    riskLevel: 'medium',
    issue: 'Elevated vibration — possible ballast deterioration',
    rulDays: 45,
    failureProbability: 42,
    recommendedAction: 'Schedule planned inspection of Track A3 within 2 weeks. Check ballast profile.',
    generatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 'PRD-003',
    assetId: 'S04',
    sensorId: 'STR_S04_001',
    riskLevel: 'medium',
    issue: 'Bridge structural strain — load concentration',
    rulDays: 90,
    failureProbability: 28,
    recommendedAction: 'Perform visual bridge inspection within 30 days. Review load distribution.',
    generatedAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 'PRD-004',
    assetId: 'F5',
    sensorId: 'NFC_F5_001',
    riskLevel: 'low',
    issue: 'Minor vibration increase — rail joint wear',
    rulDays: 120,
    failureProbability: 15,
    recommendedAction: 'Include in next scheduled maintenance round. Inspect rail joints.',
    generatedAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: 'PRD-005',
    assetId: 'P1',
    riskLevel: 'low',
    issue: 'Viaduct — minor vibration pattern',
    rulDays: 180,
    failureProbability: 8,
    recommendedAction: 'Continue monitoring. Include in semi-annual inspection.',
    generatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
];

export function getPredictionForAsset(assetId: string): Prediction | undefined {
  return MOCK_PREDICTIONS.find(p => p.assetId === assetId);
}
