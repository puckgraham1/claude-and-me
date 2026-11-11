"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { River, Species } from "@/data/types";
import { MONTHS, MONTHS_FULL } from "@/data/types";
import { ArtDefs, FishArt, InsectArt, NymphArt } from "./CritterArt";

type Actor = {
  slug: string;
  label?: string;
  type?: "nymph";
  x: number; y: number; s: number;
  // fish swim between minX and maxX; insects fly or drift
  v?: number; minX?: number; maxX?: number; dir?: number;
  motion?: "fly" | "drift";
};

// Positions in an 800×560 scene. Tuned for the Deschutes; other rivers can reuse or adjust.
const ACTORS: Actor[] = [
  { slug: "redband-trout", x: 200, y: 232, s: 1.05, v: 0.5, minX: 60, maxX: 520, dir: 1 },
  { slug: "redband-trout", label: "Redband (juvenile)", x: 650, y: 196, s: 0.75, v: 0.4, minX: 540, maxX: 740, dir: -1 },
  { slug: "brown-trout", x: 560, y: 372, s: 1.2, v: 0.35, minX: 380, maxX: 720, dir: -1 },
  { slug: "summer-steelhead", x: 330, y: 318, s: 1.45, v: 0.45, minX: 90, maxX: 620, dir: 1 },
  { slug: "bull-trout", x: 160, y: 420, s: 1.2, v: 0.3, minX: 40, maxX: 380, dir: 1 },
  { slug: "mountain-whitefish", x: 480, y: 456, s: 0.9, v: 0.5, minX: 260, maxX: 720, dir: -1 },
  { slug: "salmonfly", x: 300, y: 92, s: 1.6, motion: "fly" },
  { slug: "salmonfly", label: "Salmonfly nymph", type: "nymph", x: 360, y: 482, s: 1.3 },
  { slug: "golden-stonefly", x: 470, y: 112, s: 1.4, motion: "fly" },
  { slug: "caddisfly", x: 150, y: 120, s: 1.6, motion: "fly" },
  { slug: "caddisfly", x: 690, y: 104, s: 1.4, motion: "fly" },
  { slug: "pale-morning-dun", x: 520, y: 150, s: 1.7, motion: "drift" },
  { slug: "blue-winged-olive", x: 360, y: 151, s: 1.6, motion: "drift" },
  { slug: "midges", x: 610, y: 82, s: 1.4, motion: "fly" },
];

function isActive(sp: Species, month: number | null, nymph = false) {
  if (month === null || nymph) return true;
  return sp.active.includes(month) || sp.peak.includes(month);
}

