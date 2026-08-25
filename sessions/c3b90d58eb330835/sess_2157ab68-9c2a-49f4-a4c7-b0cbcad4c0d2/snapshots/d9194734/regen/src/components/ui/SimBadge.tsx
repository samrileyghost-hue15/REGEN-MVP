// Simulated data notice — shown throughout the MVP to indicate non-real data
export function SimBadge() {
  return (
    <span className="sim-notice">
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      SIMULATED DATA — MVP ONLY
    </span>
  );
}
