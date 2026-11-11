import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRiver, getSpecies, rivers } from "@/data";
import { MONTHS_FULL } from "@/data/types";
import { Portrait } from "@/components/CritterArt";
import { SpeciesTabs } from "@/components/SpeciesTabs";

type Props = { params: Promise<{ river: string; species: string }> };

export function generateStaticParams() {
  return rivers.flatMap((r) => r.species.map((s) => ({ river: r.slug, species: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const river = getRiver(p.river);
  const sp = getSpecies(p.river, p.species);
  if (!river || !sp) return {};
  const short = river.name.replace(" River", "");
  const title = sp.kind === "insect"
    ? `${short} ${sp.name.toLowerCase()} hatch: timing & best flies`
    : `${sp.name} on the ${short}: best flies & how to fish`;
  return {
    title,
    description: sp.summary,
    alternates: { canonical: `/${river.slug}/${sp.slug}` },
  };
}

export default async function SpeciesPage({ params }: Props) {
  const p = await params;
  const river = getRiver(p.river);
  const sp = getSpecies(p.river, p.species);
  if (!river || !sp) notFound();
  const peak = sp.peak.length ? sp.peak.map((m) => MONTHS_FULL[m]) : null;

  return (
    <div className="wrap stack" style={{ gap: 16, paddingTop: 16, maxWidth: 760 }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: 14 }}>
        <Link href={`/${river.slug}`}>← {river.name}</Link>
      </nav>

      <header className="card" style={{ background: "var(--river)", color: "var(--cream)", border: 0, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 10, display: "flex", justifyContent: "center", padding: 8 }}>
          <Portrait slug={sp.slug} kind={sp.kind} size={220} />
        </div>
        <h1 className="display" style={{ fontSize: "clamp(36px, 8vw, 48px)" }}>{sp.name}</h1>
        <div className="mono" style={{ fontSize: 12, fontStyle: "italic", color: "#c9d8d6" }}>
          {sp.scientific}{sp.aka ? ` · ${sp.aka}` : ""}
        </div>
        <div className="chips">
          {peak && <span className="chip" style={{ background: "var(--accent)", color: "#fff" }}>Peak: {peak.length > 3 ? `${peak[0]}–${peak[peak.length - 1]}` : peak.join(", ")}</span>}
          {sp.tags.map((t) => <span key={t.label} className={`chip ${t.tone ?? ""}`}>{t.label}</span>)}
        </div>
        <p style={{ margin: 0, color: "#dce6e4" }}>{sp.summary}</p>
      </header>

      <SpeciesTabs sp={sp} regulationsNote={river.regulationsNote} />

      <section className="stack" style={{ gap: 8 }}>
        <h2 className="section-title">More on the {river.name}</h2>
        <div className="species-grid">
          {river.species.filter((s) => s.slug !== sp.slug).map((s) => (
            <Link key={s.slug} href={`/${river.slug}/${s.slug}`} className="card">
              <span className="dot" style={{ background: s.color }} />{s.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
