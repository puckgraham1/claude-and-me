// The Read the Rise logo mark: rise rings with a mayfly at the center.
export function RiseMark({ size = 32, water = "#0f3d47", ink = "#f1ebdd", accent = "#d4652a" }: {
  size?: number; water?: string; ink?: string; accent?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 640 640" aria-hidden="true">
      <circle cx="320" cy="320" r="320" fill={water} />
      <g fill="none" stroke={ink} strokeLinecap="round">
        <ellipse cx="320" cy="392" rx="250" ry="74" strokeWidth="14" opacity="0.28" />
        <ellipse cx="320" cy="392" rx="186" ry="55" strokeWidth="16" opacity="0.5" />
        <ellipse cx="320" cy="392" rx="122" ry="36" strokeWidth="18" opacity="0.8" />
      </g>
      <path d="M262 384 C236 376 214 362 196 342 M262 386 C232 384 208 378 186 366" stroke={ink} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M258 386 C290 380 330 376 372 380 C384 381 390 386 384 392 C350 398 300 398 258 392 Z" fill={ink} />
      <path d="M300 380 C304 330 318 268 340 222 C352 246 356 300 352 378 Z" fill={ink} />
      <circle cx="380" cy="384" r="8" fill={accent} />
    </svg>
  );
}
