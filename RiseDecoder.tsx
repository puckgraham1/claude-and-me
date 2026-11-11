"use client";

import { useState } from "react";

const RISES = {
  splash: {
    label: "Splashy",
    eating: "Fast-moving insects",
    why: "A trout that throws water is chasing something that could get away, usually a caddis pupa rushing to the surface or an adult skittering off it.",
    flies: ["Sparkle Pupa #14–16", "Elk Hair Caddis, twitched", "Soft hackle, swung"],
  },
  sip: {
    label: "Quiet sip",
    eating: "Small bugs stuck in the film",
    why: "A quiet dimple, often with a bubble left behind, means an easy meal that is not going anywhere: spent spinners, small duns or midges.",
    flies: ["Rusty Spinner #16–18", "Parachute BWO #18–20", "Griffith's Gnat #20"],
  },
  head: {
    label: "Head and tail",
    eating: "Emergers and duns",
    why: "Seeing the nose, then the back, then the tail means the trout is rolling over insects right at the surface, usually mayflies hatching or just hatched.",
    flies: ["PMD Cripple #16–18", "Sparkle Dun #16–18", "X-Caddis #14–16"],
  },
  bulge: {
    label: "Bulge, no break",
    eating: "Nymphs just under the surface",
    why: "A boil or bulge without a break means the fish is taking rising nymphs or pupae a few inches down, before they reach the top.",
    flies: ["Soft hackle #14–16", "Unweighted Pheasant Tail", "Emerger in the film"],
  },
} as const;

type Key = keyof typeof RISES;

function RiseIcon({ k }: { k: Key }) {
  const s = { fill: "none", stroke: "#0F3D47" };
  if (k === "splash")
    return (
      <svg width="120" height="60" viewBox="0 0 120 60" aria-hidden="true">
        <ellipse cx="60" cy="40" rx="50" ry="12" {...s} strokeWidth="2" opacity="0.4" />
        <ellipse cx="60" cy="40" rx="30" ry="7" {...s} strokeWidth="2.5" />
        <path d="M48 36 l-8 -16 M56 34 l-2 -22 M64 34 l4 -20 M72 36 l10 -14" stroke="#4F97A0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="44" cy="16" r="2.5" fill="#4F97A0" /><circle cx="80" cy="18" r="2.5" fill="#4F97A0" />
      </svg>
    );
  if (k === "sip")
    return (
      <svg width="120" height="60" viewBox="0 0 120 60" aria-hidden="true">
        <ellipse cx="60" cy="40" rx="34" ry="8" {...s} strokeWidth="2" opacity="0.4" />
        <ellipse cx="60" cy="40" rx="14" ry="3.5" {...s} strokeWidth="2.5" />
        <circle cx="60" cy="39" r="2.5" fill="#fff" stroke="#0F3D47" />
      </svg>
    );
  if (k === "head")
    return (
      <svg width="120" height="60" viewBox="0 0 120 60" aria-hidden="true">
        <ellipse cx="60" cy="44" rx="46" ry="10" {...s} strokeWidth="2" opacity="0.4" />
        <path d="M24 44 C34 28 50 24 60 26 C72 28 84 34 92 44" stroke="#0F3D47" strokeWidth="2" fill="#B59A6E" />
        <path d="M88 42 l10 -10 l2 12 Z" fill="#6E6A45" /><path d="M54 27 l6 -8 l6 8" fill="#6E6A45" />
      </svg>
    );
  return (
    <svg width="120" height="60" viewBox="0 0 120 60" aria-hidden="true">
      <path d="M10 38 C40 38 44 24 60 24 C76 24 80 38 110 38" {...s} strokeWidth="2.5" />
      <path d="M10 46 h100" stroke="#0F3D47" strokeWidth="2" opacity="0.3" />
      <ellipse cx="60" cy="44" rx="18" ry="4" fill="#25646F" opacity="0.35" />
    </svg>
  );
}

export function RiseDecoder() {
  const [rise, setRise] = useState<Key>("head");
  const r = RISES[rise];
  return (
    <div className="stack" style={{ maxWidth: 560 }}>
      <div className="rise-grid" role="group" aria-label="Rise types">
        {(Object.keys(RISES) as Key[]).map((k) => (
          <button key={k} type="button" aria-pressed={rise === k} onClick={() => setRise(k)}>
            <RiseIcon k={k} />
            {RISES[k].label}
          </button>
        ))}
      </div>
      <div className="answer" aria-live="polite">
        <div>
          <div className="label">Likely eating</div>
          <div className="display" style={{ fontSize: 28 }}>{r.eating}</div>
        </div>
        <p style={{ margin: 0, fontSize: 15, color: "#dce6e4" }}>{r.why}</p>
        <div className="label">Tie on</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {r.flies.map((f) => <span key={f} className="pill">{f}</span>)}
        </div>
      </div>
    </div>
  );
}
