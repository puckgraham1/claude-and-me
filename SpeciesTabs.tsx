"use client";

import { useState } from "react";
import type { Species } from "@/data/types";
import { MONTHS } from "@/data/types";

const TABS = [
  ["flies", "Best flies"],
  ["cycle", "Life cycle"],
  ["methods", "Methods"],
  ["facts", "ID & facts"],
] as const;

// All panels are rendered in the HTML (just hidden), so search engines see every section.
export function SpeciesTabs({ sp, regulationsNote }: { sp: Species; regulationsNote: string }) {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("flies");
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="tabs" role="tablist" aria-label={`${sp.name} sections`}>
        {TABS.map(([id, label]) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            type="button"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
          >
            {label === "ID & facts" && sp.kind === "fish" ? "Know the fish" : label}
          </button>
        ))}
      </div>

      <section id="panel-flies" role="tabpanel" aria-labelledby="tab-flies" hidden={tab !== "flies"} style={{ padding: 16 }}>
        <h2 className="section-title" style={{ marginBottom: 10 }}>Best flies for {sp.name.toLowerCase()} on this river</h2>
        {sp.flies.length > 0 ? (
          <div className="stack" style={{ gap: 8 }}>
            {sp.flies.map((f) => (
              <div key={f.name} className="card fly">
                <div><div className="stage">{f.stage}</div><b>{f.name}</b></div>
                <div className="size">#{f.size}</div>
                <div className="when">{f.when}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="note">{sp.noFliesNote}</div>
        )}
      </section>

      <section id="panel-cycle" role="tabpanel" aria-labelledby="tab-cycle" hidden={tab !== "cycle"} style={{ padding: 16 }}>
        <h2 className="section-title" style={{ marginBottom: 8 }}>
          {sp.kind === "fish" ? "When they're in the river" : "When adults are out"}
        </h2>
        <div className="calendar" aria-label="Activity by month" style={{ marginBottom: 6 }}>
          {MONTHS.map((m, i) => (
            <div key={m} title={m} className={sp.peak.includes(i) ? "peak" : sp.active.includes(i) ? "on" : ""}>{m[0]}</div>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 12, margin: "0 0 14px" }}>Orange is peak. Green is active.</p>
        <h2 className="section-title" style={{ marginBottom: 10 }}>Life cycle</h2>
        <ol className="cycle">
          {sp.lifeCycle.map((s, i) => (
            <li key={s.name}>
              <div className="n">{i + 1}</div>
              <div className="card body">
                <div className="head"><b>{s.name}</b>{s.time && <span className="time">{s.time}</span>}</div>
                <div style={{ fontSize: 14, color: "#3e4b47" }}>{s.text}</div>
                {s.fishIt && <div className="fishit">Fish it: {s.fishIt}</div>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="panel-methods" role="tabpanel" aria-labelledby="tab-methods" hidden={tab !== "methods"} style={{ padding: 16 }}>
        <h2 className="section-title" style={{ marginBottom: 6 }}>How to fish it</h2>
        {sp.methods.map((m) => (
          <div key={m.name} style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
            <b>{m.name}</b>
            <div className="muted" style={{ fontSize: 14 }}>{m.text}</div>
          </div>
        ))}
        <div className="note" style={{ marginTop: 14 }}>{regulationsNote}</div>
      </section>

      <section id="panel-facts" role="tabpanel" aria-labelledby="tab-facts" hidden={tab !== "facts"} style={{ padding: 16 }}>
        <dl className="facts">
          {sp.facts.map((f) => (
            <div key={f.label} style={{ display: "contents" }}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
