import type { Asset, RailwayLine, Station } from '../types';

export const RAILWAY_LINES: RailwayLine[] = [
  {
    id: 'north-south',
    name: 'North–South Line',
    color: '#00FFC6',
    stations: [],
  },
  {
    id: 'east-west',
    name: 'East–West Line',
    color: '#00D1FF',
    stations: [],
  },
  {
    id: 'loop',
    name: 'City Loop',
    color: '#FFB020',
    stations: [],
  },
];

// SVG viewBox: 0 0 900 520
export const STATIONS: Station[] = [
  { id: 's-pretoria',     name: 'Pretoria',          x: 140,  y: 60,  lineId: 'north-south' },
  { id: 's-centurion',    name: 'Centurion',         x: 140,  y: 150, lineId: 'north-south' },
  { id: 's-midrand',      name: 'Midrand',           x: 140,  y: 245, lineId: 'north-south' },
  { id: 's-marlboro',     name: 'Marlboro',          x: 140,  y: 340, lineId: 'north-south' },
  { id: 's-sandton',      name: 'Sandton',           x: 140,  y: 435, lineId: 'north-south' },
  { id: 's-rosebank',     name: 'Rosebank',          x: 280,  y: 435, lineId: 'east-west'   },
  { id: 's-park',         name: 'Park',              x: 420,  y: 435, lineId: 'east-west'   },
  { id: 's-rhodesfield',  name: 'Rhodesfield',       x: 560,  y: 435, lineId: 'east-west'   },
  { id: 's-or-tambo',     name: 'O.R. Tambo',        x: 700,  y: 435, lineId: 'east-west'   },
  { id: 's-hatfield',     name: 'Hatfield',          x: 420,  y: 60,  lineId: 'loop'        },
];