export function RiverExplorer({ river }: { river: River }) {
  const bySlug = useMemo(() => Object.fromEntries(river.species.map((s) => [s.slug, s])), [river]);
  const [month, setMonth] = useState<number | null>(null);
  const [selected, setSelected] = useState<string>(river.species[0].slug);
  const refs = useRef<(SVGGElement | null)[]>([]);
  const wingRefs = useRef<(SVGGElement | null)[]>([]);

  // Set the current month on first load (client only, so the server render stays stable).
  useEffect(() => setMonth(new Date().getMonth()), []);

  // Keep the selected month chip in view on narrow screens.
  const monthsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const row = monthsRef.current;
    const btn = row?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]');
    if (row && btn) row.scrollTo({ left: btn.offsetLeft - row.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [month]);

  // Animation loop: moves fish and insects by writing transforms directly (no re-renders).
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = ACTORS.map((a) => ({ x: a.x, dir: a.dir ?? 1 }));
    let raf = 0;
    const tick = (t: number) => {
      const tt = t / 1000;
      ACTORS.forEach((a, i) => {
        const el = refs.current[i];
        if (!el) return;
        const ph = i * 1.7;
        let x = a.x, y = a.y, flip = 1, rot = 0;
        const sp = bySlug[a.slug];
        if (sp?.kind === "fish") {
          const st = state[i];
          if (!reduce) {
            st.x += (a.v ?? 0.4) * st.dir;
            if (st.x > (a.maxX ?? 760)) st.dir = -1;
            if (st.x < (a.minX ?? 40)) st.dir = 1;
          }
          x = st.x; y = a.y + Math.sin(tt * 0.8 + ph) * 5; flip = st.dir; rot = Math.sin(tt * 2 + ph) * 2;
        } else if (a.type === "nymph") {
          x = a.x + (reduce ? 0 : Math.sin(tt * 0.3 + ph) * 12);
        } else if (a.motion === "fly") {
          x = a.x + (reduce ? 0 : Math.sin(tt * 0.6 + ph) * 34);
          y = a.y + (reduce ? 0 : Math.sin(tt * 1.3 + ph) * 12);
          flip = Math.cos(tt * 0.6 + ph) >= 0 ? 1 : -1;
          const wing = wingRefs.current[i];
          if (wing && !reduce) wing.setAttribute("transform", `scale(1,${0.6 + 0.4 * Math.abs(Math.sin(tt * 18 + i))})`);
        } else if (a.motion === "drift") {
          x = reduce ? a.x : ((a.x + tt * 12) % 860) - 30;
          y = a.y + Math.sin(tt * 2 + ph) * 1.5;
        }
        el.setAttribute("transform", `translate(${x},${y}) rotate(${rot}) scale(${a.s * flip},${a.s})`);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bySlug]);

  const sel = bySlug[selected];
  const hatching = river.species
    .filter((s) => s.kind === "insect" && month !== null && (s.active.includes(month) || s.peak.includes(month)))
    .sort((a, b) => Number(b.peak.includes(month!)) - Number(a.peak.includes(month!)));

  return (
    <div className="grid-2">
      <div className="stack">
        <div className="months" ref={monthsRef} role="group" aria-label="Filter by month">
          <button type="button" aria-pressed={month === null} onClick={() => setMonth(null)} style={{ minWidth: 80 }}>
            All year
          </button>
          {MONTHS.map((m, i) => (
            <button key={m} type="button" aria-pressed={month === i} onClick={() => setMonth(i)}>
              {m}
            </button>
          ))}
        </div>

        <div className="scene">
          <svg viewBox="0 0 800 560" role="group" aria-label={`Cross-section of the ${river.name}. Select a fish or insect.`}>
            <ArtDefs />
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f3d9b5" /><stop offset="1" stopColor="#cfe2e4" />
              </linearGradient>
              <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#4f97a0" /><stop offset=".45" stopColor="#25646f" /><stop offset="1" stopColor="#0d343d" />
              </linearGradient>
              <linearGradient id="bed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#5a5445" /><stop offset="1" stopColor="#2f2b23" />
              </linearGradient>
            </defs>
            <rect width="800" height="152" fill="url(#sky)" />
            <path d="M0 100 L0 36 L70 32 L96 54 L180 48 L206 22 L290 28 L320 62 L0 110Z" fill="#8a6f55" />
            <path d="M0 112 L0 76 L110 70 L150 90 L250 84 L300 104 L0 120Z" fill="#6f5843" />
            <path d="M800 100 L800 30 L730 28 L706 50 L620 46 L594 18 L510 26 L480 60 L800 110Z" fill="#8a6f55" />
            <path d="M800 114 L800 72 L690 68 L650 90 L550 84 L500 104 L800 120Z" fill="#6f5843" />
            <path d="M0 152 L0 112 C80 104 160 124 220 140 L240 154Z" fill="#9a8c5c" />
            <path d="M800 152 L800 114 C720 106 640 124 580 140 L560 154Z" fill="#9a8c5c" />
            <g>
              <rect x="80" y="78" width="6" height="44" fill="#5a4630" />
              <circle cx="83" cy="72" r="24" fill="#6c8445" /><circle cx="66" cy="84" r="16" fill="#5f773b" /><circle cx="100" cy="82" r="17" fill="#7a9050" />
            </g>
            <rect y="152" width="800" height="408" fill="url(#water)" />
            <path d="M0 152 Q 25 147 50 152 T 100 152 T 150 152 T 200 152 T 250 152 T 300 152 T 350 152 T 400 152 T 450 152 T 500 152 T 550 152 T 600 152 T 650 152 T 700 152 T 750 152 T 800 152" fill="none" stroke="#d8eef0" strokeWidth="2" opacity=".8" />
            <g fontFamily="IBM Plex Mono, monospace" fontSize="12" fill="#cfe7e8" opacity=".75">
              <text x="14" y="176">SURFACE</text>
              <text x="14" y="300">MID-COLUMN</text>
              <text x="14" y="470">BOTTOM</text>
            </g>
            <path d="M0 560 L0 500 C100 488 190 504 280 494 C380 484 470 506 580 496 C680 486 740 498 800 490 L800 560Z" fill="url(#bed)" />
            <g fill="#3d382e">
              <ellipse cx="120" cy="500" rx="46" ry="20" /><ellipse cx="350" cy="496" rx="56" ry="22" fill="#46402f" />
              <ellipse cx="580" cy="500" rx="50" ry="19" /><ellipse cx="720" cy="494" rx="40" ry="17" fill="#46402f" />
            </g>
            <g stroke="#3f6b45" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85">
              <path d="M420 494 q-6 -30 3 -60 q8 -22 -2 -44" /><path d="M650 496 q-8 -34 5 -66" />
            </g>

            {ACTORS.map((a, i) => {
              const sp = bySlug[a.slug];
              if (!sp) return null;
              const active = isActive(sp, month, a.type === "nymph");
              const label = a.label ?? sp.name;
              return (
                <g
                  key={i}
                  className={`critter${selected === a.slug ? " selected" : ""}${active ? "" : " dim"}`}
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                  aria-pressed={selected === a.slug}
                  onClick={() => setSelected(a.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(a.slug); }
                  }}
                >
                  <title>{label}</title>
                  <g ref={(el) => { refs.current[i] = el; }} transform={`translate(${a.x},${a.y}) scale(${a.s})`}>
                    {sp.kind === "fish" ? (
                      <FishArt slug={a.slug} ring />
                    ) : a.type === "nymph" ? (
                      <NymphArt ring />
                    ) : (
                      <g ref={(el) => { wingRefs.current[i] = el; }}>
                        <InsectArt slug={a.slug} ring />
                      </g>
                    )}
                  </g>
                </g>
              );
            })}
          </svg>
          <div className="scene-hint">Tap a fish or insect</div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: "12px 14px 4px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 className="section-title">{month === null ? "Pick a month to see what's hatching" : `Hatching in ${MONTHS_FULL[month]}`}</h2>
            {month !== null && <span className="muted" style={{ fontSize: 12 }}>{hatching.length} insects</span>}
          </div>
          {month !== null && hatching.length === 0 && <p className="muted" style={{ padding: "0 14px 12px", margin: 0 }}>No major hatches this month.</p>}
          {month !== null &&
            hatching.map((s) => (
              <Link key={s.slug} href={`/${river.slug}/${s.slug}`} className="row-link">
                <span className="dot" style={{ background: s.color }} />
                <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  <span className="muted" style={{ fontSize: 12 }}>{s.flies[0]?.name}</span>
                </span>
                <span className={`chip${s.peak.includes(month) ? " peak" : ""}`}>{s.peak.includes(month) ? "Peak" : "Active"}</span>
              </Link>
            ))}
        </div>
      </div>

      {sel && (
        <aside className="card" aria-live="polite" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, position: "sticky", top: 72 }}>
          <div className="eyebrow">{sel.kind === "fish" ? "Fish" : "Insect"}</div>
          <h2 className="display" style={{ fontSize: 30 }}>{sel.name}</h2>
          <div className="mono muted" style={{ fontSize: 12, fontStyle: "italic" }}>
            {sel.scientific}{sel.aka ? ` · ${sel.aka}` : ""}
          </div>
          <div className="chips">
            {sel.tags.map((t) => <span key={t.label} className={`chip ${t.tone ?? ""}`}>{t.label}</span>)}
            {month !== null && !isActive(sel, month) && <span className="chip">Quiet in {MONTHS[month]}</span>}
          </div>
          <p style={{ margin: 0, fontSize: 15 }}>{sel.summary}</p>
          {sel.flies.length > 0 ? (
            <div className="stack" style={{ gap: 6 }}>
              <h3 className="section-title" style={{ fontSize: 13 }}>Top flies</h3>
              {sel.flies.slice(0, 3).map((f) => (
                <div key={f.name} className="card fly">
                  <div><div className="stage">{f.stage}</div><b>{f.name}</b></div>
                  <div className="size">#{f.size}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="note">{sel.noFliesNote}</div>
          )}
          <Link href={`/${river.slug}/${sel.slug}`} className="btn">
            Full guide: flies, life cycle, methods
          </Link>
        </aside>
      )}
    </div>
  );
}
