/**
 * RegenLogo — SVG recreation of the Regen brand mark.
 *
 * The logo consists of:
 *  - A railway track perspective (dark navy, converging rails with sleepers)
 *  - A sweeping arc / "R" stroke in lime-green → teal gradient
 *  - The wordmark "Regen" (dark navy)
 *  - Optional tagline "BUILT TO LAST. DESIGNED TO HEAL."
 *
 * Props:
 *   width   — overall width (height scales proportionally, aspect ≈ 2.4:1)
 *   variant — "full"    shows track + wordmark + tagline
 *             "mark"    track + wordmark only (no tagline)
 *             "icon"    track mark only (square-ish, for sidebar)
 *   light   — if true uses white/light wordmark (for dark backgrounds)
 */

interface RegenLogoProps {
  width?: number;
  variant?: 'full' | 'mark' | 'icon';
  light?: boolean;
  className?: string;
}

export function RegenLogo({
  width = 180,
  variant = 'mark',
  light = false,
  className,
}: RegenLogoProps) {
  // Aspect ratios per variant
  const aspectMap = { full: 2.8, mark: 2.4, icon: 1.1 };
  const aspect = aspectMap[variant];
  const height = Math.round(width / aspect);

  const navyColor   = light ? '#FFFFFF' : '#1B2A4A';
  const dimColor    = light ? 'rgba(255,255,255,0.55)' : '#5A6A80';
  const gradId      = `regen-arc-grad-${variant}`;

  if (variant === 'icon') {
    // Compact: track mark + "R" only, square crop
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Regen logo mark"
        role="img"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#8BC34A" />
            <stop offset="50%"  stopColor="#4CAF7D" />
            <stop offset="100%" stopColor="#00897B" />
          </linearGradient>
        </defs>
        {/* Track — two converging rails with sleepers */}
        {/* Left rail */}
        <path d="M18 52 L28 18" stroke={navyColor} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Right rail */}
        <path d="M30 52 L35 18" stroke={navyColor} strokeWidth="2.5" strokeLinecap="round"/>
        {/* Sleepers */}
        {[48, 42, 36, 29, 23].map((y, i) => {
          const progress = i / 4;
          const lx = 18 + (28 - 18) * (1 - (52 - y) / 34);
          const rx = 30 + (35 - 30) * (1 - (52 - y) / 34);
          return (
            <line key={y}
              x1={lx - 1} y1={y} x2={rx + 1} y2={y}
              stroke={navyColor}
              strokeWidth={2 - progress * 0.8}
              strokeLinecap="round"
              opacity={0.85 - progress * 0.2}
            />
          );
        })}
        {/* Sweeping arc */}
        <path
          d="M12 38 C10 20, 20 8, 36 12 C44 14, 44 22, 38 26 C34 28, 30 27, 30 18"
          stroke={`url(#${gradId})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arc speed lines */}
        <path d="M10 42 C8 38, 9 34, 12 32" stroke={`url(#${gradId})`} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6"/>
        <path d="M8 46 C6 41, 7 36, 11 34" stroke={`url(#${gradId})`} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.35"/>
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={variant === 'full' ? '0 0 280 100' : '0 0 240 100'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Regen — Railway Infrastructure Monitoring"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8BC34A" />
          <stop offset="45%"  stopColor="#4CAF7D" />
          <stop offset="100%" stopColor="#007A6E" />
        </linearGradient>
      </defs>

      {/* ── Track mark (left side) ───────────────────────────── */}
      {/* Left rail */}
      <path d="M24 78 L40 22" stroke={navyColor} strokeWidth="3" strokeLinecap="round"/>
      {/* Right rail */}
      <path d="M40 78 L50 22" stroke={navyColor} strokeWidth="3" strokeLinecap="round"/>
      {/* Sleepers — 6 of them, perspective-scaled */}
      {[72, 64, 55, 46, 37, 28].map((y, i) => {
        const t = i / 5;                // 0 = bottom (wide), 1 = top (narrow)
        const lx = 24 + (40 - 24) * t;
        const rx = 40 + (50 - 40) * t;
        return (
          <line key={y}
            x1={lx - 1} y1={y} x2={rx + 1} y2={y}
            stroke={navyColor}
            strokeWidth={2.5 - t * 1.2}
            strokeLinecap="round"
            opacity={0.9 - t * 0.25}
          />
        );
      })}

      {/* ── Sweeping arc / stylised "R" stroke ──────────────── */}
      {/* Main arc sweep — large curve over the track */}
      <path
        d="M14 68 C10 42, 22 10, 52 14 C66 16, 68 30, 58 38 C52 43, 43 42, 42 28"
        stroke={`url(#${gradId})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Speed line 1 */}
      <path
        d="M11 74 C8 64, 10 54, 15 48"
        stroke={`url(#${gradId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Speed line 2 */}
      <path
        d="M8 80 C4 68, 6 56, 12 50"
        stroke={`url(#${gradId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />

      {/* ── Wordmark "Regen" ─────────────────────────────────── */}
      {/* "R" — the arc provides the top curve, we render the letterform */}
      <text
        x="58"
        y="70"
        fontFamily="'Segoe UI', Arial, sans-serif"
        fontSize="52"
        fontWeight="700"
        fill={navyColor}
        letterSpacing="-1"
      >
        egen
      </text>
      {/* Uppercase R that merges with the arc */}
      <text
        x="44"
        y="70"
        fontFamily="'Segoe UI', Arial, sans-serif"
        fontSize="52"
        fontWeight="700"
        fill={navyColor}
        letterSpacing="-1"
      >
        R
      </text>

      {/* ── Tagline ──────────────────────────────────────────── */}
      {variant === 'full' && (
        <text
          x="46"
          y="90"
          fontFamily="'Segoe UI', Arial, sans-serif"
          fontSize="9"
          fontWeight="500"
          fill={dimColor}
          letterSpacing="2"
        >
          BUILT TO LAST. DESIGNED TO HEAL.
        </text>
      )}
    </svg>
  );
}
