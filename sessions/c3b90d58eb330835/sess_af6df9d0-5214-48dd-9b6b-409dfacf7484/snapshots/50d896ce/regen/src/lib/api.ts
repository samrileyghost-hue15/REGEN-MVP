/**
 * Thin fetch wrapper for the Express API.
 * All requests go to /api/* — Vite proxies them to http://localhost:3001 in dev.
 * In production the Express server serves the built frontend too, so the same
 * origin works without any proxy.
 */

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login: (role: string) =>
    request<{ user: import('../types').User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),
  listUsers: () =>
    request<import('../types').User[]>('/auth/users'),
};

// ── Assets ─────────────────────────────────────────────────────────────────
export const assetsApi = {
  list: () =>
    request<import('../types').Asset[]>('/assets'),
  get: (id: string) =>
    request<import('../types').Asset>(`/assets/${id}`),
  patch: (id: string, patch: Partial<import('../types').Asset>) =>
    request<import('../types').Asset>(`/assets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
};

// ── Sensors ────────────────────────────────────────────────────────────────
export const sensorsApi = {
  list: (assetId?: string) =>
    request<import('../types').Sensor[]>(assetId ? `/sensors?assetId=${assetId}` : '/sensors'),
  get: (id: string) =>
    request<import('../types').Sensor>(`/sensors/${id}`),
  patch: (id: string, patch: Partial<import('../types').Sensor>) =>
    request<import('../types').Sensor>(`/sensors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
  readings: (id: string) =>
    request<import('../types').SensorReading[]>(`/sensors/${id}/readings`),
};

// ── Alerts ─────────────────────────────────────────────────────────────────
export const alertsApi = {
  list: (params?: { assetId?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<import('../types').Alert[]>(`/alerts${q ? '?' + q : ''}`);
  },
  create: (alert: import('../types').Alert) =>
    request<import('../types').Alert>('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    }),
  acknowledge: (id: string, by: string) =>
    request<import('../types').Alert>(`/alerts/${id}/acknowledge`, {
      method: 'PATCH',
      body: JSON.stringify({ by }),
    }),
  resolve: (id: string) =>
    request<import('../types').Alert>(`/alerts/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    }),
};

// ── Work Orders ────────────────────────────────────────────────────────────
export const workOrdersApi = {
  list: (params?: { assetId?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<import('../types').WorkOrder[]>(`/work-orders${q ? '?' + q : ''}`);
  },
  create: (wo: import('../types').WorkOrder) =>
    request<import('../types').WorkOrder>('/work-orders', {
      method: 'POST',
      body: JSON.stringify(wo),
    }),
  patch: (id: string, patch: Partial<import('../types').WorkOrder>) =>
    request<import('../types').WorkOrder>(`/work-orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }),
};

// ── Predictions ────────────────────────────────────────────────────────────
export const predictionsApi = {
  list: (assetId?: string) =>
    request<import('../types').Prediction[]>(assetId ? `/predictions?assetId=${assetId}` : '/predictions'),
};

// ── Maintenance records ────────────────────────────────────────────────────
export const maintenanceApi = {
  list: (assetId?: string) =>
    request<import('../types').MaintenanceRecord[]>(assetId ? `/maintenance?assetId=${assetId}` : '/maintenance'),
};

// ── Network ────────────────────────────────────────────────────────────────
export const networkApi = {
  lines: () =>
    request<import('../types').RailwayLine[]>('/network/lines'),
  stations: () =>
    request<import('../types').Station[]>('/network/stations'),
};