export const MOCK_ASSETS: Asset[] = [
  // North–South sections
  {
    id: 'B12', name: 'Track B12', type: 'track',
    location: 'Centurion–Midrand Section, km 4.2',
    lineId: 'north-south', severity: 'critical',
    lastInspection: '2024-03-15', installDate: '2018-06-01',
    description: 'High-speed mainline track section between Centurion and Midrand stations.',
    mapX: 140, mapY: 198,
  },
  {
    id: 'A3', name: 'Track A3', type: 'track',
    location: 'Pretoria–Centurion Section, km 2.8',
    lineId: 'north-south', severity: 'warning',
    lastInspection: '2024-04-01', installDate: '2018-06-01',
    description: 'Track section approaching Centurion from Pretoria.',
    mapX: 140, mapY: 105,
  },
  {
    id: 'C7', name: 'Switch C7', type: 'switch',
    location: 'Midrand Junction',
    lineId: 'north-south', severity: 'healthy',
    lastInspection: '2024-04-20', installDate: '2019-03-01',
    description: 'Point switch assembly at Midrand junction.',
    mapX: 140, mapY: 245,
  },
  {
    id: 'S04', name: 'Bridge S04', type: 'bridge',
    location: 'Jukskei River Crossing',
    lineId: 'north-south', severity: 'warning',
    lastInspection: '2024-01-10', installDate: '2017-11-15',
    description: 'Steel-girder rail bridge over Jukskei River.',
    mapX: 140, mapY: 290,
  },
  {
    id: 'D8', name: 'Sleeper Section D8', type: 'sleeper',
    location: 'Marlboro–Sandton Section, km 1.9',
    lineId: 'north-south', severity: 'healthy',
    lastInspection: '2024-05-01', installDate: '2020-08-12',
    description: 'Composite sleeper panel installation.',
    mapX: 140, mapY: 388,
  },
  // East–West sections
  {
    id: 'E2', name: 'Track E2', type: 'track',
    location: 'Sandton–Rosebank Section',
    lineId: 'east-west', severity: 'healthy',
    lastInspection: '2024-04-15', installDate: '2018-06-01',
    mapX: 210, mapY: 435,
  },
  {
    id: 'F5', name: 'Track F5', type: 'track',
    location: 'Rosebank–Park Section',
    lineId: 'east-west', severity: 'info',
    lastInspection: '2024-03-28', installDate: '2018-06-01',
    mapX: 350, mapY: 435,
  },
  {
    id: 'G9', name: 'Switch G9', type: 'switch',
    location: 'Park Station Junction',
    lineId: 'east-west', severity: 'healthy',
    lastInspection: '2024-05-05', installDate: '2019-09-01',
    mapX: 420, mapY: 435,
  },
  {
    id: 'H1', name: 'Track H1', type: 'track',
    location: 'Park–Rhodesfield Section',
    lineId: 'east-west', severity: 'healthy',
    lastInspection: '2024-04-22', installDate: '2018-06-01',
    mapX: 490, mapY: 435,
  },
  {
    id: 'J3', name: 'Bridge J3', type: 'bridge',
    location: 'N3 Highway Crossing',
    lineId: 'east-west', severity: 'info',
    lastInspection: '2024-02-15', installDate: '2017-09-01',
    mapX: 630, mapY: 435,
  },
  // Additional
  {
    id: 'K2', name: 'Track K2', type: 'track',
    location: 'Hatfield–Park Loop Section',
    lineId: 'loop', severity: 'healthy',
    lastInspection: '2024-04-30', installDate: '2018-06-01',
    mapX: 420, mapY: 245,
  },
  {
    id: 'L7', name: 'Switch L7', type: 'switch',
    location: 'Marlboro Interchange',
    lineId: 'north-south', severity: 'healthy',
    lastInspection: '2024-05-10', installDate: '2020-01-15',
    mapX: 200, mapY: 340,
  },
  {
    id: 'M4', name: 'Track M4', type: 'track',
    location: 'OR Tambo Approach',
    lineId: 'east-west', severity: 'healthy',
    lastInspection: '2024-04-08', installDate: '2018-06-01',
    mapX: 700, mapY: 390,
  },
  {
    id: 'N6', name: 'Sleeper Section N6', type: 'sleeper',
    location: 'Centurion Station Zone',
    lineId: 'north-south', severity: 'healthy',
    lastInspection: '2024-05-02', installDate: '2021-03-20',
    mapX: 195, mapY: 150,
  },
  {
    id: 'P1', name: 'Bridge P1', type: 'bridge',
    location: 'Pretoria Approach Viaduct',
    lineId: 'north-south', severity: 'info',
    lastInspection: '2024-01-25', installDate: '2017-08-01',
    mapX: 195, mapY: 60,
  },
  {
    id: 'Q5', name: 'Track Q5', type: 'track',
    location: 'Rhodesfield–OR Tambo',
    lineId: 'east-west', severity: 'healthy',
    lastInspection: '2024-04-18', installDate: '2018-06-01',
    mapX: 630, mapY: 480,
  },
  {
    id: 'R3', name: 'Switch R3', type: 'switch',
    location: 'Sandton North Junction',
    lineId: 'north-south', severity: 'healthy',
    lastInspection: '2024-05-08', installDate: '2019-07-01',
    mapX: 195, mapY: 435,
  },
  {
    id: 'T8', name: 'Track T8', type: 'track',
    location: 'Midrand–Marlboro Section',
    lineId: 'north-south', severity: 'healthy',
    lastInspection: '2024-04-25', installDate: '2018-06-01',
    mapX: 195, mapY: 292,
  },
  {
    id: 'U2', name: 'Sleeper Section U2', type: 'sleeper',
    location: 'Park Station Zone',
    lineId: 'east-west', severity: 'healthy',
    lastInspection: '2024-05-05', installDate: '2020-11-10',
    mapX: 420, mapY: 480,
  },
  {
    id: 'V9', name: 'Track V9', type: 'track',
    location: 'Rosebank–Sandton Approach',
    lineId: 'east-west', severity: 'healthy',
    lastInspection: '2024-04-12', installDate: '2018-06-01',
    mapX: 210, mapY: 480,
  },
];
