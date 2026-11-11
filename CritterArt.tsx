// SVG drawings for every fish and insect. Fish face right, ~100 units long, centered on y=0.

const FISH_GRAD: Record<string, [string, string, string]> = {
  "redband-trout": ["#4f5f34", "#c9a77a", "#f1ead8"],
  "brown-trout": ["#5c4421", "#c79a3e", "#f3e2a6"],
  "summer-steelhead": ["#3b5c66", "#cdd8da", "#f7f8f6"],
  "bull-trout": ["#3e4a39", "#8b9466", "#eadfc4"],
  "mountain-whitefish": ["#5e6b6e", "#b9c2c1", "#eef0ec"],
};

export function ArtDefs() {
  return (
    <defs>
      {Object.entries(FISH_GRAD).map(([slug, [a, b, c]]) => (
        <linearGradient key={slug} id={`g-${slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.5" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      ))}
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
    </defs>
  );
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function FishArt({ slug, ring = false }: { slug: string; ring?: boolean }) {
  const fill = `url(#g-${slug})`;
  const body =
    slug === "mountain-whitefish"
      ? "M0,0 C18,-13 62,-16 98,-5 C103,-2 103,2 98,5 C62,16 18,13 0,0Z"
      : "M0,0 C18,-17 62,-21 98,-6 C104,-3 104,3 98,6 C62,21 18,17 0,0Z";
  const spotStyle: Record<string, [string, number]> = {
    "redband-trout": ["#2a2a1e", 22],
    "brown-trout": ["#3b2410", 14],
    "summer-steelhead": ["#34444a", 10],
    "bull-trout": ["#f1d48a", 16],
    "mountain-whitefish": ["", 0],
  };
  const [spotColor, count] = spotStyle[slug] ?? ["#222", 12];
  const rnd = seeded(slug.length * 7);
  const spots: { x: number; y: number; halo: boolean }[] = [];
  for (let i = 0; i < count; i++) {
    const x = 12 + rnd() * 78;
    const y = -12 + rnd() * 16;
    if (Math.abs(y) > (x < 20 ? 6 : 12)) continue;
    spots.push({ x, y, halo: slug === "brown-trout" && i % 3 === 0 });
  }
  return (
    <g>
      {ring && <ellipse className="ring" cx="48" cy="0" rx="70" ry="30" fill="#fff" filter="url(#glow)" />}
      <path d="M4,0 L-22,-15 L-15,0 L-22,15Z" fill={fill} stroke="#00000030" />
      <path d="M40,-17 Q52,-30 64,-17Z" fill={fill} stroke="#00000030" />
      <path d="M48,14 Q54,24 62,14Z" fill="#e7d7b8" opacity="0.9" />
      <path d={body} fill={fill} stroke="#00000035" />
      {slug === "redband-trout" && <path d="M10,1 C40,-4 70,-4 94,0 C70,5 40,6 10,3Z" fill="#d4566a" opacity="0.75" />}
      {slug === "summer-steelhead" && <path d="M10,1 C40,-3 70,-3 94,0 C70,4 40,5 10,3Z" fill="#e7a3ad" opacity="0.45" />}
      {spots.map((s, i) =>
        s.halo ? (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r="2.6" fill="#f2e6c8" />
            <circle cx={s.x} cy={s.y} r="1.6" fill="#c2422c" />
          </g>
        ) : (
          <circle key={i} cx={s.x} cy={s.y} r={slug === "bull-trout" ? 1.9 : 1.4} fill={spotColor} />
        ),
      )}
      <path d="M82,-10 Q76,0 82,10" fill="none" stroke="#00000040" strokeWidth="1.2" />
      <circle cx="89" cy="-3" r="2.6" fill="#111" />
      <circle cx="89.8" cy="-3.8" r="0.8" fill="#fff" />
      <rect x="-26" y="-26" width="134" height="52" fill="transparent" />
    </g>
  );
}

export function InsectArt({ slug, ring = false, wingScale = 1 }: { slug: string; ring?: boolean; wingScale?: number }) {
  const w = `scale(1,${wingScale})`;
  let art: React.ReactNode = null;
  if (slug === "salmonfly" || slug === "golden-stonefly") {
    const big = slug === "salmonfly";
    art = (
      <>
        <ellipse transform={w} cx="-2" cy="-6" rx="20" ry="5" fill="#e9e3d4" opacity="0.75" stroke="#7d6f55" strokeWidth="0.6" />
        <ellipse transform={w} cx="-2" cy="6" rx="20" ry="5" fill="#e9e3d4" opacity="0.75" stroke="#7d6f55" strokeWidth="0.6" />
        <ellipse cx="0" cy="0" rx={big ? 18 : 14} ry="3.6" fill={big ? "#3a2b22" : "#b8892b"} />
        <ellipse cx="-2" cy="1.4" rx={big ? 15 : 11} ry="1.8" fill={big ? "#d4652a" : "#e2b13b"} />
        <path d="M16,-1 l10,-6 M16,1 l10,6" stroke="#3a2b22" strokeWidth="0.9" />
      </>
    );
  } else if (slug === "caddisfly") {
    art = (
      <>
        <path transform={w} d="M-12,0 L10,-9 L12,0Z" fill="#a98a5b" stroke="#5b4a30" strokeWidth="0.6" />
        <ellipse cx="2" cy="1" rx="9" ry="2.4" fill="#5d6b3a" />
        <path d="M10,0 q12,-10 24,-6 M10,1 q12,-6 24,0" stroke="#5b4a30" strokeWidth="0.7" fill="none" />
      </>
    );
  } else if (slug === "pale-morning-dun" || slug === "blue-winged-olive") {
    const pmd = slug === "pale-morning-dun";
    const k = pmd ? 1 : 0.8;
    art = (
      <>
        <path d={`M${-10 * k},0 q${-10 * k},-2 ${-18 * k},-8 M${-10 * k},0 q${-10 * k},2 ${-18 * k},-3`} stroke="#7b6d4a" strokeWidth="0.7" fill="none" />
        <ellipse cx="0" cy="0" rx={10 * k} ry={2.4 * k} fill={pmd ? "#e8c96a" : "#6b7c55"} />
        <path d={`M-2,-1 L${2 * k},${-18 * k} L${7 * k},${-16 * k} L4,-1Z`} fill={pmd ? "#f3edd2" : "#a9b1b8"} stroke="#77706080" strokeWidth="0.6" />
      </>
    );
  } else if (slug === "midges") {
    art = (
      <>
        {[[0, 0], [-10, -8], [9, -10], [-4, 10], [12, 6], [-14, 4]].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="3.2" ry="1.1" fill="#2c3436" />
            <ellipse transform={`translate(${x - 1} ${y - 2}) ${w}`} rx="2.4" ry="1.2" fill="#dfe6e8" opacity="0.85" />
          </g>
        ))}
      </>
    );
  }
  return (
    <g>
      {ring && <circle className="ring" r="24" fill="#fff" filter="url(#glow)" />}
      {art}
      <circle r="26" fill="transparent" />
    </g>
  );
}

export function NymphArt({ ring = false }: { ring?: boolean }) {
  return (
    <g>
      {ring && <circle className="ring" r="26" fill="#fff" filter="url(#glow)" />}
      <path d="M-18,-6 l-8,-6 M-18,6 l-8,6 M-6,-7 l-2,-9 M-6,7 l-2,9 M6,-7 l3,-9 M6,7 l3,9" stroke="#2a2018" strokeWidth="1.4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={-14 + i * 6} cy="0" rx="4.5" ry={6 - i * 0.4} fill={i % 2 ? "#3a2c20" : "#2c2118"} />
      ))}
      <ellipse cx="15" cy="0" rx="5" ry="5" fill="#2c2118" />
      <path d="M19,-2 l9,-6 M19,2 l9,6" stroke="#2a2018" strokeWidth="1" />
      <circle r="26" fill="transparent" />
    </g>
  );
}

/** Small standalone portrait used on species pages and lists. */
export function Portrait({ slug, kind, size = 96 }: { slug: string; kind: "fish" | "insect"; size?: number }) {
  return (
    <svg width={size} height={size * 0.62} viewBox={kind === "fish" ? "-30 -28 140 56" : "-32 -22 64 40"} aria-hidden="true">
      <ArtDefs />
      {kind === "fish" ? <FishArt slug={slug} /> : <InsectArt slug={slug} />}
    </svg>
  );
}
